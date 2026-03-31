# {{PROJECT_NAME}} Development Workflow

## Purpose

Keep day-to-day development stable while preserving a clean `{{DEV_BRANCH}}`
lane for integration and a clean `{{MAIN_BRANCH}}` lane for release validation.

## Canonical Working Layout

- `{{DEV_WORKSPACE_PATH}}`
  - active development workspace
  - may be dirty and in-progress
- `{{DEVELOP_CLEAN_PATH}}`
  - clean integration and dev/release lane
  - branch: `{{DEV_BRANCH}}`
  - must stay clean
- `{{TRUNK_CLEAN_PATH}}`
  - clean trunk validation lane
  - branch: `{{MAIN_BRANCH}}`
  - must stay clean

## Ground Rules

1. Never do day-to-day edits directly on `{{MAIN_BRANCH}}`.
2. All code changes happen on `codex/*` branches.
3. {{THREADMASTER_ROLE}} reconstructs release-facing work in a clean dev/release lane before recommending merge.
4. Merge release-facing implementation into `{{DEV_BRANCH}}` first.
5. Promote `{{DEV_BRANCH}}` to `{{MAIN_BRANCH}}` only after regression testing and {{OPERATOR_ROLE}} sign-off.
6. Validate release and smoke checks from clean worktrees, not from a dirty dev tree.

## Release Lane Flow

1. Implement on `codex/*`
2. Hand off using `ops/runbooks/threadmaster-handoff.md`
3. {{THREADMASTER_ROLE}} reconstructs and validates in a clean dev/release lane
4. Merge into `{{DEV_BRANCH}}`
5. Build and test the dev artifact from `{{DEV_BRANCH}}`
6. Hand the clean lane to the {{OPERATOR_ROLE}} or human for final smoke validation
7. Record sign-off
8. Promote the tested commit from `{{DEV_BRANCH}}` to `{{MAIN_BRANCH}}`

## Minimum Validation

Run the most direct checks for the touched surface. The default baseline is:

```bash
{{PACKAGE_MANAGER_INSTALL_COMMAND}}
{{CI_BUILD_COMMAND}}
{{CI_CHECK_COMMAND}}
{{CI_TEST_COMMAND}}
{{CI_PROTOCOL_COMMAND}}
{{CI_DASHBOARD_COMMAND}}
```
