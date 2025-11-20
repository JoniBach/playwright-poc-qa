import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { assertComponentVisible, assertComponentText } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Notification Banner
 * Tests both important and success notification banners
 */
test.describe('Notification Banner Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render notification banners', async ({ page }) => {
    const banner = page.locator('.govuk-notification-banner').first();
    
    await assertComponentVisible(banner);
  });

  test('should display important notification', async ({ page }) => {
    const importantBanner = page.locator('.govuk-notification-banner', {
      hasText: 'You have 7 days left to send your application'
    });
    
    await assertComponentVisible(importantBanner);
    await assertComponentText(importantBanner, 'Important');
  });

  test('should display success notification', async ({ page }) => {
    const successBanner = page.locator('.govuk-notification-banner--success');
    
    await assertComponentVisible(successBanner);
    await assertComponentText(successBanner, 'Success');
    await assertComponentText(successBanner, 'Your application has been submitted successfully');
  });

  test('should have correct GOV.UK classes for important banner', async ({ page }) => {
    const importantBanner = page.locator('.govuk-notification-banner').first();
    const classList = await importantBanner.getAttribute('class');
    
    expect(classList).toContain('govuk-notification-banner');
  });

  test('should have correct GOV.UK classes for success banner', async ({ page }) => {
    const successBanner = page.locator('.govuk-notification-banner--success');
    const classList = await successBanner.getAttribute('class');
    
    expect(classList).toContain('govuk-notification-banner');
    expect(classList).toContain('govuk-notification-banner--success');
  });

  test('should display banner title', async ({ page }) => {
    const bannerTitle = page.locator('.govuk-notification-banner__title').first();
    await assertComponentVisible(bannerTitle);
    
    const titleText = await bannerTitle.textContent();
    expect(titleText?.trim()).toBeTruthy();
  });

  test('should display banner content', async ({ page }) => {
    const bannerContent = page.locator('.govuk-notification-banner__content').first();
    await assertComponentVisible(bannerContent);
    
    const contentText = await bannerContent.textContent();
    expect(contentText?.trim()).toBeTruthy();
  });

  test('should have correct ARIA role', async ({ page }) => {
    const banner = page.locator('.govuk-notification-banner').first();
    const role = await banner.getAttribute('role');
    
    expect(role).toBe('region');
  });

  test('should be accessible', async ({ page }) => {
    const banners = page.locator('.govuk-notification-banner');
    const count = await banners.count();
    
    expect(count).toBeGreaterThanOrEqual(2); // At least important and success
    
    // Each banner should have title and content
    for (let i = 0; i < count; i++) {
      const banner = banners.nth(i);
      const title = banner.locator('.govuk-notification-banner__title');
      const content = banner.locator('.govuk-notification-banner__content');
      
      await assertComponentVisible(title);
      await assertComponentVisible(content);
    }
  });

  test('should verify notification helper method', async ({ page }) => {
    // Target the specific important banner
    const importantBanner = page.locator('.govuk-notification-banner').filter({ hasText: 'You have 7 days left' });
    
    await assertComponentVisible(importantBanner);
    await assertComponentText(importantBanner, 'You have 7 days left to send your application');
  });
});
