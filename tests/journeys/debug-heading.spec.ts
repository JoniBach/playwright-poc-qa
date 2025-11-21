import { test } from '../../fixtures/base.fixture';

test('debug: check actual heading text', async ({ page, journeyRunner }) => {
  await journeyRunner.startJourney('/department-for-business-and-trade/register-a-company/apply');
  
  await page.waitForLoadState('networkidle');
  await journeyRunner.continue();
  
  await page.waitForLoadState('networkidle');
  
  // Get all h1 elements and their text
  const h1Elements = await page.locator('h1').all();
  console.log(`Found ${h1Elements.length} h1 elements:`);
  
  for (let i = 0; i < h1Elements.length; i++) {
    const text = await h1Elements[i].textContent();
    const isVisible = await h1Elements[i].isVisible();
    console.log(`H1 ${i + 1}: "${text}" (visible: ${isVisible})`);
    console.log(`  Char codes:`, text?.split('').map(c => c.charCodeAt(0)).join(','));
  }
  
  // Try to find with exact text
  const exactMatch = await page.locator('h1:has-text("What is the company\'s proposed name?")').count();
  console.log(`Exact match count: ${exactMatch}`);
  
  // Try with different apostrophe
  const altMatch = await page.locator("h1:has-text(\"What is the company's proposed name?\")").count();
  console.log(`Alt apostrophe match count: ${altMatch}`);
});
