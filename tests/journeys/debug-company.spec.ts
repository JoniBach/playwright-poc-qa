import { test, expect } from '../../fixtures/base.fixture';

test('debug: check what page loads for company journey', async ({ page }) => {
  // Try the URL
  await page.goto('http://localhost:5173/department-for-business-and-trade/register-a-company/apply');
  
  // Wait a bit for page to load
  await page.waitForTimeout(2000);
  
  // Get the page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Get all headings
  const headings = await page.locator('h1, h2, h3').allTextContents();
  console.log('Headings found:', headings);
  
  // Get the URL after navigation
  console.log('Current URL:', page.url());
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/debug-company-journey.png', fullPage: true });
  
  // This test is just for debugging - always pass
  expect(true).toBe(true);
});
