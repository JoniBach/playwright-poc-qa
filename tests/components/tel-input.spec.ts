import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { 
  assertComponentVisible,
  assertInputValue,
  assertComponentAttribute
} from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Telephone Input
 * Tests the dedicated telephone input component
 */
test.describe('Telephone Input Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render telephone input with correct attributes', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    const telInput = components.getTextInput('UK telephone number');
    await assertComponentVisible(telInput);
    
    // Verify it has tel type
    await assertComponentAttribute(telInput, 'type', 'tel');
    
    // Verify autocomplete attribute
    await assertComponentAttribute(telInput, 'autocomplete', 'tel');
  });

  test('should accept valid phone number input', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has issues with tel input field interaction');
    
    const components = new ComponentHelper(page);
    
    const telInput = components.getTextInput('UK telephone number');
    const testPhone = '07700 900123';
    
    await telInput.fill(testPhone);
    await assertInputValue(telInput, testPhone);
  });

  test('should accept international phone numbers', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    const telInput = components.getTextInput('UK telephone number');
    const internationalPhone = '+44 20 7946 0958';
    
    await telInput.fill(internationalPhone);
    await assertInputValue(telInput, internationalPhone);
  });

  test('should display hint text', async ({ page }) => {
    const hintText = page.locator('#phone-number-hint');
    await expect(hintText).toBeVisible();
    await expect(hintText).toContainText('For international numbers include the country code');
  });

  test('should be keyboard accessible', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit keyboard simulation differs from other browsers');
    
    const components = new ComponentHelper(page);
    const telInput = components.getTextInput('UK telephone number');
    
    await telInput.focus();
    await page.keyboard.type('01234567890');
    
    await assertInputValue(telInput, '01234567890');
  });

  test('should have correct width class', async ({ page }) => {
    const telInput = page.locator('#phone-number');
    const classList = await telInput.getAttribute('class');
    
    expect(classList).toContain('govuk-input--width-20');
  });

  test('should allow various phone number formats', async ({ page }) => {
    const components = new ComponentHelper(page);
    const telInput = components.getTextInput('UK telephone number');
    
    const formats = [
      '07700900123',
      '0770 090 0123',
      '(020) 7946 0958',
      '+44 7700 900123'
    ];
    
    for (const format of formats) {
      await telInput.fill(format);
      await assertInputValue(telInput, format);
      await telInput.clear();
    }
  });
});
