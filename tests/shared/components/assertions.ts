/**
 * Shared Component Assertions
 * Reusable assertions for GOV.UK components
 */

import { expect, Locator } from '@playwright/test';

/**
 * Assert that a component is visible
 */
export async function assertComponentVisible(locator: Locator) {
  await expect(locator).toBeVisible();
}

/**
 * Assert that a component is not visible
 */
export async function assertComponentNotVisible(locator: Locator) {
  await expect(locator).not.toBeVisible();
}

/**
 * Assert that a text input has a specific value
 */
export async function assertInputValue(locator: Locator, expectedValue: string) {
  await expect(locator).toHaveValue(expectedValue);
}

/**
 * Assert that a radio button is checked
 */
export async function assertRadioChecked(locator: Locator) {
  await expect(locator).toBeChecked();
}

/**
 * Assert that a radio button is not checked
 */
export async function assertRadioNotChecked(locator: Locator) {
  await expect(locator).not.toBeChecked();
}

/**
 * Assert that a checkbox is checked
 */
export async function assertCheckboxChecked(locator: Locator) {
  await expect(locator).toBeChecked();
}

/**
 * Assert that an error summary contains specific errors
 */
export async function assertErrorSummaryContains(
  errorSummary: Locator,
  expectedErrors: string[]
) {
  await expect(errorSummary).toBeVisible();
  
  for (const error of expectedErrors) {
    await expect(errorSummary.getByText(error, { exact: false })).toBeVisible();
  }
}

/**
 * Assert that a field has an error message
 */
export async function assertFieldHasError(
  fieldError: Locator,
  expectedMessage: string
) {
  await expect(fieldError).toBeVisible();
  await expect(fieldError).toContainText(expectedMessage);
}

/**
 * Assert that a button is enabled
 */
export async function assertButtonEnabled(button: Locator) {
  await expect(button).toBeEnabled();
}

/**
 * Assert that a button is disabled
 */
export async function assertButtonDisabled(button: Locator) {
  await expect(button).toBeDisabled();
}

/**
 * Assert that a component has specific text
 */
export async function assertComponentText(
  locator: Locator,
  expectedText: string
) {
  await expect(locator).toContainText(expectedText);
}

/**
 * Assert that a component has a specific attribute
 */
export async function assertComponentAttribute(
  locator: Locator,
  attribute: string,
  expectedValue: string
) {
  await expect(locator).toHaveAttribute(attribute, expectedValue);
}

/**
 * Assert that a component is focused
 */
export async function assertComponentFocused(locator: Locator) {
  await expect(locator).toBeFocused();
}

/**
 * Assert that all options in a select/radio group are visible
 */
export async function assertAllOptionsVisible(
  container: Locator,
  expectedOptions: string[]
) {
  for (const option of expectedOptions) {
    await expect(container.getByText(option)).toBeVisible();
  }
}

/**
 * Assert GOV.UK component follows design system patterns
 */
export async function assertGovUKPattern(
  component: Locator,
  componentType: 'button' | 'input' | 'radios' | 'checkboxes' | 'select'
) {
  // Check for GOV.UK CSS classes
  const classList = await component.getAttribute('class');
  expect(classList).toContain(`govuk-${componentType}`);
}
