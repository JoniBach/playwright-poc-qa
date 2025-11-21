import { test, expect } from '../../fixtures/base.fixture';
import { TestDataFactory } from '../../helpers/TestDataFactory';

/**
 * Register a Company Journey - Realistic Comprehensive Tests
 * Tests only features that actually exist in this journey
 * 
 * This journey uses:
 * - Inline field errors (no error summary)
 * - Simple <dl> description lists (no change links)
 * - No change answer functionality
 */
test.describe('Register a Company Journey - Realistic', () => {
  const JOURNEY_PATH = '/department-for-business-and-trade/register-a-company/apply';

  test.describe('Happy Path Tests', () => {
    
    test('should complete full company registration journey @smoke @journey', async ({ 
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
        'Company name': 'Acme Corporation Ltd'
      });
      await journeyRunner.continue();
      
      // Step 3: Registered office address
      await journeyRunner.verifyHeading("What is the company's registered office address?");
      await journeyRunner.fillStep({
        'Address line 1': '123 Business Park',
        'Town or city': 'London',
        'Postcode': 'SW1A 1AA'
      });
      await journeyRunner.continue();
      
      // Step 4: Director details
      await journeyRunner.verifyHeading("Director's details");
      await journeyRunner.fillStep({
        'First name': 'Sarah',
        'Last name': 'Johnson',
        'Email address': 'sarah.johnson@acmecorp.com'
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
      
      // Verify summary data (using <dl> structure)
      const companyName = await page.locator('dt:has-text("Company Name") + dd').textContent();
      expect(companyName?.trim()).toBe('Acme Corporation Ltd');
      
      const town = await page.locator('dt:has-text("Registered Office Town") + dd').textContent();
      expect(town?.trim()).toBe('London');
      
      await journeyRunner.submit();
      
      // Step 8: Confirmation
      await journeyRunner.verifyHeading('Your application has been submitted');
    });

    test('should complete journey with minimal required fields @journey', async ({ 
      page, 
      journeyRunner
    }) => {
      const contactData = TestDataFactory.generateContactDetails();

      await journeyRunner.startJourney(JOURNEY_PATH);
      await journeyRunner.verifyHeading('Before you start');
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's proposed name?");
      await journeyRunner.fillStep({ 'Company name': 'Minimal Company Ltd' });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's registered office address?");
      await journeyRunner.fillStep({
        'Address line 1': '1 Street',
        'Town or city': 'London',
        'Postcode': 'E1 1AA'
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("Director's details");
      await journeyRunner.fillStep({
        'First name': 'John',
        'Last name': 'Doe',
        'Email address': contactData.email
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("Shareholder's details");
      await journeyRunner.fillStep({
        'First name': 'John',
        'Last name': 'Doe',
        'Number of shares': '1',
        'Value of each share (£)': '1'
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading('Your contact details');
      await journeyRunner.fillStep({
        'Email address': contactData.email,
        'Full name': contactData.fullName
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading('Check your answers');
      await journeyRunner.submit();
      await journeyRunner.verifyHeading('Your application has been submitted');
    });
  });

  test.describe('Validation Tests - Inline Errors', () => {
    
    test('should show inline error for missing company name @journey @validation', async ({ 
      page, 
      journeyRunner
    }) => {
      await journeyRunner.startJourney(JOURNEY_PATH);
      await journeyRunner.verifyHeading('Before you start');
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's proposed name?");
      // Try to continue without filling
      await journeyRunner.continue();
      
      // Verify inline error (this journey doesn't use error summary)
      const errorText = await page.locator('text=Error:').textContent();
      expect(errorText).toContain('Error:');
      
      const errorMessage = await page.locator('p:has-text("Enter company name")').textContent();
      expect(errorMessage).toContain('Enter company name');
    });

    test('should show inline errors for missing address fields @journey @validation', async ({ 
      page, 
      journeyRunner
    }) => {
      await journeyRunner.startJourney(JOURNEY_PATH);
      await journeyRunner.verifyHeading('Before you start');
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's proposed name?");
      await journeyRunner.fillStep({ 'Company name': 'Test Company Ltd' });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's registered office address?");
      // Try to continue without filling address
      await journeyRunner.continue();
      
      // Verify inline errors appear
      const errors = await page.locator('text=Error:').count();
      expect(errors).toBeGreaterThan(0);
    });

    test('should show inline error for missing director details @journey @validation', async ({ 
      page, 
      journeyRunner
    }) => {
      await journeyRunner.startJourney(JOURNEY_PATH);
      await journeyRunner.verifyHeading('Before you start');
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's proposed name?");
      await journeyRunner.fillStep({ 'Company name': 'Test Company Ltd' });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's registered office address?");
      await journeyRunner.fillStep({
        'Address line 1': '1 Test Street',
        'Town or city': 'London',
        'Postcode': 'E1 1AA'
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("Director's details");
      // Try to continue without filling
      await journeyRunner.continue();
      
      // Verify inline errors
      const errors = await page.locator('text=Error:').count();
      expect(errors).toBeGreaterThan(0);
    });
  });

  test.describe('Navigation Tests', () => {
    
    test('should allow navigating back through journey @journey', async ({ 
      page, 
      journeyRunner
    }) => {
      await journeyRunner.startJourney(JOURNEY_PATH);
      await journeyRunner.verifyHeading('Before you start');
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's proposed name?");
      await journeyRunner.fillStep({ 'Company name': 'Test Company Ltd' });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's registered office address?");
      await journeyRunner.fillStep({
        'Address line 1': '1 Test Street',
        'Town or city': 'London',
        'Postcode': 'E1 1AA'
      });
      await journeyRunner.continue();
      
      // Now on director details - navigate back
      await journeyRunner.verifyHeading("Director's details");
      await journeyRunner.goBack();
      
      // Should be back on address page
      await journeyRunner.verifyHeading("What is the company's registered office address?");
      
      // Verify form retains data
      const addressInput = page.getByLabel('Address line 1');
      const addressValue = await addressInput.inputValue();
      expect(addressValue).toBe('1 Test Street');
    });
  });

  test.describe('Edge Cases', () => {
    
    test('should handle special characters in company name @journey', async ({ 
      page, 
      journeyRunner
    }) => {
      const contactData = TestDataFactory.generateContactDetails();

      await journeyRunner.startJourney(JOURNEY_PATH);
      await journeyRunner.verifyHeading('Before you start');
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's proposed name?");
      await journeyRunner.fillStep({ 'Company name': "O'Brien & Sons Ltd" });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's registered office address?");
      await journeyRunner.fillStep({
        'Address line 1': '1 Test Street',
        'Town or city': 'London',
        'Postcode': 'E1 1AA'
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("Director's details");
      await journeyRunner.fillStep({
        'First name': 'John',
        'Last name': "O'Brien",
        'Email address': contactData.email
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("Shareholder's details");
      await journeyRunner.fillStep({
        'First name': 'John',
        'Last name': "O'Brien",
        'Number of shares': '100',
        'Value of each share (£)': '1'
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading('Your contact details');
      await journeyRunner.fillStep({
        'Email address': contactData.email,
        'Full name': "John O'Brien"
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading('Check your answers');
      
      // Verify special characters are preserved
      const companyName = await page.locator('dt:has-text("Company Name") + dd').textContent();
      expect(companyName?.trim()).toBe("O'Brien & Sons Ltd");
      
      await journeyRunner.submit();
      await journeyRunner.verifyHeading('Your application has been submitted');
    });

    test('should handle same person as director and shareholder @journey', async ({ 
      page, 
      journeyRunner
    }) => {
      const contactData = TestDataFactory.generateContactDetails();
      const personData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: contactData.email
      };

      await journeyRunner.startJourney(JOURNEY_PATH);
      await journeyRunner.verifyHeading('Before you start');
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's proposed name?");
      await journeyRunner.fillStep({ 'Company name': 'Smith Enterprises Ltd' });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading("What is the company's registered office address?");
      await journeyRunner.fillStep({
        'Address line 1': '1 Test Street',
        'Town or city': 'London',
        'Postcode': 'E1 1AA'
      });
      await journeyRunner.continue();
      
      // Same person as director
      await journeyRunner.verifyHeading("Director's details");
      await journeyRunner.fillStep({
        'First name': personData.firstName,
        'Last name': personData.lastName,
        'Email address': personData.email
      });
      await journeyRunner.continue();
      
      // Same person as shareholder
      await journeyRunner.verifyHeading("Shareholder's details");
      await journeyRunner.fillStep({
        'First name': personData.firstName,
        'Last name': personData.lastName,
        'Number of shares': '100',
        'Value of each share (£)': '1'
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading('Your contact details');
      await journeyRunner.fillStep({
        'Email address': contactData.email,
        'Full name': `${personData.firstName} ${personData.lastName}`
      });
      await journeyRunner.continue();
      
      await journeyRunner.verifyHeading('Check your answers');
      await journeyRunner.submit();
      await journeyRunner.verifyHeading('Your application has been submitted');
    });
  });
});
