import { Page, expect } from '@playwright/test';

/**
 * Shared Journey Runner
 * Provides reusable utilities for running multi-step user journeys
 * Can be used in: Journey tests, E2E tests, Integration tests
 */
export class JourneyRunner {
  private currentStep: number = 0;
  private journeyData: Map<string, any> = new Map();
  private journeyPath: string = '';

  constructor(
    private page: Page,
    private baseURL: string = 'http://localhost:5173'
  ) {}

  /**
   * Start a journey by navigating to its entry point
   */
  async start(journeyPath: string): Promise<void> {
    this.journeyPath = journeyPath;
    await this.page.goto(`${this.baseURL}${journeyPath}`);
    this.currentStep = 0;
    this.journeyData.clear();
  }

  /**
   * Fill form fields on the current step
   */
  async fillStep(data: Record<string, string>): Promise<void> {
    for (const [field, value] of Object.entries(data)) {
      await this.page.getByLabel(field, { exact: false }).fill(value);
    }
  }

  /**
   * Fill form fields and continue to next step
   */
  async fillAndContinue(data: Record<string, string>): Promise<void> {
    await this.fillStep(data);
    await this.continue();
  }

  /**
   * Select a radio option
   */
  async selectRadio(label: string): Promise<void> {
    await this.page.getByLabel(label, { exact: false }).check();
  }

  /**
   * Select radio and continue
   */
  async selectRadioAndContinue(label: string): Promise<void> {
    await this.selectRadio(label);
    await this.continue();
  }

  /**
   * Check a checkbox
   */
  async checkCheckbox(label: string): Promise<void> {
    await this.page.getByLabel(label, { exact: false }).check();
  }

  /**
   * Click the Continue button
   */
  async continue(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue' }).click();
    this.currentStep++;
  }

  /**
   * Submit the journey from Check Your Answers page
   */
  async submit(): Promise<void> {
    // Click "Accept and send" or "Continue" button
    await this.page.getByRole('button', { name: /Accept and send|Continue/i }).click();
    
    // Wait for the confirmation page to load
    await this.page.waitForSelector('h1:has-text("Application submitted"), .govuk-panel__title', {
      timeout: 10000
    });
    
    this.currentStep++;
  }

  /**
   * Click the Back link
   */
  async goBack(): Promise<void> {
    await this.page.getByRole('link', { name: 'Back' }).click();
    this.currentStep--;
  }

  /**
   * Click a change link in the summary list
   */
  async clickChange(fieldLabel: string): Promise<void> {
    const row = this.page.locator('.govuk-summary-list__row', {
      has: this.page.locator('.govuk-summary-list__key', { hasText: fieldLabel })
    });
    await row.locator('.govuk-summary-list__actions a').click();
  }

  /**
   * Verify heading on current page
   */
  async verifyHeading(headingText: string): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: headingText }).first()
    ).toBeVisible();
  }

  /**
   * Verify we're on a specific step by checking the heading
   */
  async assertOnStep(headingText: string): Promise<void> {
    await this.verifyHeading(headingText);
  }

  /**
   * Verify text is visible on page
   */
  async verifyText(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
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
   * Verify error summary is visible
   */
  async verifyErrorSummary(expectedErrors?: string[]): Promise<void> {
    const errorSummary = this.page.locator('.govuk-error-summary');
    await expect(errorSummary).toBeVisible();
    
    if (expectedErrors) {
      for (const error of expectedErrors) {
        await expect(errorSummary.getByText(error, { exact: false })).toBeVisible();
      }
    }
  }

  /**
   * Verify field error message
   */
  async verifyFieldError(fieldLabel: string, errorMessage: string): Promise<void> {
    const error = this.page.locator(`#${fieldLabel}-error`);
    await expect(error).toBeVisible();
    await expect(error).toContainText(errorMessage);
  }

  /**
   * Get validation errors from error summary
   */
  async getValidationErrors(): Promise<Record<string, string>> {
    const errorSummary = this.page.locator('.govuk-error-summary');
    const errors: Record<string, string> = {};
    
    const errorLinks = await errorSummary.locator('a').all();
    for (const link of errorLinks) {
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      if (text && href) {
        const fieldName = href.replace('#', '');
        errors[fieldName] = text;
      }
    }
    
    return errors;
  }

  /**
   * Store data for later verification
   */
  storeData(key: string, value: any): void {
    this.journeyData.set(key, value);
  }

  /**
   * Retrieve stored data
   */
  getData(key: string): any {
    return this.journeyData.get(key);
  }

  /**
   * Get all stored data
   */
  getAllData(): Record<string, any> {
    return Object.fromEntries(this.journeyData);
  }

  /**
   * Get current step number
   */
  getCurrentStep(): number {
    return this.currentStep;
  }

  /**
   * Get current journey path
   */
  getJourneyPath(): string {
    return this.journeyPath;
  }

  /**
   * Wait for navigation after action
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for specific selector
   */
  async waitFor(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Take screenshot of current step
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-step-${this.currentStep}.png`,
      fullPage: true 
    });
  }

  /**
   * Click autofill button (if available)
   */
  async autofill(): Promise<void> {
    const autofillButton = this.page.getByRole('button', { name: /Auto-fill|Autofill/i });
    if (await autofillButton.isVisible()) {
      await autofillButton.click();
    }
  }

  /**
   * Complete entire journey with provided data
   * Automatically navigates through all steps
   */
  async completeJourney(journeyData: Record<string, Record<string, string>>): Promise<void> {
    for (const [stepName, stepData] of Object.entries(journeyData)) {
      await this.fillAndContinue(stepData);
      this.storeData(stepName, stepData);
    }
  }

  /**
   * Verify confirmation page
   */
  async verifyConfirmation(expectedTitle: string = 'Application submitted'): Promise<void> {
    const panel = this.page.locator('.govuk-panel');
    await expect(panel).toBeVisible();
    await expect(panel.locator('.govuk-panel__title')).toContainText(expectedTitle);
  }

  /**
   * Get reference number from confirmation page
   */
  async getReferenceNumber(): Promise<string | null> {
    const panel = this.page.locator('.govuk-panel');
    const body = await panel.locator('.govuk-panel__body').textContent();
    
    if (body) {
      const match = body.match(/APP-[A-Z0-9]+-[A-Z0-9]+/);
      return match ? match[0] : null;
    }
    
    return null;
  }
}
