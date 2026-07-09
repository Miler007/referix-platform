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
function json(data: any, status = 200): Response { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Tenant-Id' } }); }

function error(code: string, message: string, status = 400): Response {
  return json({ data: null, errors: [{ code, message }], meta: { timestamp: new Date().toISOString() } }, status);
}

function success(data: any, meta?: Record<string, unknown>): Response {
  return json({ data, meta: { timestamp: new Date().toISOString(), ...meta } });
}

// ─── ROUTER ──────────────────────────────────────────────────────────

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Tenant-Id' } });

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

    // ─── AUTH ────────────────────────────────────────────────────────
    if (path === '/api/v1/auth/login' && method === 'POST') {
      if (!body?.email || !body?.password) return error('VALIDATION', 'Email y password requeridos', 400);
      const result = await env.REFERIX_DB.prepare('SELECT id, name, email, role, tenant_id FROM users WHERE email = ? AND password = ?').bind(body.email, body.password).all();
      const users = result.results ?? [];
      if (users.length === 0) return error('AUTH_FAILED', 'Credenciales inválidas', 401);
      const u = users[0] as any;
      return success({ token: `jwt-${u.id}-${Date.now()}`, user: { id: u.id, name: u.name, email: u.email, role: u.role, tenantId: u.tenant_id } });
    }

    // ─── DASHBOARD ──────────────────────────────────────────────────
    if (path === '/api/v1/dashboard' && method === 'GET') {
      const [salesToday, installationsPending, commissionsHeld, topReferidors, recentActivity] = await Promise.all([
        env.REFERIX_DB.prepare('SELECT COUNT(*) as count FROM referrals WHERE tenant_id = ? AND date(created_at) = date("now")').bind(tenantId).first(),
        env.REFERIX_DB.prepare('SELECT COUNT(*) as count FROM installations WHERE tenant_id = ? AND status IN ("PENDING","SCHEDULED")').bind(tenantId).first(),
        env.REFERIX_DB.prepare('SELECT COUNT(*) as count, COALESCE(SUM(final_amount),0) as total FROM commissions WHERE tenant_id = ? AND financial_state = "HELD"').bind(tenantId).first(),
        env.REFERIX_DB.prepare('SELECT r.id, p.full_name as name, COUNT(ref.id) as sales, COALESCE(SUM(c.final_amount),0) as commission FROM referidors r JOIN persons p ON r.person_id = p.id LEFT JOIN referrals ref ON ref.referrer_person_id = r.person_id LEFT JOIN commissions c ON c.referral_id = ref.id WHERE r.tenant_id = ? GROUP BY r.id ORDER BY sales DESC LIMIT 5').bind(tenantId).all(),
        env.REFERIX_DB.prepare("SELECT event_name as event, event_name as description, created_at as time FROM events WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 10").bind(tenantId).all(),
      ]);
      return success({
        salesToday: (salesToday as any)?.count ?? 0,
        installationsPending: (installationsPending as any)?.count ?? 0,
        commissionsHeld: { count: (commissionsHeld as any)?.count ?? 0, total: (commissionsHeld as any)?.total ?? 0 },
        topReferidors: (topReferidors as any)?.results ?? [],
        recentActivity: (recentActivity as any)?.results ?? [],
      });
    }

    // ─── REFERRALS ──────────────────────────────────────────────────
    if (path === '/api/v1/referrals' && method === 'POST') {
      const { fullName, phone, email, address, latitude, longitude, planId, source } = body as any;
      const id = uuid();
      await env.REFERIX_DB.prepare('INSERT INTO referrals (id, tenant_id, full_name, phone, email, address, latitude, longitude, plan_id, source, funnel_status, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime("now"))').bind(id, tenantId, fullName, phone, email, address, latitude ?? null, longitude ?? null, planId, source ?? 'DIRECT', 'NEW').run();
      return success({ id }, { status: 'CREATED' });
    }

    if (path.startsWith('/api/v1/referrals/') && method === 'GET') {
      const id = path.split('/')[4];
      const ref = await env.REFERIX_DB.prepare('SELECT * FROM referrals WHERE id = ? AND tenant_id = ?').bind(id, tenantId).first();
      if (!ref) return error('NOT_FOUND', 'Referral no encontrada', 404);
      const timeline = await env.REFERIX_DB.prepare('SELECT event_name as event, description, created_at as timestamp FROM events WHERE aggregate_id = ? ORDER BY created_at ASC').bind(id).all();
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

    // ─── COMMISSIONS ───────────────────────────────────────────────
    if (path === '/api/v1/commissions' && method === 'GET') {
      const { referrerId, status: commStatus } = params;
      let query = 'SELECT * FROM commissions WHERE tenant_id = ?';
      const binds: any[] = [tenantId];
      if (commStatus) { query += ' AND financial_state = ?'; binds.push(commStatus); }
      if (referrerId) { query += ' AND referrer_person_id = ?'; binds.push(referrerId); }
      query += ' ORDER BY created_at DESC';
      const result = await env.REFERIX_DB.prepare(query).bind(...binds).all();
      return success((result as any)?.results ?? []);
    }

    // ─── WALLET ────────────────────────────────────────────────────
    if (path === '/api/v1/wallet' && method === 'GET') {
      const { referrerId } = params;
      const wallet = await env.REFERIX_DB.prepare('SELECT * FROM wallets WHERE referrer_person_id = ? AND tenant_id = ?').bind(referrerId, tenantId).first();
      if (!wallet) return success({ balance: 0, pendingBalance: 0, totalEarned: 0, transactions: [] });
      const transactions = await env.REFERIX_DB.prepare('SELECT * FROM wallet_transactions WHERE wallet_id = ? ORDER BY created_at DESC LIMIT 20').bind((wallet as any).id).all();
      return success({ ...wallet, transactions: (transactions as any)?.results ?? [] });
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
