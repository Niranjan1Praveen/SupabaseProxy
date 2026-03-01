// src/index.js
export default {
  async fetch(request) {
    // Handle CORS preflight requests (OPTIONS method)
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
      
      // Use REST API endpoint (port 443) instead of database port (5432)
      const supabaseUrl = `https://${supabaseProjectRef}.supabase.co/rest/v1${url.pathname}${url.search}`;
      
      console.log(`Proxying request to: ${supabaseUrl}`);
      console.log(`Request method: ${request.method}`);

      // Get headers from the original request
      const apikey = request.headers.get('apikey');
      const authorization = request.headers.get('authorization');
      const contentType = request.headers.get('content-type');
      const prefer = request.headers.get('prefer');
      const accept = request.headers.get('accept');

      // Prepare headers for Supabase
      const headers = {
        'apikey': apikey || '',
        'Content-Type': contentType || 'application/json',
      };

      // Add Authorization header if present (for authenticated requests)
      if (authorization) {
        headers['Authorization'] = authorization;
      }

      // Add Prefer header if present (for returning representation, etc.)
      if (prefer) {
        headers['Prefer'] = prefer;
      }

      // Add Accept header if present
      if (accept) {
        headers['Accept'] = accept;
      }

      // Prepare request options
      const requestOptions = {
        method: request.method,
        headers: headers,
      };

      // Add body for non-GET/HEAD requests
      if (!['GET', 'HEAD'].includes(request.method)) {
        // For POST, PUT, PATCH requests, read the body
        const body = await request.text();
        if (body) {
          requestOptions.body = body;
        }
      }

      // Forward the request to Supabase
      const response = await fetch(supabaseUrl, requestOptions);

      // Read the response body
      const responseBody = await response.text();

      // Create a new response with CORS headers
      const newResponse = new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, X-Client-Info, Prefer, Accept',
          'Content-Type': response.headers.get('content-type') || 'application/json',
        },
      });

      console.log(`Response status: ${response.status}`);

      return newResponse;

    } catch (error) {
      console.error('Worker error:', error);
      
      // Return a detailed error response
      return new Response(JSON.stringify({
        success: false,
        error: 'Proxy error',
        message: error.message,
        stack: error.stack,
        solution: 'Check that your Supabase project reference is correct and the REST API is accessible'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, X-Client-Info, Prefer, Accept',
        },
      });
    }
  },
};