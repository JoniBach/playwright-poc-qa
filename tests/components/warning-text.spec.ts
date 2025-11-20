import { test, expect } from '@playwright/test';
import { assertComponentVisible, assertComponentText } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Warning Text
 * Tests the warning text component for important warnings
 */
test.describe('Warning Text Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render warning text', async ({ page }) => {
    const warningText = page.locator('.govuk-warning-text');
    await assertComponentVisible(warningText);
  });

  test('should display warning icon', async ({ page }) => {
    const warningIcon = page.locator('.govuk-warning-text__icon');
    await assertComponentVisible(warningIcon);
    
    // Should contain exclamation mark
    await assertComponentText(warningIcon, '!');
  });

  test('should display warning message', async ({ page }) => {
    const warningText = page.locator('.govuk-warning-text__text');
    await assertComponentVisible(warningText);
    
    await assertComponentText(
      warningText,
      'You can be fined up to £5,000 if you do not register'
    );
  });

  test('should have visually hidden "Warning" text', async ({ page }) => {
    const visuallyHidden = page.locator('.govuk-warning-text__assistive');
    await assertComponentVisible(visuallyHidden);
    await assertComponentText(visuallyHidden, 'Warning');
  });

  test('should have correct GOV.UK classes', async ({ page }) => {
    const warningText = page.locator('.govuk-warning-text');
    const classList = await warningText.getAttribute('class');
    
    expect(classList).toContain('govuk-warning-text');
  });

  test('should be accessible', async ({ page }) => {
    const warningText = page.locator('.govuk-warning-text');
    
    // Should have assistive text for screen readers
    const assistiveText = warningText.locator('.govuk-warning-text__assistive');
    await assertComponentVisible(assistiveText);
    
    // Should have visible warning message
    const messageText = warningText.locator('.govuk-warning-text__text');
    await assertComponentVisible(messageText);
  });

  test('should be visually prominent', async ({ page }) => {
    const warningIcon = page.locator('.govuk-warning-text__icon');
    
    // Icon should have background color
    const backgroundColor = await warningIcon.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
