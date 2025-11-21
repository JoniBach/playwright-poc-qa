import { test, expect } from '../../fixtures/base.fixture';
import { TestDataFactory } from '../../helpers/TestDataFactory';

/**
 * Refactored Register a Plane Journey Tests
 * Using Page Objects and Test Data Factory
 */
test.describe('Register a Plane Journey - Refactored', () => {
  const JOURNEY_PATH = '/civil-aviation-authority/register-a-plane/apply';

  test('should complete journey as individual using helpers @smoke @journey', async ({ 
    page, 
    journeyRunner 
  }) => {
    const contactData = TestDataFactory.generateContactDetails();
    const aircraftData = TestDataFactory.generateAircraftData();

    await journeyRunner.startJourney(JOURNEY_PATH);
    
    // Step 1: Applicant Type
    await journeyRunner.verifyHeading('Who is registering the aircraft?');
    await journeyRunner.selectRadio('An individual');
    await journeyRunner.continue();
    
    // Step 2: Aircraft Details
    await journeyRunner.verifyHeading('Enter aircraft details');
    await journeyRunner.fillStep({
      'Manufacturer': aircraftData.manufacturer,
      'Model': aircraftData.model,
      'Serial number': aircraftData.serialNumber
    });
    await journeyRunner.continue();
    
    // Step 3: Contact Details
    await journeyRunner.verifyHeading('Your contact details');
    await journeyRunner.fillStep({
      'Full name': contactData.fullName,
      'Email address': contactData.email,
      'Telephone number': contactData.phone
    });
    await journeyRunner.continue();
    
    // Step 4: Check Answers
    await journeyRunner.verifyHeading('Check your answers before submitting');
    await journeyRunner.submit();
    
    // Step 5: Confirmation
    await journeyRunner.verifyHeading('Application submitted');
  });

  test('should complete journey as organisation @journey', async ({ 
    page, 
    journeyRunner 
  }) => {
    const contactData = TestDataFactory.generateContactDetails();
    const aircraftData = TestDataFactory.generateAircraftData();

    await journeyRunner.startJourney(JOURNEY_PATH);
    
    await journeyRunner.verifyHeading('Who is registering the aircraft?');
    await journeyRunner.selectRadio('A company or organisation');
    await journeyRunner.continue();
    
    await journeyRunner.verifyHeading('Enter aircraft details');
    await journeyRunner.fillStep({
      'Manufacturer': aircraftData.manufacturer,
      'Model': aircraftData.model,
      'Serial number': aircraftData.serialNumber
    });
    await journeyRunner.continue();
    
    await journeyRunner.verifyHeading('Your contact details');
    await journeyRunner.fillStep({
      'Full name': contactData.fullName,
      'Email address': contactData.email,
      'Telephone number': contactData.phone
    });
    await journeyRunner.continue();
    
    await journeyRunner.verifyHeading('Check your answers before submitting');
    await journeyRunner.submit();
    
    await journeyRunner.verifyHeading('Application submitted');
  });
});
