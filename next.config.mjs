import { execSync } from "child_process";

let gitBranch = "unknown";
let gitStatus = "";

try {
  gitBranch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  gitStatus = execSync("git status --short").toString().trim();
} catch (e) {
  console.warn("Failed to retrieve git info:", e);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_GIT_BRANCH: gitBranch,
    NEXT_PUBLIC_GIT_STATUS: gitStatus,
  },
};

export default nextConfig;

