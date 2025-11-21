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
   * Submit the journey from Check Your Answers page
   * Handles the "Accept and send" button and waits for server response
   * Note: Journey uses client-side routing, so we wait for content instead of URL change
   */
  async submit(): Promise<void> {
    // Click "Accept and send" button
    await this.page.getByRole('button', { name: /Accept and send|Continue/i }).click();
    
    // Wait for the confirmation page to load (client-side routing, URL doesn't change)
    // Look for confirmation heading or panel
    await this.page.waitForSelector('h1:has-text("Application submitted"), .govuk-panel__title', {
      timeout: 10000
    });
    
    this.currentStep++;
  }

  /**
   * Click the Back link or button
   */
  async goBack(): Promise<void> {
    // Wait for page to be stable
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try button first (most common in GOV.UK forms)
    const backButton = this.page.getByRole('button', { name: 'Back' });
    const backButtonVisible = await backButton.isVisible().catch(() => false);
    
    if (backButtonVisible) {
      await backButton.click();
    } else {
      // Fall back to link
      await this.page.getByRole('link', { name: 'Back' }).click();
    }
    
    this.currentStep--;
  }

  /**
   * Verify heading on current page
   */
  async verifyHeading(headingText: string): Promise<void> {
    // Wait for page to be stable before checking heading
    await this.page.waitForLoadState('networkidle');
    // Wait for h1 to be present and visible
    await this.page.waitForSelector('h1', { state: 'visible', timeout: 10000 });
    
    // Normalize apostrophes (handle smart quotes ' vs ')
    // Replace smart quotes (') with standard apostrophes (')
    // Using Unicode escape \u2019 for right single quotation mark
    const normalizedText = headingText.replace(/[\u2018\u2019']/g, "'");
    
    // Get all h1 elements and check their text content
    const h1Elements = await this.page.locator('h1').all();
    let found = false;
    
    for (const h1 of h1Elements) {
      const text = await h1.textContent();
      const normalizedPageText = text?.replace(/[\u2018\u2019']/g, "'") || '';
      
      if (normalizedPageText.includes(normalizedText)) {
        const isVisible = await h1.isVisible();
        if (isVisible) {
          found = true;
          break;
        }
      }
    }
    
    if (!found) {
      throw new Error(`Heading "${headingText}" not found on page`);
    }
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
