# Shared Component Modules

Reusable utilities for testing GOV.UK Design System components across all test types.

---

## 📦 What's Included

### **helpers.ts**
Main helper class for interacting with GOV.UK components:
- Text inputs, radios, checkboxes
- Buttons, links
- Error summaries and field errors
- Notification banners
- Accordions
- Summary lists (Check Your Answers pattern)
- Panels (Confirmation page pattern)

### **assertions.ts**
Reusable assertions for component testing:
- Visibility checks
- Value assertions
- State checks (checked, enabled, focused)
- Error message validation
- GOV.UK pattern compliance

---

## 🎯 Usage Examples

### **Component Tests**

```typescript
import { test, expect } from '@playwright/test';
import { ComponentHelper } from '../../shared/components/helpers';
import { 
  assertRadioChecked,
  assertAllOptionsVisible 
} from '../../shared/components/assertions';

test('should select radio option', async ({ page }) => {
  const components = new ComponentHelper(page);
  
  await page.goto('/apply');
  
  // Use helper to interact
  await components.selectRadio('An individual');
  
  // Use assertion to verify
  const radio = components.getRadio('An individual');
  await assertRadioChecked(radio);
});
```

### **Journey Tests**

```typescript
import { test } from '@playwright/test';
import { ComponentHelper } from '../../shared/components/helpers';
import { validHelicopterData } from '../../shared/validation/fixtures';

test('should complete journey', async ({ page }) => {
  const components = new ComponentHelper(page);
  
  await page.goto('/apply');
  
  // Fill form using shared helper
  await components.fillTextInput('Manufacturer', validHelicopterData.helicopterMake);
  await components.fillTextInput('Model', validHelicopterData.helicopterModel);
  await components.clickButton('Continue');
  
  // Verify confirmation
  await components.verifyPanelTitle('Application complete');
});
```

### **E2E Tests**

```typescript
import { test } from '@playwright/test';
import { ComponentHelper } from '../../shared/components/helpers';
import { assertErrorSummaryContains } from '../../shared/components/assertions';

test('should show validation errors', async ({ page }) => {
  const components = new ComponentHelper(page);
  
  await page.goto('/apply');
  
  // Submit without filling
  await components.clickButton('Continue');
  
  // Verify errors using shared assertion
  const errorSummary = components.getErrorSummary();
  await assertErrorSummaryContains(errorSummary, [
    'Enter manufacturer',
    'Enter model'
  ]);
});
```

---

## 🔧 ComponentHelper API

### **Form Inputs**
```typescript
getTextInput(label: string): Locator
fillTextInput(label: string, value: string): Promise<void>

getRadio(label: string): Locator
selectRadio(label: string): Promise<void>

getCheckbox(label: string): Locator
checkCheckbox(label: string): Promise<void>
```

### **Navigation**
```typescript
getButton(name: string): Locator
clickButton(name: string): Promise<void>

getLink(name: string): Locator
```

### **Error Handling**
```typescript
getErrorSummary(): Locator
getFieldError(fieldLabel: string): Locator
verifyErrorSummary(expectedErrors: string[]): Promise<void>
verifyFieldError(fieldLabel: string, errorMessage: string): Promise<void>
```

### **GOV.UK Patterns**
```typescript
// Summary List (Check Your Answers)
getSummaryList(): Locator
verifySummaryRow(key: string, value: string): Promise<void>
clickChangeLink(key: string): Promise<void>

// Panel (Confirmation)
getPanel(): Locator
verifyPanelTitle(title: string): Promise<void>

// Accordion
getAccordionSection(heading: string): Locator
expandAccordion(heading: string): Promise<void>

// Notification Banner
getNotificationBanner(): Locator
verifyNotification(message: string): Promise<void>
```

### **Content Verification**
```typescript
verifyHeading(text: string, level?: 'h1' | 'h2' | 'h3' | 'h4'): Promise<void>
verifyText(text: string): Promise<void>
```

