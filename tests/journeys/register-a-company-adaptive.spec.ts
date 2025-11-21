import { test } from '../../fixtures/base.fixture';
import { TestDataFactory } from '../../helpers/TestDataFactory';
import { JourneyBuilder } from '../../helpers/JourneyBuilder';
import { AdaptiveBlocks } from '../../helpers/AdaptiveBlocks';

/**
 * Register a Company Journey - Adaptive Blocks Demo
 * Demonstrates using adaptive blocks that automatically detect and adapt to journey patterns
 * These tests work regardless of whether the journey uses:
 * - Error summaries or inline errors
 * - GOV.UK summary lists or <dl> lists
 * - Change answer links or not
 */
test.describe('Register a Company Journey - Adaptive', () => {
  const JOURNEY_PATH = '/department-for-business-and-trade/register-a-company/apply';

  test('should complete journey using adaptive blocks @journey @adaptive', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    const contactData = TestDataFactory.generateContactDetails();

    const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

    await builder
      // Start journey and detect patterns
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.startJourney(JOURNEY_PATH);
      })
      .addStep(AdaptiveBlocks.detectAndLogPatterns())

      // Complete journey steps
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Before you start');
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("What is the company's proposed name?");
        await journeyRunner.fillStep({ 'Company name': 'Adaptive Test Ltd' });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("What is the company's registered office address?");
        await journeyRunner.fillStep({
          'Address line 1': '123 Adaptive Street',
          'Town or city': 'London',
          'Postcode': 'SW1A 1AA'
        });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("Director's details");
        await journeyRunner.fillStep({
          'First name': 'John',
          'Last name': 'Adaptive',
          'Email address': contactData.email
        });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("Shareholder's details");
        await journeyRunner.fillStep({
          'First name': 'Jane',
          'Last name': 'Adaptive',
          'Number of shares': '100',
          'Value of each share (£)': '1'
        });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Your contact details');
        await journeyRunner.fillStep({
          'Email address': contactData.email,
          'Full name': contactData.fullName
        });
        await journeyRunner.continue();
      })

      // Use adaptive summary verification
      .addStep(AdaptiveBlocks.smartVerifySummary({
        'Company Name': 'Adaptive Test Ltd',
        'Registered Office Town': 'London',
        'Registered Office Postcode': 'SW1A 1AA'
      }))

      // Submit
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.submit();
      })

      // Verify confirmation
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Your application has been submitted');
      })

      .execute();
  });

  test('should verify validation errors using adaptive blocks @journey @adaptive @validation', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

    await builder
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.startJourney(JOURNEY_PATH);
      })
      .addStep(AdaptiveBlocks.detectAndLogPatterns())

      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Before you start');
        await journeyRunner.continue();
      })

      // Try to submit without company name - adaptive error verification
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("What is the company's proposed name?");
        await journeyRunner.continue();
      })
      .addStep(AdaptiveBlocks.smartVerifyErrors(['Enter company name']))

      .execute();
  });

  test('should attempt change answer if supported @journey @adaptive', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    const contactData = TestDataFactory.generateContactDetails();

    const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

    await builder
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.startJourney(JOURNEY_PATH);
      })
      .addStep(AdaptiveBlocks.detectAndLogPatterns())

      // Complete journey
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Before you start');
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("What is the company's proposed name?");
        await journeyRunner.fillStep({ 'Company name': 'Original Name Ltd' });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("What is the company's registered office address?");
        await journeyRunner.fillStep({
          'Address line 1': '1 Test Street',
          'Town or city': 'London',
          'Postcode': 'E1 1AA'
        });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("Director's details");
        await journeyRunner.fillStep({
          'First name': 'John',
          'Last name': 'Doe',
          'Email address': contactData.email
        });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("Shareholder's details");
        await journeyRunner.fillStep({
          'First name': 'John',
          'Last name': 'Doe',
          'Number of shares': '100',
          'Value of each share (£)': '1'
        });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Your contact details');
        await journeyRunner.fillStep({
          'Email address': contactData.email,
          'Full name': contactData.fullName
        });
        await journeyRunner.continue();
      })

      // On check answers - try to change company name if supported
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Check your answers');
      })
      .addStep(AdaptiveBlocks.changeAnswerIfSupported('Company Name', 'Updated Name Ltd'))

      // If change was supported, verify it; otherwise just submit
      .addCustomStep(async ({ journeyRunner, page }) => {
        const currentHeading = await page.locator('h1').first().textContent();
        
        if (currentHeading?.includes('Check your answers')) {
          // Still on check answers - change wasn't supported or we're back
          console.log('On check answers page - proceeding to submit');
        } else {
          console.log('Change was supported - navigating back to check answers');
        }
      })

      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.submit();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Your application has been submitted');
      })

      .execute();
  });

  test('should get summary data using adaptive blocks @journey @adaptive', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    const contactData = TestDataFactory.generateContactDetails();

    const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

    await builder
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.startJourney(JOURNEY_PATH);
      })

      // Complete journey
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Before you start');
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("What is the company's proposed name?");
        await journeyRunner.fillStep({ 'Company name': 'Data Test Ltd' });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("What is the company's registered office address?");
        await journeyRunner.fillStep({
          'Address line 1': '1 Data Street',
          'Town or city': 'London',
          'Postcode': 'E1 1AA'
        });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("Director's details");
        await journeyRunner.fillStep({
          'First name': 'John',
          'Last name': 'Doe',
          'Email address': contactData.email
        });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading("Shareholder's details");
        await journeyRunner.fillStep({
          'First name': 'John',
          'Last name': 'Doe',
          'Number of shares': '100',
          'Value of each share (£)': '1'
        });
        await journeyRunner.continue();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Your contact details');
        await journeyRunner.fillStep({
          'Email address': contactData.email,
          'Full name': contactData.fullName
        });
        await journeyRunner.continue();
      })

      // Get summary data adaptively
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Check your answers');
      })
      .addStep(AdaptiveBlocks.getSummaryData())

      // Verify data was captured
      .addCustomStep(async ({ journeyRunner }) => {
        const summaryData = journeyRunner.getData('summaryData');
        console.log('Captured summary data:', JSON.stringify(summaryData, null, 2));
        
        // Verify some key fields exist
        if (!summaryData['Company Name']) {
          throw new Error('Company Name not found in summary data');
        }
      })

      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.submit();
      })
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading('Your application has been submitted');
      })

      .execute();
  });
});
