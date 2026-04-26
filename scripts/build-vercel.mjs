import { cpSync, mkdirSync, writeFileSync, rmSync, readdirSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const projectRoot = process.cwd();
const vercelOutput = path.join(projectRoot, ".vercel/output");

console.log("🚀 Starting Expert Vercel SSR Build...");

// 1. Clean up
rmSync(vercelOutput, { recursive: true, force: true });
rmSync("dist", { recursive: true, force: true });

// 2. Run Vite Build
console.log("📦 Running vite build...");
execSync("npx vite build", { stdio: "inherit" });

// 3. Prepare Vercel Output Structure
mkdirSync(path.join(vercelOutput, "static"), { recursive: true });
const functionDir = path.join(vercelOutput, "functions/index.func");
mkdirSync(functionDir, { recursive: true });

// 4. Copy Static Assets
console.log("📂 Copying static assets...");
cpSync("dist/client", path.join(vercelOutput, "static"), { recursive: true });

// 5. Create Bridge & Bundle Server
console.log("🛠️ Bundling SSR Server with Bridge...");

// Bridge code to convert Vercel (Node) req/res to Web Request/Response
const bridgeCode = `
import server from './server.raw.js';

export default async function handler(req, res) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const url = new URL(req.url, \`\${protocol}://\${host}\`);
    
    // Read body for non-GET requests
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

    const response = await server.fetch(request);
    
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      // Avoid duplicate set-cookie headers if possible, or handle them
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
}
`;

writeFileSync(path.join(functionDir, "bridge.js"), bridgeCode);

// Bundle the server + dependencies + manifest
// We use esbuild to bundle EVERYTHING into a single file so Vercel doesn't need node_modules
console.log("⚡ Running esbuild...");
execSync(`npx esbuild dist/server/server.js --bundle --platform=node --target=node22 --format=esm --outfile=${path.join(functionDir, "server.raw.js")} --external:node:* --external:fsevents`, { stdio: "inherit" });

// The entry point for Vercel is the bridge
const indexJs = `
import handler from './bridge.js';
export default handler;
`;
writeFileSync(path.join(functionDir, "index.js"), indexJs);

// 6. Create Vercel Configs
writeFileSync(path.join(functionDir, ".vc-config.json"), JSON.stringify({
  runtime: "nodejs22.x",
  handler: "index.js",
  launcherType: "Nodejs",
  shouldAddHelpers: true
}, null, 2));

writeFileSync(path.join(functionDir, "package.json"), JSON.stringify({ type: "module" }));

// 7. Global Config for Routing
writeFileSync(path.join(vercelOutput, "config.json"), JSON.stringify({
  version: 3,
  routes: [
    { src: "/assets/(.*)", dest: "/assets/$1" },
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/" }
  ]
}, null, 2));

console.log("✅ Build Complete! Ready for Deployment.");
