import { test, expect } from '@playwright/test';
import { assertComponentVisible, assertComponentText } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK List
 * Tests both bullet and numbered list components
 */
test.describe('List Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render bullet list', async ({ page }) => {
    const bulletList = page.locator('ul.govuk-list--bullet').first();
    await assertComponentVisible(bulletList);
    
    // Verify it's a ul element
    expect(await bulletList.evaluate(el => el.tagName)).toBe('UL');
  });

  test('should display all bullet list items', async ({ page }) => {
    const bulletList = page.locator('ul.govuk-list--bullet').first();
    
    const expectedItems = [
      'First bullet point item',
      'Second bullet point item',
      'Third bullet point item with more detail'
    ];
    
    for (const item of expectedItems) {
      await assertComponentText(bulletList, item);
    }
  });

  test('should render numbered list', async ({ page }) => {
    const numberedList = page.locator('ol.govuk-list--number').first();
    await assertComponentVisible(numberedList);
    
    // Verify it's an ol element
    expect(await numberedList.evaluate(el => el.tagName)).toBe('OL');
  });

  test('should display all numbered list items', async ({ page }) => {
    const numberedList = page.locator('ol.govuk-list--number').first();
    
    const expectedItems = [
      'First step in the process',
      'Second step in the process',
      'Third and final step'
    ];
    
    for (const item of expectedItems) {
      await assertComponentText(numberedList, item);
    }
  });

  test('should have correct GOV.UK classes', async ({ page }) => {
    const bulletList = page.locator('ul.govuk-list--bullet').first();
    const numberedList = page.locator('ol.govuk-list--number').first();
    
    // Check bullet list classes
    const bulletClasses = await bulletList.getAttribute('class');
    expect(bulletClasses).toContain('govuk-list');
    expect(bulletClasses).toContain('govuk-list--bullet');
    
    // Check numbered list classes
    const numberedClasses = await numberedList.getAttribute('class');
    expect(numberedClasses).toContain('govuk-list');
    expect(numberedClasses).toContain('govuk-list--number');
  });

  test('should count correct number of items', async ({ page }) => {
    const bulletList = page.locator('ul.govuk-list--bullet').first();
    const bulletItems = bulletList.locator('li');
    
    expect(await bulletItems.count()).toBe(3);
    
    const numberedList = page.locator('ol.govuk-list--number').first();
    const numberedItems = numberedList.locator('li');
    
    expect(await numberedItems.count()).toBe(3);
  });

  test('should be accessible', async ({ page }) => {
    const bulletList = page.locator('ul.govuk-list--bullet').first();
    const numberedList = page.locator('ol.govuk-list--number').first();
    
    // Lists should be accessible to screen readers
    await expect(bulletList).toBeVisible();
    await expect(numberedList).toBeVisible();
    
    // Verify semantic HTML structure
    const bulletListItems = bulletList.locator('li');
    expect(await bulletListItems.first().evaluate(el => el.tagName)).toBe('LI');
    
    const numberedListItems = numberedList.locator('li');
    expect(await numberedListItems.first().evaluate(el => el.tagName)).toBe('LI');
  });
});
