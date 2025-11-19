# Shared Test Modules

This directory contains **reusable test utilities** that can be used across API, UI, and E2E tests. This modular approach ensures:

- ✅ **Consistency** - Same validation logic everywhere
- ✅ **Maintainability** - Update once, apply everywhere
- ✅ **Speed** - Reuse code instead of duplicating
- ✅ **Type Safety** - Shared Zod schemas catch errors early

---

## 📁 Directory Structure

```
shared/
├── validation/           # Validation logic
│   ├── schemas.ts       # Zod schemas for data validation
│   ├── assertions.ts    # Reusable test assertions
│   └── fixtures.ts      # Test data fixtures
├── api/                 # API utilities
│   └── mocks.ts         # Mock responses for UI tests
└── README.md            # This file
```

---

## 🎯 Usage Examples

### **1. API Tests (Direct HTTP)**

```typescript
import { test, expect } from '@playwright/test';
import { assertValidationError, assertSuccessResponse } from '../shared/validation/assertions';
import { validPlaneData } from '../shared/validation/fixtures';

test('should validate email format', async ({ request }) => {
  const response = await request.post('/apply?page=check-your-answers', {
    multipart: { ...validPlaneData, 'email-address': 'invalid' }
  });
  
  const body = await response.json();
  
  // Use shared assertion
  assertValidationError(body, ['email-address']);
});
```

### **2. UI Tests (Mocked API)**

```typescript
import { test, expect } from '@playwright/test';
import { mockSuccessfulSubmission } from '../shared/api/mocks';
import { validHelicopterData } from '../shared/validation/fixtures';

test('should complete journey', async ({ page }) => {
  // Mock API response
  await page.route('**/apply?page=check-your-answers', mockSuccessfulSubmission);
  
  // Fill form
  await page.fill('[name="ownerEmail"]', validHelicopterData.ownerEmail);
  
  // Submit and verify
  await page.click('text=Accept and send');
  await expect(page.locator('text=Application complete')).toBeVisible();
});
```

### **3. E2E Tests (Real API)**

```typescript
import { test, expect } from '@playwright/test';
import { assertSuccessResponse } from '../shared/validation/assertions';
import { validHelicopterData } from '../shared/validation/fixtures';

test('should submit to real server', async ({ page, request }) => {
  // Use real API (no mocking)
  await page.fill('[name="ownerEmail"]', validHelicopterData.ownerEmail);
  await page.click('text=Accept and send');
  
  // Verify with shared assertion
  await expect(page.locator('text=/APP-\\d+-[A-Z0-9]+/')).toBeVisible();
});
```

---

## 📦 Module Reference

### **validation/schemas.ts**

Zod schemas for validating data structures:

- `emailSchema` - Email validation
- `phoneSchema` - UK phone number validation
- `referenceNumberSchema` - Reference number format
- `helicopterDataSchema` - Helicopter registration data
- `planeDataSchema` - Plane registration data
- `validationErrorResponseSchema` - Error response structure
- `successResponseSchema` - Success response structure

**Example:**
```typescript
import { emailSchema } from '../shared/validation/schemas';

const result = emailSchema.safeParse('test@example.com');
expect(result.success).toBe(true);
```

---

### **validation/assertions.ts**

Reusable assertion functions:

- `assertValidationError(response, fields)` - Assert validation error response
- `assertSuccessResponse(response, options)` - Assert success response
- `assertGovUKErrorMessages(errors)` - Assert GOV.UK style messages
- `assertValidEmail(email)` - Assert valid email
- `assertValidPhone(phone)` - Assert valid phone
- `assertValidReferenceNumber(ref)` - Assert valid reference number
- `assertRequiredFields(data, fields)` - Assert required fields present
- `assertMultipleErrors(response, minErrors)` - Assert multiple errors
- `assertFieldError(response, field, message)` - Assert specific field error

**Example:**
```typescript
import { assertValidationError } from '../shared/validation/assertions';

assertValidationError(response, ['email-address', 'telephone-number']);
```

---

### **validation/fixtures.ts**

Test data fixtures:

- `validHelicopterData` - Valid helicopter registration data
- `validPlaneData` - Valid plane registration data
- `invalidEmails` - Array of invalid emails
- `validEmails` - Array of valid emails
- `invalidPhones` - Array of invalid phones
- `validPhones` - Array of valid phones
- `mockSuccessResponse` - Mock success response
- `mockValidationErrorResponse` - Mock error response
- `generateMockReferenceNumber()` - Generate reference number
- `createPartialHelicopterData(fields)` - Create partial data
- `createInvalidHelicopterData(invalidFields)` - Create invalid data

