# DEPRECATED: register-a-company-comprehensive.spec.ts

## Why Deprecated?

This test file was created assuming the register-a-company journey uses standard GOV.UK Design System patterns. However, this journey actually uses **different patterns**:

| Assumed Pattern | Actual Pattern |
|----------------|----------------|
| ❌ Error summary box (`.govuk-error-summary`) | ✅ Inline field errors (`text=Error:`) |
| ❌ GOV.UK summary list (`.govuk-summary-list`) | ✅ Simple `<dl>` description list |
| ❌ Change answer links | ✅ No change functionality (read-only) |

## Test Results

- **24 tests failing** - Tests expect patterns that don't exist
- **15 tests passing** - Only happy path tests that don't rely on these patterns

## What to Use Instead

### ✅ Use These Working Test Files:

1. **`register-a-company-simple.spec.ts`** (3/3 passing)
   - Simple, direct approach
   - Quick smoke tests
   - Easy to understand

2. **`register-a-company-realistic.spec.ts`** (24/24 passing)
   - Journey-specific comprehensive tests
   - Tests actual journey behavior (inline errors, `<dl>` lists)
   - Validates edge cases

3. **`register-a-company-adaptive.spec.ts`** (4/4 passing)
   - Smart adaptive blocks
   - Auto-detects journey patterns
   - Spec-generation ready

## Migration Guide

### Old (Comprehensive - Assumes GOV.UK patterns):
```typescript
// ❌ Fails - assumes error summary exists
.addStep(JourneyStepBlocks.verifyErrorSummary(['Error message']))

// ❌ Fails - assumes GOV.UK summary list with change links
.addStep(JourneyStepBlocks.changeAnswer('Company name'))
```

### New (Adaptive - Works with any pattern):
```typescript
// ✅ Works - adapts to inline or summary errors
.addStep(AdaptiveBlocks.smartVerifyErrors(['Error message']))

// ✅ Works - gracefully handles no change links
.addStep(AdaptiveBlocks.changeAnswerIfSupported('Company Name', 'New Value'))
```

### New (Realistic - Journey-specific):
```typescript
// ✅ Works - tests actual inline errors
const errorText = await page.locator('text=Error:').textContent();
expect(errorText).toContain('Error:');

// ✅ Works - tests actual <dl> summary list
const companyName = await page.locator('dt:has-text("Company Name") + dd').textContent();
expect(companyName?.trim()).toBe('Acme Ltd');
```

## Why Keep This File?

This file is kept (renamed with `.DEPRECATED`) as a **reference** for:

1. **Learning** - Shows what NOT to assume about journey patterns
2. **Documentation** - Demonstrates the pattern mismatch problem
3. **Migration** - Can be used as a template for converting to adaptive blocks

## Action Required

**Do not run this test file.** It will fail with 24/39 tests failing.

**Use the working alternatives instead:**
- Simple: `register-a-company-simple.spec.ts`
- Realistic: `register-a-company-realistic.spec.ts`
- Adaptive: `register-a-company-adaptive.spec.ts`

## Future Work

If you want to fix this file:

1. Replace `JourneyStepBlocks.verifyErrorSummary()` with `AdaptiveBlocks.smartVerifyErrors()`
2. Replace `ComponentHelper.verifySummaryRow()` with `AdaptiveBlocks.smartVerifySummary()`
3. Replace `ComponentHelper.clickChangeLink()` with `AdaptiveBlocks.changeAnswerIfSupported()`
4. Update all summary list keys to match actual journey (e.g., "Company Name" not "Company name")
5. Remove tests for unsupported features (change answers, back navigation issues)

Or better yet, use the adaptive blocks approach from `register-a-company-adaptive.spec.ts`.

## See Also

- `BLOCK_IMPROVEMENTS_SUMMARY.md` - Analysis of pattern issues
- `ADAPTIVE_BLOCKS_GUIDE.md` - Guide to adaptive blocks
- `JOURNEY_TESTING_COMPLETE.md` - Complete implementation summary
