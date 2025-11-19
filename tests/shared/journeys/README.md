# Shared Journey Modules

Reusable utilities for testing multi-step user journeys across all test types.

---

## 📦 What's Included

### **runner.ts**
Main journey automation helper:
- Start and navigate journeys
- Fill forms and select options
- Submit and verify completion
- Handle errors and validation
- Store and retrieve journey data
- Take screenshots

### **steps.ts**
Reusable journey step patterns:
- Common form steps (contact details, address, etc.)
- Helicopter/plane registration steps
- Review and submit steps
- Change field steps
- Validation error handling

### **assertions.ts**
Journey-specific assertions:
- Step verification
- Completion verification
- Error validation
- Summary data checks
- Navigation checks

---

## 🎯 Usage Examples

### **Basic Journey Test**

```typescript
import { test } from '@playwright/test';
import { JourneyRunner } from '../../shared/journeys/runner';
import { assertJourneyComplete } from '../../shared/journeys/assertions';

test('should complete helicopter registration', async ({ page }) => {
  const journey = new JourneyRunner(page);
  
  // Start journey
  await journey.start('/civil-aviation-authority/register-a-helicopter/apply');
  
  // Fill steps
  await journey.fillAndContinue({
    'Manufacturer': 'Airbus',
    'Model': 'H125'
  });
  
  await journey.fillAndContinue({
    'Full name': 'John Smith',
    'Email address': 'john@example.com',
    'Telephone number': '07700900123'
  });
  
  // Submit
  await journey.submit();
  
  // Verify
  await assertJourneyComplete(page);
});
```

### **Using Journey Steps**

```typescript
import { test } from '@playwright/test';
import { JourneyRunner } from '../../shared/journeys/runner';
import { createJourneySteps } from '../../shared/journeys/steps';

test('should complete journey with reusable steps', async ({ page }) => {
  const journey = new JourneyRunner(page);
  const steps = createJourneySteps(journey, page);
  
  await journey.start('/apply');
  
  // Use reusable steps
  await steps.fillHelicopterDetails({
    make: 'Airbus',
    model: 'H125',
    serial: 'ABC123'
  });
  
  await steps.fillOwnerDetails({
    fullName: 'John Smith',
    email: 'john@example.com',
    phone: '07700900123'
  });
  
  await steps.reviewAndSubmit();
  await steps.verifySubmissionSuccess();
});
```

### **With Shared Test Data**

```typescript
import { test } from '@playwright/test';
import { JourneyRunner } from '../../shared/journeys/runner';
import { validHelicopterData } from '../../shared/validation/fixtures';
import { assertJourneyComplete } from '../../shared/journeys/assertions';

test('should complete journey with shared data', async ({ page }) => {
  const journey = new JourneyRunner(page);
  
  await journey.start('/civil-aviation-authority/register-a-helicopter/apply');
  
  // Use shared test data
  await journey.fillAndContinue({
    'Manufacturer': validHelicopterData.helicopterMake,
    'Model': validHelicopterData.helicopterModel
  });
  
  await journey.fillAndContinue({
    'Full name': validHelicopterData.ownerFullName,
    'Email address': validHelicopterData.ownerEmail,
    'Telephone number': validHelicopterData.ownerPhone
  });
  
  await journey.submit();
  await assertJourneyComplete(page);
});
```

### **With Validation Testing**

```typescript
import { test } from '@playwright/test';
import { JourneyRunner } from '../../shared/journeys/runner';
import { assertValidationErrors } from '../../shared/journeys/assertions';

test('should show validation errors', async ({ page }) => {
  const journey = new JourneyRunner(page);
  
  await journey.start('/apply');
  
  // Submit without filling
  await journey.continue();
  
  // Verify errors
  await assertValidationErrors(page, [
    'Enter manufacturer',
    'Enter model'
  ]);
});
```

### **Complete Integration Example**

```typescript
import { test } from '@playwright/test';
import { JourneyRunner } from '../../shared/journeys/runner';
import { createJourneySteps } from '../../shared/journeys/steps';
import { ComponentHelper } from '../../shared/components/helpers';
import { AccessibilityHelper } from '../../shared/accessibility/helpers';
import { assertNoViolations } from '../../shared/accessibility/assertions';
import { validHelicopterData } from '../../shared/validation/fixtures';

test('complete journey with all validations', async ({ page }) => {
  const journey = new JourneyRunner(page);
  const steps = createJourneySteps(journey, page);
  const components = new ComponentHelper(page);
  const a11y = new AccessibilityHelper(page);
  
  // Start journey
  await journey.start('/civil-aviation-authority/register-a-helicopter/apply');
  
  // Check accessibility
  let results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
  
  // Fill helicopter details
  await steps.fillHelicopterDetails({
    make: validHelicopterData.helicopterMake,
    model: validHelicopterData.helicopterModel
  });
  
  // Check accessibility again
  results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
  
  // Fill owner details
  await steps.fillOwnerDetails({
    fullName: validHelicopterData.ownerFullName,
    email: validHelicopterData.ownerEmail,
    phone: validHelicopterData.ownerPhone
  });
  
  // Verify summary
  await steps.verifySummaryRows({
    'Manufacturer': validHelicopterData.helicopterMake,
    'Model': validHelicopterData.helicopterModel,
    'Full name': validHelicopterData.ownerFullName
  });
  
  // Submit and verify
  await steps.reviewAndSubmit();
  await steps.verifySubmissionSuccess();
  
  // Get reference number
  const refNumber = await journey.getReferenceNumber();
  expect(refNumber).toMatch(/^APP-[A-Z0-9]+-[A-Z0-9]+$/);
});
```

