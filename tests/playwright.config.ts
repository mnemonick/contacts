import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./specs",
  tsconfig: "./tsconfig.json",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3000",
    locale: "en-US",
    actionTimeout: 10_000,
    navigationTimeout: 10_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
