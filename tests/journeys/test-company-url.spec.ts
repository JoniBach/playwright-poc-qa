import { test } from '../../fixtures/base.fixture';

test('test company URL with /apply', async ({ page }) => {
  await page.goto('http://localhost:5173/department-for-business-and-trade/register-a-company/apply');
  await page.waitForLoadState('networkidle');
  
  const h1 = await page.locator('h1').first().textContent();
  console.log('H1 text:', h1);
  
  await page.screenshot({ path: 'test-results/company-with-apply.png' });
});

test('test company URL without /apply', async ({ page }) => {
  await page.goto('http://localhost:5173/department-for-business-and-trade/register-a-company');
  await page.waitForLoadState('networkidle');
  
  const h1 = await page.locator('h1').first().textContent();
  console.log('H1 text:', h1);
  
  await page.screenshot({ path: 'test-results/company-without-apply.png' });
});
