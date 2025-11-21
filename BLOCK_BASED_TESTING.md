# Block-Based Journey Testing

## Overview

This document describes the modular, block-based approach to building E2E journey tests. This system allows you to compose complex journey tests from reusable, well-tested building blocks.

## Architecture

### Core Components

1. **JourneyStepBlocks** (`helpers/JourneyStepBlocks.ts`)
   - Library of reusable step blocks
   - Each block represents a common journey pattern
   - Blocks are composable and chainable

2. **JourneyBuilder** (`helpers/JourneyBuilder.ts`)
   - Fluent API for composing journey tests
   - Manages step execution and data flow
   - Supports partial execution and cloning

3. **Supporting Helpers**
   - `JourneyRunner` - Core journey navigation and interaction
   - `ComponentHelper` - GOV.UK component interactions
   - `TestDataFactory` - Test data generation

## Quick Start

### Basic Example

```typescript
import { test } from '../../fixtures/base.fixture';
import { JourneyBuilder } from '../../helpers/JourneyBuilder';
import { JourneyStepBlocks } from '../../helpers/JourneyStepBlocks';

test('complete registration journey', async ({ page, journeyRunner, componentHelper }) => {
  await new JourneyBuilder(page, journeyRunner, componentHelper)
    .addStep(JourneyStepBlocks.startJourney('/path/to/journey'))
    .addStep(JourneyStepBlocks.selectIndividualApplicant())
    .addStep(JourneyStepBlocks.fillContactDetails())
    .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
    .addStep(JourneyStepBlocks.verifyConfirmation())
    .execute();
});
```

## Available Step Blocks

### Navigation Blocks

- `startJourney(path)` - Start a journey at a specific path
- `continue()` - Click continue button
- `goBack()` - Navigate back to previous step

### Applicant Type Blocks

- `selectIndividualApplicant(heading?)` - Select individual option
- `selectOrganisationApplicant(heading?)` - Select organisation option
- `selectApplicantType(type, heading?)` - Generic applicant selection

### Form Filling Blocks

- `fillContactDetails(heading?)` - Fill contact details with auto-generated data
- `fillContactDetailsWithData(data, heading?)` - Fill with custom data
- `fillCompanyName(heading?)` - Fill company name
- `fillCompanyRegistration(heading?)` - Fill company registration details
- `fillUKAddress(heading?)` - Fill UK address
- `fillAircraftDetails(heading?)` - Fill aircraft details
- `fillFormStep(data, heading?)` - Fill custom form with provided data

### Selection Blocks

- `selectRadio(label, heading?)` - Select a radio option
- `checkCheckbox(label)` - Check a checkbox
- `acceptDeclaration(label?)` - Accept declaration checkbox
- `acceptTermsAndConditions(label?)` - Accept T&Cs

### Check Your Answers Blocks

- `checkYourAnswersAndSubmit(heading?)` - Verify and submit
- `verifyCheckYourAnswers(heading?)` - Verify without submitting
- `changeAnswer(key)` - Change an answer from summary page

### Confirmation Blocks

- `verifyConfirmation(heading?)` - Verify confirmation page
- `verifyConfirmationWithReference(heading?)` - Verify and capture reference number

### Verification Blocks

- `verifyHeading(text)` - Verify page heading
- `verifyErrorSummary(errors[])` - Verify error summary
- `verifyFieldError(field, message)` - Verify field error

### Composite Blocks

- `completeIndividualApplication(options?)` - Complete individual flow
- `completeOrganisationApplication(options?)` - Complete organisation flow

## Advanced Usage

### Using Custom Data

```typescript
const customData = {
  fullName: 'John Smith',
  email: 'john@example.com',
  phone: '07700900123'
};

await new JourneyBuilder(page, journeyRunner, componentHelper)
  .setData('contactData', customData)
  .addStep(JourneyStepBlocks.startJourney('/path'))
  .addStep(JourneyStepBlocks.fillContactDetails())
  .execute();
```

### Partial Journey Execution

```typescript
const builder = new JourneyBuilder(page, journeyRunner, componentHelper)
  .addStep(JourneyStepBlocks.startJourney('/path'))
  .addStep(JourneyStepBlocks.fillContactDetails())
  .addStep(JourneyStepBlocks.fillCompanyName())
  .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit());

// Execute only first 2 steps
await builder.executeUpTo(1);

// Verify we're on the expected page
await journeyRunner.verifyHeading('What is the company name?');
```

### Executing Step Ranges

```typescript
// Execute steps 2-4 only
await builder.executeRange(2, 4);
```

