import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for GOV.UK Checkboxes Component
 */
export class CheckboxesComponent {
  private fieldset: Locator;
  private legend: Locator;
  private errorMessage: Locator;

  constructor(
    private page: Page,
    private fieldName: string
  ) {
    this.fieldset = page.locator(`fieldset:has(input[name="${fieldName}"])`);
    this.legend = this.fieldset.locator('legend');
    this.errorMessage = page.locator(`#${fieldName}-error`);
  }

  private getCheckboxByLabel(label: string): Locator {
    return this.page.getByLabel(label, { exact: false });
  }

  async check(label: string): Promise<void> {
    await this.getCheckboxByLabel(label).check();
  }

  async uncheck(label: string): Promise<void> {
    await this.getCheckboxByLabel(label).uncheck();
  }

  async assertChecked(label: string): Promise<void> {
    await expect(this.getCheckboxByLabel(label)).toBeChecked();
  }

  async assertNotChecked(label: string): Promise<void> {
    await expect(this.getCheckboxByLabel(label)).not.toBeChecked();
  }

  async assertError(expectedError: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedError);
  }

  getLocator(): Locator {
    return this.fieldset;
  }
}
