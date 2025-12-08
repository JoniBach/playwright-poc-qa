import { test, expect } from '../../fixtures/base.fixture';
import { TestDataFactory } from '../../helpers/TestDataFactory';
import { JourneyBuilder } from '../../helpers/JourneyBuilder';
import { AdaptiveBlocks } from '../../helpers/AdaptiveBlocks';

/**
 * Register a company - Generated Tests
 * 
 * Generated from journey: register-a-company
 * Generated at: 2025-11-22T00:23:13.377Z
 * 
 * Journey Structure:
 * - Pages: 8
 * - Components: 31
 * - User Stories: 3
 * - Test Scenarios: 12
 */

test.describe('register-a-company', () => {
  const JOURNEY_PATH = '/department-for-business-and-trade/register-a-company/apply';

  test.describe('Happy Path Tests', () => {

    test('should complete full journey using adaptive blocks @smoke @journey', async ({
      page,
      journeyRunner,
      componentHelper
    }) => {
      const contactData = TestDataFactory.generateContactDetails();
      const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

      await builder
        // Start journey
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.startJourney(JOURNEY_PATH);
          await journeyRunner.verifyHeading('Before you start');
          await journeyRunner.continue();
        })
        // company-name
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('What is the company’s proposed name?');
          await journeyRunner.fillStep({
            'Company name': 'Test Company Ltd',
          });
          await journeyRunner.continue();
        })
        // registered-office
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('What is the company’s registered office address?');
          await journeyRunner.fillStep({
            'Address line 1': '123 Test Street',
            'Address line 2 (optional)': '',
            'Town or city': 'London',
            'County (optional)': '',
            'Postcode': 'SW1A 1AA',
          });
          await journeyRunner.continue();
        })
        // director-details
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Director’s details');
          await journeyRunner.fillStep({
            'First name': 'John',
            'Last name': 'Smith',
            'Email address': contactData.email,
            'Telephone number (optional)': contactData.phone,
          });
          await journeyRunner.continue();
        })
        // shareholder-details
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Shareholder’s details');
          await journeyRunner.fillStep({
            'First name': 'John',
            'Last name': 'Smith',
            'Number of shares': '100',
            'Value of each share (£)': '100',
          });
          await journeyRunner.continue();
        })
        // contact-details
        .addCustomStep(async ({ journeyRunner }) => {
          await journeyRunner.verifyHeading('Your contact details');
          await journeyRunner.fillStep({
            'Email address': contactData.email,
            'Full name': contactData.fullName,
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
          await journeyRunner.verifyHeading('Your application has been submitted');
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
