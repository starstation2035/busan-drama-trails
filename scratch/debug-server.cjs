const handler = require("../.vercel/output/functions/index.func/index.js");
const { createServer } = require("http");

console.log("Starting CJS debug server on http://localhost:3001");

const server = createServer(async (req, res) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  try {
    await handler(req, res);
    console.log(`Response sent with status: ${res.statusCode}`);
  } catch (error) {
    console.error("Handler Error:", error);
    res.statusCode = 500;
    res.end("Internal Server Error (Debug)");
  }
});

server.listen(3001);
