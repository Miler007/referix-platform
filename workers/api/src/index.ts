/**
 * Referix API Gateway — Cloudflare Worker
 * 
 * End-to-end API for the entire business flow.
 * Lead → Coverage → Subscription → Installation → Activation → Billing → Commission → Payout
 */

interface Env {
  REFERIX_DB: D1Database;
  REFERIX_KV: KVNamespace;
}

// ─── HELPERS ─────────────────────────────────────────────────────────

function uuid(): string { return crypto.randomUUID(); }
function json(data: any, status = 200, cacheSecs = 0): Response {
  const headers: Record<string,string> = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Tenant-Id,X-User-Id' };
  if (cacheSecs > 0) headers['Cache-Control'] = `public, max-age=${cacheSecs}, s-maxage=${cacheSecs}`;
  return new Response(JSON.stringify(data), { status, headers });
}

// ─── PASSWORD HASHING (PBKDF2 + SHA-256) ─────────────────────────
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 10000, hash: 'SHA-256' }, key, 256);
  const hash = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${salt}:${hash}`;
}
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 10000, hash: 'SHA-256' }, key, 256);
  const computed = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return computed === hash;
}

function error(code: string, message: string, status = 400): Response {
  return json({ data: null, errors: [{ code, message }], meta: { timestamp: new Date().toISOString() } }, status);
}

function success(data: any, meta?: Record<string, unknown>, cacheSecs = 0): Response {
  return json({ data, meta: { timestamp: new Date().toISOString(), ...meta } }, 200, cacheSecs);
}

// ─── ROUTER ──────────────────────────────────────────────────────────

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Tenant-Id,X-User-Id' } });

  const tenantId = request.headers.get('X-Tenant-Id') ?? 'demo-tenant';
  let body: any = {};
  const contentType = request.headers.get('content-type') || '';
  if (method !== 'GET' && contentType.includes('json')) {
    const text = await request.text();
    try { body = JSON.parse(text); } catch { body = {}; }
  }
  const params = Object.fromEntries(url.searchParams);

  try {
    // ─── DEBUG ──────────────────────────────────────────────────────
    if (path === '/api/v1/debug') {
      return success({ method, path, headers: Object.fromEntries(request.headers), body, params });
    }
    if (path === '/api/v1/debug/hash' && method === 'POST') {
      const hashed = await hashPassword(body.password || 'test');
      const check = await verifyPassword(body.password || 'test', hashed);
      return success({ input: body.password, hash: hashed, verify: check });
    }

    // ─── AUTH ────────────────────────────────────────────────────────
    if (path === '/api/v1/auth/login' && method === 'POST') {
      if (!body?.email || !body?.password) return error('VALIDATION', 'Email y password requeridos', 400);
      const result = await env.REFERIX_DB.prepare('SELECT id, name, email, role, tenant_id, password FROM users WHERE email = ? AND active = 1').bind(body.email).all();
      const users = result.results ?? [];
      if (users.length === 0) return error('AUTH_FAILED', 'Credenciales inválidas', 401);
      const u = users[0] as any;
      const valid = u.password && u.password.includes(':') ? await verifyPassword(body.password, u.password) : (body.password === u.password);
      if (!valid) return error('AUTH_FAILED', 'Credenciales inválidas', 401);
      return success({ token: `jwt-${u.id}-${Date.now()}`, user: { id: u.id, name: u.name, email: u.email, role: u.role, tenantId: u.tenant_id } });
    }

    // ─── DASHBOARD ──────────────────────────────────────────────────
    if (path === '/api/v1/dashboard' && method === 'GET') {
      const [salesToday, installationsPending, commissionsHeld, topReferidors, recentActivity] = await Promise.all([
        env.REFERIX_DB.prepare('SELECT COUNT(*) as count FROM referrals WHERE tenant_id = ? AND date(created_at) = date("now")').bind(tenantId).first(),
        env.REFERIX_DB.prepare('SELECT COUNT(*) as count FROM installations WHERE tenant_id = ? AND status IN ("PENDING","SCHEDULED")').bind(tenantId).first(),
        env.REFERIX_DB.prepare('SELECT COUNT(*) as count, COALESCE(SUM(final_amount),0) as total FROM commissions WHERE tenant_id = ? AND financial_state = "HELD"').bind(tenantId).first(),
        env.REFERIX_DB.prepare('SELECT r.id, p.full_name as name, COUNT(ref.id) as sales, COALESCE(SUM(c.final_amount),0) as commission FROM referidors r JOIN persons p ON r.person_id = p.id LEFT JOIN referrals ref ON ref.referrer_person_id = r.person_id LEFT JOIN commissions c ON c.referral_id = ref.id WHERE r.tenant_id = ? GROUP BY r.id ORDER BY sales DESC LIMIT 5').bind(tenantId).all(),
        env.REFERIX_DB.prepare("SELECT event_name as event, payload, created_at as time FROM events WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 10").bind(tenantId).all(),
      ]);
      return success({
        salesToday: (salesToday as any)?.count ?? 0,
        installationsPending: (installationsPending as any)?.count ?? 0,
        commissionsHeld: { count: (commissionsHeld as any)?.count ?? 0, total: (commissionsHeld as any)?.total ?? 0 },
        topReferidors: (topReferidors as any)?.results ?? [],
        recentActivity: (recentActivity as any)?.results ?? [],
      }, undefined, 30);
    }

    // ─── USERS LIST ────────────────────────────────────────────────
    if (path === '/api/v1/users' && method === 'GET') {
      const users = await env.REFERIX_DB.prepare('SELECT id, name, email, role, active, created_at, commission_pct FROM users WHERE tenant_id = ? ORDER BY name').bind(tenantId).all();
      return success((users as any)?.results ?? [], undefined, 60);
    }
    if (path === '/api/v1/users' && method === 'POST') {
      const { name, email, password, role, commission_pct } = body as any;
      if (!password) return error('VALIDATION', 'Password requerido', 400);
      const id = uuid();
      const safe = (v: any) => v ?? null;
      const hashed = await hashPassword(password);
      await env.REFERIX_DB.prepare('INSERT INTO users (id, tenant_id, name, email, password, role, commission_pct) VALUES (?,?,?,?,?,?,?)').bind(id, tenantId, safe(name), safe(email), hashed, safe(role)||'REFERIDOR', safe(commission_pct)??50).run();
      return success({ id }, { status: 'CREATED' });
    }
    if (path.startsWith('/api/v1/users/') && method === 'PUT') {
      const id = path.split('/')[4];
      const { name, email, role, password, commission_pct } = body as any;
      const safe = (v: any) => v ?? null;
      if (password) {
        const hashed = await hashPassword(password);
        await env.REFERIX_DB.prepare('UPDATE users SET name = ?, email = ?, role = ?, password = ?, commission_pct = ? WHERE id = ? AND tenant_id = ?').bind(safe(name), safe(email), safe(role), hashed, safe(commission_pct)??50, id, tenantId).run();
      } else {
        await env.REFERIX_DB.prepare('UPDATE users SET name = ?, email = ?, role = ?, commission_pct = ? WHERE id = ? AND tenant_id = ?').bind(safe(name), safe(email), safe(role), safe(commission_pct)??50, id, tenantId).run();
      }
      return success({ id, updated: true });
    }
    if (path.startsWith('/api/v1/users/') && method === 'DELETE') {
      const id = path.split('/')[4];
      await env.REFERIX_DB.prepare('UPDATE users SET active = 0 WHERE id = ? AND tenant_id = ?').bind(id, tenantId).run();
      return success({ id, deleted: true });
    }

    // ─── MIGRATE PASSWORDS (one-time) ────────────────────────────
    if (path === '/api/v1/admin/migrate-passwords' && method === 'POST') {
      const users = await env.REFERIX_DB.prepare("SELECT id, password FROM users WHERE tenant_id = ? AND password NOT LIKE '%:%'").bind(tenantId).all() as any;
      let count = 0;
      for (const u of (users?.results || [])) {
        const hashed = await hashPassword(u.password);
        await env.REFERIX_DB.prepare('UPDATE users SET password = ? WHERE id = ?').bind(hashed, u.id).run();
        count++;
      }
      return success({ migrated: count });
    }

    // ─── CLIENT SEARCH ─────────────────────────────────────────────
    if (path === '/api/v1/clients/search' && method === 'GET') {
      const q = (params.q || '').trim();
      if (!q || q.length < 2) return success([]);
      const result = await env.REFERIX_DB.prepare("SELECT id, full_name, phone, email, address, funnel_status, plan_id, created_at FROM referrals WHERE tenant_id = ? AND (full_name LIKE ? OR phone LIKE ? OR email LIKE ?) ORDER BY created_at DESC LIMIT 10").bind(tenantId, `%${q}%`, `%${q}%`, `%${q}%`).all();
      return success((result as any)?.results ?? []);
    }

    // ─── REFERRALS ──────────────────────────────────────────────────
    if (path === '/api/v1/referrals' && method === 'POST') {
      const { fullName, phone, email, address, latitude, longitude, planId, source } = body as any;
      const id = uuid();
      const safe = (v: any) => v ?? null;
      await env.REFERIX_DB.prepare('INSERT INTO referrals (id, tenant_id, full_name, phone, email, address, latitude, longitude, plan_id, source, funnel_status, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime("now"))').bind(id, tenantId, safe(fullName), safe(phone), safe(email), safe(address), safe(latitude), safe(longitude), safe(planId), safe(source) || 'DIRECT', 'NEW').run();
      return success({ id }, { status: 'CREATED' });
    }

    if (path.startsWith('/api/v1/referrals/') && method === 'GET') {
      const id = path.split('/')[4];
      const ref = await env.REFERIX_DB.prepare('SELECT * FROM referrals WHERE id = ? AND tenant_id = ?').bind(id, tenantId).first();
      if (!ref) return error('NOT_FOUND', 'Referral no encontrada', 404);
      const timeline = await env.REFERIX_DB.prepare("SELECT event_name as event, payload as description, created_at as timestamp FROM events WHERE aggregate_id = ? ORDER BY created_at ASC").bind(id).all();
      return success({ ...ref, timeline: (timeline as any)?.results ?? [] });
    }

    if (path === '/api/v1/referrals' && method === 'GET') {
      const { status, referrerId, page = '1', limit = '20' } = params;
      let query = 'SELECT * FROM referrals WHERE tenant_id = ?';
      const binds: any[] = [tenantId];
      if (status) { query += ' AND funnel_status = ?'; binds.push(status); }
      if (referrerId) { query += ' AND referrer_person_id = ?'; binds.push(referrerId); }
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      binds.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
      const result = await env.REFERIX_DB.prepare(query).bind(...binds).all();
      const total = await env.REFERIX_DB.prepare('SELECT COUNT(*) as count FROM referrals WHERE tenant_id = ?').bind(tenantId).first();
      return success((result as any)?.results ?? [], { page: parseInt(page), limit: parseInt(limit), total: (total as any)?.count ?? 0 });
    }

    // ─── COVERAGE ──────────────────────────────────────────────────
    if (path === '/api/v1/coverage/check' && method === 'POST') {
      const { address, latitude, longitude } = body as any;
      const zones = await env.REFERIX_DB.prepare('SELECT * FROM coverage_zones WHERE tenant_id = ? AND active = 1').bind(tenantId).all();
      const explanations: string[] = [];
      const matchingZone = (zones as any)?.results?.find((z: any) => {
        const lat = parseFloat(latitude ?? '0');
        const lng = parseFloat(longitude ?? '0');
        return lat >= (z.min_lat ?? 0) && lat <= (z.max_lat ?? 0) && lng >= (z.min_lng ?? 0) && lng <= (z.max_lng ?? 0);
      });

      if (!matchingZone) {
        explanations.push('La dirección está fuera de las zonas de cobertura actuales');
        return success({ available: false, confidence: 'HIGH', explanations, blockers: ['Sin cobertura en esta zona'] });
      }

      const boxes = await env.REFERIX_DB.prepare('SELECT * FROM distribution_boxes WHERE zone_id = ? AND status = "ACTIVE"').bind(matchingZone.id).all();
      const availableBox = (boxes as any)?.results?.find((b: any) => (b.total_ports - b.used_ports) > 0);

      if (!availableBox) {
        explanations.push(`Zona: ${matchingZone.name} — sin puertos disponibles`);
        return success({ available: false, confidence: 'MEDIUM', explanations, blockers: ['Saturación en la zona'] });
      }

      explanations.push(`Zona: ${matchingZone.name} (${matchingZone.technology})`);
      explanations.push(`Caja: ${availableBox.name} — ${availableBox.total_ports - availableBox.used_ports} puertos libres`);
      explanations.push(`Velocidad máxima: ${matchingZone.max_speed} Mbps`);
      explanations.push(`Instalación estimada: ${matchingZone.install_hours} horas`);

      return success({
        available: true, confidence: 'HIGH', technology: matchingZone.technology,
        maxSpeed: matchingZone.max_speed, estimatedInstallHours: matchingZone.install_hours,
        distributionBoxId: availableBox.id, explanations, blockers: [],
      });
    }

    // ─── SUBSCRIPTIONS ─────────────────────────────────────────────
    if (path === '/api/v1/subscriptions' && method === 'POST') {
      const { personId, planId, coverageResultId } = body as any;
      const id = uuid();
      const plan = await env.REFERIX_DB.prepare('SELECT * FROM plans WHERE id = ? AND tenant_id = ?').bind(planId, tenantId).first();
      await env.REFERIX_DB.prepare('INSERT INTO subscriptions (id, tenant_id, person_id, plan_id, status, amount, currency, created_at, updated_at) VALUES (?,?,?,?,?,?,?,datetime("now"),datetime("now"))').bind(id, tenantId, personId, planId, 'PENDING_PROVISIONING', (plan as any)?.price ?? 0, 'MXN').run();
      return success({ id, status: 'PENDING_PROVISIONING' });
    }

    // ─── INSTALLATIONS ─────────────────────────────────────────────
    if (path === '/api/v1/installations' && method === 'POST') {
      const { subscriptionId, scheduledDate, technicianId } = body as any;
      const id = uuid();
      await env.REFERIX_DB.prepare('INSERT INTO installations (id, tenant_id, subscription_id, technician_id, scheduled_date, status, created_at) VALUES (?,?,?,?,?,?,datetime("now"))').bind(id, tenantId, subscriptionId, technicianId, scheduledDate, 'SCHEDULED').run();
      return success({ id, status: 'SCHEDULED' });
    }

    if (path.startsWith('/api/v1/installations/') && method === 'PATCH') {
      const id = path.split('/')[4];
      const { status, evidence } = body as any;
      await env.REFERIX_DB.prepare('UPDATE installations SET status = ?, evidence = ?, updated_at = datetime("now") WHERE id = ? AND tenant_id = ?').bind(status, JSON.stringify(evidence ?? {}), id, tenantId).run();
      return success({ id, status });
    }

    // ─── COMMISSIONS ENGINE ───────────────────────────────────────
    function nextCutDate(): string {
      const now = new Date();
      const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
      if (d < 15) return `${y}-${String(m+1).padStart(2,'0')}-15`;
      if (d < 30) return `${y}-${String(m+1).padStart(2,'0')}-30`;
      const next = new Date(y, m + 1, 15);
      return `${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-15`;
    }
    if (path === '/api/v1/commissions/create' && method === 'POST') {
      const { referralId, subscriptionId, planPrice, planName, clientName, advisorName, advisorId } = body as any;
      const id = crypto.randomUUID();
      const safe = (v: any) => v ?? null;
      // Get advisor's commission percentage (default 50%)
      let pct = 50;
      if (advisorId) {
        const user = await env.REFERIX_DB.prepare('SELECT commission_pct FROM users WHERE id = ?').bind(advisorId).first() as any;
        if (user?.commission_pct) pct = user.commission_pct;
      }
      const baseAmount = Math.round((planPrice||0) * (pct / 100));
      const heldUntil = nextCutDate();
      await env.REFERIX_DB.prepare('INSERT INTO commissions (id, tenant_id, referral_id, subscription_id, base_amount, final_amount, financial_state, operational_state, held_until, created_at) VALUES (?,?,?,?,?,?,?,?,?,datetime("now"))').bind(id, tenantId, safe(referralId), safe(subscriptionId), baseAmount, baseAmount, 'HELD', 'PENDIENTE_FACTURA', heldUntil).run();
      await env.REFERIX_DB.prepare("INSERT INTO events (id, tenant_id, aggregate_type, aggregate_id, event_name, payload, created_at) VALUES (?,?,'commission',?,'COMMISSION_CREATED',?,datetime('now'))").bind(crypto.randomUUID(), tenantId, id, JSON.stringify({planName:safe(planName),clientName:safe(clientName),advisorName:safe(advisorName),amount:baseAmount})).run();
      return success({ id, amount: baseAmount, heldUntil, status: 'PENDIENTE_FACTURA' });
    }
    if (path === '/api/v1/commissions/my-commissions' && method === 'GET') {
      const result = await env.REFERIX_DB.prepare("SELECT c.*, e.payload FROM commissions c LEFT JOIN events e ON e.aggregate_id = c.id WHERE c.tenant_id = ? ORDER BY c.created_at DESC").bind(tenantId).all();
      const rows = (result as any)?.results || [];
      const pending = rows.filter((r:any)=>r.financial_state==='HELD');
      const paid = rows.filter((r:any)=>r.financial_state==='PAID');
      const totalPending = pending.reduce((s:number,r:any)=>s+(r.final_amount||0),0);
      const totalPaid = paid.reduce((s:number,r:any)=>s+(r.final_amount||0),0);
      const cutDate = nextCutDate();
      return success({ commissions: rows, summary: { pending: pending.length, paid: paid.length, totalPending, totalPaid, nextCut: cutDate } });
    }
    if (path === '/api/v1/commissions/mark-invoice-paid' && method === 'POST') {
      const { commissionId, subscriptionId } = body as any;
      const id = commissionId || crypto.randomUUID();
      if (commissionId) {
        await env.REFERIX_DB.prepare("UPDATE commissions SET financial_state = 'PAYABLE', operational_state = 'FACTURA_PAGADA', held_until = ? WHERE id = ? AND tenant_id = ?").bind(nextCutDate(), commissionId, tenantId).run();
        await env.REFERIX_DB.prepare("INSERT INTO events (id, tenant_id, aggregate_type, aggregate_id, event_name, payload, created_at) VALUES (?,?,'commission',?,'INVOICE_PAID',?,datetime('now'))").bind(crypto.randomUUID(), tenantId, commissionId, JSON.stringify({note:'Cliente pagó primera factura completa'})).run();
      }
      return success({ id, status: 'PAYABLE', nextCut: nextCutDate() });
    }
    // ─── WALLET/PAYOUT ────────────────────────────────────────────
    if (path === '/api/v1/wallet' && method === 'GET') {
      const { referrerId } = params;
      const wallet = await env.REFERIX_DB.prepare('SELECT * FROM wallets WHERE referrer_person_id = ? AND tenant_id = ?').bind(referrerId||'', tenantId).first() as any;
      if (!wallet) return success({ balance: 0, pendingBalance: 0, totalEarned: 0, totalWithdrawn: 0, transactions: [] });
      const transactions = await env.REFERIX_DB.prepare("SELECT * FROM wallet_transactions WHERE wallet_id = ? ORDER BY created_at DESC LIMIT 50").bind(wallet.id).all();
      let payMethod = {};
      try { payMethod = JSON.parse(wallet.payout_method||'{}'); } catch(e) {}
      return success({ ...wallet, transactions: (transactions as any)?.results ?? [], payoutMethod: payMethod });
    }
    if (path === '/api/v1/wallet/payment-method' && method === 'POST') {
      const { referrerId, method: payMethod, bankName, accountType, accountNumber, accountHolder, nequiPhone } = body as any;
      const details = payMethod === 'NEQUI' ? { method:'NEQUI', phone:nequiPhone } : { method:'BANK', bank:bankName, accountType, accountNumber, holder:accountHolder };
      await env.REFERIX_DB.prepare('UPDATE wallets SET payout_method = ? WHERE referrer_person_id = ? AND tenant_id = ?').bind(JSON.stringify(details), referrerId||'', tenantId).run();
      return success({ saved: true, method: details });
    }
    if (path === '/api/v1/wallet/payout-request' && method === 'POST') {
      const { referrerId, amount, method: payMethod, bankName, accountType, accountNumber, accountHolder, nequiPhone } = body as any;
      if (!referrerId || !amount || amount <= 0) return error('VALIDATION', 'Monto inválido');
      const wallet = await env.REFERIX_DB.prepare('SELECT * FROM wallets WHERE referrer_person_id = ? AND tenant_id = ?').bind(referrerId, tenantId).first() as any;
      if (!wallet) return error('NOT_FOUND', 'Wallet no encontrada');
      if ((wallet.balance||0) < amount) return error('VALIDATION', 'Saldo insuficiente');
      const txId = crypto.randomUUID();
      const details = payMethod === 'NEQUI' ? { method:'NEQUI', phone:nequiPhone } : { method:'BANK', bank:bankName, accountType, accountNumber, holder:accountHolder };
      await env.REFERIX_DB.prepare('INSERT INTO wallet_transactions (id, wallet_id, type, amount, balance_before, balance_after, description, created_at) VALUES (?,?,?,?,?,?,?,datetime("now"))').bind(txId, wallet.id, 'PAYOUT_REQUEST', -amount, wallet.balance, (wallet.balance||0) - amount, JSON.stringify(details)).run();
      await env.REFERIX_DB.prepare('UPDATE wallets SET balance = balance - ?, pending_balance = pending_balance + ?, total_withdrawn = total_withdrawn + ? WHERE id = ?').bind(amount, amount, amount, wallet.id).run();
      return success({ id: txId, amount, newBalance: (wallet.balance||0) - amount, status: 'PENDING' });
    }
    if (path === '/api/v1/admin/payouts' && method === 'GET') {
      const txs = await env.REFERIX_DB.prepare("SELECT wt.*, w.referrer_person_id FROM wallet_transactions wt JOIN wallets w ON w.id = wt.wallet_id WHERE wt.type = 'PAYOUT_REQUEST' AND w.tenant_id = ? ORDER BY wt.created_at DESC").bind(tenantId).all();
      return success((txs as any)?.results ?? []);
    }
    if (path === '/api/v1/admin/payouts/approve' && method === 'POST') {
      const { transactionId } = body as any;
      if (!transactionId) return error('VALIDATION','transactionId requerido');
      const tx = await env.REFERIX_DB.prepare('SELECT * FROM wallet_transactions WHERE id = ?').bind(transactionId).first() as any;
      if (!tx) return error('NOT_FOUND','Transacción no encontrada');
      await env.REFERIX_DB.prepare("UPDATE wallet_transactions SET type = 'PAYOUT' WHERE id = ?").bind(transactionId).run();
      return success({ id: transactionId, status: 'APPROVED' });
    }
    if (path === '/api/v1/admin/payouts/reject' && method === 'POST') {
      const { transactionId } = body as any;
      if (!transactionId) return error('VALIDATION','transactionId requerido');
      const tx = await env.REFERIX_DB.prepare('SELECT * FROM wallet_transactions WHERE id = ?').bind(transactionId).first() as any;
      if (!tx) return error('NOT_FOUND','Transacción no encontrada');
      await env.REFERIX_DB.prepare('DELETE FROM wallet_transactions WHERE id = ?').bind(transactionId).run();
      if (tx.wallet_id) {
        await env.REFERIX_DB.prepare('UPDATE wallets SET balance = balance + ?, pending_balance = pending_balance - ?, total_withdrawn = total_withdrawn - ? WHERE id = ?').bind(Math.abs(tx.amount||0), Math.abs(tx.amount||0), Math.abs(tx.amount||0), tx.wallet_id).run();
      }
      return success({ id: transactionId, status: 'REJECTED' });
    }

    if (path === '/api/v1/commissions/pay' && method === 'POST') {
      const { commissionIds } = body as any;
      if (!commissionIds || !Array.isArray(commissionIds)) return error('VALIDATION','commissionIds requerido');
      const now = new Date().toISOString().split('T')[0];
      for (const id of commissionIds) {
        await env.REFERIX_DB.prepare("UPDATE commissions SET financial_state = 'PAID', operational_state = 'PAGADO', paid_at = ? WHERE id = ? AND tenant_id = ? AND held_until <= ?").bind(now, id, tenantId, now).run();
        await env.REFERIX_DB.prepare("INSERT INTO events (id, tenant_id, aggregate_type, aggregate_id, event_name, payload, created_at) VALUES (?,?,'commission',?,'COMMISSION_PAID',?,datetime('now'))").bind(crypto.randomUUID(), tenantId, id, JSON.stringify({paidAt:now})).run();
      }
      return success({ paid: commissionIds.length, date: now });
    }

    // ─── COMMERCIAL CATALOG v2 (REF-INT-001) ──────────────────────
    if (path === '/api/v2/catalog/zones' && method === 'GET') {
      const zones = await env.REFERIX_DB.prepare('SELECT cz.id as zone_id, cz.name, t.name as technology, t.code as technology_code, t.id as technology_id FROM coverage_zones cz JOIN technologies t ON t.code = cz.technology WHERE cz.tenant_id = ? AND cz.active = 1 ORDER BY cz.name, t.name').bind(tenantId).all();
      return success((zones as any)?.results ?? [], undefined, 300);
    }

    if (path === '/api/v2/catalog/technologies' && method === 'GET') {
      const techs = await env.REFERIX_DB.prepare('SELECT * FROM technologies WHERE tenant_id = ? AND active = 1').bind(tenantId).all();
      return success((techs as any)?.results ?? []);
    }

    if (path === '/api/v2/catalog/client-types' && method === 'GET') {
      const types = await env.REFERIX_DB.prepare('SELECT * FROM client_types WHERE tenant_id = ? AND active = 1').bind(tenantId).all();
      return success((types as any)?.results ?? []);
    }

    if (path === '/api/v2/catalog/plans' && method === 'GET') {
      const { zone_id, technology_id, category_id, client_type_id } = params;
      let query = 'SELECT cp.*, cz.name as zone_name, t.name as technology_name FROM catalog_plans cp JOIN coverage_zones cz ON cz.id = cp.zone_id JOIN technologies t ON t.id = cp.technology_id WHERE cp.tenant_id = ? AND cp.status = "PUBLISHED"';
      const binds: any[] = [tenantId];
      if (zone_id) { query += ' AND cp.zone_id = ?'; binds.push(zone_id); }
      if (technology_id) { query += ' AND cp.technology_id = ?'; binds.push(technology_id); }
      if (category_id) { query += ' AND cp.category_id = ?'; binds.push(category_id); }
      query += ' ORDER BY cp.price ASC';
      const plans = await env.REFERIX_DB.prepare(query).bind(...binds).all();
      return success((plans as any)?.results ?? [], undefined, 120);
    }

    if (path === '/api/v2/catalog/plan-detail' && method === 'GET') {
      const { plan_id } = params;
      if (!plan_id) return error('VALIDATION', 'plan_id requerido');
      const plan = await env.REFERIX_DB.prepare('SELECT cp.*, cz.name as zone_name, t.name as technology_name, cc.name as category_name FROM catalog_plans cp JOIN coverage_zones cz ON cz.id = cp.zone_id JOIN technologies t ON t.id = cp.technology_id LEFT JOIN commercial_categories cc ON cc.id = cp.category_id WHERE cp.id = ? AND cp.tenant_id = ?').bind(plan_id, tenantId).first();
      if (!plan) return error('NOT_FOUND', 'Plan no encontrado');
      const services = await env.REFERIX_DB.prepare('SELECT * FROM plan_services WHERE plan_id = ? AND active = 1').bind(plan_id).all();
      const equipment = await env.REFERIX_DB.prepare('SELECT * FROM plan_equipment WHERE plan_id = ? AND active = 1').bind(plan_id).all();
      const documents = await env.REFERIX_DB.prepare('SELECT * FROM plan_documents WHERE plan_id = ? AND active = 1').bind(plan_id).all();
      const commissions = await env.REFERIX_DB.prepare('SELECT pc.*, ct.name as client_type_name FROM plan_commissions pc LEFT JOIN client_types ct ON ct.id = pc.client_type_id WHERE pc.plan_id = ? AND pc.active = 1').bind(plan_id).all();
      return success({
        ...plan,
        services: (services as any)?.results ?? [],
        equipment: (equipment as any)?.results ?? [],
        documents: (documents as any)?.results ?? [],
        commissions: (commissions as any)?.results ?? [],
      });
    }

    // ─── COMMERCIAL ENGINE ────────────────────────────────────────────
    if (path === '/api/v2/engine/offers' && method === 'GET') {
      const { zone_id, technology_id } = params;
      let query = `SELECT co.*, cp.name as plan_name, cp.price, cp.download_speed, cp.upload_speed, cp.is_symmetric, cp.benefits as plan_benefits, cp.installation_days_min, cp.installation_days_max, cz.name as zone_name FROM commercial_offers co JOIN catalog_plans cp ON cp.id = co.plan_id JOIN offer_availability oa ON oa.offer_id = co.id JOIN coverage_zones cz ON cz.id = oa.zone_id WHERE co.tenant_id = ? AND co.status = 'PUBLISHED' AND oa.status = 'AVAILABLE'`;
      const binds: any[] = [tenantId];
      if (zone_id) { query += ' AND oa.zone_id = ?'; binds.push(zone_id); }
      if (technology_id) { query += ' AND cp.technology_id = ?'; binds.push(technology_id); }
      query += ' GROUP BY co.id ORDER BY cp.price ASC';
      const offers = await env.REFERIX_DB.prepare(query).bind(...binds).all();
      return success((offers as any)?.results ?? []);
    }

    if (path === '/api/v2/engine/commission' && method === 'GET') {
      const { plan_id, offer_id } = params;
      let query = 'SELECT * FROM commission_rules WHERE tenant_id = ? AND active = 1';
      const binds: any[] = [tenantId];
      if (offer_id) { query += ' AND (offer_id = ? OR offer_id IS NULL)'; binds.push(offer_id); }
      else if (plan_id) { query += ' AND (plan_id = ? OR plan_id IS NULL)'; binds.push(plan_id); }
      query += ' ORDER BY priority ASC LIMIT 1';
      const rule = await env.REFERIX_DB.prepare(query).bind(...binds).first();
      if (!rule) return success({ type: 'PERCENTAGE', value: 10, amount: 0 });
      const price = plan_id ? (await env.REFERIX_DB.prepare('SELECT price FROM catalog_plans WHERE id = ?').bind(plan_id).first()) : null;
      const amount = (rule as any).type === 'PERCENTAGE' ? ((price as any)?.price || 0) * (rule as any).value / 100 : (rule as any).value;
      return success({ ...rule, calculatedAmount: Math.round(amount) });
    }

    if (path === '/api/v2/engine/profitability' && method === 'GET') {
      const { plan_id } = params;
      if (!plan_id) return error('VALIDATION', 'plan_id requerido');
      const plan = await env.REFERIX_DB.prepare('SELECT * FROM catalog_plans WHERE id = ? AND tenant_id = ?').bind(plan_id, tenantId).first() as any;
      const costs = await env.REFERIX_DB.prepare('SELECT * FROM plan_costs WHERE plan_id = ?').bind(plan_id).first() as any;
      if (!plan) return error('NOT_FOUND', 'Plan no encontrado');
      const infraCost = costs?.infrastructure || (plan.price * 0.3);
      const supportCost = costs?.support || (plan.price * 0.07);
      const equipCost = costs?.equipment || (plan.price * 0.03);
      const totalCost = infraCost + supportCost + equipCost;
      const margin = plan.price - totalCost;
      const marginPct = plan.price > 0 ? (margin / plan.price) * 100 : 0;
      return success({
        planName: plan.name, price: plan.price, totalCost, margin, marginPct,
        breakdown: { infrastructure: infraCost, support: supportCost, equipment: equipCost, other: 0 }
      });
    }

    if (path === '/api/v2/engine/recommend' && method === 'POST') {
      const { devices, useCases } = body as any;
      const deviceCount = parseInt(devices || '1');
      const needs = (useCases || []).map((u: string) => u.toLowerCase());
      const plans = await env.REFERIX_DB.prepare('SELECT * FROM catalog_plans WHERE tenant_id = ? AND status = "PUBLISHED" ORDER BY price ASC').bind(tenantId).all() as any;
      const scored = (plans.results || []).map((p: any) => {
        let score = 0;
        if (p.download_speed >= 50 && deviceCount <= 5) score += 20;
        if (p.download_speed >= 100 && deviceCount <= 10) score += 30;
        if (p.download_speed >= 200) score += 40;
        if (needs.includes('teletrabajo') && p.download_speed >= 100) score += 25;
        if (needs.includes('gaming') && p.download_speed >= 100) score += 20;
        if (needs.includes('streaming') && p.download_speed >= 50) score += 15;
        if (needs.includes('netflix')) score += 10;
        return { ...p, score };
      });
      scored.sort((a: any, b: any) => b.score - a.score);
      return success({
        recommended: scored[0] || null,
        alternatives: scored.slice(1, 3) || [],
        allScored: scored,
      });
    }

    // ─── CATALOG MANAGEMENT (Console) ──────────────────────────────
    if (path === '/api/v2/admin/plans' && method === 'GET') {
      const result = await env.REFERIX_DB.prepare('SELECT cp.*, cz.name as zone_name, t.name as technology_name FROM catalog_plans cp JOIN coverage_zones cz ON cz.id = cp.zone_id JOIN technologies t ON t.id = cp.technology_id WHERE cp.tenant_id = ? ORDER BY cp.name').bind(tenantId).all();
      return success((result as any)?.results ?? [], undefined, 60);
    }

    if (path === '/api/v2/admin/plans' && method === 'POST') {
      const p = body as any;
      const id = uuid();
      await env.REFERIX_DB.prepare('INSERT INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, installation_days_min, installation_days_max, status, version) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)').bind(id, tenantId, p.zone_id || 'z-fresno', p.technology_id || 'tech-gpon', p.category_id || 'cat-hogar', p.name, p.code || p.name.toUpperCase().replace(/\s/g, '_'), p.description || '', JSON.stringify(p.benefits || []), p.download_speed || 50, p.upload_speed || 50, p.is_symmetric !== undefined ? (p.is_symmetric ? 1 : 0) : 1, p.price || 0, p.install_days_min || 2, p.install_days_max || 3, 'DRAFT').run();
      return success({ id, status: 'DRAFT' });
    }

    if (path.startsWith('/api/v2/admin/plans/') && method === 'GET') {
      const id = path.split('/')[5];
      const plan = await env.REFERIX_DB.prepare('SELECT cp.*, cz.name as zone_name, t.name as technology_name FROM catalog_plans cp JOIN coverage_zones cz ON cz.id = cp.zone_id JOIN technologies t ON t.id = cp.technology_id WHERE cp.id = ? AND cp.tenant_id = ?').bind(id, tenantId).first();
      if (!plan) return error('NOT_FOUND', 'Plan no encontrado');
      const services = await env.REFERIX_DB.prepare('SELECT * FROM plan_services WHERE plan_id = ? AND active = 1').bind(id).all();
      const equipment = await env.REFERIX_DB.prepare('SELECT * FROM plan_equipment WHERE plan_id = ? AND active = 1').bind(id).all();
      const docs = await env.REFERIX_DB.prepare('SELECT * FROM plan_documents WHERE plan_id = ? AND active = 1').bind(id).all();
      const commissions = await env.REFERIX_DB.prepare('SELECT * FROM plan_commissions WHERE plan_id = ? AND active = 1').bind(id).all();
      const costs = await env.REFERIX_DB.prepare('SELECT * FROM plan_costs WHERE plan_id = ?').bind(id).first();
      return success({ ...plan, services: (services as any)?.results || [], equipment: (equipment as any)?.results || [], documents: (docs as any)?.results || [], commissions: (commissions as any)?.results || [], costs });
    }

    if (path.startsWith('/api/v2/admin/plans/') && method === 'PUT') {
      const id = path.split('/')[5];
      const p = body as any;
      await env.REFERIX_DB.prepare('UPDATE catalog_plans SET name = ?, price = ?, download_speed = ?, upload_speed = ?, is_symmetric = ?, description = ?, benefits = ?, installation_days_min = ?, installation_days_max = ?, updated_at = datetime("now") WHERE id = ? AND tenant_id = ?').bind(p.name, p.price, p.download_speed, p.upload_speed, p.is_symmetric ? 1 : 0, p.description || '', JSON.stringify(p.benefits || []), p.install_days_min || 2, p.install_days_max || 3, id, tenantId).run();
      return success({ id, updated: true });
    }

    if (path.startsWith('/api/v2/admin/plans/') && path.endsWith('/publish')) {
      const id = path.split('/')[5];
      await env.REFERIX_DB.prepare('UPDATE catalog_plans SET status = "PUBLISHED", version = version + 1, published_at = datetime("now"), updated_at = datetime("now") WHERE id = ? AND tenant_id = ?').bind(id, tenantId).run();
      return success({ id, status: 'PUBLISHED' });
    }

    if (path.startsWith('/api/v2/admin/plans/') && path.endsWith('/duplicate')) {
      const id = path.split('/')[5];
      const original = await env.REFERIX_DB.prepare('SELECT * FROM catalog_plans WHERE id = ? AND tenant_id = ?').bind(id, tenantId).first() as any;
      if (!original) return error('NOT_FOUND', 'Plan no encontrado');
      const newId = uuid();
      await env.REFERIX_DB.prepare('INSERT INTO catalog_plans (id, tenant_id, zone_id, technology_id, category_id, name, code, description, benefits, download_speed, upload_speed, is_symmetric, price, installation_days_min, installation_days_max, support_priority, max_incident_resolution_hours, status, version) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)').bind(newId, tenantId, original.zone_id, original.technology_id, original.category_id, `${original.name} (copia)`, `${original.code}-COPY`, original.description, original.benefits, original.download_speed, original.upload_speed, original.is_symmetric, original.price, original.installation_days_min, original.installation_days_max, original.support_priority || 'NORMAL', original.max_incident_resolution_hours || 24, 'DRAFT').run();
      return success({ id: newId, name: `${original.name} (copia)` });
    }

    // ─── COMMISSION RULES MANAGEMENT ──────────────────────────────────
    if (path === '/api/v2/admin/commissions' && method === 'GET') {
      const rules = await env.REFERIX_DB.prepare('SELECT pc.*, cp.name as plan_name FROM plan_commissions pc LEFT JOIN catalog_plans cp ON cp.id = pc.plan_id WHERE pc.tenant_id = ? ORDER BY pc.value DESC').bind(tenantId).all();
      return success((rules as any)?.results ?? []);
    }

    if (path === '/api/v2/admin/commissions' && method === 'POST') {
      const r = body as any;
      const id = uuid();
      await env.REFERIX_DB.prepare('INSERT INTO commission_rules (id, tenant_id, plan_id, offer_id, role, type, value, min_amount, max_amount, holding_days) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id, tenantId, r.plan_id || null, r.offer_id || null, r.role || 'REFERIDOR', r.type || 'PERCENTAGE', r.value || 0, r.min_amount || null, r.max_amount || null, r.holding_days || 15).run();
      return success({ id });
    }

    if (path.startsWith('/api/v2/admin/commissions/') && method === 'PUT') {
      const id = path.split('/')[5];
      const { value, type, holding_days } = body as any;
      const safe = (v: any) => v ?? null;
      await env.REFERIX_DB.prepare('UPDATE plan_commissions SET value = ?, type = ?, holding_days = ? WHERE id = ? AND tenant_id = ?').bind(safe(value), safe(type)||'PERCENTAGE', safe(holding_days)||15, id, tenantId).run();
      return success({ id, updated: true });
    }
    if (path.startsWith('/api/v2/admin/commissions/') && method === 'DELETE') {
      const id = path.split('/')[5];
      await env.REFERIX_DB.prepare('UPDATE plan_commissions SET active = 0 WHERE id = ? AND tenant_id = ?').bind(id, tenantId).run();
      return success({ id, deleted: true });
    }
    if (path.startsWith('/api/v2/admin/plans/') && method === 'DELETE') {
      const id = path.split('/')[5];
      await env.REFERIX_DB.prepare("UPDATE catalog_plans SET status = 'ARCHIVED' WHERE id = ? AND tenant_id = ?").bind(id, tenantId).run();
      return success({ id, deleted: true });
    }
    if (path.startsWith('/api/v1/referrals/') && method === 'DELETE') {
      const id = path.split('/')[4];
      await env.REFERIX_DB.prepare('DELETE FROM referrals WHERE id = ? AND tenant_id = ?').bind(id, tenantId).run();
      await env.REFERIX_DB.prepare('DELETE FROM commissions WHERE referral_id = ?').bind(id).run();
      return success({ id, deleted: true });
    }
    if (path === '/api/v1/admin/referrals/clear-test' && method === 'DELETE') {
      const refs = await env.REFERIX_DB.prepare("SELECT id FROM referrals WHERE tenant_id = ? AND funnel_status = 'NEW'").bind(tenantId).all() as any;
      const ids = (refs?.results||[]).map((r:any)=>r.id);
      if (ids.length > 0) {
        await env.REFERIX_DB.prepare(`DELETE FROM referrals WHERE id IN (${ids.map(()=>'?').join(',')})`).bind(...ids).run();
        await env.REFERIX_DB.prepare(`DELETE FROM commissions WHERE referral_id IN (${ids.map(()=>'?').join(',')})`).bind(...ids).run();
        await env.REFERIX_DB.prepare(`DELETE FROM events WHERE aggregate_id IN (${ids.map(()=>'?').join(',')})`).bind(...ids).run();
      }
      return success({ deleted: ids.length });
    }

    // ─── PLAN COMPARISON ──────────────────────────────────────────────
    if (path === '/api/v2/catalog/compare' && method === 'POST') {
      const { planIds } = body as any;
      if (!planIds || !Array.isArray(planIds) || planIds.length < 2) return error('VALIDATION', 'Se requieren al menos 2 plan_ids');
      const placeholders = planIds.map(() => '?').join(',');
      const plans = await env.REFERIX_DB.prepare(`SELECT cp.*, cz.name as zone_name, t.name as technology_name FROM catalog_plans cp JOIN coverage_zones cz ON cz.id = cp.zone_id JOIN technologies t ON t.id = cp.technology_id WHERE cp.id IN (${placeholders}) AND cp.tenant_id = ?`).bind(...planIds, tenantId).all();
      return success((plans as any)?.results ?? []);
    }

    if (path === '/api/v2/engine/simulate' && method === 'POST') {
      const { plan_id, new_price } = body as any;
      if (!plan_id || !new_price) return error('VALIDATION', 'plan_id y new_price requeridos');
      const plan = await env.REFERIX_DB.prepare('SELECT * FROM catalog_plans WHERE id = ? AND tenant_id = ?').bind(plan_id, tenantId).first() as any;
      if (!plan) return error('NOT_FOUND', 'Plan no encontrado');
      const oldPrice = plan.price;
      const diff = new_price - oldPrice;
      const oldCommission = oldPrice * 0.10;
      const newCommission = new_price * 0.10;
      return success({
        planName: plan.name, oldPrice, newPrice: new_price, difference: diff,
        commissionChange: { old: oldCommission, new: newCommission, diff: newCommission - oldCommission },
        iva: { residential: 0, commercial: new_price * 0.19 },
        marginChange: { old: oldPrice * 0.6, new: new_price * 0.6, diff: diff * 0.6 },
      });
    }

    // ─── TABLE DATA ───────────────────────────────────────────────
    if (path === '/api/v1/admin/table-data' && method === 'GET') {
      const t = params.table || '';
      const allowed = ['tenants','users','persons','referidors','referrals','coverage_zones','catalog_plans','plan_services','plan_equipment','plan_documents','plan_commissions','subscriptions','installations','invoices','payments','commissions','events','wallets','wallet_transactions'];
      if (!allowed.includes(t)) return error('VALIDATION','Tabla no permitida');
      const hasTenant = ['tenants','users','persons','referidors','referrals','coverage_zones','catalog_plans','plan_services','plan_equipment','plan_documents','plan_commissions','subscriptions','installations','invoices','payments','commissions','events','wallet_transactions'].includes(t);
      const query = hasTenant ? `SELECT * FROM "${t}" WHERE tenant_id = ? ORDER BY rowid DESC LIMIT 100` : `SELECT * FROM "${t}" ORDER BY rowid DESC LIMIT 100`;
      const data = await env.REFERIX_DB.prepare(query).bind(...(hasTenant?[tenantId]:[])).all();
      return success((data as any)?.results ?? []);
    }
    // Generic table row DELETE (admin only)
    if (path.startsWith('/api/v1/admin/table-data/') && method === 'DELETE') {
      const parts = path.split('/');
      const t = parts[5]; const id = parts[6];
      const allowed = ['tenants','users','persons','referidors','referrals','coverage_zones','catalog_plans','plan_services','plan_equipment','plan_documents','plan_commissions','subscriptions','installations','invoices','payments','commissions','events','wallets','wallet_transactions'];
      if (!allowed.includes(t) || !id) return error('VALIDATION','Parámetros inválidos');
      // Check if table has tenant_id
      const hasTenant = allowed.includes(t) && t !== 'wallets' && t !== 'wallet_transactions';
      const query = hasTenant ? `DELETE FROM "${t}" WHERE id = ? AND tenant_id = ?` : `DELETE FROM "${t}" WHERE id = ?`;
      await env.REFERIX_DB.prepare(query).bind(id, ...(hasTenant?[tenantId]:[])).run();
      return success({ deleted: true });
    }
    // Generic table row UPDATE (admin only)
    if (path.startsWith('/api/v1/admin/table-data/') && method === 'PUT') {
      const parts = path.split('/');
      const t = parts[5]; const id = parts[6];
      const allowed = ['tenants','users','persons','referidors','referrals','coverage_zones','catalog_plans','plan_services','plan_equipment','plan_documents','plan_commissions','subscriptions','installations','invoices','payments','commissions','events','wallets','wallet_transactions'];
      if (!allowed.includes(t) || !id) return error('VALIDATION','Parámetros inválidos');
      const updates = body as Record<string,any>;
      const safeKeys = Object.keys(updates).filter(k => k !== 'id' && k !== 'tenant_id' && k !== 'rowid');
      if (safeKeys.length === 0) return error('VALIDATION','Sin campos para actualizar');
      const setClause = safeKeys.map(k => `"${k}" = ?`).join(', ');
      const vals = safeKeys.map(k => updates[k] ?? null);
      const hasTenant = allowed.includes(t) && t !== 'wallets' && t !== 'wallet_transactions';
      const query = hasTenant ? `UPDATE "${t}" SET ${setClause} WHERE id = ? AND tenant_id = ?` : `UPDATE "${t}" SET ${setClause} WHERE id = ?`;
      await env.REFERIX_DB.prepare(query).bind(...vals, id, ...(hasTenant?[tenantId]:[])).run();
      return success({ updated: true });
    }

    // ─── DB STATUS ──────────────────────────────────────────────────
    if (path === '/api/v1/admin/db-status' && method === 'GET') {
      const tables = ['tenants','users','persons','referidors','referrals','coverage_zones','catalog_plans','plan_services','plan_equipment','plan_documents','plan_commissions','subscriptions','installations','invoices','payments','commissions','events','wallets','wallet_transactions'];
      const counts: any[] = [];
      for (const t of tables) {
        const r = await env.REFERIX_DB.prepare(`SELECT COUNT(*) as count FROM "${t}"`).first() as any;
        counts.push({ table: t, rows: r?.count ?? 0 });
      }
      return success(counts);
    }

    // ─── HEALTH ─────────────────────────────────────────────────────
    if (path === '/health') {
      return success({ status: 'healthy', version: '1.0.0', timestamp: new Date().toISOString() });
    }

    return error('NOT_FOUND', `Ruta no encontrada: ${method} ${path}`, 404);
  } catch (e: any) {
    return error('INTERNAL_ERROR', e.message ?? 'Error interno', 500);
  }
}

export default { fetch: handleRequest };
