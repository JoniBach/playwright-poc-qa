import { test, expect } from '@playwright/test';
// ✅ Use shared component modules
import { ComponentHelper } from '../shared/components/helpers';
import { 
  assertInputValue,
  assertComponentVisible,
  assertComponentFocused,
  assertGovUKPattern
} from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Text Input
 * NOW USING: Shared component modules for maximum reusability
 * ISOLATED: Tests components independently using setContent()
 */
test.describe('Text Input Component @component', () => {
  test.beforeEach(async ({ page }) => {
    // ✅ Inject isolated component HTML - no business logic dependency
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="http://localhost:5173/stylesheets/govuk-frontend.min.css">
      </head>
      <body class="govuk-template__body">
        <div class="govuk-width-container">
          <main class="govuk-main-wrapper">
            <h1 class="govuk-heading-l">Component Test Page</h1>
            
            <div class="govuk-form-group">
              <label class="govuk-label" for="full-name">
                Full name
              </label>
              <input class="govuk-input" id="full-name" name="full-name" type="text">
            </div>

            <div class="govuk-form-group">
              <label class="govuk-label" for="email">
                Email address
              </label>
              <input class="govuk-input" id="email" name="email" type="email">
            </div>
          </main>
        </div>
      </body>
      </html>
    `);
  });

  test('should fill text input', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // ✅ Use shared helper to fill input
    await components.fillTextInput('Full name', 'John Smith');
    
    // ✅ Use shared assertion to verify value
    const input = components.getTextInput('Full name');
    await assertInputValue(input, 'John Smith');
  });

  test('should clear and refill text input', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // Fill initial value
    await components.fillTextInput('Full name', 'John Smith');
    let input = components.getTextInput('Full name');
    await assertInputValue(input, 'John Smith');
    
    // Clear and fill new value
    await components.fillTextInput('Full name', '');
    await assertInputValue(input, '');
    
    await components.fillTextInput('Full name', 'Jane Doe');
    await assertInputValue(input, 'Jane Doe');
  });

  test('should be keyboard accessible', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // Tab to the input
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need multiple tabs depending on page structure
    
    // Find the input and verify it can be focused
    const input = components.getTextInput('Full name');
    await input.focus();
    await assertComponentFocused(input);
    
    // Type using keyboard
    await page.keyboard.type('Test User');
    await assertInputValue(input, 'Test User');
  });

  test('should display input with correct GOV.UK styling', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    const input = components.getTextInput('Full name');
    
    // ✅ Use shared assertion to verify GOV.UK pattern
    await assertComponentVisible(input);
    await assertGovUKPattern(input, 'input');
  });

  test('should handle special characters', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    const specialText = "O'Brien-Smith & Co. (2024)";
    await components.fillTextInput('Full name', specialText);
    
    const input = components.getTextInput('Full name');
    await assertInputValue(input, specialText);
  });

  test('should handle long text input', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    const longText = 'A'.repeat(200);
    await components.fillTextInput('Full name', longText);
    
    const input = components.getTextInput('Full name');
    await assertInputValue(input, longText);
  });

  test('should maintain value after blur', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // Fill input
    await components.fillTextInput('Full name', 'John Smith');
    
    // Blur by clicking elsewhere
    await page.click('h1'); // Click on heading
    
    // Verify value is maintained
    const input = components.getTextInput('Full name');
    await assertInputValue(input, 'John Smith');
  });

  test.skip('should show error state when validation fails', async ({ page }) => {
    // Validation requires form context - tested in journey tests instead
    const components = new ComponentHelper(page);
    
    // Leave field empty and submit
    await components.clickButton('Continue');
    
    // Should show error
    await components.verifyErrorSummary(['Enter your full name']);
    await components.verifyFieldError('full-name', 'Enter your full name');
  });
});
