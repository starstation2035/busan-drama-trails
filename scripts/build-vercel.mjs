import { cpSync, mkdirSync, writeFileSync, rmSync } from "fs";
import { execSync } from "child_process";

console.log("Building for Vercel...");
execSync("npx vite build", { stdio: "inherit" });

console.log("Creating Vercel output structure...");
rmSync(".vercel/output", { recursive: true, force: true });
mkdirSync(".vercel/output/static", { recursive: true });
mkdirSync(".vercel/output/functions/index.func", { recursive: true });

// Copy static client assets
cpSync("dist/client", ".vercel/output/static", { recursive: true });

// Copy server files into the function directory
cpSync("dist/server", ".vercel/output/functions/index.func", { recursive: true });

// Create function entrypoint
writeFileSync(
  ".vercel/output/functions/index.func/index.js",
  `
import server from "./server.js";

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
`
);

// Create function config
writeFileSync(
  ".vercel/output/functions/index.func/.vc-config.json",
  JSON.stringify({ runtime: "nodejs22.x", handler: "index.js", launcherType: "Nodejs" }, null, 2)
);

// Create Vercel output config
writeFileSync(
  ".vercel/output/config.json",
  JSON.stringify({
    version: 3,
    routes: [
      { src: "/assets/(.*)", dest: "/assets/$1" },
      { src: "/(.*)", dest: "/index" },
    ],
  }, null, 2)
);

console.log("Vercel output ready!");
