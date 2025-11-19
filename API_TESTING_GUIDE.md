# API Testing Guide for Journey Validation

**Date:** November 19, 2025  
**Purpose:** Comprehensive API testing strategy for journey form submission endpoints

---

## 🎯 Overview

The journey API endpoints (`/[department]/[slug]/apply`) now have:
- ✅ Dynamic Zod validation from journey JSON
- ✅ Server-side validation with custom error messages
- ✅ Reference number generation
- ✅ Structured error responses

This enables comprehensive API testing beyond just UI testing.

---

## 📋 Types of API Tests We Can Do

### **1. Validation Testing** ✅

Test that the server correctly validates form data according to the journey JSON rules.

#### **Test Cases:**

**A. Required Field Validation**
```typescript
test('should reject submission with missing required fields', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        // Missing required fields
        'applicant-type': 'individual'
        // Missing: aircraft-manufacturer, aircraft-model, etc.
      }
    }
  );
  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.success).toBe(false);
  expect(body.errors).toHaveProperty('aircraft-manufacturer');
  expect(body.errors['aircraft-manufacturer']).toContain('Enter the aircraft manufacturer');
});
```

**B. Email Pattern Validation**
```typescript
test('should reject invalid email format', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'applicant-type': 'individual',
        'aircraft-manufacturer': 'Cessna',
        'aircraft-model': '172',
        'aircraft-serial-number': '12345',
        'full-name': 'John Smith',
        'email-address': 'not-an-email',  // ❌ Invalid
        'telephone-number': '07700900123'
      }
    }
  );
  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.errors['email-address']).toContain('Enter an email address in the correct format');
});
```

**C. Min/Max Length Validation**
```typescript
test('should reject field exceeding max length', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'full-name': 'A'.repeat(101),  // ❌ Exceeds maxLength: 100
        // ... other fields
      }
    }
  );
  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.errors['full-name']).toContain('must be 100 characters or less');
});
```

**D. Phone Pattern Validation**
```typescript
test('should reject invalid phone number format', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'telephone-number': 'abc123',  // ❌ Invalid phone
        // ... other fields
      }
    }
  );
  
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.errors['telephone-number']).toContain('telephone number');
});
```

---

### **2. Success Path Testing** ✅

Test that valid submissions are accepted and return correct responses.

```typescript
test('should accept valid submission and return reference number', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'applicant-type': 'individual',
        'aircraft-manufacturer': 'Cessna',
        'aircraft-model': '172S',
        'aircraft-serial-number': '17280001',
        'full-name': 'John Smith',
        'email-address': 'john.smith@example.com',
        'telephone-number': '07700900123'
      }
    }
  );
  
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.complete).toBe(true);
  expect(body.referenceNumber).toMatch(/^[A-Z0-9]{8}$/);  // e.g., "ABC12345"
});
```

---

### **3. Error Message Quality Testing** ✅

Test that error messages follow GOV.UK guidelines and are helpful.

```typescript
test('should return GOV.UK-style error messages', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'email-address': 'invalid'
      }
    }
  );
  
  const body = await response.json();
  
  // Check error message style
  Object.values(body.errors).forEach((message: string) => {
    // Should start with imperative verb
    expect(message).toMatch(/^(Enter|Select|Choose|Provide)/);
    
    // Should not be technical
    expect(message).not.toContain('validation failed');
    expect(message).not.toContain('regex');
    expect(message).not.toContain('schema');
  });
});
```

---

### **4. Multiple Field Validation** ✅

Test that multiple validation errors are returned together.

```typescript
test('should return all validation errors at once', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'email-address': 'invalid-email',
        'telephone-number': 'abc',
        // Missing other required fields
      }
    }
  );
  
  const body = await response.json();
  
  // Should return multiple errors
  expect(Object.keys(body.errors).length).toBeGreaterThan(1);
  expect(body.errors).toHaveProperty('email-address');
  expect(body.errors).toHaveProperty('telephone-number');
  expect(body.errors).toHaveProperty('aircraft-manufacturer');
});
```

---

### **5. Edge Case Testing** ✅

Test boundary conditions and edge cases.

```typescript
test('should handle empty strings vs missing fields', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'full-name': '',  // Empty string
        'email-address': '   ',  // Whitespace
        // Other fields missing entirely
      }
    }
  );
  
  const body = await response.json();
  
  // Both should trigger required field errors
  expect(body.errors['full-name']).toBeDefined();
  expect(body.errors['email-address']).toBeDefined();
});
```

