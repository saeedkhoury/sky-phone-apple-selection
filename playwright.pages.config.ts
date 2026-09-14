import { defineConfig, devices } from '@playwright/test'

const publishedUrl = process.env.PAGES_TEST_URL
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/skyphone-ca'

export default defineConfig({
  testDir: './e2e',
  testMatch: ['pages.spec.ts', 'hero-loop.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `${(publishedUrl ?? `http://127.0.0.1:4173${basePath}`).replace(/\/$/, '')}/`,
    trace: 'retain-on-failure',
  },
  webServer: publishedUrl ? undefined : {
    command: 'node scripts/serve-pages.mjs',
    url: `http://127.0.0.1:4173${basePath}/`,
    reuseExistingServer: !process.env.CI,
  },
})