### Cloning Journeys

```typescript
// Create a base journey
const baseJourney = new JourneyBuilder(page, journeyRunner, componentHelper)
  .addStep(JourneyStepBlocks.startJourney('/path'))
  .addStep(JourneyStepBlocks.fillContactDetails());

// Clone and extend for different scenarios
const individualJourney = baseJourney.clone()
  .addStep(JourneyStepBlocks.selectIndividualApplicant())
  .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit());

const organisationJourney = baseJourney.clone()
  .addStep(JourneyStepBlocks.selectOrganisationApplicant())
  .addStep(JourneyStepBlocks.fillCompanyRegistration())
  .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit());

await individualJourney.execute();
// ... later ...
await organisationJourney.execute();
```

### Custom Step Blocks

```typescript
await new JourneyBuilder(page, journeyRunner, componentHelper)
  .addStep(JourneyStepBlocks.startJourney('/path'))
  .addCustomStep(async ({ page, journeyRunner, componentHelper }) => {
    // Custom logic here
    await page.getByText('Special button').click();
    await journeyRunner.verifyHeading('Special page');
  })
  .addStep(JourneyStepBlocks.continue())
  .execute();
```

### Using Composite Blocks

```typescript
const individualFlow = JourneyStepBlocks.completeIndividualApplication({
  applicantHeading: 'Who is applying?',
  contactHeading: 'Contact details',
  checkAnswersHeading: 'Check your answers',
  confirmationHeading: 'Application complete'
});

await new JourneyBuilder(page, journeyRunner, componentHelper)
  .addStep(JourneyStepBlocks.startJourney('/path'))
  .addStep(JourneyStepBlocks.fillAircraftDetails())
  .addSteps(individualFlow) // Add multiple steps at once
  .execute();
```

## Creating Custom Step Blocks

You can create your own reusable step blocks:

```typescript
// In your test file or a custom blocks file
import { StepBlock } from '../../helpers/JourneyStepBlocks';

const fillPassportDetails = (heading: string = 'Passport details'): StepBlock => {
  return async ({ journeyRunner, data }) => {
    await journeyRunner.verifyHeading(heading);
    
    const passportData = data?.passportData || {
      number: 'AB123456',
      issueDate: '01/01/2020',
      expiryDate: '01/01/2030'
    };
    
    await journeyRunner.fillStep({
      'Passport number': passportData.number,
      'Issue date': passportData.issueDate,
      'Expiry date': passportData.expiryDate
    });
    
    await journeyRunner.continue();
    journeyRunner.storeData('passportData', passportData);
  };
};

// Use it in your test
await new JourneyBuilder(page, journeyRunner, componentHelper)
  .addStep(fillPassportDetails())
  .execute();
```

## Data Flow

### Storing Data

Data can be stored in two ways:

1. **Via JourneyBuilder**:
```typescript
builder.setData('myKey', myValue);
```

2. **Via JourneyRunner** (inside a step):
```typescript
journeyRunner.storeData('myKey', myValue);
```

### Retrieving Data

```typescript
// From JourneyBuilder
const value = builder.getData('myKey');

// From JourneyRunner
const value = journeyRunner.getData('myKey');
```

### Auto-Synced Data Keys

The following keys are automatically synced between JourneyRunner and JourneyBuilder:
- `contactData`
- `companyData`
- `addressData`
- `aircraftData`
- `referenceNumber`

## Best Practices

### 1. Use Descriptive Headings

Always provide heading text to make tests more readable and maintainable:

```typescript
.addStep(JourneyStepBlocks.fillContactDetails('Your contact details'))
```

### 2. Group Related Steps

Use composite blocks for common flows:

```typescript
const standardFlow = JourneyStepBlocks.completeIndividualApplication();
```

### 3. Reuse Journey Builders

Create base journeys and clone them for variations:

```typescript
const baseJourney = new JourneyBuilder(...)
  .addStep(commonStep1)
  .addStep(commonStep2);

const variation1 = baseJourney.clone().addStep(specificStep1);
const variation2 = baseJourney.clone().addStep(specificStep2);
```

### 4. Use Custom Data for Edge Cases

Test edge cases with specific data:

```typescript
builder.setData('contactData', {
  fullName: 'Name with special chars: O\'Brien',
  email: 'test+tag@example.com',
  phone: '+44 (0)20 7123 4567'
});
```

### 5. Validate at Each Step

Add verification blocks to ensure journey state:

