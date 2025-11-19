import { test, expect } from '../../fixtures/base.fixture';
import { RadiosComponent } from '../../page-objects/components/RadiosComponent';

/**
 * Component Tests for GOV.UK Radios
 */
test.describe('Radios Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
  });

  test('should select radio option', async ({ page }) => {
    const radios = new RadiosComponent(page, 'applicant-type');
    
    await radios.selectByLabel('An individual');
    await radios.assertSelected('An individual');
  });

  test('should change selection', async ({ page }) => {
    const radios = new RadiosComponent(page, 'applicant-type');
    
    await radios.selectByLabel('An individual');
    await radios.assertSelected('An individual');
    
    await radios.selectByLabel('A company or organisation');
    await radios.assertSelected('A company or organisation');
    await radios.assertNotSelected('An individual');
  });

  test('should be keyboard accessible', async ({ page }) => {
    const radios = new RadiosComponent(page, 'applicant-type');
    
    // Focus the first radio button directly
    const firstRadio = page.locator('input[name="applicant-type"]').first();
    await firstRadio.focus();
    
    // Select it with Space key
    await page.keyboard.press('Space');
    
    // Verify it's selected
    const selectedValue = await radios.getSelectedValue();
    expect(selectedValue).toBeTruthy();
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowDown');
    const secondValue = await radios.getSelectedValue();
    expect(secondValue).toBeTruthy();
    expect(secondValue).not.toBe(selectedValue);
  });

  test('should display all options', async ({ page }) => {
    const radios = new RadiosComponent(page, 'applicant-type');
    
    await radios.assertAllOptionsVisible([
      'An individual',
      'A company or organisation'
    ]);
  });
});
