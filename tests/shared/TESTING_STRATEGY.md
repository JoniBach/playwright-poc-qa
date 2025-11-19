# Complete Testing Strategy Guide

Comprehensive guide to testing with the modular, reusable test architecture.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Test Types](#test-types)
3. [Shared Modules](#shared-modules)
4. [When to Use Each Test Type](#when-to-use-each-test-type)
5. [Integration Patterns](#integration-patterns)
6. [Best Practices](#best-practices)
7. [Example Test Patterns](#example-test-patterns)
8. [Quick Reference](#quick-reference)

---

## 🎯 Overview

This testing architecture provides **100% reusable modules** across all test types:

```
tests/
├── shared/                    # ✅ Reusable modules (100%)
│   ├── validation/           # Schemas, assertions, fixtures
│   ├── components/           # GOV.UK component helpers
│   ├── accessibility/        # A11y testing utilities
│   ├── api/                  # API mocking
│   ├── journeys/             # Journey automation
│   └── index.ts              # Unified exports
│
├── api/                      # API tests (fast, isolated)
├── components/               # Component tests (UI elements)
├── accessibility/            # A11y tests (WCAG compliance)
├── journeys/                 # Journey tests (multi-step flows)
└── e2e/                      # E2E tests (full integration)
```

---

## 🧪 Test Types

### **1. API Tests** ⚡ (Fastest)
- **Purpose**: Test server-side validation and business logic
- **Speed**: ~1-2 seconds for 33 tests
- **Coverage**: Validation rules, error messages, success responses
- **When**: Testing backend logic without UI

```typescript
import { assertValidationError, validHelicopterData } from '../shared';

test('should validate email', async ({ request }) => {
  const response = await request.post('/apply', {
    multipart: { ...validHelicopterData, ownerEmail: 'invalid' }
  });
  
  const body = await response.json();
  assertValidationError(body, ['ownerEmail']);
});
```

### **2. Component Tests** 🧩 (Fast)
- **Purpose**: Test individual UI components in isolation
- **Speed**: ~5 seconds for 12 tests
- **Coverage**: Component behavior, interactions, states
- **When**: Testing specific UI elements

```typescript
import { ComponentHelper, assertRadioChecked } from '../shared';

test('should select radio option', async ({ page }) => {
  const components = new ComponentHelper(page);
  await page.goto('/apply');
  
  await components.selectRadio('An individual');
  const radio = components.getRadio('An individual');
  await assertRadioChecked(radio);
});
```

### **3. Accessibility Tests** ♿ (Medium)
- **Purpose**: Test WCAG 2.1 AA compliance
- **Speed**: ~12 seconds for 27 tests
- **Coverage**: A11y violations, keyboard navigation, ARIA
- **When**: Ensuring accessibility standards

```typescript
import { AccessibilityHelper, assertNoViolations } from '../shared';

test('should have no a11y violations', async ({ page }) => {
  const a11y = new AccessibilityHelper(page);
  await page.goto('/apply');
  
  const results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
});
```

### **4. Journey Tests** 🚶 (Medium)
- **Purpose**: Test multi-step user journeys
- **Speed**: ~4 seconds for 6 tests
- **Coverage**: Form flows, navigation, data persistence
- **When**: Testing complete user workflows

```typescript
import { JourneyRunner, createJourneySteps, validHelicopterData } from '../shared';

test('should complete journey', async ({ page }) => {
  const journey = new JourneyRunner(page);
  const steps = createJourneySteps(journey, page);
  
  await journey.start('/apply');
  await steps.fillHelicopterDetails(validHelicopterData);
  await steps.fillOwnerDetails(validHelicopterData);
  await steps.reviewAndSubmit();
});
```

### **5. E2E Tests** 🌐 (Slowest, Most Complete)
- **Purpose**: Test entire system integration
- **Speed**: ~10-30 seconds per test
- **Coverage**: Full user flows with real backend
- **When**: Testing critical paths end-to-end

```typescript
import { 
  JourneyRunner, 
  ComponentHelper, 
  AccessibilityHelper,
  assertNoViolations,
  assertSuccessResponse,
  validHelicopterData 
} from '../shared';

test('complete E2E test', async ({ page, request }) => {
  const journey = new JourneyRunner(page);
  const a11y = new AccessibilityHelper(page);
  
  // Journey + A11y
  await journey.start('/apply');
  const results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
  
  // Complete journey
  await journey.fillAndContinue(validHelicopterData);
  await journey.submit();
  
  // Verify API
  const response = await request.get('/api/submissions/latest');
  const body = await response.json();
  assertSuccessResponse(body, { expectReferenceNumber: true });
});
```

---

## 📦 Shared Modules

### **Validation Modules**
```typescript
import {
  // Schemas
  emailSchema,
  helicopterDataSchema,
  
  // Assertions
  assertValidationError,
  assertSuccessResponse,
  
  // Fixtures
  validHelicopterData,
  invalidEmails
} from '../shared';
```

### **Component Modules**
```typescript
import {
  // Helper
  ComponentHelper,
  
  // Assertions
  assertRadioChecked,
  assertErrorSummaryContains
} from '../shared';
```

### **Accessibility Modules**
```typescript
import {
  // Helper
  AccessibilityHelper,
  
  // Assertions
  assertNoViolations,
  assertWCAG_AA_Compliant
} from '../shared';
```

### **Journey Modules**
```typescript
import {
  // Runner
  JourneyRunner,
  
  // Steps
  createJourneySteps,
  
  // Assertions
  assertJourneyComplete,
  assertOnStep
} from '../shared';
```

### **API Modules**
```typescript
import {
  mockSuccessfulSubmission,
  mockValidationError,
  RequestCapture
} from '../shared';
```

---

## 🎯 When to Use Each Test Type

### **Use API Tests When:**
- ✅ Testing validation rules
- ✅ Testing error messages
- ✅ Testing business logic
- ✅ Need fast feedback
- ✅ Don't need UI interaction

### **Use Component Tests When:**
- ✅ Testing individual UI components
- ✅ Testing component interactions
- ✅ Testing component states
- ✅ Need isolation from full journey
- ✅ Testing GOV.UK patterns

### **Use Accessibility Tests When:**
- ✅ Ensuring WCAG compliance
- ✅ Testing keyboard navigation
- ✅ Testing screen reader support
- ✅ Testing color contrast
- ✅ Required for accessibility certification

### **Use Journey Tests When:**
- ✅ Testing multi-step flows
- ✅ Testing form navigation
- ✅ Testing data persistence across steps
- ✅ Testing Check Your Answers
- ✅ Testing journey completion

### **Use E2E Tests When:**
- ✅ Testing critical user paths
- ✅ Testing full system integration
- ✅ Testing real backend interactions
- ✅ Smoke testing before release
- ✅ Need highest confidence

---

## 🔗 Integration Patterns

### **Pattern 1: API + Validation**
```typescript
import { assertValidationError, validHelicopterData } from '../shared';

test('API validation test', async ({ request }) => {
  const response = await request.post('/apply', {
    multipart: validHelicopterData
  });
  
  const body = await response.json();
  assertSuccessResponse(body);
});
```

### **Pattern 2: Component + Accessibility**
```typescript
import { ComponentHelper, AccessibilityHelper, assertNoViolations } from '../shared';

test('accessible component test', async ({ page }) => {
  const components = new ComponentHelper(page);
  const a11y = new AccessibilityHelper(page);
  
  await components.fillTextInput('Email', 'test@example.com');
  
  const results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
});
```

### **Pattern 3: Journey + Validation + Accessibility**
```typescript
import { 
  JourneyRunner, 
  AccessibilityHelper,
  assertNoViolations,
  validHelicopterData 
} from '../shared';

test('complete journey with validations', async ({ page }) => {
  const journey = new JourneyRunner(page);
  const a11y = new AccessibilityHelper(page);
  
  await journey.start('/apply');
  
  // Check a11y at each step
  let results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
  
  await journey.fillAndContinue(validHelicopterData);
  
  results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
  
  await journey.submit();
});
```

### **Pattern 4: Full Integration (All Modules)**
```typescript
import {
  JourneyRunner,
  createJourneySteps,
  ComponentHelper,
  AccessibilityHelper,
  assertNoViolations,
  assertSuccessResponse,
  validHelicopterData
} from '../shared';

test('complete integration test', async ({ page, request }) => {
  // Initialize all helpers
  const journey = new JourneyRunner(page);
  const steps = createJourneySteps(journey, page);
  const components = new ComponentHelper(page);
  const a11y = new AccessibilityHelper(page);
  
  // Start journey
  await journey.start('/apply');
  
  // Check accessibility
  const a11yResults = await a11y.scanWCAG_AA();
  assertNoViolations(a11yResults);
  
  // Use journey steps with shared data
  await steps.fillHelicopterDetails(validHelicopterData);
  await steps.fillOwnerDetails(validHelicopterData);
  
  // Verify summary using component helper
  await components.verifySummaryRow('Manufacturer', validHelicopterData.helicopterMake);
  
  // Submit
  await steps.reviewAndSubmit();
  
  // Verify API response
  const response = await request.get('/api/submissions/latest');
  const body = await response.json();
  assertSuccessResponse(body, { expectReferenceNumber: true });
});
```

---

## ✅ Best Practices

### **1. Use Shared Modules**
```typescript
// ✅ Good - Use shared modules
import { ComponentHelper, validHelicopterData } from '../shared';

// ❌ Bad - Duplicate code
const validData = { helicopterMake: 'Airbus', ... };
```

### **2. Single Import**
```typescript
// ✅ Good - Single import
import { 
  ComponentHelper, 
  AccessibilityHelper, 
  validHelicopterData 
} from '../shared';

// ❌ Bad - Multiple imports
import { ComponentHelper } from '../shared/components/helpers';
import { AccessibilityHelper } from '../shared/accessibility/helpers';
import { validHelicopterData } from '../shared/validation/fixtures';
```

### **3. Descriptive Test Names**
```typescript
// ✅ Good
test('should show validation error when email is invalid', async ({ page }) => {

// ❌ Bad
test('test email', async ({ page }) => {
```

### **4. Use Appropriate Test Type**
```typescript
// ✅ Good - Use API test for validation
test('should validate email format', async ({ request }) => {
  // Fast API test
});

// ❌ Bad - Use E2E test for simple validation
test('should validate email format', async ({ page }) => {
  // Slow E2E test for simple validation
});
```

### **5. Combine Modules When Needed**
```typescript
// ✅ Good - Combine modules for comprehensive testing
const journey = new JourneyRunner(page);
const a11y = new AccessibilityHelper(page);

// ❌ Bad - Test in isolation when integration is needed
// Only use journey without checking accessibility
```

### **6. Use Fixtures for Test Data**
```typescript
// ✅ Good - Use shared fixtures
import { validHelicopterData } from '../shared';

// ❌ Bad - Hardcode test data
const data = { helicopterMake: 'Airbus', helicopterModel: 'H125' };
```

---

## 📝 Example Test Patterns

### **Quick API Validation Test**
```typescript
import { assertValidationError, invalidEmails } from '../shared';

test('should reject invalid email', async ({ request }) => {
  const response = await request.post('/apply', {
    multipart: { email: invalidEmails[0] }
  });
  
  const body = await response.json();
  assertValidationError(body, ['email']);
});
```

### **Component Interaction Test**
```typescript
import { ComponentHelper, assertRadioChecked } from '../shared';

test('should select and verify radio', async ({ page }) => {
  const components = new ComponentHelper(page);
  await page.goto('/apply');
  
  await components.selectRadio('An individual');
  const radio = components.getRadio('An individual');
  await assertRadioChecked(radio);
});
```

### **Accessibility Scan Test**
```typescript
import { AccessibilityHelper, assertNoViolations } from '../shared';

test('should pass WCAG AA', async ({ page }) => {
  const a11y = new AccessibilityHelper(page);
  await page.goto('/apply');
  
  const results = await a11y.scanWCAG_AA();
  assertNoViolations(results);
});
```

### **Complete Journey Test**
```typescript
import { JourneyRunner, createJourneySteps, validHelicopterData } from '../shared';

test('should complete helicopter registration', async ({ page }) => {
  const journey = new JourneyRunner(page);
  const steps = createJourneySteps(journey, page);
  
  await journey.start('/civil-aviation-authority/register-a-helicopter/apply');
  await steps.fillHelicopterDetails(validHelicopterData);
  await steps.fillOwnerDetails(validHelicopterData);
  await steps.reviewAndSubmit();
  await steps.verifySubmissionSuccess();
});
```

---

## 🚀 Quick Reference

### **Import Everything You Need**
```typescript
import {
  // Helpers
  ComponentHelper,
  AccessibilityHelper,
  JourneyRunner,
  createJourneySteps,
  
  // Assertions
  assertNoViolations,
  assertValidationError,
  assertSuccessResponse,
  assertJourneyComplete,
  
  // Fixtures
  validHelicopterData,
  validPlaneData,
  invalidEmails
} from '../shared';
```

### **Test Speed Comparison**
| Test Type | Speed | Tests | Time |
|-----------|-------|-------|------|
| API | ⚡⚡⚡ | 33 | ~1.4s |
| Component | ⚡⚡ | 12 | ~5s |
| Journey | ⚡⚡ | 6 | ~4s |
| Accessibility | ⚡ | 27 | ~12s |
| E2E | 🐌 | Variable | ~10-30s |

### **Module Coverage**
| Module | Purpose | Key Exports |
|--------|---------|-------------|
| **validation** | Data validation | schemas, assertions, fixtures |
| **components** | UI components | ComponentHelper, assertions |
| **accessibility** | A11y testing | AccessibilityHelper, assertions |
| **journeys** | Journey automation | JourneyRunner, steps, assertions |
| **api** | API mocking | mocks, interceptors |

---

## 🎯 Summary

### **Key Principles**
1. ✅ **Use shared modules** - Write once, use everywhere
2. ✅ **Choose right test type** - Fast tests for simple checks
3. ✅ **Combine when needed** - Integration for comprehensive testing
4. ✅ **Single import** - Use `tests/shared` for everything
5. ✅ **Reuse fixtures** - Consistent test data

### **Testing Pyramid**
```
        /\
       /E2E\        ← Few, slow, high confidence
      /------\
     /Journey\      ← Some, medium speed
    /----------\
   /Component  \    ← More, faster
  /--------------\
 /      API       \ ← Many, fastest, isolated
/------------------\
```

### **All Modules Work Together**
Every module is designed to work seamlessly with every other module. Mix and match as needed for your specific testing requirements.

---

## 🎉 You're Ready!

You now have a **complete, modular, reusable testing architecture** that supports:
- ✅ Fast API tests
- ✅ Component tests
- ✅ Accessibility tests
- ✅ Journey tests
- ✅ E2E tests
- ✅ 100% code reuse
- ✅ Single import for everything

**Happy Testing!** 🚀
