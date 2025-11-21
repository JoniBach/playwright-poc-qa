# Adaptive Blocks Guide

## Overview

Adaptive blocks are smart, pattern-aware test blocks that automatically detect and adapt to journey-specific UI patterns. They enable writing tests that work across different journey implementations without modification.

## Why Adaptive Blocks?

Different journeys use different UI patterns:

| Pattern | Journey A | Journey B |
|---------|-----------|-----------|
| Errors | Error summary box | Inline field errors |
| Summary | GOV.UK summary list | `<dl>` description list |
| Change answers | Yes, with links | No change support |
| Back button | `<button>` | `<a>` link |
| Quotes | Smart quotes (`'`) | Standard quotes (`'`) |

**Problem:** Generic tests fail when patterns don't match.

**Solution:** Adaptive blocks detect patterns at runtime and adapt behavior accordingly.

## Core Components

### 1. PatternDetector

Detects which UI patterns a journey uses:

```typescript
const detector = new PatternDetector(page);
const patterns = await detector.detectPatterns();

// Returns:
{
  errorDisplay: 'summary' | 'inline' | 'both' | 'none',
  summaryList: 'govuk-summary-list' | 'dl' | 'table' | 'none',
  changeAnswers: boolean,
  backNavigation: 'button' | 'link' | 'both' | 'none',
  smartQuotes: boolean
}
```

### 2. AdaptiveBlocks

Smart blocks that use PatternDetector to adapt behavior:

```typescript
// Verify errors - works with any error pattern
AdaptiveBlocks.verifyErrors(['Enter company name'])

// Verify summary - works with any list pattern
AdaptiveBlocks.verifySummaryData({ 'Company Name': 'Acme Ltd' })

// Change answer - gracefully handles unsupported journeys
AdaptiveBlocks.changeAnswerIfSupported('Company Name', 'New Name Ltd')
```

## Usage Examples

### Basic Error Verification

```typescript
test('should verify validation errors', async ({ page, journeyRunner, componentHelper }) => {
  const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

  await builder
    .addCustomStep(async ({ journeyRunner }) => {
      await journeyRunner.startJourney('/path/to/journey');
      await journeyRunner.verifyHeading('Enter details');
      await journeyRunner.continue(); // Submit empty form
    })
    // Adaptive error verification - works with summary OR inline errors
    .addStep(AdaptiveBlocks.smartVerifyErrors(['Field is required']))
    .execute();
});
```

### Summary Data Verification

```typescript
test('should verify check answers', async ({ page, journeyRunner, componentHelper }) => {
  const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

  await builder
    // ... complete journey steps ...
    .addCustomStep(async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading('Check your answers');
    })
    // Adaptive summary verification - works with GOV.UK list, <dl>, or table
    .addStep(AdaptiveBlocks.smartVerifySummary({
      'Company Name': 'Acme Ltd',
      'Town': 'London'
    }))
    .execute();
});
```

### Conditional Change Answer

```typescript
test('should change answer if supported', async ({ page, journeyRunner, componentHelper }) => {
  const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

  await builder
    // ... complete journey to check answers ...
    .addCustomStep(async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading('Check your answers');
    })
    // Try to change - gracefully skips if not supported
    .addStep(AdaptiveBlocks.changeAnswerIfSupported('Company Name', 'Updated Ltd'))
    .execute();
});
```

### Pattern Detection for Debugging

```typescript
test('should detect journey patterns', async ({ page, journeyRunner, componentHelper }) => {
  const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

  await builder
    .addCustomStep(async ({ journeyRunner }) => {
      await journeyRunner.startJourney('/path/to/journey');
    })
    // Log detected patterns to console
    .addStep(AdaptiveBlocks.detectAndLogPatterns())
    .execute();
});

// Output:
// Detected journey patterns: {
//   "errorDisplay": "inline",
//   "summaryList": "dl",
//   "changeAnswers": false,
//   "backNavigation": "button",
//   "smartQuotes": true
// }
```

### Extract Summary Data

```typescript
test('should extract summary data', async ({ page, journeyRunner, componentHelper }) => {
  const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

  await builder
    // ... complete journey to check answers ...
    .addCustomStep(async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading('Check your answers');
    })
    // Extract all summary data regardless of pattern
    .addStep(AdaptiveBlocks.getSummaryData())
    // Use the extracted data
    .addCustomStep(async ({ journeyRunner }) => {
      const data = journeyRunner.getData('summaryData');
      console.log('Summary data:', data);
      // Verify specific fields
      if (data['Company Name'] !== 'Expected Name') {
        throw new Error('Company name mismatch');
      }
    })
    .execute();
});
```

