import { cpSync, mkdirSync, writeFileSync, rmSync, readdirSync } from "fs";
import { execSync } from "child_process";

console.log("Building...");
execSync("npx vite build", { stdio: "inherit" });

// Find client entry from manifest
const serverAssets = readdirSync("dist/server/assets");
const manifestFile = serverAssets.find(f => f.includes("manifest"));
const { tsrStartManifest } = await import(new URL(`../dist/server/assets/${manifestFile}`, import.meta.url).href);
const manifest = tsrStartManifest();
const clientEntry = manifest.clientEntry; // e.g. /assets/index-CxNlA28E.js

// Find CSS file
const clientAssets = readdirSync("dist/client/assets");
const cssFile = clientAssets.find(f => f.endsWith(".css"));

console.log("clientEntry:", clientEntry);
console.log("css:", cssFile);

// Generate index.html for SPA
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Busan Drama Spot &amp; Style</title>
    <meta name="description" content="Discover K-drama filming locations, restaurants, and cafes in Busan." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="/assets/${cssFile}" />
  </head>
  <body>
    <script type="module">import("${clientEntry}")</script>
  </body>
</html>`;

writeFileSync("dist/client/index.html", html);
console.log("index.html created!");

// Prepare clean .vercel/output
rmSync(".vercel/output", { recursive: true, force: true });
mkdirSync(".vercel/output/static", { recursive: true });
cpSync("dist/client", ".vercel/output/static", { recursive: true });

// SPA routing config
writeFileSync(".vercel/output/config.json", JSON.stringify({
  version: 3,
  routes: [
    { src: "/assets/(.*)", dest: "/assets/$1" },
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/index.html" }
  ]
}, null, 2));

// Remove api folder (no longer needed)
rmSync("api", { recursive: true, force: true });

console.log("Done! Static SPA ready for Vercel.");
