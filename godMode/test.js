const express = require('express');
const httpProxy = require('http-proxy');
const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');

const app = express();
const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    secure: false // Allow insecure SSL certificates
});

// Middleware to serve a basic web interface
app.get('/', (req, res) => {
    res.send(`
        <html>
            <body>
                <h1>Simple Proxy Server</h1>
                <form action="/proxy" method="get">
                    <input type="text" name="url" placeholder="Enter URL to proxy" style="width:300px;">
                    <button type="submit">Go</button>
                </form>
            </body>
        </html>
    `);
});

// Proxy request handler
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('URL parameter is required.');
    }

    try {
        // Validate the URL format
        const parsedUrl = url.parse(targetUrl);
        if (!parsedUrl.protocol || !parsedUrl.host) {
            return res.status(400).send('Invalid URL format.');
        }

        // Fetch the target page content
        const response = await axios.get(targetUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        // Rewrite links, scripts, and styles to go through the proxy
        $('a').each(function () {
            const href = $(this).attr('href');
            if (href && href.startsWith('http')) {
                $(this).attr('href', '/proxy?url=' + href);
            }
        });

        $('script').each(function () {
            const src = $(this).attr('src');
            if (src && src.startsWith('http')) {
                $(this).attr('src', '/proxy?url=' + src);
            }
        });

        $('link').each(function () {
            const href = $(this).attr('href');
            if (href && href.startsWith('http')) {
                $(this).attr('href', '/proxy?url=' + href);
            }
        });

        // Send modified HTML back to the user
        res.send($.html());
    } catch (err) {
        console.error('Error fetching URL:', err.message);
        res.status(500).send('Error while fetching the target URL.');
    }
});

// Start the proxy server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});

console.log("HI")
