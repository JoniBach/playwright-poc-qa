import { test, expect } from '@playwright/test';
import { assertComponentVisible, assertComponentText } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Tag
 * Tests all tag color variants
 */
test.describe('Tag Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render default grey tag', async ({ page }) => {
    const tag = page.locator('.govuk-tag', { hasText: 'Inactive' });
    await assertComponentVisible(tag);
  });

  test('should render blue tag', async ({ page }) => {
    const tag = page.locator('.govuk-tag--blue', { hasText: 'New' });
    await assertComponentVisible(tag);
    
    const classList = await tag.getAttribute('class');
    expect(classList).toContain('govuk-tag--blue');
  });

  test('should render green tag', async ({ page }) => {
    const tag = page.locator('.govuk-tag--green', { hasText: 'Active' });
    await assertComponentVisible(tag);
    
    const classList = await tag.getAttribute('class');
    expect(classList).toContain('govuk-tag--green');
  });

  test('should render yellow tag', async ({ page }) => {
    const tag = page.locator('.govuk-tag--yellow', { hasText: 'Pending' });
    await assertComponentVisible(tag);
    
    const classList = await tag.getAttribute('class');
    expect(classList).toContain('govuk-tag--yellow');
  });

  test('should render red tag', async ({ page }) => {
    const tag = page.locator('.govuk-tag--red', { hasText: 'Rejected' });
    await assertComponentVisible(tag);
    
    const classList = await tag.getAttribute('class');
    expect(classList).toContain('govuk-tag--red');
  });

  test('should have correct GOV.UK base class', async ({ page }) => {
    const tags = page.locator('.govuk-tag');
    const count = await tags.count();
    
    expect(count).toBeGreaterThanOrEqual(5); // At least 5 different colored tags
    
    // All should have base class
    for (let i = 0; i < count; i++) {
      const classList = await tags.nth(i).getAttribute('class');
      expect(classList).toContain('govuk-tag');
    }
  });

  test('should display tag text correctly', async ({ page }) => {
    const expectedTags = ['Inactive', 'New', 'Active', 'Pending', 'Rejected'];
    
    for (const text of expectedTags) {
      const tag = page.locator('.govuk-tag').getByText(text, { exact: true });
      await assertComponentVisible(tag);
      await assertComponentText(tag, text);
    }
  });

  test('should be accessible', async ({ page }) => {
    const tags = page.locator('.govuk-tag');
    
    // All tags should have text content
    const count = await tags.count();
    for (let i = 0; i < count; i++) {
      const text = await tags.nth(i).textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('should use strong element for semantic HTML', async ({ page }) => {
    const tag = page.locator('.govuk-tag').first();
    expect(await tag.evaluate(el => el.tagName)).toBe('STRONG');
  });
});
