# Playwright POC QA Workspace

This workspace contains Playwright tests for validating the GOV.UK journey applications.

## Test Structure

- `tests/` - All test files
  - `tests/generated/` - Auto-generated tests from journey configurations
  - `tests/components/` - Component-level tests
  - `tests/journeys/` - Manual journey tests

## Running Tests

### Local Development

To run all tests:

```bash
npm test
```

To run generated tests only:

```bash
npx playwright test tests/generated/
```

To run a specific generated test:

```bash
npx playwright test tests/generated/[test-name].spec.ts
```

To run tests with UI:

```bash
npm run test:ui
```

## CI/CD Integration

### GitHub Actions Workflow

The repository includes a GitHub Actions workflow that automatically runs tests when:
- Pushing to the `main` branch
- Creating a pull request targeting the `main` branch

The workflow performs the following steps:

1. Checks out the repository
2. Sets up Node.js
3. Installs dependencies for all workspaces
4. Installs Playwright browsers
5. Runs standard Playwright tests
6. Checks for and runs generated tests
7. Uploads test reports as artifacts
8. Creates a test summary

### Generated Tests

The workflow automatically detects and runs any tests in the `tests/generated/` directory. These tests are created by the test generation pipeline in the `playwright-poc-gen-ui` workspace.

If generated tests fail, the workflow will continue and mark the failures in the summary, but will not fail the entire workflow. This allows for continuous development while the test generation system is being improved.

### Test Reports

Test reports are available as artifacts in the GitHub Actions workflow run:

- `playwright-report` - Standard test results
- `playwright-report-generated` - Generated test results (if applicable)

## Generating Tests

To generate tests from journey configurations, use the following command from the root directory:

```bash
npm run gen:tests -- --journey=<journey-id>
```

Or to generate tests for all journeys:

```bash
npm run gen:tests -- --all