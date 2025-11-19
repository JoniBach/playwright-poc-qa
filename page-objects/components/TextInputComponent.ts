import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for GOV.UK Text Input Component
 */
export class TextInputComponent {
  private input: Locator;
  private label: Locator;
  private hint: Locator;
  private errorMessage: Locator;

  constructor(
    private page: Page,
    private fieldName: string
  ) {
    this.input = page.locator(`#${fieldName}`);
    this.label = page.locator(`label[for="${fieldName}"]`);
    this.hint = page.locator(`#${fieldName}-hint`);
    this.errorMessage = page.locator(`#${fieldName}-error`);
  }

  /**
   * Fill the input field
   */
  async fill(value: string): Promise<void> {
    await this.input.fill(value);
  }

  /**
   * Clear the input field
   */
  async clear(): Promise<void> {
    await this.input.clear();
  }

  /**
   * Get the current value
   */
  async getValue(): Promise<string> {
    return await this.input.inputValue();
  }

  /**
   * Click the input field
   */
  async click(): Promise<void> {
    await this.input.click();
  }

  /**
   * Focus the input field
   */
  async focus(): Promise<void> {
    await this.input.focus();
  }

  /**
   * Blur (unfocus) the input field
   */
  async blur(): Promise<void> {
    await this.input.blur();
  }

  /**
   * Press a key
   */
  async press(key: string): Promise<void> {
    await this.input.press(key);
  }

  /**
   * Type text with delay
   */
  async type(text: string, delay?: number): Promise<void> {
    await this.input.pressSequentially(text, { delay });
  }

  /**
   * Verify input is visible
   */
  async assertVisible(): Promise<void> {
    await expect(this.input).toBeVisible();
  }

  /**
   * Verify input has specific value
   */
  async assertValue(expectedValue: string): Promise<void> {
    await expect(this.input).toHaveValue(expectedValue);
  }

  /**
   * Verify label text
   */
  async assertLabel(expectedLabel: string): Promise<void> {
    await expect(this.label).toHaveText(expectedLabel);
  }

  /**
   * Verify hint text is visible
   */
  async assertHint(expectedHint: string): Promise<void> {
    await expect(this.hint).toBeVisible();
    await expect(this.hint).toHaveText(expectedHint);
  }

  /**
   * Verify error message is visible
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
   * Verify input is disabled
   */
  async assertDisabled(): Promise<void> {
    await expect(this.input).toBeDisabled();
  }

  /**
   * Verify input is enabled
   */
  async assertEnabled(): Promise<void> {
    await expect(this.input).toBeEnabled();
  }

  /**
   * Verify input has error styling
   */
  async assertHasErrorClass(): Promise<void> {
    await expect(this.input).toHaveClass(/govuk-input--error/);
  }

  /**
   * Get the input locator for custom assertions
   */
  getLocator(): Locator {
    return this.input;
  }

  /**
   * Get the error message locator
   */
  getErrorLocator(): Locator {
    return this.errorMessage;
  }
}
