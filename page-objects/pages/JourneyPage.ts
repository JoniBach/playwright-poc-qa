import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object for Journey Pages
 */
export class JourneyPage {
  protected heading: Locator;
  protected continueButton: Locator;
  protected backLink: Locator;
  protected errorSummary: Locator;

  constructor(protected page: Page) {
    this.heading = page.locator('h1').first();
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.backLink = page.getByRole('link', { name: 'Back' });
    this.errorSummary = page.locator('.govuk-error-summary');
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async goBack(): Promise<void> {
    await this.backLink.click();
  }

  async assertHeading(expectedHeading: string): Promise<void> {
    await expect(this.heading).toHaveText(expectedHeading);
  }

  async assertErrorSummary(expectedErrors: string[]): Promise<void> {
    await expect(this.errorSummary).toBeVisible();
    for (const error of expectedErrors) {
      await expect(this.errorSummary).toContainText(error);
    }
  }

  async assertNoErrors(): Promise<void> {
    await expect(this.errorSummary).not.toBeVisible();
  }
}
