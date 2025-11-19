import { Page, expect } from '@playwright/test';

/**
 * Journey Runner Helper
 * Provides utilities for running multi-step user journeys
 */
export class JourneyRunner {
  private currentStep: number = 0;
  private journeyData: Map<string, any> = new Map();

  constructor(
    private page: Page,
    private baseURL: string = 'http://localhost:5173'
  ) {}

  /**
   * Start a journey by navigating to its entry point
   */
  async startJourney(journeyPath: string): Promise<void> {
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
   * Select a radio option
   */
  async selectRadio(label: string): Promise<void> {
    await this.page.getByLabel(label, { exact: false }).check();
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
   * Click the Back link
   */
  async goBack(): Promise<void> {
    await this.page.getByRole('link', { name: 'Back' }).click();
    this.currentStep--;
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
   * Get current step number
   */
  getCurrentStep(): number {
    return this.currentStep;
  }

  /**
   * Wait for navigation after action
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
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
}
