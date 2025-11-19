import { test as base } from '@playwright/test';
import { JourneyRunner } from '../helpers/JourneyRunner';
import { ComponentHelper } from '../helpers/ComponentHelper';

/**
 * Custom Playwright fixtures for the test suite
 * Extends base test with journey and component helpers
 */
type CustomFixtures = {
  journeyRunner: JourneyRunner;
  componentHelper: ComponentHelper;
  baseURL: string;
};

export const test = base.extend<CustomFixtures>({
  // Journey runner fixture - provides helper for running multi-step journeys
  journeyRunner: async ({ page }, use) => {
    const runner = new JourneyRunner(page);
    await use(runner);
  },

  // Component helper fixture - provides utilities for interacting with GOV.UK components
  componentHelper: async ({ page }, use) => {
    const helper = new ComponentHelper(page);
    await use(helper);
  },

  // Base URL fixture - can be overridden per environment
  baseURL: async ({}, use) => {
    const url = process.env.BASE_URL || 'http://localhost:5173';
    await use(url);
  },
});

export { expect } from '@playwright/test';
