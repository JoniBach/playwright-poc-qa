import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { assertComponentVisible } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Date Input
 * Tests the date input component with day/month/year fields
 */
test.describe('Date Input Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render all three date fields', async ({ page }) => {
    const dayInput = page.locator('input[name="date-of-birth-day"]');
    const monthInput = page.locator('input[name="date-of-birth-month"]');
    const yearInput = page.locator('input[name="date-of-birth-year"]');
    
    await assertComponentVisible(dayInput);
    await assertComponentVisible(monthInput);
    await assertComponentVisible(yearInput);
  });

  test('should fill complete date', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has issues with date input field interaction');
    
    const components = new ComponentHelper(page);
    
    await components.fillDateInput('What is your date of birth?', {
      day: '15',
      month: '03',
      year: '1990'
    });
    
    const dayInput = page.locator('input[name="date-of-birth-day"]');
    const monthInput = page.locator('input[name="date-of-birth-month"]');
    const yearInput = page.locator('input[name="date-of-birth-year"]');
    
    await expect(dayInput).toHaveValue('15');
    await expect(monthInput).toHaveValue('03');
    await expect(yearInput).toHaveValue('1990');
  });

  test('should display legend', async ({ page }) => {
    const legend = page.locator('.govuk-fieldset__legend', {
      hasText: 'What is your date of birth?'
    });
    await assertComponentVisible(legend);
  });

  test('should display hint text', async ({ page }) => {
    const hint = page.locator('#date-of-birth-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('For example, 31 3 1980');
  });

  test('should have correct labels for each field', async ({ page }) => {
    const dayLabel = page.locator('label[for="date-of-birth-day"]');
    const monthLabel = page.locator('label[for="date-of-birth-month"]');
    const yearLabel = page.locator('label[for="date-of-birth-year"]');
    
    await expect(dayLabel).toContainText('Day');
    await expect(monthLabel).toContainText('Month');
    await expect(yearLabel).toContainText('Year');
  });

  test('should be keyboard accessible', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has issues with date input keyboard interaction');
    
    const dayInput = page.locator('input[name="date-of-birth-day"]');
    const monthInput = page.locator('input[name="date-of-birth-month"]');
    const yearInput = page.locator('input[name="date-of-birth-year"]');
    
    // Focus and fill day
    await dayInput.focus();
    await page.keyboard.type('25');
    
    // Tab to month
    await page.keyboard.press('Tab');
    await page.keyboard.type('12');
    
    // Tab to year
    await page.keyboard.press('Tab');
    await page.keyboard.type('1985');
    
    // Verify values
    await expect(dayInput).toHaveValue('25');
    await expect(monthInput).toHaveValue('12');
    await expect(yearInput).toHaveValue('1985');
  });

  test('should have correct input widths', async ({ page }) => {
    const dayInput = page.locator('input[name="date-of-birth-day"]');
    const monthInput = page.locator('input[name="date-of-birth-month"]');
    const yearInput = page.locator('input[name="date-of-birth-year"]');
    
    const dayClass = await dayInput.getAttribute('class');
    const monthClass = await monthInput.getAttribute('class');
    const yearClass = await yearInput.getAttribute('class');
    
    expect(dayClass).toContain('govuk-input--width-2');
    expect(monthClass).toContain('govuk-input--width-2');
    expect(yearClass).toContain('govuk-input--width-4');
  });

  test('should accept single digit day and month', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit has issues with date input field interaction');
    
    const components = new ComponentHelper(page);
    
    await components.fillDateInput('What is your date of birth?', {
      day: '5',
      month: '3',
      year: '1995'
    });
    
    const dayInput = page.locator('input[name="date-of-birth-day"]');
    const monthInput = page.locator('input[name="date-of-birth-month"]');
    
    await expect(dayInput).toHaveValue('5');
    await expect(monthInput).toHaveValue('3');
  });

  test('should clear date fields', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    await components.fillDateInput('What is your date of birth?', {
      day: '15',
      month: '06',
      year: '1990'
    });
    
    const dayInput = page.locator('input[name="date-of-birth-day"]');
    const monthInput = page.locator('input[name="date-of-birth-month"]');
    const yearInput = page.locator('input[name="date-of-birth-year"]');
    
    await dayInput.clear();
    await monthInput.clear();
    await yearInput.clear();
    
    await expect(dayInput).toHaveValue('');
    await expect(monthInput).toHaveValue('');
    await expect(yearInput).toHaveValue('');
  });

  test('should have correct GOV.UK classes', async ({ page }) => {
    const dateInputContainer = page.locator('.govuk-date-input');
    await assertComponentVisible(dateInputContainer);
    
    const inputs = dateInputContainer.locator('input');
    const firstInputClass = await inputs.first().getAttribute('class');
    
    expect(firstInputClass).toContain('govuk-input');
    expect(firstInputClass).toContain('govuk-date-input__input');
  });
});
