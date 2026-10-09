import { defineConfig, devices } from "@playwright/test";
import { randomBytes } from "node:crypto";
const admin = process.env.E2E_EDITOR_MODE === "true";
process.env.E2E_ADMIN_TOKEN ||= randomBytes(32).toString("hex");
process.env.E2E_DB_PATH ||= `./data/e2e-${admin ? "editor" : "public"}-${Date.now()}.sqlite`;
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: admin ? "admin.spec.ts" : "public.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3001",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: admin ? "editor" : "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: admin
      ? "npx next dev --webpack --hostname 127.0.0.1 --port 3001"
      : "npx next start --hostname 127.0.0.1 --port 3001",
    url: "http://127.0.0.1:3001",
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      DATABASE_PATH: process.env.E2E_DB_PATH,
      NEXT_TELEMETRY_DISABLED: "1",
      LOCAL_ADMIN_ENABLED: "true",
      ADMIN_TOKEN: process.env.E2E_ADMIN_TOKEN,
      ADMIN_ORIGIN: "http://127.0.0.1:3001",
    },
  },
});
