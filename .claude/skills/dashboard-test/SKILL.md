---
name: dashboard-test
description: Run Jest and Playwright tests in the dashboard. Use when asked to "run tests", "test this", or any test execution task in saleor-dashboard/. Knows correct commands and test patterns.
---

# Dashboard Test Runner

The dashboard uses Jest for unit tests and Playwright for E2E tests.

## Unit Tests (Jest)

### Run a specific test file (recommended)

```bash
pnpm run test:quiet <file_path>
```

Console output is suppressed. Use for clean output.

### Debug a failing test

```bash
pnpm run test:debug <file_path>
```

Full console output + extended React Testing Library output (DEBUG_PRINT_LIMIT=20000).

### Run with pattern matching

```bash
pnpm run test:quiet --testPathPattern="ProductList"
```

**Never** run `pnpm run test` without a file path — it runs ALL tests and can freeze the system.

## E2E Tests (Playwright)

```bash
pnpm e2e <spec-file>
```

Or with grep:

```bash
npx playwright test --grep "#e2e"
```

## Test Selection

Run most-likely-to-fail first:

1. The specific test file you changed or created
2. Related test files in the same module
3. Full module only if architecture changed

## Writing Tests

### Structure

Use `// Arrange // Act // Assert` comments:

```typescript
it("should render product name", () => {
  // Arrange
  const product: Product = { name: "Test Product", id: "123" };

  // Act
  render(<ProductCard product={product} />);

  // Assert
  expect(screen.getByText("Test Product")).toBeInTheDocument();
});
```

### Fixtures

- Declare test fixtures with explicit types: `const fixture: FixtureType = {...}`
- Use existing fixtures from `fixtures.ts` files when available
- Prefer fixtures over mocking

### Mocking

- Mock GraphQL operations using Apollo MockedProvider
- Mock at the boundary, not deep internals

## Test Artifacts

- Jest output: console (use `test:debug` for full output)
- Playwright screenshots: `test-results/`
- Playwright traces: `test-results/`
