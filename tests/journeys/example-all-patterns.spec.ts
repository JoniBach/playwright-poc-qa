import { test, expect } from '../../fixtures/base.fixture';
import { JourneyBuilder } from '../../helpers/JourneyBuilder';
import { JourneyStepBlocks } from '../../helpers/JourneyStepBlocks';
import { GovUKPatternBlocks } from '../../helpers/GovUKPatternBlocks';
import { TestDataFactory } from '../../helpers/TestDataFactory';

/**
 * Comprehensive Example - All Pattern Blocks
 * Demonstrates using all available block types to compose E2E tests
 */
test.describe('Example: All Pattern Blocks', () => {
  
  test.skip('example: using basic journey blocks', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    // This example shows the basic journey blocks
    await new JourneyBuilder(page, journeyRunner, componentHelper)
      // Navigation
      .addStep(JourneyStepBlocks.startJourney('/example/journey'))
      
      // Applicant type selection
      .addStep(JourneyStepBlocks.selectIndividualApplicant('Who is applying?'))
      
      // Form filling
      .addStep(JourneyStepBlocks.fillContactDetails('Your contact details'))
      .addStep(JourneyStepBlocks.fillUKAddress('Your address'))
      
      // Check and submit
      .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
      .addStep(JourneyStepBlocks.verifyConfirmation('Application submitted'))
      .execute();
  });

  test.skip('example: using GOV.UK pattern blocks', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    // This example shows GOV.UK Design System pattern blocks
    await new JourneyBuilder(page, journeyRunner, componentHelper)
      // Start page pattern
      .addStep(GovUKPatternBlocks.startPage('Apply for a service'))
      
      // Question page patterns
      .addStep(GovUKPatternBlocks.yesNoQuestion('Do you live in the UK?', 'Yes'))
      .addStep(GovUKPatternBlocks.multipleChoice('What type of application?', 'New application'))
      
      // Date input pattern
      .addStep(GovUKPatternBlocks.dateInput('When did you move to the UK?', {
        day: '15',
        month: '06',
        year: '2020'
      }))
      
      // Checkbox list pattern
      .addStep(GovUKPatternBlocks.checkboxList('Select all that apply', [
        'Option 1',
        'Option 2'
      ]))
      
      // Form page pattern
      .addStep(GovUKPatternBlocks.completeFormPage('Your details', {
        'Full name': 'John Smith',
        'Email': 'john@example.com'
      }))
      
      // Verify summary rows
      .addStep(GovUKPatternBlocks.verifySummaryRows({
        'Full name': 'John Smith',
        'Email': 'john@example.com',
        'Lives in UK': 'Yes'
      }))
      
      .addStep(JourneyStepBlocks.submit())
      .addStep(GovUKPatternBlocks.verifyConfirmationPage('Application complete'))
      .execute();
  });

  test.skip('example: using custom data', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    // Generate custom test data
    const customData = {
      contactData: {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '07700900456'
      },
      companyData: {
        name: 'Example Ltd',
        registrationNumber: 'EX123456'
      }
    };

    await new JourneyBuilder(page, journeyRunner, componentHelper)
      .setData('contactData', customData.contactData)
      .setData('companyData', customData.companyData)
      .addStep(JourneyStepBlocks.startJourney('/example/journey'))
      .addStep(JourneyStepBlocks.fillContactDetails())
      .addStep(JourneyStepBlocks.fillCompanyName())
      .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
      .execute();

    // Verify data was stored
    const storedContact = journeyRunner.getData('contactData');
    expect(storedContact.fullName).toBe('Jane Doe');
  });

  test.skip('example: validation testing', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    await new JourneyBuilder(page, journeyRunner, componentHelper)
      .addStep(JourneyStepBlocks.startJourney('/example/journey'))
      .addStep(JourneyStepBlocks.verifyHeading('Contact details'))
      
      // Try to continue without filling required fields
      .addStep(JourneyStepBlocks.continue())
      
      // Verify validation errors
      .addStep(JourneyStepBlocks.verifyErrorSummary([
        'Enter your full name',
        'Enter your email address',
        'Enter your phone number'
      ]))
      
      // Verify individual field errors
      .addStep(JourneyStepBlocks.verifyFieldError('full-name', 'Enter your full name'))
      .execute();
  });

  test.skip('example: changing answers', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    const builder = new JourneyBuilder(page, journeyRunner, componentHelper)
      .addStep(JourneyStepBlocks.startJourney('/example/journey'))
      .addStep(JourneyStepBlocks.fillContactDetails('Contact details'))
      .addStep(JourneyStepBlocks.fillCompanyName('Company name'))
      .addStep(JourneyStepBlocks.verifyCheckYourAnswers());

    await builder.execute();

    // Change multiple answers
    await GovUKPatternBlocks.changeAnswers({
      'Full name': 'Updated Name',
      'Company name': 'Updated Company Ltd'
    })({ page, journeyRunner, componentHelper });

    // Verify changes
    await componentHelper.verifySummaryRow('Full name', 'Updated Name');
    await componentHelper.verifySummaryRow('Company name', 'Updated Company Ltd');

    // Submit
    await journeyRunner.submit();
  });

  test.skip('example: partial journey execution', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    const builder = new JourneyBuilder(page, journeyRunner, componentHelper)
      .addStep(JourneyStepBlocks.startJourney('/example/journey'))
      .addStep(JourneyStepBlocks.fillContactDetails())
      .addStep(JourneyStepBlocks.fillCompanyName())
      .addStep(JourneyStepBlocks.fillUKAddress())
      .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit());

    // Execute only first 3 steps
    await builder.executeUpTo(2);
    
    // Verify we stopped at the right place
    await journeyRunner.verifyHeading('Your address');
    
    // Continue from where we left off
    await builder.executeRange(3, 4);
  });

  test.skip('example: cloning journeys for variations', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    // Create a base journey
    const baseJourney = new JourneyBuilder(page, journeyRunner, componentHelper)
      .addStep(JourneyStepBlocks.startJourney('/example/journey'))
      .addStep(JourneyStepBlocks.fillContactDetails());

    // Clone for individual applicant
    const individualJourney = baseJourney.clone()
      .addStep(JourneyStepBlocks.selectIndividualApplicant())
      .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit());

    // Clone for organisation applicant
    const organisationJourney = baseJourney.clone()
      .addStep(JourneyStepBlocks.selectOrganisationApplicant())
      .addStep(JourneyStepBlocks.fillCompanyRegistration())
      .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit());

    // Execute individual journey
    await individualJourney.execute();
  });

  test.skip('example: composite blocks', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    // Use composite blocks that combine multiple steps
    const individualFlow = JourneyStepBlocks.completeIndividualApplication({
      applicantHeading: 'Who is applying?',
      contactHeading: 'Your contact details',
      checkAnswersHeading: 'Check your answers',
      confirmationHeading: 'Application complete'
    });

    await new JourneyBuilder(page, journeyRunner, componentHelper)
      .addStep(JourneyStepBlocks.startJourney('/example/journey'))
      .addStep(JourneyStepBlocks.fillCompanyName())
      .addSteps(individualFlow) // Add multiple steps at once
      .execute();
  });

  test.skip('example: custom step blocks', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    await new JourneyBuilder(page, journeyRunner, componentHelper)
      .addStep(JourneyStepBlocks.startJourney('/example/journey'))
      
      // Add a custom step inline
      .addCustomStep(async ({ page, journeyRunner }) => {
        await journeyRunner.verifyHeading('Special page');
        await page.getByText('Special button').click();
        await page.waitForTimeout(1000); // Custom wait
      })
      
      .addStep(JourneyStepBlocks.continue())
      .execute();
  });

  test.skip('example: GOV.UK component patterns', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    await new JourneyBuilder(page, journeyRunner, componentHelper)
      .addStep(JourneyStepBlocks.startJourney('/example/journey'))
      
      // Accordion pattern
      .addStep(GovUKPatternBlocks.expandAccordionAndVerify(
        'More information',
        'This is the expanded content'
      ))
      
      // Warning text pattern
      .addStep(GovUKPatternBlocks.verifyWarning('Important warning message'))
      
      // Inset text pattern
      .addStep(GovUKPatternBlocks.verifyInsetText('Important information'))
      
      // Details (disclosure) pattern
      .addStep(GovUKPatternBlocks.expandDetailsAndVerify(
        'Help with this question',
        'Here is some helpful information'
      ))
      
      // Notification banner pattern
      .addStep(GovUKPatternBlocks.verifySuccessNotification('Success message'))
      
      .execute();
  });

  test.skip('example: data-driven testing', async ({ 
    page, 
    journeyRunner,
    componentHelper
  }) => {
    const testCases = [
      { 
        type: 'individual', 
        data: TestDataFactory.generateContactDetails(),
        expectedHeading: 'Individual confirmation'
      },
      { 
        type: 'organisation', 
        data: TestDataFactory.generateCompanyData(),
        expectedHeading: 'Organisation confirmation'
      }
    ];

    for (const testCase of testCases) {
      await new JourneyBuilder(page, journeyRunner, componentHelper)
        .setData('contactData', testCase.data)
        .addStep(JourneyStepBlocks.startJourney('/example/journey'))
        .addStep(JourneyStepBlocks.selectApplicantType(testCase.type))
        .addStep(JourneyStepBlocks.fillContactDetails())
        .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
        .addStep(JourneyStepBlocks.verifyHeading(testCase.expectedHeading))
        .execute();
    }
  });
});
