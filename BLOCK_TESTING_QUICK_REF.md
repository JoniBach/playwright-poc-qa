# Block-Based Testing - Quick Reference

## 🚀 Quick Start

```typescript
import { test } from '../../fixtures/base.fixture';
import { JourneyBuilder } from '../../helpers/JourneyBuilder';
import { JourneyStepBlocks } from '../../helpers/JourneyStepBlocks';

test('my journey test', async ({ page, journeyRunner, componentHelper }) => {
  await new JourneyBuilder(page, journeyRunner, componentHelper)
    .addStep(JourneyStepBlocks.startJourney('/path'))
    .addStep(JourneyStepBlocks.fillContactDetails())
    .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
    .execute();
});
```

## 📚 Common Blocks Cheat Sheet

### Navigation
```typescript
.addStep(JourneyStepBlocks.startJourney('/path'))
.addStep(JourneyStepBlocks.continue())
.addStep(JourneyStepBlocks.goBack())
```

### Applicant Selection
```typescript
.addStep(JourneyStepBlocks.selectIndividualApplicant())
.addStep(JourneyStepBlocks.selectOrganisationApplicant())
.addStep(JourneyStepBlocks.selectApplicantType('Individual'))
```

### Form Filling
```typescript
.addStep(JourneyStepBlocks.fillContactDetails())
.addStep(JourneyStepBlocks.fillCompanyName())
.addStep(JourneyStepBlocks.fillUKAddress())
.addStep(JourneyStepBlocks.fillAircraftDetails())
.addStep(JourneyStepBlocks.fillFormStep({ 'Field': 'Value' }))
```

### Check & Submit
```typescript
.addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
.addStep(JourneyStepBlocks.verifyCheckYourAnswers())
.addStep(JourneyStepBlocks.changeAnswer('Field name'))
```

### Confirmation
```typescript
.addStep(JourneyStepBlocks.verifyConfirmation())
.addStep(JourneyStepBlocks.verifyConfirmationWithReference())
```

### Validation
```typescript
.addStep(JourneyStepBlocks.verifyErrorSummary(['Error 1', 'Error 2']))
.addStep(JourneyStepBlocks.verifyFieldError('field', 'message'))
```

## 🎨 GOV.UK Pattern Blocks

```typescript
import { GovUKPatternBlocks } from '../../helpers/GovUKPatternBlocks';

// Start page
.addStep(GovUKPatternBlocks.startPage('Before you start'))

// Questions
.addStep(GovUKPatternBlocks.yesNoQuestion('Question?', 'Yes'))
.addStep(GovUKPatternBlocks.multipleChoice('Choose one', 'Option 1'))

// Date input
.addStep(GovUKPatternBlocks.dateInput('Date?', { day: '15', month: '06', year: '2020' }))

// Checkboxes
.addStep(GovUKPatternBlocks.checkboxList('Select all', ['Option 1', 'Option 2']))

// Form page
.addStep(GovUKPatternBlocks.completeFormPage('Heading', { 'Field': 'Value' }))

// Summary verification
.addStep(GovUKPatternBlocks.verifySummaryRows({ 'Key': 'Value' }))
```

## 💾 Working with Data

### Set custom data
```typescript
const builder = new JourneyBuilder(page, journeyRunner, componentHelper)
  .setData('contactData', { fullName: 'John', email: 'john@example.com' })
  .addStep(JourneyStepBlocks.fillContactDetails())
```

### Get data
```typescript
const contactData = journeyRunner.getData('contactData');
```

## 🔧 Advanced Patterns

### Partial Execution
```typescript
const builder = new JourneyBuilder(...)
  .addStep(step1)
  .addStep(step2)
  .addStep(step3);

await builder.executeUpTo(1); // Execute first 2 steps only
await builder.executeRange(2, 3); // Execute steps 3-4 only
```

### Cloning
```typescript
const base = new JourneyBuilder(...).addStep(commonStep);
const variation1 = base.clone().addStep(specificStep1);
const variation2 = base.clone().addStep(specificStep2);
```

### Custom Steps
```typescript
.addCustomStep(async ({ page, journeyRunner, componentHelper }) => {
  // Your custom logic
})
```

### Composite Blocks
```typescript
const flow = JourneyStepBlocks.completeIndividualApplication();
builder.addSteps(flow); // Add multiple steps at once
```

## 📋 Complete Example

```typescript
test('register company', async ({ page, journeyRunner, componentHelper }) => {
  await new JourneyBuilder(page, journeyRunner, componentHelper)
    // Start
    .addStep(JourneyStepBlocks.startJourney('/companies-house/register'))
    .addStep(GovUKPatternBlocks.startPage('Before you start'))
    
    // Fill details
    .addStep(JourneyStepBlocks.fillCompanyName())
    .addStep(JourneyStepBlocks.fillUKAddress())
    .addStep(JourneyStepBlocks.fillContactDetails())
    
    // Submit
    .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
    .addStep(JourneyStepBlocks.verifyConfirmationWithReference())
    .execute();
});
```

## 🧪 Testing Patterns

### Happy Path
```typescript
.addStep(JourneyStepBlocks.startJourney('/path'))
.addStep(JourneyStepBlocks.fillContactDetails())
.addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
.addStep(JourneyStepBlocks.verifyConfirmation())
```

### Validation
```typescript
.addStep(JourneyStepBlocks.verifyHeading('Form'))
.addStep(JourneyStepBlocks.continue()) // Don't fill
.addStep(JourneyStepBlocks.verifyErrorSummary(['Required field']))
```

### Change Answer
```typescript
await builder.execute(); // Up to check answers
await componentHelper.clickChangeLink('Name');
await journeyRunner.fillStep({ 'Name': 'New Name' });
await journeyRunner.continue();
await journeyRunner.submit();
```

## 📁 File Locations

- **Step Blocks**: `helpers/JourneyStepBlocks.ts`
- **GOV.UK Patterns**: `helpers/GovUKPatternBlocks.ts`
- **Journey Builder**: `helpers/JourneyBuilder.ts`
- **Examples**: `tests/journeys/*-blocks.spec.ts`
- **Full Docs**: `BLOCK_BASED_TESTING.md`

## 🎯 Tips

1. **Always provide heading text** for better readability
2. **Use composite blocks** for common flows
3. **Clone builders** for journey variations
4. **Set custom data** for edge case testing
5. **Use partial execution** for debugging
6. **Verify at each step** to catch issues early

## 🆘 Common Issues

**Heading not found?**
```typescript
// Check exact heading text
.addStep(JourneyStepBlocks.fillContactDetails('Your contact details'))
```

**Data not available?**
```typescript
// Set data before the step that needs it
.setData('contactData', myData)
.addStep(JourneyStepBlocks.fillContactDetails())
```

**Step fails?**
```typescript
// Debug with partial execution
await builder.executeUpTo(2); // Stop at step 3
```