---

## 🔧 JourneyRunner API

### **Navigation**
```typescript
start(journeyPath: string): Promise<void>
continue(): Promise<void>
submit(): Promise<void>
goBack(): Promise<void>
clickChange(fieldLabel: string): Promise<void>
```

### **Form Filling**
```typescript
fillStep(data: Record<string, string>): Promise<void>
fillAndContinue(data: Record<string, string>): Promise<void>
selectRadio(label: string): Promise<void>
selectRadioAndContinue(label: string): Promise<void>
checkCheckbox(label: string): Promise<void>
autofill(): Promise<void>
```

### **Verification**
```typescript
verifyHeading(headingText: string): Promise<void>
assertOnStep(headingText: string): Promise<void>
verifyText(text: string): Promise<void>
verifySummaryRow(key: string, value: string): Promise<void>
verifyErrorSummary(expectedErrors?: string[]): Promise<void>
verifyFieldError(fieldLabel: string, errorMessage: string): Promise<void>
verifyConfirmation(expectedTitle?: string): Promise<void>
```

### **Data Management**
```typescript
storeData(key: string, value: any): void
getData(key: string): any
getAllData(): Record<string, any>
getValidationErrors(): Promise<Record<string, string>>
getReferenceNumber(): Promise<string | null>
```

### **Utilities**
```typescript
getCurrentStep(): number
getJourneyPath(): string
waitForNavigation(): Promise<void>
waitFor(selector: string, timeout?: number): Promise<void>
screenshot(name: string): Promise<void>
completeJourney(journeyData: Record<string, Record<string, string>>): Promise<void>
```

---

## ✅ JourneySteps API

### **Common Steps**
```typescript
selectApplicantType(type: 'individual' | 'organisation'): Promise<void>
fillContactDetails(data: {fullName, email, phone}): Promise<void>
fillAddress(data: {addressLine1, addressLine2?, town, postcode}): Promise<void>
fillFormStep(fields: Record<string, string>): Promise<void>
```

### **Specific Steps**
```typescript
fillHelicopterDetails(data: {make, model, serial?}): Promise<void>
fillPlaneDetails(data: {make, model, registration?}): Promise<void>
fillOwnerDetails(data: {fullName, email, phone}): Promise<void>
```

### **Review & Submit**
```typescript
reviewAndSubmit(): Promise<void>
verifySubmissionSuccess(expectedTitle?: string): Promise<void>
verifySummaryRows(expectedData: Record<string, string>): Promise<void>
```

### **Utilities**
```typescript
changeField(fieldLabel: string, newValue: string): Promise<void>
expectValidationErrors(expectedErrors: string[]): Promise<void>
useAutofill(): Promise<void>
```

---

## 📊 Journey Assertions API

### **Step Verification**
```typescript
assertOnStep(page: Page, expectedHeading: string): Promise<void>
assertStepCount(currentStep: number, expectedStep: number): void
```

### **Completion**
```typescript
assertJourneyComplete(page: Page, expectedTitle?: string): Promise<void>
assertReferenceNumberDisplayed(page: Page): Promise<void>
assertConfirmationMessage(page: Page, expectedMessage: string): Promise<void>
```

### **Validation**
```typescript
assertValidationErrors(page: Page, expectedErrors: string[]): Promise<void>
assertFieldError(page: Page, fieldName: string, errorMessage: string): Promise<void>
assertNoErrors(page: Page): Promise<void>
```

### **Summary**
```typescript
assertSummaryData(page: Page, expectedData: Record<string, string>): Promise<void>
assertAtCheckYourAnswers(page: Page): Promise<void>
assertChangeLinksVisible(page: Page, fieldLabels: string[]): Promise<void>
```

### **Navigation**
```typescript
assertCanNavigateBack(page: Page): Promise<void>
assertContinueButtonVisible(page: Page): Promise<void>
```

### **Data**
```typescript
assertJourneyData(storedData: Record<string, any>, expectedData: Record<string, any>): void
assertRequiredFields(page: Page, fieldLabels: string[]): Promise<void>
```

---

## 🎯 Benefits

1. ✅ **Journey automation** - Complete multi-step journeys easily
2. ✅ **Reusable steps** - Common patterns pre-built
3. ✅ **Data management** - Store and verify journey data
4. ✅ **Error handling** - Built-in validation error checking
5. ✅ **Integration ready** - Works with all other shared modules
6. ✅ **Screenshot support** - Debug failing tests easily

---

## 🚀 Integration with Other Shared Modules

Journey modules work seamlessly with all other shared modules:

```typescript
// All modules together
import { JourneyRunner } from '../../shared/journeys/runner';
import { ComponentHelper } from '../../shared/components/helpers';
import { AccessibilityHelper } from '../../shared/accessibility/helpers';
import { validHelicopterData } from '../../shared/validation/fixtures';
import { assertSuccessResponse } from '../../shared/validation/assertions';

// Use them all together!
const journey = new JourneyRunner(page);
const components = new ComponentHelper(page);
const a11y = new AccessibilityHelper(page);
```

---

## 🎉 Summary

**Journey modules are now 100% reusable across:**
- Journey tests
- E2E tests
- Integration tests
- Smoke tests

**Write once, test everywhere!** 🚀
