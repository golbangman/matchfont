import { defineConfig, devices } from "@playwright/test";

// 기본 포트는 3000. 그 포트가 다른 프로세스에 잡혀 있으면 PORT로 바꿔 띄우고
// 같은 값을 넘겨 실행한다. 예: `PORT=3001 bun run test:e2e`
const port = process.env.PORT ?? "3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;

// 브라우저가 이미 설치된 환경(예: Claude Code 원격 세션)에서는
// PLAYWRIGHT_CHROMIUM_PATH로 실행 파일을 직접 지정한다.
// 로컬에서는 비워 두고 `bunx playwright install chromium`으로 내려받는다.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: "./e2e",
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: executablePath ? { executablePath } : {},
      },
    },
  ],
  webServer: {
    command: "bun run dev",
    env: { PORT: port },
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
