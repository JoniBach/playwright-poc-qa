import { Page, Locator, expect } from '@playwright/test';

/**
 * Shared Component Helper
 * Provides reusable utilities for interacting with GOV.UK components
 * Can be used in: Component tests, Journey tests, E2E tests
 */
export class ComponentHelper {
  constructor(private page: Page) {}

  /**
   * Get a text input by label
   */
  getTextInput(label: string): Locator {
    return this.page.getByLabel(label, { exact: false });
  }

  /**
   * Get a radio button by label
   */
  getRadio(label: string): Locator {
    return this.page.getByLabel(label, { exact: false });
  }

  /**
   * Get a checkbox by label
   */
  getCheckbox(label: string): Locator {
    return this.page.getByLabel(label, { exact: false });
  }

  /**
   * Get a button by name
   */
  getButton(name: string): Locator {
    return this.page.getByRole('button', { name });
  }

  /**
   * Get a link by name
   */
  getLink(name: string): Locator {
    return this.page.getByRole('link', { name });
  }

  /**
   * Get error summary
   */
  getErrorSummary(): Locator {
    return this.page.locator('.govuk-error-summary');
  }

  /**
   * Get error message for a field
   */
  getFieldError(fieldLabel: string): Locator {
    // GOV.UK pattern: error message is associated with the input
    return this.page.locator(`#${fieldLabel}-error`);
  }

  /**
   * Verify error summary is visible with specific errors
   */
  async verifyErrorSummary(expectedErrors: string[]): Promise<void> {
    const errorSummary = this.getErrorSummary();
    await expect(errorSummary).toBeVisible();
    
    for (const error of expectedErrors) {
      await expect(errorSummary.getByText(error, { exact: false })).toBeVisible();
    }
  }

  /**
   * Verify field has error message
   */
  async verifyFieldError(fieldLabel: string, errorMessage: string): Promise<void> {
    const error = this.getFieldError(fieldLabel);
    await expect(error).toBeVisible();
    await expect(error).toContainText(errorMessage);
  }

  /**
   * Get notification banner
   */
  getNotificationBanner(): Locator {
    return this.page.locator('.govuk-notification-banner');
  }

  /**
   * Verify notification banner is visible
   */
  async verifyNotification(message: string): Promise<void> {
    const banner = this.getNotificationBanner();
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(message);
  }

  /**
   * Get accordion section
   */
  getAccordionSection(heading: string): Locator {
    return this.page.locator('.govuk-accordion__section', { 
      has: this.page.getByRole('button', { name: heading }) 
    });
  }

  /**
   * Expand accordion section
   */
  async expandAccordion(heading: string): Promise<void> {
    const button = this.page.getByRole('button', { name: heading });
    const isExpanded = await button.getAttribute('aria-expanded');
    
    if (isExpanded !== 'true') {
      await button.click();
    }
  }

  /**
   * Get summary list (check your answers pattern)
   */
  getSummaryList(): Locator {
    return this.page.locator('.govuk-summary-list');
  }

  /**
   * Verify summary list row
   */
  async verifySummaryRow(key: string, value: string): Promise<void> {
    const row = this.page.locator('.govuk-summary-list__row', {
      has: this.page.locator('.govuk-summary-list__key', { hasText: key })
    });
    
    await expect(row.locator('.govuk-summary-list__value')).toContainText(value);
  }

  /**
   * Click change link in summary list
   */
  async clickChangeLink(key: string): Promise<void> {
    const row = this.page.locator('.govuk-summary-list__row', {
      has: this.page.locator('.govuk-summary-list__key', { hasText: key })
    });
    
    await row.locator('.govuk-summary-list__actions a').click();
  }

  /**
   * Get panel (confirmation page pattern)
   */
  getPanel(): Locator {
    return this.page.locator('.govuk-panel');
  }

  /**
   * Verify panel title
   */
  async verifyPanelTitle(title: string): Promise<void> {
    const panel = this.getPanel();
    await expect(panel.locator('.govuk-panel__title')).toContainText(title);
  }

  /**
   * Fill text input by label
   */
  async fillTextInput(label: string, value: string): Promise<void> {
    await this.getTextInput(label).fill(value);
  }

  /**
   * Select radio by label
   */
  async selectRadio(label: string): Promise<void> {
    await this.getRadio(label).check();
  }

  /**
   * Check checkbox by label
   */
  async checkCheckbox(label: string): Promise<void> {
    await this.getCheckbox(label).check();
  }

  /**
   * Click button by name
   */
  async clickButton(name: string): Promise<void> {
    await this.getButton(name).click();
  }

  /**
   * Verify heading is visible
   */
  async verifyHeading(text: string, level: 'h1' | 'h2' | 'h3' | 'h4' = 'h1'): Promise<void> {
    const heading = this.page.locator(level, { hasText: text });
    await expect(heading).toBeVisible();
  }

  /**
   * Verify text is visible on page
   */
  async verifyText(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }
}
