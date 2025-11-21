import { Page } from '@playwright/test';
import { JourneyRunner } from './JourneyRunner';
import { ComponentHelper } from './ComponentHelper';
import { TestDataFactory } from './TestDataFactory';

/**
 * Journey Step Blocks
 * Reusable, composable blocks for building E2E journey tests
 * 
 * Each block represents a common journey step pattern that can be
 * reused across multiple journeys.
 */

export interface StepBlockContext {
  page: Page;
  journeyRunner: JourneyRunner;
  componentHelper: ComponentHelper;
  data?: Record<string, any>;
}

export type StepBlock = (context: StepBlockContext) => Promise<void>;

/**
 * Common Journey Step Blocks
 */
export class JourneyStepBlocks {
  
  // ==================== APPLICANT TYPE BLOCKS ====================
  
  /**
   * Select "Individual" as applicant type
   */
  static selectIndividualApplicant(headingText: string = 'Who is registering the aircraft?'): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading(headingText);
      await journeyRunner.selectRadio('An individual');
      await journeyRunner.continue();
    };
  }

  /**
   * Select "Organisation" as applicant type
   */
  static selectOrganisationApplicant(headingText: string = 'Who is registering the aircraft?'): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading(headingText);
      await journeyRunner.selectRadio('A company or organisation');
      await journeyRunner.continue();
    };
  }

  /**
   * Generic applicant type selection
   */
  static selectApplicantType(type: string, headingText?: string): StepBlock {
    return async ({ journeyRunner }) => {
      if (headingText) {
        await journeyRunner.verifyHeading(headingText);
      }
      await journeyRunner.selectRadio(type);
      await journeyRunner.continue();
    };
  }

  // ==================== CONTACT DETAILS BLOCKS ====================

  /**
   * Fill contact details with auto-generated data
   */
  static fillContactDetails(headingText: string = 'Your contact details'): StepBlock {
    return async ({ journeyRunner, data }) => {
      await journeyRunner.verifyHeading(headingText);
      
      const contactData = data?.contactData || TestDataFactory.generateContactDetails();
      
      await journeyRunner.fillStep({
        'Full name': contactData.fullName,
        'Email address': contactData.email,
        'Telephone number': contactData.phone
      });
      
      await journeyRunner.continue();
      
      // Store for later verification
      journeyRunner.storeData('contactData', contactData);
    };
  }

  /**
   * Fill contact details with custom data
   */
  static fillContactDetailsWithData(contactData: any, headingText?: string): StepBlock {
    return async ({ journeyRunner }) => {
      if (headingText) {
        await journeyRunner.verifyHeading(headingText);
      }
      
      await journeyRunner.fillStep({
        'Full name': contactData.fullName,
        'Email address': contactData.email,
        'Telephone number': contactData.phone
      });
      
      await journeyRunner.continue();
      journeyRunner.storeData('contactData', contactData);
    };
  }

  // ==================== COMPANY DETAILS BLOCKS ====================

  /**
   * Fill company name
   */
  static fillCompanyName(headingText: string = 'What is the company name?'): StepBlock {
    return async ({ journeyRunner, data }) => {
      await journeyRunner.verifyHeading(headingText);
      
      const companyData = data?.companyData || TestDataFactory.generateCompanyData();
      
      await journeyRunner.fillStep({
        'Company name': companyData.name
      });
      
      await journeyRunner.continue();
      journeyRunner.storeData('companyData', companyData);
    };
  }

  /**
   * Fill company registration details
   */
  static fillCompanyRegistration(headingText: string = 'Company registration details'): StepBlock {
    return async ({ journeyRunner, data }) => {
      await journeyRunner.verifyHeading(headingText);
      
      const companyData = data?.companyData || TestDataFactory.generateCompanyData();
      
      await journeyRunner.fillStep({
        'Company registration number': companyData.registrationNumber,
        'Registered office address': companyData.address
      });
      
      await journeyRunner.continue();
      journeyRunner.storeData('companyData', companyData);
    };
  }

  // ==================== ADDRESS BLOCKS ====================

  /**
   * Fill UK address
   */
  static fillUKAddress(headingText: string = 'What is your address?'): StepBlock {
    return async ({ journeyRunner, data }) => {
      await journeyRunner.verifyHeading(headingText);
      
      const addressData = data?.addressData || TestDataFactory.generateAddress();
      
      await journeyRunner.fillStep({
        'Address line 1': addressData.line1,
        'Address line 2': addressData.line2 || '',
        'Town or city': addressData.city,
        'County': addressData.county || '',
        'Postcode': addressData.postcode
      });
      
      await journeyRunner.continue();
      journeyRunner.storeData('addressData', addressData);
    };
  }

  // ==================== AIRCRAFT/VEHICLE DETAILS BLOCKS ====================

  /**
   * Fill aircraft details
   */
  static fillAircraftDetails(headingText: string = 'Enter aircraft details'): StepBlock {
    return async ({ journeyRunner, data }) => {
      await journeyRunner.verifyHeading(headingText);
      
      const aircraftData = data?.aircraftData || TestDataFactory.generateAircraftData();
      
      await journeyRunner.fillStep({
        'Manufacturer': aircraftData.manufacturer,
        'Model': aircraftData.model,
        'Serial number': aircraftData.serialNumber
      });
      
      await journeyRunner.continue();
      journeyRunner.storeData('aircraftData', aircraftData);
    };
  }

  // ==================== DOCUMENT UPLOAD BLOCKS ====================

  /**
   * Upload document
   */
  static uploadDocument(fieldLabel: string, filePath: string): StepBlock {
    return async ({ page }) => {
      const fileInput = page.getByLabel(fieldLabel);
      await fileInput.setInputFiles(filePath);
    };
  }

  // ==================== DECLARATION/CONSENT BLOCKS ====================

  /**
   * Accept declaration checkbox
   */
  static acceptDeclaration(label: string = 'I confirm that the information provided is correct'): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.checkCheckbox(label);
    };
  }

  /**
   * Accept terms and conditions
   */
  static acceptTermsAndConditions(label: string = 'I accept the terms and conditions'): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.checkCheckbox(label);
    };
  }

  // ==================== CHECK YOUR ANSWERS BLOCKS ====================

  /**
   * Verify and submit Check Your Answers page
   */
  static checkYourAnswersAndSubmit(headingText: string = 'Check your answers before submitting'): StepBlock {
    return async ({ journeyRunner, componentHelper }) => {
      await journeyRunner.verifyHeading(headingText);
      
      // Optional: Verify specific summary rows if data is stored
      const contactData = journeyRunner.getData('contactData');
      if (contactData) {
        await componentHelper.verifySummaryRow('Full name', contactData.fullName);
        await componentHelper.verifySummaryRow('Email address', contactData.email);
      }
      
      await journeyRunner.submit();
    };
  }

  /**
   * Verify Check Your Answers page without submitting
   */
  static verifyCheckYourAnswers(headingText: string = 'Check your answers before submitting'): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading(headingText);
    };
  }

  /**
   * Change an answer from Check Your Answers page
   */
  static changeAnswer(key: string): StepBlock {
    return async ({ componentHelper }) => {
      await componentHelper.clickChangeLink(key);
    };
  }

  // ==================== CONFIRMATION BLOCKS ====================

  /**
   * Verify confirmation page
   */
  static verifyConfirmation(headingText: string = 'Application submitted'): StepBlock {
    return async ({ journeyRunner, componentHelper }) => {
      await journeyRunner.verifyHeading(headingText);
      await componentHelper.verifyPanelTitle(headingText);
    };
  }

  /**
   * Verify confirmation with reference number
   */
  static verifyConfirmationWithReference(headingText: string = 'Application submitted'): StepBlock {
    return async ({ journeyRunner, componentHelper, page }) => {
      await journeyRunner.verifyHeading(headingText);
      await componentHelper.verifyPanelTitle(headingText);
      
      // Extract and store reference number
      const referenceNumber = await page.locator('.govuk-panel__body').textContent();
      journeyRunner.storeData('referenceNumber', referenceNumber?.trim());
    };
  }

  // ==================== NAVIGATION BLOCKS ====================

  /**
   * Start journey at specific path
   */
  static startJourney(path: string): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.startJourney(path);
    };
  }

  /**
   * Go back to previous step
   */
  static goBack(): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.goBack();
    };
  }

  /**
   * Continue to next step
   */
  static continue(): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.continue();
    };
  }

  // ==================== CUSTOM FORM BLOCKS ====================

  /**
   * Fill custom form step with provided data
   */
  static fillFormStep(data: Record<string, string>, headingText?: string): StepBlock {
    return async ({ journeyRunner }) => {
      if (headingText) {
        await journeyRunner.verifyHeading(headingText);
      }
      await journeyRunner.fillStep(data);
      await journeyRunner.continue();
    };
  }

  /**
   * Select radio option
   */
  static selectRadio(label: string, headingText?: string): StepBlock {
    return async ({ journeyRunner }) => {
      if (headingText) {
        await journeyRunner.verifyHeading(headingText);
      }
      await journeyRunner.selectRadio(label);
      await journeyRunner.continue();
    };
  }

  /**
   * Check checkbox
   */
  static checkCheckbox(label: string): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.checkCheckbox(label);
    };
  }

  // ==================== VERIFICATION BLOCKS ====================

  /**
   * Verify heading
   */
  static verifyHeading(headingText: string): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading(headingText);
    };
  }

  /**
   * Verify error summary
   */
  static verifyErrorSummary(expectedErrors: string[]): StepBlock {
    return async ({ componentHelper }) => {
      await componentHelper.verifyErrorSummary(expectedErrors);
    };
  }

  /**
   * Verify field error
   */
  static verifyFieldError(fieldLabel: string, errorMessage: string): StepBlock {
    return async ({ componentHelper }) => {
      await componentHelper.verifyFieldError(fieldLabel, errorMessage);
    };
  }

  // ==================== COMPOSITE BLOCKS ====================

  /**
   * Complete standard individual application flow
   * (Applicant Type -> Contact Details -> Check Answers -> Confirmation)
   */
  static completeIndividualApplication(options?: {
    applicantHeading?: string;
    contactHeading?: string;
    checkAnswersHeading?: string;
    confirmationHeading?: string;
  }): StepBlock[] {
    return [
      this.selectIndividualApplicant(options?.applicantHeading),
      this.fillContactDetails(options?.contactHeading),
      this.checkYourAnswersAndSubmit(options?.checkAnswersHeading),
      this.verifyConfirmation(options?.confirmationHeading)
    ];
  }

  /**
   * Complete standard organisation application flow
   */
  static completeOrganisationApplication(options?: {
    applicantHeading?: string;
    contactHeading?: string;
    checkAnswersHeading?: string;
    confirmationHeading?: string;
  }): StepBlock[] {
    return [
      this.selectOrganisationApplicant(options?.applicantHeading),
      this.fillContactDetails(options?.contactHeading),
      this.checkYourAnswersAndSubmit(options?.checkAnswersHeading),
      this.verifyConfirmation(options?.confirmationHeading)
    ];
  }
}
