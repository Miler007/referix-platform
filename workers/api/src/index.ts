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

    // ─── COMMERCIAL CATALOG v2 (REF-INT-001) ──────────────────────
    if (path === '/api/v2/catalog/zones' && method === 'GET') {
      const zones = await env.REFERIX_DB.prepare('SELECT cz.id as zone_id, cz.name, t.name as technology, t.code as technology_code, t.id as technology_id FROM coverage_zones cz JOIN technologies t ON t.code = cz.technology WHERE cz.tenant_id = ? AND cz.active = 1 ORDER BY cz.name, t.name').bind(tenantId).all();
      return success((zones as any)?.results ?? []);
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
      return success((plans as any)?.results ?? []);
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
      return success((result as any)?.results ?? []);
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
      const rules = await env.REFERIX_DB.prepare('SELECT cr.*, cp.name as plan_name FROM commission_rules cr LEFT JOIN catalog_plans cp ON cp.id = cr.plan_id WHERE cr.tenant_id = ? ORDER BY cr.type, cr.value DESC').bind(tenantId).all();
      return success((rules as any)?.results ?? []);
    }

    if (path === '/api/v2/admin/commissions' && method === 'POST') {
      const r = body as any;
      const id = uuid();
      await env.REFERIX_DB.prepare('INSERT INTO commission_rules (id, tenant_id, plan_id, offer_id, role, type, value, min_amount, max_amount, holding_days) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id, tenantId, r.plan_id || null, r.offer_id || null, r.role || 'REFERIDOR', r.type || 'PERCENTAGE', r.value || 0, r.min_amount || null, r.max_amount || null, r.holding_days || 15).run();
      return success({ id });
    }

    if (path.startsWith('/api/v2/admin/commissions/') && method === 'DELETE') {
      const id = path.split('/')[5];
      await env.REFERIX_DB.prepare('UPDATE commission_rules SET active = 0 WHERE id = ? AND tenant_id = ?').bind(id, tenantId).run();
      return success({ id, deleted: true });
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
