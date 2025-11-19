import { test, expect } from '@playwright/test';
// ✅ Use shared component modules
import { ComponentHelper } from '../shared/components/helpers';
import { 
  assertRadioChecked, 
  assertRadioNotChecked,
  assertAllOptionsVisible 
} from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Radios
 * NOW USING: Shared component modules for maximum reusability
 */
test.describe('Radios Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
  });

  test('should select radio option', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // ✅ Use shared helper
    await components.selectRadio('An individual');
    
    // ✅ Use shared assertion
    const radio = components.getRadio('An individual');
    await assertRadioChecked(radio);
  });

  test('should change selection', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // Select first option
    await components.selectRadio('An individual');
    let radio = components.getRadio('An individual');
    await assertRadioChecked(radio);
    
    // Change to second option
    await components.selectRadio('A company or organisation');
    radio = components.getRadio('A company or organisation');
    await assertRadioChecked(radio);
    
    // First option should no longer be checked
    const firstRadio = components.getRadio('An individual');
    await assertRadioNotChecked(firstRadio);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // Focus the first radio button directly
    const firstRadio = page.locator('input[name="applicant-type"]').first();
    await firstRadio.focus();
    
    // Select it with Space key
    await page.keyboard.press('Space');
    
    // Verify it's selected
    await assertRadioChecked(firstRadio);
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowDown');
    const secondRadio = page.locator('input[name="applicant-type"]').nth(1);
    await assertRadioChecked(secondRadio);
    await assertRadioNotChecked(firstRadio);
  });

  test('should display all options', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // ✅ Use shared assertion - find the radios fieldset
    const radiosContainer = page.locator('.govuk-radios');
    await assertAllOptionsVisible(radiosContainer, [
      'An individual',
      'A company or organisation'
    ]);
  });
});
