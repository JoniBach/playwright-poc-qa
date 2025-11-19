# Shared Accessibility Modules

Reusable utilities for accessibility testing across all test types using axe-core.

---

## 📦 What's Included

### **helpers.ts**
Main helper class for accessibility testing:
- WCAG 2.1 Level AA/AAA scanning
- Keyboard navigation testing
- Color contrast checks
- ARIA validation
- Form label verification
- Semantic HTML checks
- Detailed violation reporting

### **assertions.ts**
Reusable assertions for accessibility testing:
- No violations assertions
- WCAG compliance checks
- Specific rule assertions (images, forms, contrast)
- Keyboard accessibility validation
- Scan summary assertions

---

## 🎯 Usage Examples

### **Accessibility Tests**

```typescript
import { test, expect } from '@playwright/test';
import { AccessibilityHelper } from '../../shared/accessibility/helpers';
import { assertNoViolations, assertWCAG_AA_Compliant } from '../../shared/accessibility/assertions';

test('should have no accessibility violations', async ({ page }) => {
  const a11y = new AccessibilityHelper(page);
  
  await page.goto('/apply');
  const results = await a11y.scanWCAG_AA();
  
  // Use shared assertion
  assertNoViolations(results);
});
```

### **Component Tests with A11y**

```typescript
import { test } from '@playwright/test';
import { ComponentHelper } from '../../shared/components/helpers';
import { AccessibilityHelper } from '../../shared/accessibility/helpers';
import { assertNoViolations } from '../../shared/accessibility/assertions';

test('component should be accessible', async ({ page }) => {
  const components = new ComponentHelper(page);
  const a11y = new AccessibilityHelper(page);
  
  await page.goto('/apply');
  await components.fillTextInput('Email', 'test@example.com');
  
  // Check accessibility
  const results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
});
```

### **E2E Tests with A11y**

```typescript
import { test } from '@playwright/test';
import { ComponentHelper } from '../../shared/components/helpers';
import { AccessibilityHelper } from '../../shared/accessibility/helpers';
import { assertNoViolations } from '../../shared/accessibility/assertions';
import { validHelicopterData } from '../../shared/validation/fixtures';

test('full journey should be accessible', async ({ page }) => {
  const components = new ComponentHelper(page);
  const a11y = new AccessibilityHelper(page);
  
  await page.goto('/apply');
  
  // Fill form
  await components.fillTextInput('Email', validHelicopterData.ownerEmail);
  
  // Check accessibility at each step
  let results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
  
  await components.clickButton('Continue');
  
  // Check next page
  results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
});
```

---

## 🔧 AccessibilityHelper API

### **Scanning Methods**
```typescript
scanPage(options?: { includeTags, excludeTags, rules }): Promise<AxeResults>
scanWCAG_AA(): Promise<AxeResults>
scanWCAG_AAA(): Promise<AxeResults>
checkColorContrast(): Promise<AxeResults>
verifyARIA(): Promise<AxeResults>
checkFormLabels(): Promise<AxeResults>
checkKeyboardTraps(): Promise<AxeResults>
checkSemanticHTML(): Promise<AxeResults>
```

### **Testing Methods**
```typescript
testKeyboardNavigation(expectedFocusableElements: number): Promise<string[]>
testSkipLink(): Promise<boolean>
getFocusableElements(): Promise<Array<{tag, text, ariaLabel, role}>>
```

### **Utility Methods**
```typescript
formatViolations(violations: any[]): Array<FormattedViolation>
getScanSummary(results: any): ScanSummary
meetsWCAG_AA(): Promise<boolean>
```

---

## ✅ Assertions API

### **General Assertions**
```typescript
assertNoViolations(results: any): void
assertNoCriticalViolations(results: any): void
assertWCAG_AA_Compliant(results: any): void
assertViolationCount(results: any, expectedCount: number): void
assertNoViolation(results: any, violationId: string): void
```

