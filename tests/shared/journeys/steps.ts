/**
 * Shared Journey Steps
 * Reusable step definitions for common journey patterns
 */

import { Page } from '@playwright/test';
import { JourneyRunner } from './runner';

/**
 * Common journey step patterns
 */
export class JourneySteps {
  constructor(
    private runner: JourneyRunner,
    private page: Page
  ) {}

  /**
   * Complete applicant type step
   */
  async selectApplicantType(type: 'individual' | 'organisation'): Promise<void> {
    const label = type === 'individual' ? 'An individual' : 'A company or organisation';
    await this.runner.selectRadioAndContinue(label);
  }

  /**
   * Complete contact details step
   */
  async fillContactDetails(data: {
    fullName: string;
    email: string;
    phone: string;
  }): Promise<void> {
    await this.runner.fillAndContinue({
      'Full name': data.fullName,
      'Email address': data.email,
      'Telephone number': data.phone
    });
  }

  /**
   * Complete address step
   */
  async fillAddress(data: {
    addressLine1: string;
    addressLine2?: string;
    town: string;
    postcode: string;
  }): Promise<void> {
    const formData: Record<string, string> = {
      'Address line 1': data.addressLine1,
      'Town or city': data.town,
      'Postcode': data.postcode
    };

    if (data.addressLine2) {
      formData['Address line 2'] = data.addressLine2;
    }

    await this.runner.fillAndContinue(formData);
  }

  /**
   * Review and submit on Check Your Answers page
   */
  async reviewAndSubmit(): Promise<void> {
    await this.runner.assertOnStep('Check your answers');
    await this.runner.submit();
  }

  /**
   * Verify successful submission
   */
  async verifySubmissionSuccess(expectedTitle: string = 'Application submitted'): Promise<void> {
    await this.runner.verifyConfirmation(expectedTitle);
  }

  /**
   * Complete a simple form step with arbitrary fields
   */
  async fillFormStep(fields: Record<string, string>): Promise<void> {
    await this.runner.fillAndContinue(fields);
  }

  /**
   * Navigate back and change a field
   */
  async changeField(fieldLabel: string, newValue: string): Promise<void> {
    await this.runner.clickChange(fieldLabel);
    await this.page.getByLabel(fieldLabel, { exact: false }).fill(newValue);
    await this.runner.continue();
  }

  /**
   * Complete helicopter details step
   */
  async fillHelicopterDetails(data: {
    make: string;
    model: string;
    serial?: string;
  }): Promise<void> {
    const formData: Record<string, string> = {
      'Manufacturer': data.make,
      'Model': data.model
    };

    if (data.serial) {
      formData['Serial number'] = data.serial;
    }

    await this.runner.fillAndContinue(formData);
  }

  /**
   * Complete plane details step
   */
  async fillPlaneDetails(data: {
    make: string;
    model: string;
    registration?: string;
  }): Promise<void> {
    const formData: Record<string, string> = {
      'Manufacturer': data.make,
      'Model': data.model
    };

    if (data.registration) {
      formData['Serial number'] = data.registration;
    }

    await this.runner.fillAndContinue(formData);
  }

  /**
   * Complete owner details step
   */
  async fillOwnerDetails(data: {
    fullName: string;
    email: string;
    phone: string;
  }): Promise<void> {
    await this.runner.fillAndContinue({
      'Full name': data.fullName,
      'Email address': data.email,
      'Telephone number': data.phone
    });
  }

  /**
   * Verify all summary rows
   */
  async verifySummaryRows(expectedData: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(expectedData)) {
      await this.runner.verifySummaryRow(key, value);
    }
  }

  /**
   * Handle validation errors
   */
  async expectValidationErrors(expectedErrors: string[]): Promise<void> {
    await this.runner.verifyErrorSummary(expectedErrors);
  }

  /**
   * Use autofill if available
   */
  async useAutofill(): Promise<void> {
    await this.runner.autofill();
  }
}

/**
 * Factory function to create JourneySteps
 */
export function createJourneySteps(runner: JourneyRunner, page: Page): JourneySteps {
  return new JourneySteps(runner, page);
}
