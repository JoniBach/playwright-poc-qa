import { test, expect } from '@playwright/test';
// ✅ Use shared accessibility modules
import { AccessibilityHelper } from '../shared/accessibility/helpers';
import { assertNoViolations, assertKeyboardAccessible } from '../shared/accessibility/assertions';

/**
 * Accessibility Tests - WCAG 2.1 AA Compliance
 * NOW USING: Shared accessibility modules for maximum reusability
 */
test.describe('WCAG 2.1 AA Compliance @a11y', () => {
  test('should have no accessibility violations on home page', async ({ page }) => {
    const a11y = new AccessibilityHelper(page);
    
    await page.goto('/');
    const results = await a11y.scanWCAG_AA();
    
    // ✅ Use shared assertion
    assertNoViolations(results);
  });

  test('should have no violations on journey start page', async ({ page }) => {
    const a11y = new AccessibilityHelper(page);
    
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    const results = await a11y.scanWCAG_AA();
    
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:');
      console.log(a11y.formatViolations(results.violations));
    }
    
    // ✅ Use shared assertion
    assertNoViolations(results);
  });

  test('should support keyboard navigation', async ({ page }) => {
    const a11y = new AccessibilityHelper(page);
    
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    
    // Test tab navigation through interactive elements
    const focusableElements = await a11y.testKeyboardNavigation(5);
    
    // ✅ Use shared assertion
    assertKeyboardAccessible(focusableElements);
  });

  test('should have proper form labels', async ({ page }) => {
    const a11y = new AccessibilityHelper(page);
    
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    await page.getByLabel('An individual').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    
    const results = await a11y.checkFormLabels();
    // ✅ Use shared assertion
    assertNoViolations(results);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const a11y = new AccessibilityHelper(page);
    
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    const results = await a11y.checkColorContrast();
    
    // ✅ Use shared assertion
    assertNoViolations(results);
  });
});
