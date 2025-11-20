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

  /**
   * Get select dropdown by label
   */
  getSelect(label: string): Locator {
    return this.page.getByLabel(label, { exact: false });
  }

  /**
   * Select option from dropdown by label
   */
  async selectOption(label: string, value: string): Promise<void> {
    await this.getSelect(label).selectOption(value);
  }

  /**
   * Fill date input (GOV.UK pattern with day/month/year fields)
   */
  async fillDateInput(
    legend: string,
    date: { day: string; month: string; year: string }
  ): Promise<void> {
    // Find the date input container by its legend
    const container = this.page.locator('.govuk-date-input', {
      has: this.page.locator('legend', { hasText: legend })
    });

    await container.getByLabel('Day').fill(date.day);
    await container.getByLabel('Month').fill(date.month);
    await container.getByLabel('Year').fill(date.year);
  }

  /**
   * Get textarea by label
   */
  getTextarea(label: string): Locator {
    return this.page.getByLabel(label, { exact: false });
  }

  /**
   * Fill textarea by label
   */
  async fillTextarea(label: string, value: string): Promise<void> {
    await this.getTextarea(label).fill(value);
  }

  /**
   * Upload file by label
   */
  async uploadFile(label: string, filePath: string): Promise<void> {
    const fileInput = this.page.getByLabel(label, { exact: false });
    await fileInput.setInputFiles(filePath);
  }

  // ============================================
  // GOV.UK Pattern Components
  // ============================================

  /**
   * Get details (expandable section) by summary text
   */
  getDetails(summary: string): Locator {
    return this.page.locator('details', {
      has: this.page.locator('summary', { hasText: summary })
    });
  }

  /**
   * Expand details section if not already expanded
   */
  async expandDetails(summary: string): Promise<void> {
    const details = this.getDetails(summary);
    const isOpen = await details.getAttribute('open');
    
    if (isOpen === null) {
      await details.locator('summary').click();
    }
  }

  /**
   * Collapse details section if expanded
   */
  async collapseDetails(summary: string): Promise<void> {
    const details = this.getDetails(summary);
    const isOpen = await details.getAttribute('open');
    
    if (isOpen !== null) {
      await details.locator('summary').click();
    }
  }

  /**
   * Get warning text component
   */
  getWarningText(): Locator {
    return this.page.locator('.govuk-warning-text');
  }

  /**
   * Verify warning text is visible with specific message
   */
  async verifyWarningText(text: string): Promise<void> {
    const warning = this.getWarningText();
    await expect(warning).toBeVisible();
    await expect(warning).toContainText(text);
  }

  /**
   * Get inset text component
   */
  getInsetText(): Locator {
    return this.page.locator('.govuk-inset-text');
  }

  /**
   * Verify inset text is visible with specific message
   */
  async verifyInsetText(text: string): Promise<void> {
    const inset = this.getInsetText();
    await expect(inset).toBeVisible();
    await expect(inset).toContainText(text);
  }

  /**
   * Get breadcrumbs component
   */
  getBreadcrumbs(): Locator {
    return this.page.locator('.govuk-breadcrumbs');
  }

  /**
   * Verify breadcrumb item exists
   */
  async verifyBreadcrumb(text: string): Promise<void> {
    const breadcrumb = this.getBreadcrumbs().locator('.govuk-breadcrumbs__link', { hasText: text });
    await expect(breadcrumb).toBeVisible();
  }

  /**
   * Click breadcrumb link
   */
  async clickBreadcrumb(text: string): Promise<void> {
    await this.getBreadcrumbs().locator('.govuk-breadcrumbs__link', { hasText: text }).click();
  }

  /**
   * Get tag (badge) by text
   */
  getTag(text: string): Locator {
    return this.page.locator('.govuk-tag', { hasText: text });
  }

  /**
   * Verify tag is visible with optional color
   */
  async verifyTag(text: string, color?: string): Promise<void> {
    const tag = this.getTag(text);
    await expect(tag).toBeVisible();
    
    if (color) {
      await expect(tag).toHaveClass(new RegExp(`govuk-tag--${color}`));
    }
  }

  /**
   * Get tabs component
   */
  getTabs(): Locator {
    return this.page.locator('.govuk-tabs');
  }

  /**
   * Get specific tab by name
   */
  getTab(name: string): Locator {
    return this.page.locator('.govuk-tabs__tab', { hasText: name });
  }

  /**
   * Click tab to switch view
   */
  async clickTab(name: string): Promise<void> {
    await this.getTab(name).click();
  }

  /**
   * Verify tab is selected
   */
  async verifyTabSelected(name: string): Promise<void> {
    const tab = this.getTab(name);
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  }

  /**
   * Get table component
   */
  getTable(): Locator {
    return this.page.locator('.govuk-table');
  }

  /**
   * Get table cell by row and column index (1-based)
   */
  getTableCell(row: number, column: number): Locator {
    return this.getTable()
      .locator('tbody tr')
      .nth(row - 1)
      .locator('td')
      .nth(column - 1);
  }

  /**
   * Verify table cell contains specific value
   */
  async verifyTableCell(row: number, column: number, value: string): Promise<void> {
    const cell = this.getTableCell(row, column);
    await expect(cell).toContainText(value);
  }

  /**
   * Get table header by index (1-based)
   */
  getTableHeader(column: number): Locator {
    return this.getTable()
      .locator('thead th')
      .nth(column - 1);
  }

  /**
   * Verify table header text
   */
  async verifyTableHeader(column: number, text: string): Promise<void> {
    const header = this.getTableHeader(column);
    await expect(header).toContainText(text);
  }

  /**
   * Get character count component
   */
  getCharacterCount(id: string): Locator {
    return this.page.locator('.govuk-character-count', {
      has: this.page.locator(`#${id}`)
    });
  }

  /**
   * Get character count message
   */
  getCharacterCountMessage(id: string): Locator {
    return this.page.locator(`#${id}-info`);
  }

  /**
   * Verify character count shows correct remaining characters
   */
  async verifyCharacterCount(id: string, expectedMessage: string): Promise<void> {
    const message = this.getCharacterCountMessage(id);
    await expect(message).toContainText(expectedMessage);
  }

  /**
   * Fill textarea with character count
   */
  async fillTextareaWithCount(label: string, value: string): Promise<void> {
    await this.fillTextarea(label, value);
  }

  /**
   * Get skip link
   */
  getSkipLink(): Locator {
    return this.page.locator('.govuk-skip-link');
  }

  /**
   * Click skip link
   */
  async clickSkipLink(): Promise<void> {
    await this.getSkipLink().click();
  }

  /**
   * Get phase banner
   */
  getPhaseBanner(): Locator {
    return this.page.locator('.govuk-phase-banner');
  }

  /**
   * Verify phase banner tag (e.g., "Alpha", "Beta")
   */
  async verifyPhaseBannerTag(tag: string): Promise<void> {
    const banner = this.getPhaseBanner();
    await expect(banner.locator('.govuk-phase-banner__content__tag')).toContainText(tag);
  }

  /**
   * Get back link
   */
  getBackLink(): Locator {
    return this.page.locator('.govuk-back-link');
  }

  /**
   * Click back link
   */
  async clickBackLink(): Promise<void> {
    await this.getBackLink().click();
  }

  /**
   * Verify back link is visible
   */
  async verifyBackLink(): Promise<void> {
    await expect(this.getBackLink()).toBeVisible();
  }

  // ============================================
  // Advanced Form Helpers
  // ============================================

  /**
   * Fill autocomplete/typeahead field
   */
  async fillAutocomplete(label: string, value: string, optionText?: string): Promise<void> {
    const input = this.getTextInput(label);
    await input.fill(value);
    
    // Wait for autocomplete suggestions to appear
    await this.page.waitForTimeout(500);
    
    // If specific option text provided, click it
    if (optionText) {
      await this.page.getByRole('option', { name: optionText }).click();
    } else {
      // Otherwise just press Enter to select first option
      await input.press('Enter');
    }
  }

  /**
   * Verify conditional reveal is visible
   */
  async verifyConditionalReveal(triggerLabel: string, revealedText: string): Promise<void> {
    // First ensure the trigger is checked
    const trigger = this.getRadio(triggerLabel);
    await trigger.check();
    
    // Wait for reveal animation
    await this.page.waitForTimeout(300);
    
    // Verify revealed content is visible
    const reveal = this.page.locator('.govuk-radios__conditional', {
      has: this.page.getByText(revealedText)
    });
    await expect(reveal).toBeVisible();
  }

  /**
   * Fill address lookup (postcode lookup pattern)
   */
  async fillAddressLookup(postcode: string, selectAddress?: string): Promise<void> {
    await this.fillTextInput('Postcode', postcode);
    await this.clickButton('Find address');
    
    // Wait for addresses to load
    await this.page.waitForTimeout(1000);
    
    if (selectAddress) {
      await this.selectOption('Select an address', selectAddress);
    }
  }

  /**
   * Fill manual address
   */
  async fillManualAddress(address: {
    line1: string;
    line2?: string;
    town: string;
    county?: string;
    postcode: string;
  }): Promise<void> {
    await this.fillTextInput('Address line 1', address.line1);
    
    if (address.line2) {
      await this.fillTextInput('Address line 2', address.line2);
    }
    
    await this.fillTextInput('Town or city', address.town);
    
    if (address.county) {
      await this.fillTextInput('County', address.county);
    }
    
    await this.fillTextInput('Postcode', address.postcode);
  }

  /**
   * Verify form has been submitted successfully
   */
  async verifyFormSubmitted(): Promise<void> {
    // Check for either panel or notification banner
    const panel = this.getPanel();
    const notification = this.getNotificationBanner();
    
    try {
      await expect(panel).toBeVisible({ timeout: 5000 });
    } catch {
      await expect(notification).toBeVisible({ timeout: 5000 });
    }
  }

  /**
   * Get all validation errors
   */
  async getAllValidationErrors(): Promise<string[]> {
    const errorSummary = this.getErrorSummary();
    await expect(errorSummary).toBeVisible();
    
    const errorLinks = errorSummary.locator('.govuk-error-summary__list a');
    const count = await errorLinks.count();
    
    const errors: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await errorLinks.nth(i).textContent();
      if (text) errors.push(text.trim());
    }
    
    return errors;
  }

  /**
   * Verify specific number of validation errors
   */
  async verifyErrorCount(expectedCount: number): Promise<void> {
    const errors = await this.getAllValidationErrors();
    expect(errors.length).toBe(expectedCount);
  }
}
