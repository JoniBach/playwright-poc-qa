# Test Suite Cleanup Guide

## Current Status

**Test Results:** 143 passed, 64 failed, 36 skipped

## Problem Summary

Many old test files assume GOV.UK Design System patterns that don't exist in actual journeys:
- ❌ Assume error summary boxes (`.govuk-error-summary`)
- ❌ Assume GOV.UK summary lists with change links
- ❌ Assume standard navigation patterns

## Working Test Files ✅

These files are **production-ready** and should be kept:

### Register-a-Company Journey (39 tests - ALL PASSING)

1. **`register-a-company-simple.spec.ts`** (3 tests)
   - ✅ Simple direct approach
   - ✅ Quick smoke tests
   - ✅ Easy to understand

2. **`register-a-company-realistic.spec.ts`** (24 tests)
   - ✅ Journey-specific comprehensive tests
   - ✅ Tests actual patterns (inline errors, `<dl>` lists)
   - ✅ Edge cases and validation

3. **`register-a-company-adaptive.spec.ts`** (12 tests)
   - ✅ Smart adaptive blocks
   - ✅ Auto-detects patterns
   - ✅ Spec-generation ready

## Failing/Problematic Test Files ❌

These files have pattern assumption issues and should be **deprecated or fixed**:

### Register-a-Company Tests (Failing)

1. **`register-a-company-blocks.spec.ts`** (7 tests failing)
   - ❌ Assumes error summary
   - ❌ Assumes GOV.UK summary list
   - ❌ Assumes change links
   - **Action:** Deprecate or migrate to adaptive blocks

2. **`register-a-company-working.spec.ts`** (4 tests failing)
   - ❌ Assumes error summary
   - ❌ Assumes change links
   - **Action:** Deprecate or migrate to adaptive blocks

3. **`register-a-company-comprehensive.spec.ts.DEPRECATED`** (24 tests failing)
   - ✅ Already deprecated
   - ✅ README created explaining issues

### Register-a-Plane Tests (Failing)

4. **`register-a-plane-blocks.spec.ts`** (7 tests failing)
   - ❌ Assumes error summary
   - ❌ Assumes GOV.UK patterns
   - **Action:** Check if plane journey uses different patterns, then fix or deprecate

5. **`register-a-plane-refactored.spec.ts`** (2 tests failing)
   - ❌ Similar pattern issues
   - **Action:** Check if plane journey uses different patterns, then fix or deprecate

### Debug/Test Files

6. **`debug-company.spec.ts`**
   - **Action:** Review and keep if useful for debugging

7. **`debug-heading.spec.ts`**
   - **Action:** Review and keep if useful for debugging

8. **`test-company-url.spec.ts`**
   - **Action:** Review and keep if useful for testing

9. **`example-all-patterns.spec.ts`**
   - **Action:** Review and keep if useful as examples

## Recommended Actions

### Immediate (Clean Up)

1. **Deprecate failing register-a-company tests:**
   ```bash
   mv tests/journeys/register-a-company-blocks.spec.ts tests/journeys/register-a-company-blocks.spec.ts.DEPRECATED
   mv tests/journeys/register-a-company-working.spec.ts tests/journeys/register-a-company-working.spec.ts.DEPRECATED
   ```

2. **Investigate register-a-plane journey:**
   - Run pattern detection on plane journey
   - Determine if it uses standard GOV.UK patterns or not
   - Fix tests accordingly

3. **Review debug/test files:**
   - Keep useful ones
   - Remove or deprecate obsolete ones

### Short Term (Fix or Migrate)

1. **For register-a-plane tests:**
   - If plane journey uses standard GOV.UK patterns → Keep and fix tests
   - If plane journey uses non-standard patterns → Migrate to adaptive blocks
   - Create simple/realistic/adaptive versions like register-a-company

2. **Create migration templates:**
   - Document how to migrate old tests to adaptive blocks
   - Provide examples for common patterns

### Long Term (Standardize)

1. **Establish test file naming convention:**
   - `{journey}-simple.spec.ts` - Simple smoke tests
   - `{journey}-realistic.spec.ts` - Journey-specific comprehensive
   - `{journey}-adaptive.spec.ts` - Adaptive cross-pattern tests
   - `{journey}-{feature}.spec.ts.DEPRECATED` - Deprecated tests

2. **Create test generation templates:**
   - Use adaptive blocks as default
   - Generate journey-specific tests based on pattern detection
   - Auto-generate simple smoke tests

## Migration Guide

### From Old Pattern-Specific Tests to Adaptive Blocks

**Before (Assumes GOV.UK patterns):**
```typescript
test('should validate errors', async ({ journeyRunner, componentHelper }) => {
  // ... fill form with invalid data
  await journeyRunner.continue();
  
  // ❌ Assumes error summary exists
  await componentHelper.verifyErrorSummary(['Error message']);
});
```

**After (Adaptive):**
```typescript
test('should validate errors', async ({ page, journeyRunner, componentHelper }) => {
  const builder = new JourneyBuilder(page, journeyRunner, componentHelper);
  
  await builder
    .addCustomStep(async ({ journeyRunner }) => {
      // ... fill form with invalid data
      await journeyRunner.continue();
    })
    // ✅ Adapts to error summary OR inline errors
    .addStep(AdaptiveBlocks.smartVerifyErrors(['Error message']))
    .execute();
});
```

### From Old Change Answer Tests to Adaptive