```typescript
test('should handle special characters in text fields', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'full-name': 'John O\'Brien-Smith <script>alert("xss")</script>',
        'aircraft-manufacturer': 'Cessna™',
        // ... other fields
      }
    }
  );
  
  // Should accept special characters (or sanitize them)
  expect(response.status()).toBe(200);
});
```

---

### **6. Performance Testing** ✅

Test API response times and throughput.

```typescript
test('should validate and respond within acceptable time', async ({ request }) => {
  const startTime = Date.now();
  
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        // Valid data
      }
    }
  );
  
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  expect(responseTime).toBeLessThan(1000);  // Should respond in < 1 second
});
```

```typescript
test('should handle concurrent submissions', async ({ request }) => {
  const promises = Array(10).fill(null).map(() => 
    request.post('/civil-aviation-authority/register-a-plane/apply?page=check-your-answers', {
      data: { /* valid data */ }
    })
  );
  
  const responses = await Promise.all(promises);
  
  // All should succeed
  responses.forEach(response => {
    expect(response.status()).toBe(200);
  });
  
  // All should have unique reference numbers
  const refNumbers = await Promise.all(
    responses.map(r => r.json().then(b => b.referenceNumber))
  );
  const uniqueRefs = new Set(refNumbers);
  expect(uniqueRefs.size).toBe(10);
});
```

---

### **7. Security Testing** ✅

Test for common security vulnerabilities.

```typescript
test('should sanitize HTML in input fields', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'full-name': '<script>alert("XSS")</script>',
        'aircraft-manufacturer': '<img src=x onerror=alert(1)>',
        // ... other fields
      }
    }
  );
  
  const body = await response.json();
  
  // Should either reject or sanitize
  if (body.success) {
    // If accepted, verify it's sanitized in response
    expect(body.referenceNumber).not.toContain('<script>');
  }
});
```

```typescript
test('should reject SQL injection attempts', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'full-name': "'; DROP TABLE users; --",
        // ... other fields
      }
    }
  );
  
  // Should handle gracefully (either accept as text or reject)
  expect([200, 400]).toContain(response.status());
});
```

---

### **8. Journey-Specific Validation** ✅

Test validation rules specific to each journey.

```typescript
test('should validate aircraft serial number format', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'aircraft-serial-number': 'INVALID!@#',
        // ... other fields
      }
    }
  );
  
  // If journey has custom pattern validation
  expect(response.status()).toBe(400);
});
```

---

### **9. Error Response Structure Testing** ✅

Test that error responses follow a consistent structure.

```typescript
test('should return consistent error response structure', async ({ request }) => {
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=check-your-answers',
    {
      data: {
        'email-address': 'invalid'
      }
    }
  );
  
  const body = await response.json();
  
  // Check response structure
  expect(body).toHaveProperty('success');
  expect(body).toHaveProperty('errors');
  expect(body.success).toBe(false);
  expect(typeof body.errors).toBe('object');
  
  // Each error should be a string
  Object.values(body.errors).forEach(error => {
    expect(typeof error).toBe('string');
  });
});
```

---

### **10. Cross-Journey Testing** ✅

Test that validation works consistently across different journeys.

```typescript
test('should validate email consistently across all journeys', async ({ request }) => {
  const journeys = [
    '/civil-aviation-authority/register-a-plane/apply',
    '/dvla/driving-licence-apply/apply',
    '/hmrc/self-assessment/apply'
  ];
  
  for (const journey of journeys) {
    const response = await request.post(`${journey}?page=check-your-answers`, {
      data: {
        'email-address': 'invalid-email'
      }
    });
    
    const body = await response.json();
    
    // All should reject invalid email
    expect(body.errors['email-address']).toContain('email address');
  }
});
```

---

## 📁 Suggested Test File Structure

