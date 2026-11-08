import { defineConfig } from "@playwright/test";

// Run once: npx playwright install chromium
// Then: npm run build && npm run test:e2e
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  use: { baseURL: "http://localhost:3000" },
  webServer: { command: "npm run start", url: "http://localhost:3000/home", reuseExistingServer: true, timeout: 60_000 },
});