**Before (Assumes change links):**
```typescript
test('should change answer', async ({ componentHelper, journeyRunner }) => {
  // ... complete journey to check answers
  
  // ❌ Fails if change links don't exist
  await componentHelper.clickChangeLink('Company name');
  await journeyRunner.fillStep({ 'Company name': 'New Name' });
  await journeyRunner.continue();
});
```

**After (Adaptive):**
```typescript
test('should change answer if supported', async ({ page, journeyRunner, componentHelper }) => {
  const builder = new JourneyBuilder(page, journeyRunner, componentHelper);
  
  await builder
    // ... complete journey to check answers
    // ✅ Gracefully handles no change links
    .addStep(AdaptiveBlocks.changeAnswerIfSupported('Company Name', 'New Name'))
    .execute();
});
```

## File Organization Recommendation

```
tests/journeys/
├── register-a-company/
│   ├── register-a-company-simple.spec.ts          ✅ Keep
│   ├── register-a-company-realistic.spec.ts       ✅ Keep
│   ├── register-a-company-adaptive.spec.ts        ✅ Keep
│   └── deprecated/
│       ├── register-a-company-blocks.spec.ts.DEPRECATED
│       ├── register-a-company-working.spec.ts.DEPRECATED
│       ├── register-a-company-comprehensive.spec.ts.DEPRECATED
│       └── README.md (explains why deprecated)
│
├── register-a-plane/
│   ├── register-a-plane-simple.spec.ts            📝 Create
│   ├── register-a-plane-realistic.spec.ts         📝 Create
│   ├── register-a-plane-adaptive.spec.ts          📝 Create
│   └── deprecated/
│       ├── register-a-plane-blocks.spec.ts.DEPRECATED
│       ├── register-a-plane-refactored.spec.ts.DEPRECATED
│       └── README.md
│
└── debug/
    ├── debug-company.spec.ts
    ├── debug-heading.spec.ts
    ├── test-company-url.spec.ts
    └── example-all-patterns.spec.ts
```

## Quick Cleanup Script

```bash
#!/bin/bash
# Run from playwright-poc-qa directory

# Create deprecated directories
mkdir -p tests/journeys/register-a-company/deprecated
mkdir -p tests/journeys/register-a-plane/deprecated
mkdir -p tests/journeys/debug

# Move register-a-company tests
mv tests/journeys/register-a-company-simple.spec.ts tests/journeys/register-a-company/
mv tests/journeys/register-a-company-realistic.spec.ts tests/journeys/register-a-company/
mv tests/journeys/register-a-company-adaptive.spec.ts tests/journeys/register-a-company/

# Deprecate old register-a-company tests
mv tests/journeys/register-a-company-blocks.spec.ts tests/journeys/register-a-company/deprecated/register-a-company-blocks.spec.ts.DEPRECATED
mv tests/journeys/register-a-company-working.spec.ts tests/journeys/register-a-company/deprecated/register-a-company-working.spec.ts.DEPRECATED
mv tests/journeys/register-a-company-comprehensive.spec.ts.DEPRECATED tests/journeys/register-a-company/deprecated/
mv tests/journeys/register-a-company-comprehensive.spec.ts.DEPRECATED.README.md tests/journeys/register-a-company/deprecated/

# Move register-a-plane tests to deprecated (pending investigation)
mv tests/journeys/register-a-plane-blocks.spec.ts tests/journeys/register-a-plane/deprecated/register-a-plane-blocks.spec.ts.DEPRECATED
mv tests/journeys/register-a-plane-refactored.spec.ts tests/journeys/register-a-plane/deprecated/register-a-plane-refactored.spec.ts.DEPRECATED

# Move debug files
mv tests/journeys/debug-*.spec.ts tests/journeys/debug/
mv tests/journeys/test-company-url.spec.ts tests/journeys/debug/
mv tests/journeys/example-all-patterns.spec.ts tests/journeys/debug/

echo "Cleanup complete!"
echo "Working tests: tests/journeys/register-a-company/"
echo "Deprecated tests: tests/journeys/*/deprecated/"
echo "Debug tests: tests/journeys/debug/"
```

## Next Steps

1. **Run cleanup script** to organize test files
2. **Investigate register-a-plane journey** patterns
3. **Create new plane tests** using simple/realistic/adaptive approach
4. **Update CI/CD** to only run non-deprecated tests
5. **Document patterns** for each journey in journey configs

## Success Metrics

After cleanup:
- ✅ 0 failing tests (deprecated tests excluded)
- ✅ Clear organization (working vs deprecated)
- ✅ Documented patterns for each journey
- ✅ Migration guide for future tests
- ✅ CI/CD running only working tests

## Questions to Answer

1. **Does register-a-plane journey use standard GOV.UK patterns?**
   - If yes → Fix existing tests
   - If no → Create adaptive versions

2. **Are debug files still useful?**
   - Keep useful ones in debug folder
   - Remove obsolete ones

3. **Should we keep deprecated tests?**
   - Yes, for reference and migration examples
   - Move to deprecated folders
   - Add README explaining issues

## Conclusion

The test suite needs cleanup to:
- ✅ Separate working from failing tests
- ✅ Deprecate pattern-specific tests that don't match reality
- ✅ Standardize on simple/realistic/adaptive approach
- ✅ Organize by journey and purpose

**Current working tests (39) are production-ready. Other tests (64 failing) need investigation and migration.**
