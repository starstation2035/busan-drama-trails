import server from "./server.bundle.js";

export default async function handler(req, res) {
  const url = new URL(req.url, "https://" + req.headers.host);
  const chunks = [];
  await new Promise((resolve) => {
    req.on("data", (c) => chunks.push(c));
    req.on("end", resolve);
  });
  const body = chunks.length ? Buffer.concat(chunks) : undefined;

  const request = new Request(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: body && body.length > 0 ? body : undefined,
  });

  const response = await server.fetch(request);
  res.statusCode = response.status;
  for (const [k, v] of response.headers.entries()) res.setHeader(k, v);
  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  }
  res.end();
}
