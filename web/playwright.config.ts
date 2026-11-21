import { defineConfig } from "@playwright/test";

// The specs run against the docker compose stack (web on :3000, api on :8000).
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: process.env.WEB_URL ?? "http://localhost:3000" },
});
