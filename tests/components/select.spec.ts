import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { 
  assertComponentVisible,
  assertComponentAttribute
} from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Select
 * Tests the dropdown select component
 */
test.describe('Select Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render select dropdown', async ({ page }) => {
    const components = new ComponentHelper(page);
    const select = components.getSelect('Sort by');
    
    await assertComponentVisible(select);
  });

  test('should display all options', async ({ page }) => {
    const select = page.locator('#sort-by');
    
    const expectedOptions = [
      'Please select',
      'Recently published',
      'Recently updated',
      'Most views',
      'Most comments'
    ];
    
    for (const option of expectedOptions) {
      const optionElement = select.locator(`option:has-text("${option}")`);
      await expect(optionElement).toBeAttached();
    }
  });

  test('should select an option', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    await components.selectOption('Sort by', 'published');
    
    const select = components.getSelect('Sort by');
    await expect(select).toHaveValue('published');
  });

  test('should change selection', async ({ page }) => {
    const components = new ComponentHelper(page);
    const select = components.getSelect('Sort by');
    
    // Select first option
    await components.selectOption('Sort by', 'published');
    await expect(select).toHaveValue('published');
    
    // Change to different option
    await components.selectOption('Sort by', 'views');
    await expect(select).toHaveValue('views');
  });

  test('should display label', async ({ page }) => {
    const label = page.locator('label[for="sort-by"]');
    await assertComponentVisible(label);
    await expect(label).toContainText('Sort by');
  });

  test('should display hint text', async ({ page }) => {
    const hint = page.locator('#sort-by-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('Choose how to sort the results');
  });

  test('should be keyboard accessible', async ({ page }) => {
    const components = new ComponentHelper(page);
    const select = components.getSelect('Sort by');
    
    // Focus the select
    await select.focus();
    await expect(select).toBeFocused();
    
    // Can select with keyboard
    await select.selectOption('published');
    await expect(select).toHaveValue('published');
  });

  test('should have correct GOV.UK classes', async ({ page }) => {
    const select = page.locator('#sort-by');
    const classList = await select.getAttribute('class');
    
    expect(classList).toContain('govuk-select');
  });

  test('should count correct number of options', async ({ page }) => {
    const select = page.locator('#sort-by');
    const options = select.locator('option');
    
    expect(await options.count()).toBe(5);
  });

  test('should have empty default option', async ({ page }) => {
    const select = page.locator('#sort-by');
    const firstOption = select.locator('option').first();
    
    await expect(firstOption).toHaveText('Please select');
    const value = await firstOption.getAttribute('value');
    expect(value).toBe('');
  });
});
