import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { assertComponentVisible } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Summary List
 * Tests the check your answers pattern
 */
test.describe('Summary List Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render summary list', async ({ page }) => {
    const components = new ComponentHelper(page);
    const summaryList = components.getSummaryList();
    
    await assertComponentVisible(summaryList);
  });

  test('should display all summary rows', async ({ page }) => {
    const rows = page.locator('.govuk-summary-list__row');
    const count = await rows.count();
    
    expect(count).toBeGreaterThanOrEqual(4); // Name, DOB, Contact info, Contact details
  });

  test('should verify summary row content', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    await components.verifySummaryRow('Name', 'Sarah Philips');
    await components.verifySummaryRow('Date of birth', '5 January 1978');
    await components.verifySummaryRow('Contact information', '72 Guild Street');
  });

  test('should display change links', async ({ page }) => {
    const changeLinks = page.locator('.govuk-summary-list__actions a');
    const count = await changeLinks.count();
    
    expect(count).toBeGreaterThanOrEqual(3);
    
    // Verify change link text
    const firstLink = changeLinks.first();
    await expect(firstLink).toContainText('Change');
  });

  test('should have visually hidden text for change links', async ({ page }) => {
    const visuallyHiddenText = page.locator('.govuk-summary-list__actions .govuk-visually-hidden');
    
    await assertComponentVisible(visuallyHiddenText.first());
    
    // Should have context like "name", "date of birth", etc.
    const text = await visuallyHiddenText.first().textContent();
    expect(text?.trim()).toBeTruthy();
  });

  test('should display rows without actions', async ({ page }) => {
    // Contact details row has no action
    const contactDetailsRow = page.locator('.govuk-summary-list__row', {
      has: page.locator('.govuk-summary-list__key', { hasText: 'Contact details' })
    });
    
    await assertComponentVisible(contactDetailsRow);
    
    // Should not have actions
    const actions = contactDetailsRow.locator('.govuk-summary-list__actions');
    expect(await actions.count()).toBe(0);
  });

  test('should have correct GOV.UK classes', async ({ page }) => {
    const summaryList = page.locator('.govuk-summary-list');
    const classList = await summaryList.getAttribute('class');
    
    expect(classList).toContain('govuk-summary-list');
  });

  test('should have correct structure', async ({ page }) => {
    const firstRow = page.locator('.govuk-summary-list__row').first();
    
    // Should have key, value, and actions
    const key = firstRow.locator('.govuk-summary-list__key');
    const value = firstRow.locator('.govuk-summary-list__value');
    const actions = firstRow.locator('.govuk-summary-list__actions');
    
    await assertComponentVisible(key);
    await assertComponentVisible(value);
    await assertComponentVisible(actions);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const firstChangeLink = page.locator('.govuk-summary-list__actions a').first();
    
    // Tab to the link
    await firstChangeLink.focus();
    await expect(firstChangeLink).toBeFocused();
    
    // Should be activatable with Enter
    await firstChangeLink.press('Enter');
  });

  test('should click change link helper method', async ({ page }) => {
    const components = new ComponentHelper(page);
    
    // This should not throw an error
    await components.clickChangeLink('Name');
  });

  test('should be accessible', async ({ page }) => {
    const summaryList = page.locator('.govuk-summary-list');
    
    // Should use dl/dt/dd semantic HTML
    expect(await summaryList.evaluate(el => el.tagName)).toBe('DL');
    
    const keys = summaryList.locator('dt');
    const values = summaryList.locator('dd');
    
    expect(await keys.count()).toBeGreaterThan(0);
    expect(await values.count()).toBeGreaterThan(0);
  });
});
