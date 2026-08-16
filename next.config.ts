import os from "os";
import type { NextConfig } from "next";

function localDevOrigins(): string[] {
  const origins = new Set(["localhost", "127.0.0.1"]);
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const addr of addrs ?? []) {
      if (addr.family === "IPv4" && !addr.internal) {
        origins.add(addr.address);
      }
    }
  }
  return [...origins];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: localDevOrigins(),
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

