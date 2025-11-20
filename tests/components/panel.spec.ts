import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../shared/components/helpers';
import { assertComponentVisible, assertComponentText } from '../shared/components/assertions';

/**
 * Component Tests for GOV.UK Panel
 * Tests the confirmation panel component
 */
test.describe('Panel Component @component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('should render panel', async ({ page }) => {
    const components = new ComponentHelper(page);
    const panel = components.getPanel();
    
    await assertComponentVisible(panel);
  });

  test('should display panel title', async ({ page }) => {
    const components = new ComponentHelper(page);
    await components.verifyPanelTitle('Application complete');
  });

  test('should display panel body text', async ({ page }) => {
    const panel = page.locator('.govuk-panel');
    const bodyText = panel.locator('.govuk-panel__body');
    
    await assertComponentVisible(bodyText);
    await assertComponentText(bodyText, 'Your reference number is HDJ2123F');
  });

  test('should have correct GOV.UK classes', async ({ page }) => {
    const panel = page.locator('.govuk-panel');
    const classList = await panel.getAttribute('class');
    
    expect(classList).toContain('govuk-panel');
    expect(classList).toContain('govuk-panel--confirmation');
  });

  test('should have title with correct heading level', async ({ page }) => {
    const panelTitle = page.locator('.govuk-panel__title');
    await assertComponentVisible(panelTitle);
    
    expect(await panelTitle.evaluate(el => el.tagName)).toBe('H1');
  });

  test('should be visually prominent', async ({ page }) => {
    const panel = page.locator('.govuk-panel');
    
    // Panel should be visible and have background color
    await assertComponentVisible(panel);
    
    const backgroundColor = await panel.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Should have a background color set (not transparent)
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should be accessible', async ({ page }) => {
    const panel = page.locator('.govuk-panel');
    const title = panel.locator('.govuk-panel__title');
    const body = panel.locator('.govuk-panel__body');
    
    // All parts should be visible
    await assertComponentVisible(panel);
    await assertComponentVisible(title);
    await assertComponentVisible(body);
    
    // Should have text content
    expect(await title.textContent()).toBeTruthy();
    expect(await body.textContent()).toBeTruthy();
  });
});
