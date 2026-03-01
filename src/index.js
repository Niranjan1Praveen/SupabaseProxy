export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, X-Client-Info, Prefer',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      const url = new URL(request.url);
      const supabaseProjectRef = 'hpumegppcvjhxgkavawh';
      const supabaseHost = `db.${supabaseProjectRef}.supabase.co`;
      const supabaseUrl = `https://${supabaseHost}${url.pathname}${url.search}`;
      
      console.log(`Proxying to: ${supabaseUrl}`);

      const response = await fetch(supabaseUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, X-Client-Info, Prefer');

      return newResponse;

    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Proxy error',
        message: error.message,
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};