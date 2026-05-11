import path from "node:path";
import type { NextConfig } from "next";

// Pin the workspace root so Turbopack doesn't walk up the filesystem hunting
// for a lockfile — which on macOS bumps into the TCC-protected Downloads /
// Documents / Desktop folders and panics with "Operation not permitted".
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
