# Playwright QA Test Strategy

## Overview
Comprehensive test suite for the Playwright POC project, covering end-to-end journeys, component testing, validation, accessibility, and visual regression.

## Project Structure

```
playwright-poc-qa/
├── tests/
│   ├── journeys/           # End-to-end journey tests
│   ├── components/         # Component-level tests
│   ├── validation/         # Form validation tests
│   ├── accessibility/      # A11y tests
│   └── visual/            # Visual regression tests
├── fixtures/              # Custom Playwright fixtures
├── page-objects/          # Page Object Models (POM)
│   ├── components/        # Component POMs
│   └── pages/            # Page POMs
├── helpers/               # Test utilities & helpers
├── test-data/             # Test data & fixtures
└── config/                # Environment configs
```

## Test Layers

### 1. Component Tests (`tests/components/`)
Test individual GOV.UK components in isolation:
- Text inputs, radios, checkboxes
- Buttons, links, accordions
- Error summaries, notifications
- Component rendering and interactions

### 2. Journey Tests (`tests/journeys/`)
End-to-end user journey tests:
- Happy path scenarios
- Alternative flows
- Conditional routing
- Multi-page journeys

### 3. Validation Tests (`tests/validation/`)
Form validation and error handling:
- Required field validation
- Pattern matching (email, phone, etc.)
- Custom validation rules
- Error message display

### 4. Accessibility Tests (`tests/accessibility/`)
WCAG 2.1 AA compliance:
- Automated a11y scans
- Keyboard navigation
- Screen reader compatibility
- Focus management

### 5. Visual Regression Tests (`tests/visual/`)
Screenshot comparison and visual consistency:
- Component screenshots
- Page screenshots
- Cross-browser comparison
- Responsive design verification

## Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:journeys
npm run test:components
npm run test:a11y
npm run test:visual

# Run with UI mode
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug

# View test report
npm run test:report

# Run smoke tests only
npm run test:smoke

# Run regression tests
npm run test:regression
```

## Test Tags

Tests are tagged for easy filtering:
- `@smoke` - Critical path tests
- `@regression` - Full regression suite
- `@component` - Component tests
- `@journey` - Journey tests
- `@a11y` - Accessibility tests
- `@visual` - Visual regression tests

## Page Object Model (POM)

All tests use the Page Object Model pattern for maintainability:
- Component POMs in `page-objects/components/`
- Page POMs in `page-objects/pages/`
- Reusable methods and selectors
- Type-safe with TypeScript

## Test Data

Test data is managed in `test-data/`:
- Journey fixtures from existing JSON files
- User data factories
- Mock API responses
- Environment-specific data

## CI/CD Integration

Tests are integrated into CI/CD pipeline:
- Smoke tests on every PR
- Full regression on main branch
- Visual regression on staging
- Parallel execution across browsers
- HTML and JSON reports as artifacts

## Writing Tests

### Example Component Test
```typescript
import { test, expect } from '@playwright/test';
import { TextInputComponent } from '../page-objects/components/TextInputComponent';

test('text input should display error message', async ({ page }) => {
  const textInput = new TextInputComponent(page, 'email');
  await textInput.fill('invalid-email');
  await textInput.blur();
  await expect(textInput.errorMessage).toBeVisible();
});
```

### Example Journey Test
```typescript
import { test, expect } from '@playwright/test';
import { JourneyRunner } from '../helpers/JourneyRunner';

test('should complete register a plane journey', async ({ page }) => {
  const journey = new JourneyRunner(page, 'register-a-plane');
  await journey.start();
  await journey.fillStep('applicant-type', { type: 'individual' });
  await journey.continue();
  // ... continue through journey
  await journey.assertComplete();
});
```

## Best Practices

1. **Use Page Objects** - Keep selectors and actions in POMs
2. **Data-Driven Tests** - Use test data factories and fixtures
3. **Descriptive Test Names** - Clear test descriptions
4. **Proper Assertions** - Use specific Playwright assertions
5. **Clean Test Data** - Clean up after tests
6. **Parallel Execution** - Write independent tests
7. **Screenshot on Failure** - Automatic screenshots enabled
8. **Trace on Retry** - Traces captured for debugging

## Maintenance

- Update POMs when UI changes
- Review and update test data regularly
- Keep dependencies up to date
- Monitor test execution times
- Review flaky tests and fix root causes
