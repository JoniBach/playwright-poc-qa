import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Components
 */
test.describe('Component Visual Regression @visual', () => {
  test('should match radios component screenshot', async ({ page }) => {
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    
    const radios = page.locator('fieldset').first();
    await expect(radios).toHaveScreenshot('radios-component.png');
  });

  test('should match text input component screenshot', async ({ page }) => {
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    await page.getByLabel('An individual').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    
    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('text-inputs-form.png');
  });

  test('should match button component screenshot', async ({ page }) => {
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    
    const button = page.getByRole('button', { name: 'Continue' });
    await expect(button).toHaveScreenshot('continue-button.png');
  });

  test('should match full page screenshot', async ({ page }) => {
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    
    await expect(page).toHaveScreenshot('journey-start-page.png', {
      fullPage: true
    });
  });
});
