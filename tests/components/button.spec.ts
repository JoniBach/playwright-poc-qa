import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { 
  assertComponentVisible,
  assertButtonEnabled,
  assertButtonDisabled
} from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Button
 * Tests all button variants and states
 */
test.describe('Button Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render default button', async ({ page }) => {
    const components = new ComponentHelper(page);
    const button = components.getButton('Default button');
    
    await assertComponentVisible(button);
    await assertButtonEnabled(button);
  });

  test('should render secondary button', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Secondary button' });
    await assertComponentVisible(button);
    
    const classList = await button.getAttribute('class');
    expect(classList).toContain('govuk-button--secondary');
  });

  test('should render warning button', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Warning button' });
    await assertComponentVisible(button);
    
    const classList = await button.getAttribute('class');
    expect(classList).toContain('govuk-button--warning');
  });

  test('should render disabled button', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Disabled button' });
    await assertComponentVisible(button);
    await assertButtonDisabled(button);
  });

  test('should render start button', async ({ page }) => {
    // Start button should be a link with button styling
    const button = page.locator('a.govuk-button--start', { hasText: 'Start now' });
    await assertComponentVisible(button);
    
    const classList = await button.getAttribute('class');
    expect(classList).toContain('govuk-button--start');
  });

  test('should be clickable', async ({ page }) => {
    const components = new ComponentHelper(page);
    let clicked = false;
    
    page.on('console', msg => {
      if (msg.text().includes('button clicked')) {
        clicked = true;
      }
    });
    
    const button = components.getButton('Default button');
    await button.click();
    
    // Button should be clickable (no error thrown)
    await expect(button).toBeVisible();
  });

  test('should not be clickable when disabled', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Disabled button' });
    
    // Attempt to click should not work
    await button.click({ force: true });
    await assertButtonDisabled(button);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const components = new ComponentHelper(page);
    const button = components.getButton('Default button');
    
    await button.focus();
    await expect(button).toBeFocused();
    
    // Should activate with Enter
    await page.keyboard.press('Enter');
  });

  test('should activate with Space key', async ({ page }) => {
    const components = new ComponentHelper(page);
    const button = components.getButton('Default button');
    
    await button.focus();
    await page.keyboard.press('Space');
    
    // Button should still be visible after activation
    await assertComponentVisible(button);
  });

  test('should have correct GOV.UK classes', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Default button' });
    const classList = await button.getAttribute('class');
    
    expect(classList).toContain('govuk-button');
  });

  test('should support different button types', async ({ page }) => {
    // Start button is a link
    const startButton = page.locator('a.govuk-button--start');
    await expect(startButton).toBeVisible();
    expect(await startButton.evaluate(el => el.tagName)).toBe('A');
    
    // Regular buttons are button elements
    const regularButton = page.getByRole('button', { name: 'Default button' });
    expect(await regularButton.evaluate(el => el.tagName)).toBe('BUTTON');
  });

  test('should display button text correctly', async ({ page }) => {
    const buttons = [
      'Default button',
      'Secondary button',
      'Warning button',
      'Disabled button',
      'Start now'
    ];
    
    for (const buttonText of buttons) {
      const button = page.locator(`button:has-text("${buttonText}"), a:has-text("${buttonText}")`);
      await expect(button.first()).toBeVisible();
    }
  });
});
