import { test, expect } from '../../fixtures/base.fixture';
import { TestDataFactory } from '../../helpers/TestDataFactory';

/**
 * Register a Company Journey - Simple Working Test
 * Based on proven register-a-plane pattern
 */
test.describe('Register a Company Journey', () => {
  const JOURNEY_PATH = '/department-for-business-and-trade/register-a-company/apply';

  test('should complete company registration journey @smoke @journey', async ({ 
    page, 
    journeyRunner
  }) => {
    const contactData = TestDataFactory.generateContactDetails();

    await journeyRunner.startJourney(JOURNEY_PATH);
    
    // Step 1: Before you start
    await journeyRunner.verifyHeading('Before you start');
    await journeyRunner.continue();
    
    // Step 2: Company name
    await journeyRunner.verifyHeading("What is the company's proposed name?");
    await journeyRunner.fillStep({
      'Company name': 'Test Company Ltd'
    });
    await journeyRunner.continue();
    
    // Step 3: Registered office address
    await journeyRunner.verifyHeading("What is the company's registered office address?");
    await journeyRunner.fillStep({
      'Address line 1': '123 Business Street',
      'Town or city': 'London',
      'Postcode': 'SW1A 1AA'
    });
    await journeyRunner.continue();
    
    // Step 4: Director details
    await journeyRunner.verifyHeading("Director's details");
    await journeyRunner.fillStep({
      'First name': 'John',
      'Last name': 'Smith',
      'Email address': contactData.email
    });
    await journeyRunner.continue();
    
    // Step 5: Shareholder details
    await journeyRunner.verifyHeading("Shareholder's details");
    await journeyRunner.fillStep({
      'First name': 'John',
      'Last name': 'Smith',
      'Number of shares': '100',
      'Value of each share (£)': '1'
    });
    await journeyRunner.continue();
    
    // Step 6: Contact details
    await journeyRunner.verifyHeading('Your contact details');
    await journeyRunner.fillStep({
      'Email address': contactData.email,
      'Full name': contactData.fullName
    });
    await journeyRunner.continue();
    
    // Step 7: Check answers
    await journeyRunner.verifyHeading('Check your answers');
    await journeyRunner.submit();
    
    // Step 8: Confirmation
    await journeyRunner.verifyHeading('Your application has been submitted');
  });
});
