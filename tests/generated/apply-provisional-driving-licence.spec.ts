import { test, expect } from '../../fixtures/base.fixture';
import { TestDataFactory } from '../../helpers/TestDataFactory';
import { JourneyBuilder } from '../../helpers/JourneyBuilder';
import { AdaptiveBlocks } from '../../helpers/AdaptiveBlocks';

/**
 * apply-provisional-driving-licence - Generated Tests
 * 
 * Generated from journey: apply-provisional-driving-licence
 * Generated at: 2025-12-15T12:45:59.881Z
 * 
 * Journey Structure:
 * - Pages: 15
 * - Components: 50
 * - User Stories: 1
 * - Test Scenarios: 1
 */

test.describe('apply-provisional-driving-licence', () => {
  const JOURNEY_PATH = '/department-for-transport/apply-for-provisional-driving-licence/apply';

  test.describe('Happy Path Tests', () => {

    test('should complete full journey using adaptive blocks @smoke @journey', async ({
      page,
      journeyRunner,
      componentHelper
    }) => {
      const contactData = TestDataFactory.generateContactDetails();
      const testPostcode = TestDataFactory.generatePostcode();
      const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

      await builder
        // Start journey
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.startJourney(JOURNEY_PATH);
          await journeyRunner.verifyHeading('Start your application');
          await journeyRunner.continue();
        })
        // eligibility-age
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Confirm your age');
          await journeyRunner.fillStep({
            'Select yes if you are at least 15 years and 9 months old.: Yes': 'yes',
          });
          await journeyRunner.continue();
        })
        // eligibility-residency
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Residency in Great Britain');
          await journeyRunner.fillStep({
            'Select where you are normally resident.: Yes, I am normally resident in Great Britain': 'yes, i am normally resident in great britain',
          });
          await journeyRunner.continue();
        })
        // personal-name
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Your name');
          await journeyRunner.fillStep({
            'First name': 'John',
            'Middle names (optional)': contactData.fullName,
            'Last name': 'Smith',
          });
          await journeyRunner.continue();
        })
        // personal-details
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Your personal details');
          await journeyRunner.fillStep({
            'Date of birth': '01 01 2000',
            'National Insurance number (optional)': 'QQ 12 34 56 C',
            'What is your gender as shown on your official documents?: Male': 'male',
          });
          await journeyRunner.continue();
        })
        // identity-document
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Confirm your identity');
          await journeyRunner.fillStep({
            'Select an option: Yes, I have a valid UK passport': 'yes, i have a valid uk passport',
          });
          await journeyRunner.continue();
        })
        // contact-address
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Your current address');
          await journeyRunner.fillStep({
            'Address line 1': '123 Test Street',
            'Address line 2 (optional)': '',
            'Town or city': 'London',
            'Postcode': testPostcode,
          });
          await journeyRunner.continue();
        })
        // previous-addresses
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Previous addresses');
          await journeyRunner.fillStep({
            'Select yes if you have lived at your current address for 3 years or more.: Yes': 'yes',
          });
          await journeyRunner.continue();
        })
        // contact-details
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Your contact details');
          await journeyRunner.fillStep({
            'Email address (optional)': contactData.email,
            'UK mobile or landline number (optional)': '100',
          });
          await journeyRunner.continue();
        })
        // vehicle-categories
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('What you want to drive');
          await journeyRunner.fillStep({
            'Select all that apply.': ['Car (category B)', 'Motorcycle (category A)', 'Moped (category AM)'],
          });
          await journeyRunner.continue();
        })
        // medical-conditions
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Your health and medical conditions');
          await journeyRunner.fillStep({
            'Select an option: Yes, I have a medical condition that may affect my driving': 'yes, i have a medical condition that may affect my driving',
          });
          await journeyRunner.continue();
        })
        // declarations
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Confirm declarations');
          await journeyRunner.fillStep({
            'Tick all the boxes to confirm.': ['The information I have given is true and complete to the best of my knowledge.', 'I am not disqualified from holding or obtaining a driving licence.', 'I will tell DVLA if my health or personal details change in a way that may affect my driving.'],
          });
          await journeyRunner.continue();
        })
        // payment
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Pay the fee');
          await journeyRunner.fillStep({
            'Name on the card': contactData.fullName,
            'Card number': '100',
            'Expiry date (MM/YY)': '01 01 2000',
            'Card security code': 'Test Value',
          });
          await journeyRunner.continue();
        })
        // check-answers
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Check your answers');
          await journeyRunner.submit();
        })
        // confirmation
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Application submitted');
        })

        .execute();
    });

  });

  test.describe('Validation Tests', () => {

    test('should validate required fields @journey @validation', async ({
      page,
      journeyRunner,
      componentHelper
    }) => {
      await journeyRunner.startJourney(JOURNEY_PATH);
      // TODO: Navigate to form page and submit without filling
      // TODO: Use AdaptiveBlocks.smartVerifyErrors(['Error message'])
    });

  });

});
