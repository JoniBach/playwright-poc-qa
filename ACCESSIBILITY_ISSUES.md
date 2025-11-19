# 🔍 Accessibility Issues Found

## Summary

The Playwright accessibility tests have identified **real WCAG 2.1 violations** in the application. These should be addressed to ensure the application is accessible to all users.

## Critical Issues (Must Fix)

### 1. Missing Page Titles (WCAG 2.4.2 - Level A)

**Severity**: 🔴 SERIOUS  
**WCAG Level**: A (Required)  
**Impact**: High

**Problem**:
- Pages don't have `<title>` elements
- Screen readers can't announce page titles
- Browser tabs show generic or no titles
- Users can't identify pages in browser history

**Affected Pages**:
- Home page (`/`)
- All journey pages (`/civil-aviation-authority/register-a-plane/apply`)

**How to Fix**:

In your Svelte app, ensure each page has a proper `<title>` tag:

```svelte
<!-- src/routes/+layout.svelte or GovUKPage.svelte -->
<svelte:head>
  <title>{pageTitle} - Civil Aviation Authority - GOV.UK</title>
</svelte:head>
```

For journey pages, make titles dynamic:
```svelte
<!-- Example for journey pages -->
<script>
  export let pageTitle = 'Register a plane';
</script>

<svelte:head>
  <title>{pageTitle} - Register a plane - GOV.UK</title>
</svelte:head>
```

**Example Good Titles**:
- Home: `"Civil Aviation Authority - GOV.UK"`
- Journey start: `"Register a plane - Civil Aviation Authority - GOV.UK"`
- Journey step: `"Who is registering the aircraft? - Register a plane - GOV.UK"`

**WCAG Reference**: [2.4.2 Page Titled](https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html)

## Minor Issues (AAA Level - Optional)

### 2. Color Contrast Enhanced (WCAG 1.4.6 - Level AAA)

**Severity**: ⚠️ MODERATE  
**WCAG Level**: AAA (Enhanced)  
**Impact**: Low

**Problem**:
- GOV.UK green button has 6.2:1 contrast ratio
- WCAG AAA requires 7:1 for enhanced contrast
- **Note**: This PASSES WCAG AA (4.5:1) ✅

**Affected Elements**:
- Continue buttons (GOV.UK green: #00703c on white text)

**Status**: ✅ **PASSES WCAG 2.1 AA** (Required level)

**Action**: No action required unless targeting AAA compliance

**Details**:
- Current: 6.2:1 contrast ratio
- AA Required: 4.5:1 ✅ PASS
- AAA Required: 7:1 ❌ FAIL (but AAA is optional)

**WCAG Reference**: [1.4.6 Contrast Enhanced](https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html)

## Test Results

### Current Status
- ✅ **Form labels**: All passing
- ✅ **Color contrast (AA)**: Passing
- ❌ **Page titles**: Failing (must fix)
- ❌ **Color contrast (AAA)**: Failing (optional)

### Test Commands

```bash
# Run all accessibility tests
npm run test:a11y

# Run with known issues documented
npm test tests/accessibility/wcag-with-known-issues.spec.ts

# View detailed report
npm run test:report
```

## Recommendations

### Immediate Actions (This Sprint)
1. ✅ **Add page titles** to all pages
   - Update `GovUKPage.svelte` or layout component
   - Make titles dynamic based on journey step
   - Follow GOV.UK title pattern: `[Page] - [Service] - GOV.UK`

### Short Term (Next Sprint)
2. **Verify fix** with accessibility tests
3. **Add title tests** to prevent regression
4. **Document title patterns** for future pages

### Long Term (Ongoing)
5. **Regular accessibility audits** with each release
6. **Manual testing** with screen readers
7. **User testing** with people who use assistive technology

## How to Fix in Your Codebase

### Step 1: Find Your Layout Component

Look for:
- `src/routes/+layout.svelte`
- `src/lib/components/GovUKPage.svelte`
- Any component that wraps all pages

### Step 2: Add Dynamic Title Support

```svelte
<script lang="ts">
  export let title: string = 'Civil Aviation Authority';
  export let serviceName: string = '';
  
  $: fullTitle = serviceName 
    ? `${title} - ${serviceName} - GOV.UK`
    : `${title} - GOV.UK`;
</script>

<svelte:head>
  <title>{fullTitle}</title>
</svelte:head>
```

### Step 3: Use in Journey Pages

```svelte
<GovUKPage 
  title="Who is registering the aircraft?"
  serviceName="Register a plane"
>
  <!-- page content -->
</GovUKPage>
```

### Step 4: Verify with Tests

```bash
npm run test:a11y
```

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)

### GOV.UK Standards
- [GOV.UK Accessibility](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction)
- [GOV.UK Page Titles](https://design-system.service.gov.uk/styles/page-template/#page-title)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Screen Reader Testing](https://www.gov.uk/service-manual/technology/testing-with-assistive-technologies)

## Questions?

If you need help fixing these issues, I can:
1. Show you exactly where to add titles in your Svelte code
2. Create a reusable title component
3. Add tests to prevent regression
4. Help with manual accessibility testing

Let me know how you'd like to proceed!
