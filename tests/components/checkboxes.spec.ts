import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { 
  assertCheckboxChecked,
  assertComponentVisible,
  assertAllOptionsVisible
} from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Checkboxes
 * Tests the checkboxes component with multiple selection support
 */
test.describe('Checkboxes Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render all checkbox options', async ({ page }) => {
    const checkboxesContainer = page.locator('.govuk-checkboxes').first();
    await assertComponentVisible(checkboxesContainer);
    
    // Check each label is visible
    await expect(checkboxesContainer.locator('label', { hasText: 'British' })).toBeVisible();
    await expect(checkboxesContainer.locator('label', { hasText: 'Irish' })).toBeVisible();
    await expect(checkboxesContainer.locator('label', { hasText: 'Citizen of another country' })).toBeVisible();
  });

  test('should allow single checkbox selection', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    await components.checkCheckbox('British');
    const checkbox = components.getCheckbox('British');
    
    await assertCheckboxChecked(checkbox);
  });

  test('should allow multiple checkbox selections', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // Check multiple checkboxes
    await components.checkCheckbox('British');
    await components.checkCheckbox('Irish');
    
    // Verify both are checked
    await assertCheckboxChecked(components.getCheckbox('British'));
    await assertCheckboxChecked(components.getCheckbox('Irish'));
  });

  test('should allow unchecking checkboxes', async ({ page }) => {
    const components = new ComponentHelper(page);
    const checkbox = components.getCheckbox('British');
    
    // Check then uncheck
    await checkbox.check();
    await assertCheckboxChecked(checkbox);
    
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should display legend', async ({ page }) => {
    const legend = page.locator('.govuk-fieldset__legend', { 
      hasText: 'What is your nationality?' 
    });
    await assertComponentVisible(legend);
  });

  test('should display hint text', async ({ page }) => {
    const hint = page.locator('#nationality-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('Select all options that are relevant to you');
  });

  test('should display individual checkbox hints', async ({ page }) => {
    const britishHint = page.locator('.govuk-checkboxes__hint', {
      hasText: 'Including English, Scottish, Welsh and Northern Irish'
    });
    await assertComponentVisible(britishHint);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const components = new ComponentHelper(page);
    const firstCheckbox = components.getCheckbox('British');
    
    // Focus and check with keyboard
    await firstCheckbox.focus();
    await page.keyboard.press('Space');
    
    await assertCheckboxChecked(firstCheckbox);
    
    // Uncheck with keyboard
    await page.keyboard.press('Space');
    await expect(firstCheckbox).not.toBeChecked();
  });

  test('should support tab navigation between checkboxes', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has focus issues with checkbox tab navigation');
    
    const components = new ComponentHelper(page);
    
    const firstCheckbox = components.getCheckbox('British');
    await firstCheckbox.focus();
    
    // Tab to next checkbox
    await page.keyboard.press('Tab');
    
    const secondCheckbox = components.getCheckbox('Irish');
    await expect(secondCheckbox).toBeFocused();
  });

  test('should maintain state when navigating away and back', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // Check some boxes
    await components.checkCheckbox('British');
    await components.checkCheckbox('Irish');
    
    // Scroll away (simulate navigation)
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // Verify still checked
    await assertCheckboxChecked(components.getCheckbox('British'));
    await assertCheckboxChecked(components.getCheckbox('Irish'));
  });
});
