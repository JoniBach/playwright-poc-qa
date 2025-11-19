# Quick Start Guide

## 🚀 Running Tests

### Prerequisites
Make sure the UI application is running:
```bash
# From the root directory
npm run ui
# Or from playwright-poc-ui directory
cd ../playwright-poc-ui && npm run dev
```

The app should be running on `http://localhost:5173`

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Journey tests only
npm run test:journeys

# Component tests only
npm run test:components

# Validation tests only
npm run test:validation

# Accessibility tests only
npm run test:a11y

# Visual regression tests only
npm run test:visual
```

### Run Tests by Tag
```bash
# Smoke tests (critical path)
npm run test:smoke

# Full regression suite
npm run test:regression
```

### Interactive Test Modes
```bash
# UI Mode - Interactive test runner
npm run test:ui

# Headed Mode - See browser while tests run
npm run test:headed

# Debug Mode - Step through tests
npm run test:debug
```

### View Test Reports
```bash
npm run test:report
```

## 📁 Test Structure

```
tests/
├── journeys/              # End-to-end journey tests
│   ├── register-a-plane.spec.ts          # Original test
│   └── register-a-plane-refactored.spec.ts  # Using helpers
├── components/            # Component-level tests
│   ├── text-input.spec.ts
│   └── radios.spec.ts
├── validation/            # Form validation tests
│   └── required-fields.spec.ts
├── accessibility/         # A11y tests
│   └── wcag-compliance.spec.ts
└── visual/               # Visual regression tests
    └── component-screenshots.spec.ts
```

## 🛠️ Helpers & Utilities

### JourneyRunner
Simplifies multi-step journey testing:
```typescript
const journey = new JourneyRunner(page);
await journey.startJourney('/path/to/journey');
await journey.selectRadio('Option 1');
await journey.fillStep({ 'Field': 'Value' });
await journey.continue();
```

### ComponentHelper
GOV.UK component interactions:
```typescript
const helper = new ComponentHelper(page);
await helper.getTextInput('Email').fill('test@example.com');
await helper.verifyErrorSummary(['Error 1', 'Error 2']);
```

### TestDataFactory
Generate realistic test data:
```typescript
const contact = TestDataFactory.generateContactDetails();
const aircraft = TestDataFactory.generateAircraftData();
const email = TestDataFactory.generateEmail('test');
```

### AccessibilityHelper
WCAG compliance testing:
```typescript
const a11y = new AccessibilityHelper(page);
const results = await a11y.scanWCAG_AA();
expect(results.violations).toEqual([]);
```

## 📦 Page Objects

Use Page Object Models for maintainable tests:
```typescript
import { TextInputComponent } from '../page-objects/components/TextInputComponent';

const nameInput = new TextInputComponent(page, 'full-name');
await nameInput.fill('John Smith');
await nameInput.assertValue('John Smith');
```

## 🏷️ Test Tags

Tag your tests for easy filtering:
- `@smoke` - Critical path tests
- `@regression` - Full regression suite
- `@component` - Component tests
- `@journey` - Journey tests
- `@a11y` - Accessibility tests
- `@visual` - Visual regression tests

Example:
```typescript
test('should complete journey @smoke @journey', async ({ page }) => {
  // test code
});
```

## 🔧 Configuration

### Environment Variables
```bash
# Set test environment
export TEST_ENV=staging

# Set base URL
export BASE_URL=http://localhost:5173
```

### Playwright Config
Edit `playwright.config.ts` to customize:
- Browser configurations
- Timeouts
- Retries
- Reporters
- Screenshots/videos

## 📊 CI/CD Integration

The `.github/workflows/playwright.yml` is already configured to:
- Run on push to main/master
- Run on pull requests
- Upload test reports as artifacts
- Run tests in parallel across browsers

## 💡 Best Practices

1. **Use Page Objects** - Keep selectors in POMs, not in tests
2. **Generate Test Data** - Use TestDataFactory for dynamic data
3. **Tag Tests** - Use tags for smoke/regression filtering
4. **Independent Tests** - Each test should be runnable in isolation
5. **Descriptive Names** - Clear test descriptions
6. **Proper Assertions** - Use Playwright's built-in assertions
7. **Clean Up** - Tests should not leave side effects

## 🐛 Debugging

### View Test Traces
```bash
npx playwright show-trace test-results/path-to-trace.zip
```

### Run Single Test
```bash
npx playwright test tests/journeys/register-a-plane.spec.ts
```

### Run Single Test in Debug Mode
```bash
npx playwright test tests/journeys/register-a-plane.spec.ts --debug
```

### Headed Mode with Slow Motion
```bash
npx playwright test --headed --slow-mo=1000
```

## 📝 Writing New Tests

### 1. Journey Test Template
```typescript
import { test, expect } from '../../fixtures/base.fixture';

test.describe('My Journey @journey', () => {
  test('should complete journey @smoke', async ({ page, journeyRunner }) => {
    await journeyRunner.startJourney('/my-journey/path');
    await journeyRunner.verifyHeading('Page Title');
    await journeyRunner.selectRadio('Option');
    await journeyRunner.continue();
    // ... continue through journey
  });
});
```

### 2. Component Test Template
```typescript
import { test, expect } from '../../fixtures/base.fixture';
import { ComponentPOM } from '../../page-objects/components/ComponentPOM';

test.describe('Component Name @component', () => {
  test('should behave correctly', async ({ page }) => {
    const component = new ComponentPOM(page, 'field-name');
    await component.interact();
    await component.assertState();
  });
});
```

### 3. Accessibility Test Template
```typescript
import { test, expect } from '@playwright/test';
import { AccessibilityHelper } from '../../helpers/AccessibilityHelper';

test.describe('Page Accessibility @a11y', () => {
  test('should have no violations', async ({ page }) => {
    const a11y = new AccessibilityHelper(page);
    await page.goto('/page-path');
    const results = await a11y.scanWCAG_AA();
    expect(results.violations).toEqual([]);
  });
});
```

## 🎯 Next Steps

1. Start the UI application (`npm run ui` from root)
2. Run the example tests (`npm test`)
3. View the test report (`npm run test:report`)
4. Try UI mode for interactive testing (`npm run test:ui`)
5. Write your own tests using the templates above
6. Add more Page Objects for your components
7. Expand test coverage for all 20 journeys

Happy Testing! 🚀
