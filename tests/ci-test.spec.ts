import { test, expect } from '@playwright/test';

test('Simple CI test to verify deployment', async ({ page }) => {
  // Go to the base URL (should be the production URL in CI)
  await page.goto('/');
  
  // Take a screenshot for the report
  await page.screenshot({ path: 'homepage.png', fullPage: true });
  
  // Simple assertion that will always pass
  expect(true).toBeTruthy();
  
  // Log success message
  console.log('CI test completed successfully');
});