**Example:**
```typescript
import { validHelicopterData, invalidEmails } from '../shared/validation/fixtures';

// Use valid data
await page.fill('[name="ownerEmail"]', validHelicopterData.ownerEmail);

// Test with invalid emails
for (const email of invalidEmails) {
  // test each invalid email
}
```

---

### **api/mocks.ts**

API mocking utilities for UI tests:

- `mockSuccessfulSubmission(route)` - Mock successful submission
- `mockValidationErrors(route, errors)` - Mock validation errors
- `mockServerError(route, message)` - Mock server error
- `mockNetworkTimeout(route)` - Mock network timeout
- `createValidationInterceptor(validateFn)` - Create custom validator
- `RequestCapture` - Capture and inspect requests

**Example:**
```typescript
import { mockSuccessfulSubmission, RequestCapture } from '../shared/api/mocks';

// Simple mock
await page.route('**/apply', mockSuccessfulSubmission);

// Capture requests
const capture = new RequestCapture();
await page.route('**/apply', (route) => capture.captureAndRespond(route, { success: true }));
const lastRequest = capture.getLastRequest();
```

---

## 🎯 Benefits

### **1. DRY Principle**
Write validation logic once, use everywhere:
- API tests validate server responses
- UI tests validate request data
- E2E tests validate end-to-end flow

### **2. Type Safety**
Zod schemas provide runtime type checking:
```typescript
const result = helicopterDataSchema.safeParse(data);
if (!result.success) {
  console.log(result.error.issues); // Detailed error info
}
```

### **3. Consistent Test Data**
Same fixtures across all test types:
```typescript
// API test
const formData = createFormData(validHelicopterData);

// UI test
await page.fill('[name="ownerEmail"]', validHelicopterData.ownerEmail);

// E2E test
const response = await submitForm(validHelicopterData);
```

### **4. Easy Mocking**
Reusable mocks for UI tests:
```typescript
// Success scenario
await page.route('**/apply', mockSuccessfulSubmission);

// Error scenario
await page.route('**/apply', (route) => 
  mockValidationErrors(route, { email: 'Invalid email' })
);
```

---

## 🚀 Adding New Shared Utilities

### **1. Add Schema**
```typescript
// validation/schemas.ts
export const newFieldSchema = z.string().min(1).max(100);
```

### **2. Add Assertion**
```typescript
// validation/assertions.ts
export function assertNewField(data: any) {
  expect(newFieldSchema.safeParse(data).success).toBe(true);
}
```

### **3. Add Fixture**
```typescript
// validation/fixtures.ts
export const validNewData = {
  newField: 'valid value'
};
```

### **4. Use in Tests**
```typescript
// tests/api/new-test.spec.ts
import { assertNewField, validNewData } from '../shared/validation';

test('should validate new field', () => {
  assertNewField(validNewData.newField);
});
```

---

## 📊 Test Architecture

```
┌─────────────────────────────────────────────┐
│           Shared Modules                     │
│  (schemas, assertions, fixtures, mocks)      │
└─────────────────────────────────────────────┘
           ▲           ▲           ▲
           │           │           │
    ┌──────┴────┐ ┌───┴────┐ ┌───┴────┐
    │ API Tests │ │UI Tests│ │E2E Tests│
    │  (Real)   │ │(Mocked)│ │ (Real)  │
    └───────────┘ └────────┘ └─────────┘
         │            │           │
         └────────────┴───────────┘
                  │
         ┌────────▼────────┐
         │  Application    │
         │    Server       │
         └─────────────────┘
```

---

## ✅ Best Practices

1. **Always use shared schemas** for validation
2. **Reuse fixtures** instead of hardcoding test data
3. **Use assertions** for consistent error checking
4. **Mock APIs in UI tests** for speed and reliability
5. **Use real APIs in E2E tests** for integration testing
6. **Keep shared modules simple** and well-documented
7. **Update shared modules** when adding new fields/validations

---

## 🎉 Summary

This modular architecture provides:

- ✅ **33 API tests** - Fast, isolated server validation
- ✅ **UI tests** - Fast, mocked user journeys
- ✅ **E2E tests** - Comprehensive integration testing
- ✅ **Shared logic** - DRY, maintainable, type-safe

All using the **same validation rules** and **test data**! 🚀
