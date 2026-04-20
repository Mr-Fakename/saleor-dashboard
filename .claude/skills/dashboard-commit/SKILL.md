---
name: dashboard-commit
description: Commit changes in the dashboard with GraphQL codegen, i18n extraction, and Husky lint-staged handling. Use when asked to "commit", "commit changes", or any git commit task in saleor-dashboard/.
---

# Dashboard Commit

## Workflow

1. Run `git status` and `git diff` (staged + unstaged) to understand all changes
2. Stage relevant files with `git add` (specific files, never `git add -A`)
3. Run codegen/extraction if needed:
   - If `mutations.ts` or `queries.ts` files changed → `pnpm run generate`, then stage `*.generated.ts` files
   - If react-intl messages changed (`<FormattedMessage>`, `intl.formatMessage()`) → `pnpm run extract-messages`, then stage `locale/defaultMessages.json`
4. Write a comprehensive commit message using HEREDOC format
5. Run `git commit`
6. If Husky lint-staged fails, follow error resolution below and retry

## Commit Message Format

```bash
git commit -m "$(cat <<'EOF'
Short summary of changes

Detailed description of what was changed and why.
List specific modifications when multiple files are affected.

EOF
)"
```

## Auto-Generated Files

These files should never be manually edited — always regenerate:

- `src/graphql/hooks.generated.ts` — from `pnpm run generate`
- `src/graphql/typePolicies.generated.ts` — from `pnpm run generate`
- `src/graphql/fragmentTypes.generated.ts` — from `pnpm run generate`
- `src/graphql/types.generated.ts` — from `pnpm run generate`
- `locale/defaultMessages.json` — from `pnpm run extract-messages`

## Husky Lint-Staged Failure Recovery

### ESLint errors

1. Run `pnpm run lint` to auto-fix what's possible
2. Read remaining errors and fix manually
3. Stage fixed files, retry commit

### Prettier formatting

1. Lint-staged auto-formats via Prettier
2. Stage the auto-formatted files: `git add <files>`
3. Retry the commit (new commit, not `--amend`)

## Rules

- **Never** use `git add -A` or `git add .`
- **Never** manually resolve auto-generated `*.generated.ts` files — regenerate instead
- Always check if GraphQL query/mutation files changed and run codegen before committing
- Always check if i18n messages changed and run `pnpm run extract-messages` before committing
- Include `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` in the commit message
