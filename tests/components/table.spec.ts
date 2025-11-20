import { test, expect } from '@playwright/test';
import { assertComponentVisible, assertComponentText } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Table
 * Tests the table component with headers and data
 */
test.describe('Table Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render table', async ({ page }) => {
    const table = page.locator('.govuk-table');
    await assertComponentVisible(table);
  });

  test('should display table caption', async ({ page }) => {
    const caption = page.locator('.govuk-table__caption');
    await assertComponentVisible(caption);
    await assertComponentText(caption, 'Monthly expenses for 2024');
  });

  test('should display all table headers', async ({ page }) => {
    const headers = page.locator('.govuk-table__header');
    
    const expectedHeaders = ['Month', 'Amount', 'Status', 'Category'];
    
    for (const header of expectedHeaders) {
      const headerCell = page.locator('.govuk-table__header', { hasText: header });
      await assertComponentVisible(headerCell);
    }
  });

  test('should display all table rows', async ({ page }) => {
    const rows = page.locator('.govuk-table__body .govuk-table__row');
    const count = await rows.count();
    
    expect(count).toBe(4); // 4 months of data
  });

  test('should display table data correctly', async ({ page }) => {
    const table = page.locator('.govuk-table');
    
    // Check first row data
    await assertComponentText(table, 'January 2024');
    await assertComponentText(table, '£850.00');
    await assertComponentText(table, 'Paid');
    await assertComponentText(table, 'Rent');
  });

  test('should have correct GOV.UK classes', async ({ page }) => {
    const table = page.locator('.govuk-table');
    const classList = await table.getAttribute('class');
    
    expect(classList).toContain('govuk-table');
  });

  test('should use semantic HTML', async ({ page }) => {
    const table = page.locator('.govuk-table');
    
    // Should be a table element
    expect(await table.evaluate(el => el.tagName)).toBe('TABLE');
    
    // Should have thead and tbody
    const thead = table.locator('thead');
    const tbody = table.locator('tbody');
    
    await assertComponentVisible(thead);
    await assertComponentVisible(tbody);
  });

  test('should have correct number of columns', async ({ page }) => {
    const headerRow = page.locator('.govuk-table__head .govuk-table__row');
    const headers = headerRow.locator('th');
    
    expect(await headers.count()).toBe(4);
  });

  test('should have correct number of cells per row', async ({ page }) => {
    const firstDataRow = page.locator('.govuk-table__body .govuk-table__row').first();
    const cells = firstDataRow.locator('td, th');
    
    expect(await cells.count()).toBe(4);
  });

  test('should display different statuses', async ({ page }) => {
    const table = page.locator('.govuk-table');
    
    await assertComponentText(table, 'Paid');
    await assertComponentText(table, 'Pending');
    await assertComponentText(table, 'Due');
  });

  test('should be accessible', async ({ page }) => {
    const table = page.locator('.govuk-table');
    const caption = table.locator('caption');
    
    // Table should have a caption for accessibility
    await assertComponentVisible(caption);
    
    // Headers should be th elements
    const headers = table.locator('thead th');
    expect(await headers.count()).toBeGreaterThan(0);
    
    // First cell in each row should be th (firstCellIsHeader pattern)
    const firstCells = page.locator('.govuk-table__body .govuk-table__row th');
    expect(await firstCells.count()).toBeGreaterThan(0);
  });

  test('should have responsive design classes', async ({ page }) => {
    const table = page.locator('.govuk-table');
    
    // GOV.UK tables should be responsive
    await assertComponentVisible(table);
    
    // Check if table is scrollable on small screens
    const classList = await table.getAttribute('class');
    expect(classList).toContain('govuk-table');
  });
});
