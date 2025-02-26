import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
     baseURL: 'http://127.0.0.1:3000',
     trace: 'on',
     //testIdAttribute: 'pw-test'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
      ],
});
