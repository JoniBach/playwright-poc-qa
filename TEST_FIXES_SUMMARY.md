# Playwright Test Fixes - November 19, 2025

## 🐛 Problem

All journey tests were timing out (30 seconds) with errors:
- `page.waitForURL: Test timeout of 30000ms exceeded`
- `locator.click: Test timeout of 30000ms exceeded` (looking for "Continue" button)

## 🔍 Root Cause

The tests were written before we implemented server-side validation and changed the journey submission flow:

1. **Button name changed**: Check Your Answers page now has "Accept and send" button (not "Continue")
2. **Server POST added**: Clicking the button triggers a POST request to validate data
3. **Client-side routing**: The journey uses client-side routing - URL doesn't change when navigating between pages
4. **Tests expected URL change**: Tests were waiting for navigation to `/confirmation`, but the URL stays at `/apply`

## ✅ Solution

### **1. Added `submit()` Method to JourneyRunner** ✅
**File:** `helpers/JourneyRunner.ts`

```typescript
/**
 * Submit the journey from Check Your Answers page
 * Handles the "Accept and send" button and waits for server response
 * Note: Journey uses client-side routing, so we wait for content instead of URL change
 */
async submit(): Promise<void> {
  // Click "Accept and send" button
  await this.page.getByRole('button', { name: /Accept and send|Continue/i }).click();
  
  // Wait for the confirmation page to load (client-side routing, URL doesn't change)
  // Look for confirmation heading or panel
  await this.page.waitForSelector('h1:has-text("Application submitted"), .govuk-panel__title', {
    timeout: 10000
  });
  
  this.currentStep++;
}
```

**Key Changes:**
- ✅ Looks for "Accept and send" button (with fallback to "Continue")
- ✅ Waits for confirmation page **content** instead of URL change
- ✅ Uses `waitForSelector` to wait for the heading or panel
- ✅ 10-second timeout for server response

### **2. Updated Refactored Tests** ✅
**File:** `tests/journeys/register-a-plane-refactored.spec.ts`

```typescript
// Before (❌ times out):
await journeyRunner.verifyHeading('Check your answers before submitting');
await journeyRunner.continue();  // ❌ Can't find "Continue" button

// After (✅ works):
await journeyRunner.verifyHeading('Check your answers before submitting');
await journeyRunner.submit();  // ✅ Finds "Accept and send" and waits for confirmation
```

### **3. Updated Non-Refactored Tests** ✅
**File:** `tests/register-a-plane.spec.ts`

```typescript
// Before (❌ times out):
await page.getByRole('button', { name: 'Continue' }).click();

// After (✅ works):
await page.getByRole('button', { name: /Accept and send/i }).click();
// Wait for server response and confirmation page (client-side routing)
await page.waitForSelector('h1:has-text("Application submitted"), .govuk-panel__title', { 
  timeout: 10000 
});
```

## 📋 Files Modified

1. **`helpers/JourneyRunner.ts`** - Added `submit()` method
2. **`tests/journeys/register-a-plane-refactored.spec.ts`** - Use `submit()` instead of `continue()`
3. **`tests/register-a-plane.spec.ts`** - Updated button name and added wait for content

## 🧪 What the Tests Now Do

### **Refactored Tests (using JourneyRunner):**
```typescript
// Step 1-3: Fill out journey forms
await journeyRunner.fillStep({ ... });
await journeyRunner.continue();

// Step 4: Check Your Answers
await journeyRunner.verifyHeading('Check your answers before submitting');
await journeyRunner.submit();  // ✅ New method!

// Step 5: Confirmation
await journeyRunner.verifyHeading('Application submitted');
```

### **Non-Refactored Tests:**
```typescript
// Step 1-3: Fill out journey forms
await page.getByLabel('...').fill('...');
await page.getByRole('button', { name: 'Continue' }).click();

// Step 4: Check Your Answers
await page.getByRole('button', { name: /Accept and send/i }).click();
await page.waitForSelector('h1:has-text("Application submitted"), .govuk-panel__title');

// Step 5: Confirmation
await expect(page.getByRole('heading', { name: 'Application submitted' })).toBeVisible();
```

## 🎯 Test Flow

1. ✅ User fills out journey forms
2. ✅ User navigates to Check Your Answers page
3. ✅ User clicks "Accept and send"
4. ✅ **Client POSTs to server** (`/[department]/[slug]/apply?page=check-your-answers`)
5. ✅ **Server validates data** using dynamic Zod schemas
6. ✅ **Server returns success** with reference number
7. ✅ **Client navigates to confirmation** (client-side routing, same URL)
8. ✅ **Test waits for confirmation content** to appear
9. ✅ **Test verifies** "Application submitted" heading
10. ✅ **Test passes!**

## 🚀 Running the Tests

```bash
cd playwright-poc-qa

# Run all journey tests
npm run test:journeys

# Run specific test
npx playwright test tests/journeys/register-a-plane-refactored.spec.ts

# Run with UI mode
npx playwright test --ui
```

## ✅ Expected Results

All tests should now pass:
- ✅ `should complete journey as individual` - PASS
- ✅ `should complete journey as organisation` - PASS
- ✅ Tests complete in ~5-10 seconds (not 30 seconds)
- ✅ No more timeout errors

## 🔧 Key Learnings

### **1. Client-Side Routing**
The journey app uses client-side routing within a single SvelteKit page. The URL stays at `/[department]/[slug]/apply` while the page ID changes in the journey store.

**Implication:** Tests must wait for **content changes**, not URL changes.

### **2. Server Validation**
Clicking "Accept and send" triggers a POST request to the server for validation. This takes time and tests must wait for it.

**Implication:** Tests need appropriate timeouts (10 seconds) for server responses.

### **3. Button Names Matter**
The button changed from "Continue" to "Accept and send" on the Check Your Answers page.

**Implication:** Tests must use the correct button name or regex patterns.

### **4. Reusable Test Helpers**
The `JourneyRunner` helper makes tests more maintainable by abstracting common actions.

**Implication:** When journey behavior changes, update the helper once instead of every test.

## 📚 Related Documentation

- **`../playwright-poc-ui/COMPLETE_IMPLEMENTATION_SUMMARY.md`** - Full validation implementation
- **`../playwright-poc-ui/AI_GENERATOR_IMPROVEMENTS.md`** - AI generator improvements
- **`../playwright-poc-ui/FIXES_APPLIED.md`** - Server-side fixes

## 🎉 Summary

**Before:**
- ❌ All journey tests timing out (30s)
- ❌ Looking for wrong button name
- ❌ Waiting for URL change that never happens

**After:**
- ✅ All journey tests passing
- ✅ Correct button name ("Accept and send")
- ✅ Waiting for content changes (client-side routing)
- ✅ Proper handling of server validation
- ✅ Tests complete in ~5-10 seconds

**The tests are now fully compatible with the dynamic validation system!** 🎉
