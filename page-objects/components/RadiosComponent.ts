import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for GOV.UK Radios Component
 */
export class RadiosComponent {
  private fieldset: Locator;
  private legend: Locator;
  private hint: Locator;
  private errorMessage: Locator;

  constructor(
    private page: Page,
    private fieldName: string
  ) {
    this.fieldset = page.locator(`fieldset:has(input[name="${fieldName}"])`);
    this.legend = this.fieldset.locator('legend');
    this.hint = page.locator(`#${fieldName}-hint`);
    this.errorMessage = page.locator(`#${fieldName}-error`);
  }

  /**
   * Get a specific radio option by label
   */
  private getRadioByLabel(label: string): Locator {
    return this.page.getByLabel(label, { exact: false });
  }

  /**
   * Get a specific radio option by value
   */
  private getRadioByValue(value: string): Locator {
    return this.page.locator(`input[name="${this.fieldName}"][value="${value}"]`);
  }

  /**
   * Select a radio option by label
   */
  async selectByLabel(label: string): Promise<void> {
    await this.getRadioByLabel(label).check();
  }

  /**
   * Select a radio option by value
   */
  async selectByValue(value: string): Promise<void> {
    await this.getRadioByValue(value).check();
  }

  /**
   * Get the currently selected value
   */
  async getSelectedValue(): Promise<string | null> {
    const checkedRadio = this.page.locator(`input[name="${this.fieldName}"]:checked`);
    const count = await checkedRadio.count();
    
    if (count === 0) {
      return null;
    }
    
    return await checkedRadio.getAttribute('value');
  }

  /**
   * Get the label of the currently selected option
   */
  async getSelectedLabel(): Promise<string | null> {
    const value = await this.getSelectedValue();
    if (!value) return null;

    const radio = this.getRadioByValue(value);
    const id = await radio.getAttribute('id');
    const label = this.page.locator(`label[for="${id}"]`);
    
    return await label.textContent();
  }

  /**
   * Verify a specific option is selected
   */
  async assertSelected(label: string): Promise<void> {
    await expect(this.getRadioByLabel(label)).toBeChecked();
  }

  /**
   * Verify a specific option is not selected
   */
  async assertNotSelected(label: string): Promise<void> {
    await expect(this.getRadioByLabel(label)).not.toBeChecked();
  }

  /**
   * Verify legend text
   */
  async assertLegend(expectedLegend: string): Promise<void> {
    await expect(this.legend).toHaveText(expectedLegend);
  }

  /**
   * Verify hint text
   */
  async assertHint(expectedHint: string): Promise<void> {
    await expect(this.hint).toBeVisible();
    await expect(this.hint).toHaveText(expectedHint);
  }

  /**
   * Verify error message
   */
  async assertError(expectedError: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedError);
  }

  /**
   * Verify no error is shown
   */
  async assertNoError(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }

  /**
   * Verify all radio options are visible
   */
  async assertAllOptionsVisible(expectedLabels: string[]): Promise<void> {
    for (const label of expectedLabels) {
      await expect(this.getRadioByLabel(label)).toBeVisible();
    }
  }

  /**
   * Verify fieldset is visible
   */
  async assertVisible(): Promise<void> {
    await expect(this.fieldset).toBeVisible();
  }

  /**
   * Get the fieldset locator for custom assertions
   */
  getLocator(): Locator {
    return this.fieldset;
  }

  /**
   * Get count of radio options
   */
  async getOptionCount(): Promise<number> {
    return await this.page.locator(`input[name="${this.fieldName}"]`).count();
  }

  /**
   * Verify a specific option is disabled
   */
  async assertOptionDisabled(label: string): Promise<void> {
    await expect(this.getRadioByLabel(label)).toBeDisabled();
  }

  /**
   * Verify a specific option is enabled
   */
  async assertOptionEnabled(label: string): Promise<void> {
    await expect(this.getRadioByLabel(label)).toBeEnabled();
  }
}
