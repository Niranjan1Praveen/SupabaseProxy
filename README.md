# Supabase Cloudflare Proxy

A lightweight Cloudflare Worker proxy for Supabase REST API requests. This worker forwards requests to your Supabase project while handling CORS headers and preserving the exact request structure.

## 🚀 Features

- **CORS Support**: Full CORS headers for cross-origin requests
- **Method Support**: Handles all HTTP methods (GET, POST, PUT, DELETE, PATCH)
- **Header Preservation**: Forwards authentication and content headers
- **Path Preservation**: Maintains exact URL paths including case-sensitive table names
- **Error Handling**: Comprehensive error handling with detailed responses

## 📋 Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/)
- A [Supabase project](https://supabase.com/)
- Your Supabase project reference (found in your project URL)

## 🛠️ Installation

### 1. Clone or Create the Worker

Create a new Cloudflare Worker and copy the contents of `src/index.js` into your worker script.

### 2. Configure Supabase Project Reference

Update the `supabaseProjectRef` variable in the code with your Supabase project reference:

```javascript
const supabaseProjectRef = 'your-project-reference-here';
```

### 3. Deploy to Cloudflare

#### Using Wrangler CLI
```bash
# Install wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy
```

#### Using Cloudflare Dashboard
1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Workers & Pages
3. Create a new Worker
4. Paste the code and deploy

## 🔧 Configuration

### Environment Variables (Optional)

If you prefer using environment variables, modify the code to use:

```javascript
const supabaseProjectRef = env.SUPABASE_PROJECT_REF || 'your-project-reference-here';
```

## 📝 Usage

### Making Requests

Once deployed, use your Cloudflare Worker URL as the base endpoint for Supabase REST API calls:

```javascript
// Original Supabase URL
https://your-project.supabase.co/rest/v1/tableName

// Proxy URL
https://your-worker.your-subdomain.workers.dev/tableName
```

### Example Requests

#### GET Request
```javascript
fetch('https://your-worker.workers.dev/users?select=*', {
  headers: {
    'apikey': 'your-supabase-anon-key',
    'Authorization': 'Bearer your-supabase-jwt-token'
  }
})
```

#### POST Request
```javascript
fetch('https://your-worker.workers.dev/users', {
  method: 'POST',
  headers: {
    'apikey': 'your-supabase-anon-key',
    'Authorization': 'Bearer your-supabase-jwt-token',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
})
```

## 📁 Project Structure

```
supabase-cloudflare-proxy/
├── src/
│   └── index.js          # Main worker code
├── wrangler.toml         # Cloudflare worker configuration
├── package.json          # Dependencies and scripts
├── README.md            # This file
└── LICENSE              # License file
```

### wrangler.toml Example
```toml
name = "supabase-proxy"
main = "src/index.js"
compatibility_date = "2024-01-01"

[env.production]
vars = { SUPABASE_PROJECT_REF = "your-project-reference" }
```

## 🔒 Security Considerations

1. **Authentication**: The proxy forwards authentication headers but does not validate them. Always ensure your Supabase RLS policies are properly configured.
2. **Rate Limiting**: Consider implementing rate limiting in the worker to prevent abuse.
3. **Environment Variables**: Store sensitive configuration in environment variables, not in code.
4. **Allowed Origins**: For production, consider restricting `Access-Control-Allow-Origin` to specific domains instead of `*`.

## 🧪 Testing

Test your proxy locally using Wrangler:

```bash
# Local development
wrangler dev

# Test endpoints
curl -X OPTIONS http://localhost:8787/your-table
curl -H "apikey: your-key" http://localhost:8787/your-table
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the OPTIONS preflight request is handled correctly
2. **404 Not Found**: Check that the table name case matches exactly
3. **Authentication Failed**: Verify that API keys and tokens are properly forwarded

### Debug Mode

Enable logging to debug issues:

```javascript
// Add to your fetch function
console.log('Request URL:', url.toString());
console.log('Supabase URL:', supabaseUrl);
console.log('Headers:', headers);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing backend platform
- [Cloudflare Workers](https://workers.cloudflare.com/) for the serverless platform

## 📧 Support

For issues with the proxy:
- Open an issue on GitHub
- Check Cloudflare Workers documentation
- Consult Supabase REST API documentation

---

**Note**: This proxy is not officially associated with Supabase or Cloudflare. Use at your own risk.
