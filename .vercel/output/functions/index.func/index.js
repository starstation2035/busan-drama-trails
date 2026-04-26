
const server = require('./server.raw.js');

module.exports = async function handler(req, res) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const url = new URL(req.url, `${protocol}://${host}`);
    
    let body = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks);
    }

    const request = new Request(url.href, {
      method: req.method,
      headers: req.headers,
      body: body,
      duplex: 'half'
    });

    const fetchHandler = server.default?.fetch || server.fetch;
    const response = await fetchHandler(request);
    
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        res.appendHeader(key, value);
      } else {
        res.setHeader(key, value);
      }
    });
    
    const responseBody = await response.arrayBuffer();
    res.end(Buffer.from(responseBody));
  } catch (error) {
    console.error('SSR Bridge Error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error (SSR Bridge)');
  }
};
