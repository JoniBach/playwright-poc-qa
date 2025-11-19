# API Testing Status Report

**Date:** November 19, 2025  
**Status:** 🟡 Partially Working (9/36 tests passing - 25%)

---

## ✅ What's Working

### **1. FormData Submission** ✅
- API tests now correctly send FormData (multipart/form-data) instead of JSON
- Server receives and parses FormData correctly
- Helper functions created for easy test data creation

### **2. Error Response Format** ✅
- Server now returns errors as object: `{ 'email-address': '...' }`
- Previously returned array: `[{ field: 'email-address', message: '...' }]`
- API tests can now parse error responses correctly

### **3. Reference Number Format** ✅
- Tests updated to match actual format: `APP-TIMESTAMP-RANDOM`
- Example: `APP-MI6IWREY-V6HQN`
- Tests now pass for valid submissions

### **4. Test Infrastructure** ✅
- Created `helpers/api-helpers.ts` with reusable functions
- Created `tests/api/validation/` directory structure
- Tests run in ~2.5 seconds across 3 browsers

---

## ❌ What's Not Working

### **Core Issue: Validation Not Enforced**

**Problem:** The server returns **200 (success)** when it should return **400 (validation error)**.

**Why:**
1. API tests submit to `/apply?page=check-your-answers`
2. Server validates only the "check-your-answers" page
3. The "check-your-answers" page has **no form components** (it's just a summary)
4. Therefore, **no validation rules are applied**
5. All submissions pass validation, even invalid ones

**Evidence:**
```typescript
// Test sends invalid email
'email-address': 'not-an-email'

// Expected: 400 Bad Request with validation error
// Actual: 200 OK - submission accepted ❌
```

---

## 🔍 Root Cause Analysis

### **Current Validation Flow:**

```typescript
// Server: +server.ts
const currentPage = url.searchParams.get('page'); // "check-your-answers"
const validation = validateSpecificPage(journey, currentPage, data);
```

```typescript
// Validator: journey-data-validator.ts
function getPageValidationSchema(journey, pageId) {
  const page = journey.pages?.[pageId]; // Gets "check-your-answers" page
  return generatePageSchema(page.components || []); // No form components!
}
```

### **The Problem:**

The "check-your-answers" page in the journey JSON looks like this:

```json
{
  "check-your-answers": {
    "components": [
      { "type": "heading", "props": { "text": "Check your answers" } },
      { "type": "checkYourAnswers" }  // ← Not a form input!
    ]
  }
}
```

**No validation rules exist on this page!**

The actual validation rules are on the **individual form pages**:

```json
{
  "aircraft-details": {
    "components": [
      {
        "type": "textInput",
        "props": { "name": "aircraft-manufacturer" },
        "validation": {
          "required": true,
          "errorMessages": { "required": "Enter the aircraft manufacturer" }
        }
      }
    ]
  }
}
```

---

## 💡 Solution Options

### **Option 1: Validate All Pages (Recommended)** ✅

When submitting to "check-your-answers", validate the data against **all form pages** in the journey, not just the current page.

**Implementation:**
```typescript
// New function in journey-data-validator.ts
export function validateAllJourneyData(journey: any, data: Record<string, any>) {
  // Collect validation rules from ALL pages
  const allComponents = [];
  for (const page of Object.values(journey.pages)) {
    allComponents.push(...(page.components || []));
  }
  
  // Generate schema from all components
  const schema = generatePageSchema(allComponents);
  return schema.safeParse(data);
}
```

**Update server:**
```typescript
// In +server.ts
if (currentPage === 'check-your-answers') {
  // Validate ALL collected data
  const validation = validateAllJourneyData(journey, data);
} else {
  // Validate only current page
  const validation = validateSpecificPage(journey, currentPage, data);
}
```

### **Option 2: Change Test Approach** ⚠️

Submit to individual form pages instead of check-your-answers.

**Pros:**
- Tests individual page validation
- Matches current server implementation

**Cons:**
- Doesn't test end-to-end submission flow
- Requires multiple API calls per journey
- Doesn't match real user behavior

---

## 📋 Test Results Breakdown

### **Passing Tests (9):**
- ✅ `should accept valid email format` (3 browsers)
- ✅ `should accept submission with all required fields` (3 browsers)
- ✅ `should accept various valid email formats` (3 browsers)

### **Failing Tests (27):**
- ❌ Email validation (invalid formats accepted)
- ❌ Required field validation (missing fields accepted)
- ❌ Empty string validation (empty values accepted)
- ❌ Error message tests (no errors returned)

---

## 🎯 Recommended Next Steps

### **1. Implement Full Journey Validation** (High Priority)

Create `validateAllJourneyData()` function to validate against all pages when submitting to check-your-answers.

**Files to modify:**
- `src/lib/validation/journey-data-validator.ts` - Add new function
- `src/routes/[department]/[slug]/apply/+server.ts` - Use new function for check-your-answers

### **2. Update API Tests** (Medium Priority)

Once validation is working, verify all tests pass and add more test cases:
- Phone number validation
- Postcode validation  
- Conditional field validation
- Cross-field validation

### **3. Document API Testing** (Low Priority)

Update `API_TESTING_GUIDE.md` with:
- How validation works
- When to use page-specific vs full journey validation
- Best practices for API testing

---

## 📊 Current Test Coverage

| Test Category | Tests | Passing | Failing | Pass Rate |
|--------------|-------|---------|---------|-----------|
| Email Validation | 18 | 3 | 15 | 17% |
| Required Fields | 18 | 6 | 12 | 33% |
| **Total** | **36** | **9** | **27** | **25%** |

---

## 🎉 Achievements So Far

1. ✅ Created API test infrastructure
2. ✅ Fixed FormData submission
3. ✅ Fixed error response format
4. ✅ Fixed reference number format
5. ✅ Tests run successfully (infrastructure works)
6. ✅ Identified root cause of validation issue

**Next:** Implement full journey validation to make all tests pass! 🚀