## API Reference

### PatternDetector Methods

#### `detectPatterns(): Promise<JourneyPatterns>`
Detect all patterns used by the current page.

#### `detectErrorDisplayPattern(): Promise<'summary' | 'inline' | 'both' | 'none'>`
Detect how errors are displayed.

#### `detectSummaryListPattern(): Promise<'govuk-summary-list' | 'dl' | 'table' | 'none'>`
Detect summary list pattern on check answers page.

#### `detectChangeAnswerSupport(): Promise<boolean>`
Detect if change answer links are present.

#### `detectBackNavigationPattern(): Promise<'button' | 'link' | 'both' | 'none'>`
Detect back navigation pattern.

#### `detectSmartQuotes(): Promise<boolean>`
Detect if page uses smart quotes.

#### `getSummaryData(): Promise<Record<string, string>>`
Get summary list data regardless of pattern.

#### `verifySummaryData(expected: Record<string, string>): Promise<void>`
Verify summary data matches expected values (pattern-agnostic).

#### `getErrorMessages(): Promise<string[]>`
Get all error messages regardless of pattern.

#### `verifyErrors(expectedErrors: string[]): Promise<void>`
Verify errors are displayed (pattern-agnostic).

### AdaptiveBlocks Methods

#### `verifyErrors(expectedErrors: string[]): StepBlock`
Verify errors - adapts to summary or inline error patterns.

#### `verifySummaryData(expected: Record<string, string>): StepBlock`
Verify summary data - adapts to GOV.UK list, `<dl>`, or table patterns.

#### `getSummaryData(): StepBlock`
Get summary data - returns data regardless of pattern.

#### `changeAnswerIfSupported(key: string, newValue: string): StepBlock`
Change answer if supported - gracefully handles journeys without change links.

#### `goBack(): StepBlock`
Navigate back - adapts to button or link patterns.

#### `detectAndLogPatterns(): StepBlock`
Detect and log journey patterns - useful for debugging.

#### `checkAnswersAndSubmit(heading: string, expectedData?: Record<string, string>): StepBlock`
Complete check answers and submit - adapts to any pattern.

#### `smartVerifyErrors(expectedErrors: string[]): StepBlock`
Smart error verification that works with any pattern.

#### `smartVerifySummary(expected: Record<string, string>): StepBlock`
Smart summary verification that works with any list pattern.

#### `conditionalChangeAnswer(key: string, newValue: string, fallbackAction?: StepBlock): StepBlock`
Conditional change answer - only attempts if supported, with optional fallback.

## Pattern Support Matrix

| Pattern | Supported Variants | Detection Method |
|---------|-------------------|------------------|
| **Errors** | Error summary, Inline errors, Both, None | `.govuk-error-summary`, `text=Error:` |
| **Summary** | GOV.UK list, `<dl>`, Table, None | `.govuk-summary-list`, `dl`, `table` |
| **Change** | Links present, No links | `a:has-text("Change")` |
| **Back** | Button, Link, Both, None | `button[name="Back"]`, `a[name="Back"]` |
| **Quotes** | Smart quotes, Standard | Unicode chars `\u2018\u2019` |

## Best Practices

### 1. Always Detect Patterns First

```typescript
await builder
  .addCustomStep(async ({ journeyRunner }) => {
    await journeyRunner.startJourney('/path');
  })
  .addStep(AdaptiveBlocks.detectAndLogPatterns()) // Detect first
  // ... rest of test
```

### 2. Use Adaptive Blocks for Cross-Journey Tests

```typescript
// ✅ Good - works across all journeys
.addStep(AdaptiveBlocks.smartVerifyErrors(['Required field']))

// ❌ Bad - assumes specific pattern
.addStep(async ({ componentHelper }) => {
  await componentHelper.verifyErrorSummary(['Required field']);
})
```

### 3. Handle Unsupported Features Gracefully

```typescript
// ✅ Good - gracefully handles unsupported change
.addStep(AdaptiveBlocks.changeAnswerIfSupported('Field', 'New Value'))

// ❌ Bad - fails if change not supported
.addStep(async ({ componentHelper }) => {
  await componentHelper.clickChangeLink('Field');
})
```

### 4. Extract Data for Verification

```typescript
// ✅ Good - extract then verify
.addStep(AdaptiveBlocks.getSummaryData())
.addCustomStep(async ({ journeyRunner }) => {
  const data = journeyRunner.getData('summaryData');
  // Verify data
})

// ❌ Bad - assumes specific keys exist
.addCustomStep(async ({ componentHelper }) => {
  await componentHelper.verifySummaryRow('Company name', 'Acme');
})
```

