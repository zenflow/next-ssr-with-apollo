import type { PlaywrightTestConfig } from "@playwright/test";
const config: PlaywrightTestConfig = {
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: {
    cwd: "./test/app",
    command: "yarn dev",
    // command: "yarn start",
    port: 3000,
  },
  use: {
    baseURL: "http://localhost:3000",
    viewport: { width: 640, height: 360 },
    screenshot: "only-on-failure",
  },
};
export default config;
