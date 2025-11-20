import { test, expect } from '@playwright/test';
import { assertComponentVisible, assertComponentText } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Inset Text
 * Tests the inset text component for highlighting important content
 */
test.describe('Inset Text Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render inset text', async ({ page }) => {
    const insetText = page.locator('.govuk-inset-text').first();
    await assertComponentVisible(insetText);
  });

  test('should display inset text content', async ({ page }) => {
    const insetText = page.locator('.govuk-inset-text').first();
    await assertComponentText(
      insetText,
      'It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application.'
    );
  });

  test('should have correct GOV.UK class', async ({ page }) => {
    const insetText = page.locator('.govuk-inset-text').first();
    const classList = await insetText.getAttribute('class');
    
    expect(classList).toContain('govuk-inset-text');
  });

  test('should use semantic HTML', async ({ page }) => {
    const insetText = page.locator('.govuk-inset-text').first();
    expect(await insetText.evaluate(el => el.tagName)).toBe('DIV');
  });

  test('should be visually distinct', async ({ page }) => {
    const insetText = page.locator('.govuk-inset-text').first();
    
    // Should have border/padding for visual distinction
    const borderLeft = await insetText.evaluate(el => 
      window.getComputedStyle(el).borderLeftWidth
    );
    
    expect(borderLeft).not.toBe('0px');
  });

  test('should be accessible', async ({ page }) => {
    const insetText = page.locator('.govuk-inset-text').first();
    await assertComponentVisible(insetText);
    
    const text = await insetText.textContent();
    expect(text?.trim()).toBeTruthy();
  });
});