### 5. Log Patterns for Debugging

```typescript
// Add pattern detection to failing tests
.addStep(AdaptiveBlocks.detectAndLogPatterns())
// Check console output to see what patterns were detected
```

## Integration with Spec Generation

### Journey Config Metadata

Add detected patterns to journey configs:

```json
{
  "id": "register-a-company",
  "patterns": {
    "errorDisplay": "inline",
    "summaryList": "dl",
    "changeAnswers": false,
    "backNavigation": "button",
    "smartQuotes": true
  }
}
```

### Spec Generation Flow

1. **Analyze journey config** → Extract pages, components, validation
2. **Detect patterns** → Run PatternDetector on journey
3. **Select templates** → Choose test templates based on patterns
4. **Generate tests** → Use AdaptiveBlocks for cross-pattern compatibility
5. **Validate** → Ensure generated tests match journey capabilities

### Template Selection Logic

```typescript
if (patterns.errorDisplay === 'summary') {
  // Use error summary verification
} else if (patterns.errorDisplay === 'inline') {
  // Use inline error verification
} else {
  // Use adaptive verification
}
```

## Migration Guide

### Updating Existing Tests

**Before (Pattern-specific):**
```typescript
await componentHelper.verifyErrorSummary(['Error message']);
await componentHelper.verifySummaryRow('Key', 'Value');
await componentHelper.clickChangeLink('Key');
```

**After (Adaptive):**
```typescript
await AdaptiveBlocks.smartVerifyErrors(['Error message'])(context);
await AdaptiveBlocks.smartVerifySummary({ 'Key': 'Value' })(context);
await AdaptiveBlocks.changeAnswerIfSupported('Key', 'New Value')(context);
```

### Using with JourneyBuilder

```typescript
const builder = new JourneyBuilder(page, journeyRunner, componentHelper);

await builder
  .addStep(AdaptiveBlocks.detectAndLogPatterns())
  .addStep(AdaptiveBlocks.smartVerifyErrors(['Error']))
  .addStep(AdaptiveBlocks.smartVerifySummary({ 'Key': 'Value' }))
  .addStep(AdaptiveBlocks.changeAnswerIfSupported('Key', 'New'))
  .execute();
```

## Examples

See working examples in:
- `tests/journeys/register-a-company-adaptive.spec.ts` - Full adaptive test suite
- `tests/journeys/register-a-company-simple.spec.ts` - Simple direct approach
- `tests/journeys/register-a-company-realistic.spec.ts` - Journey-specific approach

## Troubleshooting

### Pattern Not Detected

**Problem:** `detectPatterns()` returns `'none'` for a pattern that exists.

**Solution:** Check selector in `PatternDetector`. Add new selector if needed:

```typescript
// In PatternDetector.ts
async detectErrorDisplayPattern() {
  const hasErrorSummary = await this.page.locator('.govuk-error-summary').isVisible();
  const hasInlineErrors = await this.page.locator('text=Error:').isVisible();
  const hasCustomErrors = await this.page.locator('.custom-error').isVisible(); // Add new
  // ...
}
```

### False Positive Detection

**Problem:** Pattern detected when it shouldn't be.

**Solution:** Make detection more specific:

```typescript
// Before - too broad
const hasChangeLinks = await this.page.locator('a:has-text("Change")').count() > 0;

// After - more specific
const hasChangeLinks = await this.page.locator('.govuk-summary-list__actions a:has-text("Change")').count() > 0;
```

### Verification Fails

**Problem:** `verifySummaryData()` can't find expected key.

**Solution:** Use `getSummaryData()` to see actual keys:

```typescript
const detector = new PatternDetector(page);
const data = await detector.getSummaryData();
console.log('Available keys:', Object.keys(data));
// Use exact keys from output
```

## Future Enhancements

1. **Pattern caching** - Cache detected patterns for performance
2. **Pattern hints** - Allow tests to hint expected patterns
3. **Pattern validation** - Validate journey configs match actual patterns
4. **Pattern migration** - Auto-migrate tests when patterns change
5. **Pattern analytics** - Track pattern usage across journeys

## Conclusion

Adaptive blocks enable:
- ✅ **Cross-journey compatibility** - Tests work across different implementations
- ✅ **Graceful degradation** - Handle unsupported features elegantly
- ✅ **Future-proof tests** - Adapt to pattern changes automatically
- ✅ **Spec generation ready** - Foundation for automated test generation

Use adaptive blocks when writing tests that need to work across multiple journeys or when journey patterns may change over time.
