import { defineConfig } from '@playwright/test';
import base from './playwright.config.js';

export default defineConfig({
  ...base,
  reporter: [['list']],
  outputDir: 'artifacts/qa/webkit',
  use: { ...base.use, browserName: 'webkit', channel: undefined },
});