---

## ✅ Assertions API

### **Visibility**
```typescript
assertComponentVisible(locator: Locator): Promise<void>
assertComponentNotVisible(locator: Locator): Promise<void>
```

### **Values & State**
```typescript
assertInputValue(locator: Locator, expectedValue: string): Promise<void>
assertRadioChecked(locator: Locator): Promise<void>
assertRadioNotChecked(locator: Locator): Promise<void>
assertCheckboxChecked(locator: Locator): Promise<void>
assertButtonEnabled(locator: Locator): Promise<void>
assertButtonDisabled(locator: Locator): Promise<void>
assertComponentFocused(locator: Locator): Promise<void>
```

### **Errors**
```typescript
assertErrorSummaryContains(errorSummary: Locator, expectedErrors: string[]): Promise<void>
assertFieldHasError(fieldError: Locator, expectedMessage: string): Promise<void>
```

### **Content**
```typescript
assertComponentText(locator: Locator, expectedText: string): Promise<void>
assertComponentAttribute(locator: Locator, attribute: string, expectedValue: string): Promise<void>
assertAllOptionsVisible(container: Locator, expectedOptions: string[]): Promise<void>
```

### **GOV.UK Compliance**
```typescript
assertGovUKPattern(
  component: Locator, 
  componentType: 'button' | 'input' | 'radios' | 'checkboxes' | 'select'
): Promise<void>
```

---

## 🎯 Benefits

### **1. Consistency**
Same component interactions across all test types:
- Component tests
- Journey tests
- E2E tests
- Integration tests

### **2. Maintainability**
Update component selectors in one place:
```typescript
// Before: Duplicated across 10 tests
await page.locator('.govuk-button').click();

// After: Centralized in ComponentHelper
await components.clickButton('Continue');
```

### **3. Readability**
Tests are more readable and self-documenting:
```typescript
// Before
await page.locator('input[name="email"]').fill('test@example.com');
await page.locator('button[type="submit"]').click();

// After
await components.fillTextInput('Email address', 'test@example.com');
await components.clickButton('Continue');
```

### **4. GOV.UK Patterns**
Built-in support for GOV.UK Design System patterns:
- Error summaries
- Summary lists
- Panels
- Notification banners
- Accordions

---

## 🚀 Integration with Other Shared Modules

Component helpers work seamlessly with other shared modules:

```typescript
import { ComponentHelper } from '../../shared/components/helpers';
import { assertSuccessResponse } from '../../shared/validation/assertions';
import { validHelicopterData } from '../../shared/validation/fixtures';
import { AccessibilityHelper } from '../../shared/accessibility/helpers';

test('complete test with all shared modules', async ({ page, request }) => {
  const components = new ComponentHelper(page);
  const a11y = new AccessibilityHelper(page);
  
  // Use component helper
  await components.fillTextInput('Email', validHelicopterData.ownerEmail);
  
  // Check accessibility
  const a11yResults = await a11y.scanWCAG_AA();
  expect(a11yResults.violations).toEqual([]);
  
  // Submit and verify API
  await components.clickButton('Submit');
  const response = await request.get('/api/submissions/latest');
  const body = await response.json();
  
  // Use validation assertion
  assertSuccessResponse(body, { expectReferenceNumber: true });
});
```

---

## 📊 Test Coverage

These shared modules support testing:
- ✅ Text inputs
- ✅ Radio buttons
- ✅ Checkboxes
- ✅ Select dropdowns
- ✅ Buttons
- ✅ Links
- ✅ Error summaries
- ✅ Field errors
- ✅ Summary lists
- ✅ Panels
- ✅ Notification banners
- ✅ Accordions
- ✅ All GOV.UK Design System patterns

---

## 🎉 Summary

**Component modules are now 100% reusable across:**
- Component tests
- Journey tests
- E2E tests
- Integration tests

**Write once, use everywhere!** 🚀