```typescript
.addStep(JourneyStepBlocks.fillContactDetails())
.addStep(JourneyStepBlocks.verifyHeading('Next expected page'))
```

## Testing Patterns

### Happy Path Test

```typescript
test('complete journey successfully', async ({ page, journeyRunner, componentHelper }) => {
  await new JourneyBuilder(page, journeyRunner, componentHelper)
    .addStep(JourneyStepBlocks.startJourney('/path'))
    .addStep(JourneyStepBlocks.fillContactDetails())
    .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
    .addStep(JourneyStepBlocks.verifyConfirmation())
    .execute();
});
```

### Validation Test

```typescript
test('validate required fields', async ({ page, journeyRunner, componentHelper }) => {
  await new JourneyBuilder(page, journeyRunner, componentHelper)
    .addStep(JourneyStepBlocks.startJourney('/path'))
    .addStep(JourneyStepBlocks.verifyHeading('Contact details'))
    .addStep(JourneyStepBlocks.continue()) // Don't fill fields
    .addStep(JourneyStepBlocks.verifyErrorSummary([
      'Enter your full name',
      'Enter your email address'
    ]))
    .execute();
});
```

### Change Answer Test

```typescript
test('change answer before submission', async ({ page, journeyRunner, componentHelper }) => {
  const builder = new JourneyBuilder(page, journeyRunner, componentHelper)
    .addStep(JourneyStepBlocks.startJourney('/path'))
    .addStep(JourneyStepBlocks.fillContactDetails())
    .addStep(JourneyStepBlocks.verifyCheckYourAnswers());
  
  await builder.execute();
  
  await componentHelper.clickChangeLink('Full name');
  await journeyRunner.fillStep({ 'Full name': 'Updated Name' });
  await journeyRunner.continue();
  await journeyRunner.submit();
});
```

### Data-Driven Test

```typescript
const testCases = [
  { type: 'individual', data: individualData },
  { type: 'organisation', data: organisationData }
];

for (const testCase of testCases) {
  test(`complete journey as ${testCase.type}`, async ({ page, journeyRunner, componentHelper }) => {
    await new JourneyBuilder(page, journeyRunner, componentHelper)
      .setData('contactData', testCase.data)
      .addStep(JourneyStepBlocks.startJourney('/path'))
      .addStep(JourneyStepBlocks.selectApplicantType(testCase.type))
      .addStep(JourneyStepBlocks.fillContactDetails())
      .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
      .execute();
  });
}
```

## Examples

See the following test files for complete examples:

- `tests/journeys/register-a-plane-blocks.spec.ts` - Aircraft registration journey
- `tests/journeys/register-a-company-blocks.spec.ts` - Company registration journey

## Migration Guide

### From Traditional Tests

**Before:**
```typescript
test('complete journey', async ({ page, journeyRunner }) => {
  await journeyRunner.startJourney('/path');
  await journeyRunner.verifyHeading('Contact details');
  await journeyRunner.fillStep({ 'Full name': 'John' });
  await journeyRunner.continue();
  await journeyRunner.verifyHeading('Check answers');
  await journeyRunner.submit();
});
```

**After:**
```typescript
test('complete journey', async ({ page, journeyRunner, componentHelper }) => {
  await new JourneyBuilder(page, journeyRunner, componentHelper)
    .addStep(JourneyStepBlocks.startJourney('/path'))
    .addStep(JourneyStepBlocks.fillContactDetails('Contact details'))
    .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit('Check answers'))
    .execute();
});
```

## Benefits

1. **Reusability** - Write once, use everywhere
2. **Maintainability** - Update blocks in one place
3. **Readability** - Tests read like user stories
4. **Composability** - Mix and match blocks for different scenarios
5. **Type Safety** - Full TypeScript support
6. **Data Management** - Built-in data sharing between steps
7. **Flexibility** - Easy to extend with custom blocks

## Troubleshooting

### Step Fails at Specific Index

Use `executeUpTo()` to debug:

```typescript
await builder.executeUpTo(2); // Execute first 3 steps only
```

### Data Not Available in Step

Ensure data is set before the step that needs it:

```typescript
builder.setData('myData', value)
  .addStep(stepThatNeedsData);
```

### Heading Not Found

Check the exact heading text in your journey config:

```typescript
.addStep(JourneyStepBlocks.fillContactDetails('Your contact details'))
```

## Contributing

To add new step blocks:

1. Add the block to `helpers/JourneyStepBlocks.ts`
2. Follow the existing patterns
3. Add JSDoc comments
4. Create example tests
5. Update this documentation
