import { test, expect } from '@playwright/test';
import { assertComponentVisible, assertComponentText } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Paragraph
 * Tests regular and lead paragraph variations
 */
test.describe('Paragraph Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render regular paragraph', async ({ page }) => {
    const paragraph = page.locator('p.govuk-body', { 
      hasText: 'This is a standard paragraph component demonstrating regular body text.' 
    });
    await assertComponentVisible(paragraph);
  });

  test('should render lead paragraph', async ({ page }) => {
    const leadParagraph = page.locator('p.govuk-body-l', { 
      hasText: 'This is a lead paragraph with larger text for introductions.' 
    });
    await assertComponentVisible(leadParagraph);
  });

  test('should have correct GOV.UK classes for regular paragraph', async ({ page }) => {
    const paragraph = page.locator('p.govuk-body').first();
    const classList = await paragraph.getAttribute('class');
    
    expect(classList).toContain('govuk-body');
  });

  test('should have correct GOV.UK classes for lead paragraph', async ({ page }) => {
    const leadParagraph = page.locator('p.govuk-body-l').first();
    const classList = await leadParagraph.getAttribute('class');
    
    expect(classList).toContain('govuk-body-l');
  });

  test('should display full text content', async ({ page }) => {
    const paragraph = page.locator('p.govuk-body', { 
      hasText: 'This is a standard paragraph component' 
    });
    
    await assertComponentText(paragraph, 'This is a standard paragraph component demonstrating regular body text.');
  });

  test('should be accessible', async ({ page }) => {
    const paragraphs = page.locator('p.govuk-body, p.govuk-body-l');
    const count = await paragraphs.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Each paragraph should have text content
    for (let i = 0; i < Math.min(count, 5); i++) {
      const text = await paragraphs.nth(i).textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('should use semantic HTML', async ({ page }) => {
    const paragraph = page.locator('p.govuk-body').first();
    expect(await paragraph.evaluate(el => el.tagName)).toBe('P');
  });
});
