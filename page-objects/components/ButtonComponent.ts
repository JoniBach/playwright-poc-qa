import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for GOV.UK Button Component
 */
export class ButtonComponent {
  private button: Locator;

  constructor(
    private page: Page,
    buttonText: string
  ) {
    this.button = page.getByRole('button', { name: buttonText });
  }

  async click(): Promise<void> {
    await this.button.click();
  }

  async assertVisible(): Promise<void> {
    await expect(this.button).toBeVisible();
  }

  async assertDisabled(): Promise<void> {
    await expect(this.button).toBeDisabled();
  }

  async assertEnabled(): Promise<void> {
    await expect(this.button).toBeEnabled();
  }

  getLocator(): Locator {
    return this.button;
  }
}
