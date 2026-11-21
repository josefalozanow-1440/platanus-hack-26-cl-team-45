import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone deja un server.js mínimo para la imagen de Docker (y Render)
  output: "standalone",
};

export default nextConfig;
