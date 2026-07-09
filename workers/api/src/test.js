// Quick quick test for D1 connectivity
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/test-db') {
      try {
        const result = await env.REFERIX_DB.prepare('SELECT COUNT(*) as count FROM users').all();
        return new Response(JSON.stringify({ success: true, data: result.results }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (url.pathname === '/login-test') {
      try {
        const body = await request.json();
        const result = await env.REFERIX_DB.prepare('SELECT id, name, email, role, tenant_id FROM users WHERE email = ?').bind(body.email).all();
        return new Response(JSON.stringify({ success: true, data: result.results, body }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response('Worker OK', { status: 200 });
  }
};
