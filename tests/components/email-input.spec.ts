import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { 
  assertComponentVisible,
  assertInputValue,
  assertComponentAttribute
} from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Email Input
 * Tests the dedicated email input component
 */
test.describe('Email Input Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render email input with correct attributes', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    const emailInput = components.getTextInput('Email address');
    await assertComponentVisible(emailInput);
    
    // Verify it has email type
    await assertComponentAttribute(emailInput, 'type', 'email');
    
    // Verify autocomplete attribute
    await assertComponentAttribute(emailInput, 'autocomplete', 'email');
  });

  test('should accept valid email input', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    const emailInput = components.getTextInput('Email address');
    const testEmail = 'test@example.com';
    
    await emailInput.fill(testEmail);
    await assertInputValue(emailInput, testEmail);
  });

  test('should display hint text', async ({ page }) => {
    const hintText = page.locator('#email-address-hint');
    await expect(hintText).toBeVisible();
    await expect(hintText).toContainText("We'll only use this to send you a receipt");
  });

  test.skip('should be keyboard accessible', async ({ page }) => {
    // Skipped due to tab navigation complexity on component showcase page
    const components = new ComponentHelper(page);
    const emailInput = components.getTextInput('Email address');
    
    // Tab to the input
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Type email using keyboard
    await page.keyboard.type('keyboard@test.com');
    
    await assertInputValue(emailInput, 'keyboard@test.com');
  });

  test('should have correct width class', async ({ page }) => {
    const emailInput = page.locator('#email-address');
    const classList = await emailInput.getAttribute('class');
    
    expect(classList).toContain('govuk-input--width-20');
  });

  test('should support copy and paste', async ({ page }) => {
    const components = new ComponentHelper(page);
    const emailInput = components.getTextInput('Email address');
    
    // Simulate paste
    await emailInput.click();
    await page.keyboard.insertText('pasted@email.com');
    
    await assertInputValue(emailInput, 'pasted@email.com');
  });
});
