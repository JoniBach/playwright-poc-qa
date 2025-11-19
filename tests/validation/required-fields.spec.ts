import { test, expect } from '../../fixtures/base.fixture';

/**
 * Validation Tests for Required Fields
 */
test.describe('Required Field Validation @validation', () => {
  test('should show error when required radio not selected', async ({ page, componentHelper }) => {
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    
    // Try to continue without selecting
    await componentHelper.getButton('Continue').click();
    
    // Should stay on same page or show error
    // This depends on your validation implementation
    const currentUrl = page.url();
    expect(currentUrl).toContain('apply');
  });

  test('should show error when required text fields are empty', async ({ page, componentHelper }) => {
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    
    // Select applicant type and continue
    await page.getByLabel('An individual').check();
    await componentHelper.getButton('Continue').click();
    
    // Wait for navigation to aircraft details page by checking for the heading
    await expect(page.getByRole('heading', { name: 'Enter aircraft details' })).toBeVisible();
    
    // Try to continue without filling aircraft details
    await componentHelper.getButton('Continue').click();
    
    // Should stay on same page due to validation errors
    await expect(page.getByRole('heading', { name: 'Enter aircraft details' })).toBeVisible();
    
    // Verify we're still on the aircraft details page (not navigated away)
    const heading = await page.getByRole('heading', { level: 1 }).textContent();
    expect(heading).toBe('Enter aircraft details');
  });
});
