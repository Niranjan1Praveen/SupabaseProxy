// src/index.js
export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, X-Client-Info, Prefer, Accept',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      const url = new URL(request.url);
      
      // Your Supabase project reference
      const supabaseProjectRef = 'hpumegppcvjhxgkavawh';
      
      // Remove the /public prefix if present (Supabase REST API doesn't need it)
      let path = url.pathname;
      
      // If path starts with /public, remove it
      if (path.startsWith('/public')) {
        path = path.replace('/public', '');
      }
      
      // Construct the Supabase REST API URL
      // Note: No /public in the path
      const supabaseUrl = `https://${supabaseProjectRef}.supabase.co/rest/v1${path}${url.search}`;
      
      console.log(`Proxying to: ${supabaseUrl}`);

      // Get headers from the original request
      const headers = {
        'apikey': request.headers.get('apikey') || '',
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': request.headers.get('content-type') || 'application/json',
      };

      // Add Prefer header if present
      const prefer = request.headers.get('prefer');
      if (prefer) {
        headers['Prefer'] = prefer;
      }

      // Prepare request options
      const requestOptions = {
        method: request.method,
        headers: headers,
      };

      // Add body for non-GET/HEAD requests
      if (!['GET', 'HEAD'].includes(request.method)) {
        const body = await request.text();
        if (body) {
          requestOptions.body = body;
        }
      }

      // Forward the request to Supabase
      const response = await fetch(supabaseUrl, requestOptions);

      // Read response body
      const responseBody = await response.text();

      // Return response with CORS headers
      return new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, X-Client-Info, Prefer, Accept',
          'Content-Type': response.headers.get('content-type') || 'application/json',
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(JSON.stringify({
        success: false,
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