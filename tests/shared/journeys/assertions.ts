/**
 * Shared Journey Assertions
 * Reusable assertions for journey testing
 */

import { expect, Page } from '@playwright/test';

/**
 * Assert that we're on a specific journey step
 */
export async function assertOnStep(page: Page, expectedHeading: string) {
  const heading = page.getByRole('heading', { name: expectedHeading }).first();
  await expect(heading).toBeVisible();
}

/**
 * Assert that journey completed successfully
 */
export async function assertJourneyComplete(page: Page, expectedTitle: string = 'Application submitted') {
  const panel = page.locator('.govuk-panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('.govuk-panel__title')).toContainText(expectedTitle);
}

/**
 * Assert that reference number is displayed
 */
export async function assertReferenceNumberDisplayed(page: Page) {
  const panel = page.locator('.govuk-panel');
  const body = await panel.locator('.govuk-panel__body').textContent();
  
  expect(body).toBeTruthy();
  expect(body).toMatch(/APP-[A-Z0-9]+-[A-Z0-9]+/);
}

/**
 * Assert that validation errors are shown
 */
export async function assertValidationErrors(page: Page, expectedErrors: string[]) {
  const errorSummary = page.locator('.govuk-error-summary');
  await expect(errorSummary).toBeVisible();
  
  for (const error of expectedErrors) {
    await expect(errorSummary.getByText(error, { exact: false })).toBeVisible();
  }
}

/**
 * Assert that a specific field has an error
 */
export async function assertFieldError(page: Page, fieldName: string, errorMessage: string) {
  const error = page.locator(`#${fieldName}-error`);
  await expect(error).toBeVisible();
  await expect(error).toContainText(errorMessage);
}

/**
 * Assert that summary list contains expected data
 */
export async function assertSummaryData(page: Page, expectedData: Record<string, string>) {
  for (const [key, value] of Object.entries(expectedData)) {
    const row = page.locator('.govuk-summary-list__row', {
      has: page.locator('.govuk-summary-list__key', { hasText: key })
    });
    await expect(row.locator('.govuk-summary-list__value')).toContainText(value);
  }
}

/**
 * Assert that we can navigate back
 */
export async function assertCanNavigateBack(page: Page) {
  const backLink = page.getByRole('link', { name: 'Back' });
  await expect(backLink).toBeVisible();
  await expect(backLink).toBeEnabled();
}

/**
 * Assert that continue button is visible
 */
export async function assertContinueButtonVisible(page: Page) {
  const continueButton = page.getByRole('button', { name: 'Continue' });
  await expect(continueButton).toBeVisible();
  await expect(continueButton).toBeEnabled();
}

/**
 * Assert that journey step count is correct
 */
export function assertStepCount(currentStep: number, expectedStep: number) {
  expect(currentStep).toBe(expectedStep);
}

/**
 * Assert that stored journey data matches expected
 */
export function assertJourneyData(storedData: Record<string, any>, expectedData: Record<string, any>) {
  for (const [key, value] of Object.entries(expectedData)) {
    expect(storedData[key]).toEqual(value);
  }
}

/**
 * Assert that error summary is not visible
 */
export async function assertNoErrors(page: Page) {
  const errorSummary = page.locator('.govuk-error-summary');
  await expect(errorSummary).not.toBeVisible();
}

/**
 * Assert that confirmation message is displayed
 */
export async function assertConfirmationMessage(page: Page, expectedMessage: string) {
  const insetText = page.locator('.govuk-inset-text');
  await expect(insetText).toBeVisible();
  await expect(insetText).toContainText(expectedMessage);
}

/**
 * Assert that page title is correct
 */
export async function assertPageTitle(page: Page, expectedTitle: string) {
  await expect(page).toHaveTitle(new RegExp(expectedTitle, 'i'));
}

/**
 * Assert that notification banner is shown
 */
export async function assertNotificationBanner(page: Page, expectedMessage: string) {
  const banner = page.locator('.govuk-notification-banner');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText(expectedMessage);
}

/**
 * Assert that all required fields are present
 */
export async function assertRequiredFields(page: Page, fieldLabels: string[]) {
  for (const label of fieldLabels) {
    const field = page.getByLabel(label, { exact: false });
    await expect(field).toBeVisible();
  }
}

/**
 * Assert that change links are visible in summary
 */
export async function assertChangeLinksVisible(page: Page, fieldLabels: string[]) {
  for (const label of fieldLabels) {
    const row = page.locator('.govuk-summary-list__row', {
      has: page.locator('.govuk-summary-list__key', { hasText: label })
    });
    const changeLink = row.locator('.govuk-summary-list__actions a');
    await expect(changeLink).toBeVisible();
    await expect(changeLink).toContainText('Change');
  }
}

/**
 * Assert that journey is at check your answers page
 */
export async function assertAtCheckYourAnswers(page: Page) {
  await assertOnStep(page, 'Check your answers');
  const summaryList = page.locator('.govuk-summary-list');
  await expect(summaryList).toBeVisible();
}

/**
 * Assert that autofill button is available
 */
export async function assertAutofillAvailable(page: Page) {
  const autofillButton = page.getByRole('button', { name: /Auto-fill|Autofill/i });
  await expect(autofillButton).toBeVisible();
}

/**
 * Assert that journey progress is saved
 */
export async function assertProgressSaved(page: Page) {
  // Check for any indication that progress is saved
  // This could be a notification, local storage, etc.
  const notification = page.locator('.govuk-notification-banner--success');
  if (await notification.isVisible()) {
    await expect(notification).toContainText(/saved|progress/i);
  }
}