### **Specific Rule Assertions**
```typescript
assertImagesHaveAltText(results: any): void
assertFormLabels(results: any): void
assertColorContrast(results: any): void
assertValidARIA(results: any): void
assertHeadingStructure(results: any): void
assertNoKeyboardTraps(results: any): void
assertSemanticHTML(results: any): void
```

### **Keyboard Assertions**
```typescript
assertKeyboardAccessible(focusableElements: string[]): void
```

### **Summary Assertions**
```typescript
assertScanSummary(summary: any, expectations: {
  maxViolations?: number;
  maxCritical?: number;
  maxSerious?: number;
  minPasses?: number;
}): void
```

---

## 🎯 Common Patterns

### **1. Basic WCAG AA Scan**
```typescript
const a11y = new AccessibilityHelper(page);
const results = await a11y.scanWCAG_AA();
assertNoViolations(results);
```

### **2. Scan with Known Issues**
```typescript
const a11y = new AccessibilityHelper(page);
const results = await a11y.scanWCAG_AA();

// Allow specific known issues
assertNoCriticalViolations(results); // Only fail on critical/serious
```

### **3. Detailed Reporting**
```typescript
const a11y = new AccessibilityHelper(page);
const results = await a11y.scanWCAG_AA();

if (results.violations.length > 0) {
  console.log('Violations:', a11y.formatViolations(results.violations));
  console.log('Summary:', a11y.getScanSummary(results));
}

assertNoViolations(results);
```

### **4. Keyboard Navigation Test**
```typescript
const a11y = new AccessibilityHelper(page);

// Test tab navigation
const focusableElements = await a11y.testKeyboardNavigation(5);
assertKeyboardAccessible(focusableElements);

// Get all focusable elements
const elements = await a11y.getFocusableElements();
console.log('Focusable elements:', elements);
```

### **5. Specific Rule Checks**
```typescript
const a11y = new AccessibilityHelper(page);

// Check only color contrast
const contrastResults = await a11y.checkColorContrast();
assertColorContrast(contrastResults);

// Check only form labels
const formResults = await a11y.checkFormLabels();
assertFormLabels(formResults);

// Check only ARIA
const ariaResults = await a11y.verifyARIA();
assertValidARIA(ariaResults);
```

---

## 🚀 Integration with Other Shared Modules

### **With Component Helpers**
```typescript
import { ComponentHelper } from '../../shared/components/helpers';
import { AccessibilityHelper } from '../../shared/accessibility/helpers';

const components = new ComponentHelper(page);
const a11y = new AccessibilityHelper(page);

await components.fillTextInput('Email', 'test@example.com');
const results = await a11y.scanWCAG_AA();
assertNoViolations(results);
```

### **With Validation Modules**
```typescript
import { AccessibilityHelper } from '../../shared/accessibility/helpers';
import { validHelicopterData } from '../../shared/validation/fixtures';

const a11y = new AccessibilityHelper(page);

// Use shared test data
await page.fill('[name="email"]', validHelicopterData.ownerEmail);

// Check accessibility
const results = await a11y.scanWCAG_AA();
assertNoViolations(results);
```

---

## 📊 WCAG Compliance Levels

### **Level A (Basic)**
```typescript
await a11y.scanPage({ includeTags: ['wcag2a', 'wcag21a'] });
```

### **Level AA (Standard)**
```typescript
await a11y.scanWCAG_AA(); // Recommended for most sites
```

### **Level AAA (Enhanced)**
```typescript
await a11y.scanWCAG_AAA(); // Strictest compliance
```

---

## 🎯 Benefits

1. ✅ **Automated WCAG testing** - Catch accessibility issues early
2. ✅ **Reusable across all test types** - Component, Journey, E2E
3. ✅ **Detailed reporting** - Know exactly what to fix
4. ✅ **Keyboard testing** - Ensure keyboard navigation works
5. ✅ **Specific rule checks** - Test individual accessibility rules
6. ✅ **Integration ready** - Works with all other shared modules

---

## 🎉 Summary

**Accessibility modules are now 100% reusable across:**
- Accessibility tests
- Component tests
- Journey tests
- E2E tests

**Write once, test everywhere!** 🚀
