const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const url = require('url');
const tls = require('tls');  // Import the tls module to handle the SSL errors

const app = express();
const port = 3000;  // Port for the Express server

// Disable SSL/TLS validation for HTTPS requests (unsafe, only for development)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';  // This will ignore SSL certificate validation globally

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy requests to the target server
app.get('/proxy/*', (req, res) => {
  const targetUrl = req.params[0];  // Get the target URL from the path
  const parsedUrl = url.parse(targetUrl);

  // Determine the protocol to use (HTTP or HTTPS)
  const protocol = parsedUrl.protocol === 'https:' ? https : http;

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (protocol === https ? 443 : 80),
    path: parsedUrl.path,
    method: 'GET',
    headers: req.headers,  // Pass along the client's request headers
    rejectUnauthorized: false,  // Disable SSL certificate validation for HTTPS requests
  };

  // Make the request to the target server
  const proxyRequest = protocol.request(options, (targetRes) => {
    res.writeHead(targetRes.statusCode, targetRes.headers);
    targetRes.pipe(res);  // Pipe the target server response to the client
  });

  proxyRequest.on('error', (err) => {
    console.error(`Error: ${err.message}`);
    res.status(500).send('Internal Server Error');
  });

  // Pipe the client's request to the target server
  req.pipe(proxyRequest);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
