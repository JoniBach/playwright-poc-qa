import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { 
  assertComponentVisible,
  assertInputValue,
  assertComponentAttribute
} from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Textarea
 * Tests the multi-line text input component
 */
test.describe('Textarea Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render textarea', async ({ page }) => {
    const components = new ComponentHelper(page);
    const textarea = components.getTextarea('Can you provide more detail?');
    
    await assertComponentVisible(textarea);
  });

  test('should accept text input', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    const testText = 'This is a test message with multiple lines.\nSecond line here.';
    await components.fillTextarea('Can you provide more detail?', testText);
    
    const textarea = components.getTextarea('Can you provide more detail?');
    await assertInputValue(textarea, testText);
  });

  test('should accept multi-line text', async ({ page }) => {
    const components = new ComponentHelper(page);
    const textarea = components.getTextarea('Can you provide more detail?');
    
    await textarea.fill('Line 1');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Line 2');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Line 3');
    
    const value = await textarea.inputValue();
    expect(value).toContain('Line 1');
    expect(value).toContain('Line 2');
    expect(value).toContain('Line 3');
  });

  test('should display label', async ({ page }) => {
    const label = page.locator('label[for="more-detail"]');
    await assertComponentVisible(label);
    await expect(label).toContainText('Can you provide more detail?');
  });

  test('should display hint text', async ({ page }) => {
    const hint = page.locator('#more-detail-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('Do not include personal or financial information');
  });

  test('should have correct number of rows', async ({ page }) => {
    const textarea = page.locator('#more-detail');
    await assertComponentAttribute(textarea, 'rows', '5');
  });

  test('should be keyboard accessible', async ({ page }) => {
    const components = new ComponentHelper(page);
    const textarea = components.getTextarea('Can you provide more detail?');
    
    await textarea.focus();
    await page.keyboard.type('Keyboard input test');
    
    await assertInputValue(textarea, 'Keyboard input test');
  });

  test('should support copy and paste', async ({ page }) => {
    const components = new ComponentHelper(page);
    const textarea = components.getTextarea('Can you provide more detail?');
    
    const longText = 'This is a longer piece of text that would typically be pasted rather than typed.';
    await textarea.click();
    await page.keyboard.insertText(longText);
    
    await assertInputValue(textarea, longText);
  });

  test('should clear text', async ({ page }) => {
    const components = new ComponentHelper(page);
    const textarea = components.getTextarea('Can you provide more detail?');
    
    await textarea.fill('Some text');
    await assertInputValue(textarea, 'Some text');
    
    await textarea.clear();
    await assertInputValue(textarea, '');
  });

  test('should have correct GOV.UK classes', async ({ page }) => {
    const textarea = page.locator('#more-detail');
    const classList = await textarea.getAttribute('class');
    
    expect(classList).toContain('govuk-textarea');
  });

  test('should handle long text', async ({ page }) => {
    const components = new ComponentHelper(page);
    const textarea = components.getTextarea('Can you provide more detail?');
    
    const longText = 'A'.repeat(500);
    await textarea.fill(longText);
    
    await assertInputValue(textarea, longText);
  });
});
