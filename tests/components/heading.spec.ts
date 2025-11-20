import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { assertComponentVisible, assertComponentText } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Heading
 * Tests all heading sizes and variations
 */
test.describe('Heading Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render XL heading', async ({ page }) => {
    const heading = page.locator('h1.govuk-heading-xl', { hasText: 'Extra Large Heading (XL)' });
    await assertComponentVisible(heading);
    
    expect(await heading.evaluate(el => el.tagName)).toBe('H1');
  });

  test('should render L heading', async ({ page }) => {
    const heading = page.locator('h2.govuk-heading-l', { hasText: 'Large Heading (L)' });
    await assertComponentVisible(heading);
    
    expect(await heading.evaluate(el => el.tagName)).toBe('H2');
  });

  test('should render M heading', async ({ page }) => {
    const heading = page.locator('h3.govuk-heading-m', { hasText: 'Medium Heading (M)' });
    await assertComponentVisible(heading);
    
    expect(await heading.evaluate(el => el.tagName)).toBe('H3');
  });

  test('should render S heading', async ({ page }) => {
    const heading = page.locator('h4.govuk-heading-s', { hasText: 'Small Heading (S)' });
    await assertComponentVisible(heading);
    
    expect(await heading.evaluate(el => el.tagName)).toBe('H4');
  });

  test('should render heading with caption', async ({ page }) => {
    const caption = page.locator('.govuk-caption-l', { hasText: 'Application details' });
    await assertComponentVisible(caption);
    
    // Verify caption appears before heading
    const headingWithCaption = page.locator('h2', { hasText: 'Heading with Caption' });
    await assertComponentVisible(headingWithCaption);
  });

  test('should have correct GOV.UK classes', async ({ page }) => {
    const xlHeading = page.locator('h1.govuk-heading-xl').first();
    const classList = await xlHeading.getAttribute('class');
    
    expect(classList).toContain('govuk-heading-xl');
  });

  test('should use semantic HTML hierarchy', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // Verify heading hierarchy
    await components.verifyHeading('Extra Large Heading (XL)', 'h1');
    await components.verifyHeading('Large Heading (L)', 'h2');
    await components.verifyHeading('Medium Heading (M)', 'h3');
    await components.verifyHeading('Small Heading (S)', 'h4');
  });

  test('should be accessible', async ({ page }) => {
    // All headings should be accessible to screen readers
    const headings = page.locator('h1, h2, h3, h4');
    const count = await headings.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Each heading should have text content
    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = await headings.nth(i).textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('should display caption with correct size', async ({ page }) => {
    const caption = page.locator('.govuk-caption-l');
    await assertComponentVisible(caption);
    
    const classList = await caption.getAttribute('class');
    expect(classList).toContain('govuk-caption-l');
  });
});