```
playwright-poc-qa/tests/api/
├── validation/
│   ├── required-fields.spec.ts
│   ├── email-validation.spec.ts
│   ├── phone-validation.spec.ts
│   ├── length-validation.spec.ts
│   └── pattern-validation.spec.ts
├── success-paths/
│   ├── valid-submission.spec.ts
│   └── reference-generation.spec.ts
├── error-handling/
│   ├── error-messages.spec.ts
│   ├── multiple-errors.spec.ts
│   └── error-structure.spec.ts
├── edge-cases/
│   ├── empty-values.spec.ts
│   ├── special-characters.spec.ts
│   └── boundary-values.spec.ts
├── performance/
│   ├── response-time.spec.ts
│   └── concurrent-requests.spec.ts
├── security/
│   ├── xss-prevention.spec.ts
│   ├── sql-injection.spec.ts
│   └── input-sanitization.spec.ts
└── journey-specific/
    ├── register-a-plane-api.spec.ts
    ├── driving-licence-api.spec.ts
    └── cross-journey-validation.spec.ts
```

---

## 🚀 Example Complete Test File

**File:** `tests/api/validation/email-validation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const JOURNEY_PATH = '/civil-aviation-authority/register-a-plane/apply';

test.describe('API Email Validation', () => {
  
  test('should reject invalid email format', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      data: {
        'applicant-type': 'individual',
        'aircraft-manufacturer': 'Cessna',
        'aircraft-model': '172',
        'aircraft-serial-number': '12345',
        'full-name': 'John Smith',
        'email-address': 'not-an-email',
        'telephone-number': '07700900123'
      }
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.errors['email-address']).toContain('Enter an email address in the correct format');
  });
  
  test('should accept valid email formats', async ({ request }) => {
    const validEmails = [
      'user@example.com',
      'user.name@example.co.uk',
      'user+tag@example.com',
      'user_name@example.com'
    ];
    
    for (const email of validEmails) {
      const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
        data: {
          'applicant-type': 'individual',
          'aircraft-manufacturer': 'Cessna',
          'aircraft-model': '172',
          'aircraft-serial-number': '12345',
          'full-name': 'John Smith',
          'email-address': email,
          'telephone-number': '07700900123'
        }
      });
      
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    }
  });
  
  test('should reject email without @ symbol', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      data: {
        'email-address': 'userexample.com',
        // ... other fields
      }
    });
    
    expect(response.status()).toBe(400);
  });
  
  test('should reject email without domain', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      data: {
        'email-address': 'user@',
        // ... other fields
      }
    });
    
    expect(response.status()).toBe(400);
  });
});
```

---

## 🎯 Benefits of API Testing

### **1. Faster Execution**
- ✅ No browser overhead
- ✅ Direct HTTP requests
- ✅ Tests run in parallel easily

### **2. More Comprehensive Coverage**
- ✅ Test edge cases difficult to trigger via UI
- ✅ Test error conditions
- ✅ Test performance under load

### **3. Better Debugging**
- ✅ Direct access to request/response
- ✅ Clear validation error messages
- ✅ No UI state to manage

### **4. CI/CD Friendly**
- ✅ Fast feedback
- ✅ Easy to run in pipelines
- ✅ No visual rendering needed

---

## 📊 Test Coverage Goals

| Category | Target Coverage |
|----------|----------------|
| **Required Field Validation** | 100% of required fields |
| **Pattern Validation** | All patterns (email, phone, postcode, etc.) |
| **Length Validation** | Min/max for all text fields |
| **Error Messages** | All error message variants |
| **Success Paths** | All journey completion paths |
| **Edge Cases** | Common edge cases per field type |
| **Performance** | Response time < 1s |
| **Security** | XSS, SQL injection, sanitization |

---

## 🚀 Getting Started

1. **Create API test directory:**
```bash
mkdir -p tests/api/validation
```

2. **Create first test file:**
```bash
touch tests/api/validation/required-fields.spec.ts
```

3. **Run API tests:**
```bash
npm run test:api
```

4. **Add to package.json:**
```json
{
  "scripts": {
    "test:api": "playwright test tests/api"
  }
}
```

---

## ✅ Summary

With dynamic Zod validation, we can now test:
- ✅ **Validation rules** - Required, patterns, lengths
- ✅ **Error messages** - Quality and consistency
- ✅ **Success paths** - Reference number generation
- ✅ **Edge cases** - Boundary values, special characters
- ✅ **Performance** - Response times, concurrency
- ✅ **Security** - XSS, SQL injection, sanitization
- ✅ **Cross-journey** - Consistent validation across journeys

**API testing complements UI testing and provides faster, more comprehensive coverage!** 🎉
