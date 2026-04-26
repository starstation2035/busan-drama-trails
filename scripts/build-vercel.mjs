import { cpSync, mkdirSync, writeFileSync, rmSync } from "fs";
import { execSync } from "child_process";
import { buildSync } from "esbuild";

console.log("Step 1: Vite build...");
execSync("npx vite build", { stdio: "inherit" });

console.log("Step 2: Creating .vercel/output structure...");
rmSync(".vercel/output", { recursive: true, force: true });
mkdirSync(".vercel/output/static", { recursive: true });
mkdirSync(".vercel/output/functions/index.func", { recursive: true });

// Static client assets
cpSync("dist/client", ".vercel/output/static", { recursive: true });

// Copy server assets (dynamic imports in server.js reference ./assets/*)
cpSync("dist/server/assets", ".vercel/output/functions/index.func/assets", { recursive: true });

console.log("Step 3: Bundling SSR server with all dependencies...");
buildSync({
  entryPoints: ["dist/server/server.js"],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: ".vercel/output/functions/index.func/server.bundle.js",
  // Keep Node built-ins and local asset imports as-is
  external: ["node:*", "./assets/*"],
  allowOverwrite: true,
});

console.log("Step 4: Writing function handler...");
writeFileSync(
  ".vercel/output/functions/index.func/index.js",
  `import server from "./server.bundle.js";

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

writeFileSync(
  ".vercel/output/functions/index.func/package.json",
  JSON.stringify({ type: "module" }, null, 2)
);

writeFileSync(
  ".vercel/output/functions/index.func/.vc-config.json",
  JSON.stringify({ runtime: "nodejs22.x", handler: "index.js", launcherType: "Nodejs" }, null, 2)
);

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
