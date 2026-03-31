# Branching & Merge Rules

## Branch Naming

| Prefix | Purpose | Example |
| --- | --- | --- |
| `codex/*` | Implementation work | `codex/runtime-guard` |
| `fix/*` | Focused bug fix | `fix/install-regression` |
| `feat/*` | Product feature | `feat/new-provider` |
| `salvage/*` | Backup of risky local state | `salvage/pre-cleanup-20260331` |

`{{DEV_BRANCH}}` is the private integration branch for release-facing work.
`{{MAIN_BRANCH}}` is the stable release trunk. Never develop directly on it.

## Merge Rules

1. All work happens on `codex/*` or another approved implementation branch.
2. Reconstruct and validate in the clean dev/release lane before any recommendation to merge.
3. Merge release-facing implementation into `{{DEV_BRANCH}}` first unless the owner explicitly overrides this.
4. {{OPERATOR_ROLE}} or human smoke testing happens after clean-lane validation and before `{{MAIN_BRANCH}}`.
5. Promote `{{DEV_BRANCH}}` to `{{MAIN_BRANCH}}` only after regression testing and {{OPERATOR_ROLE}} sign-off.
6. Use fast-forward merges when possible.
7. If fast-forward fails, rebase onto the target branch first.

## Worktree Rules

1. Primary dev workspace: `{{DEV_WORKSPACE_PATH}}`
2. Clean integration workspace: `{{DEVELOP_CLEAN_PATH}}`
3. Clean trunk workspace: `{{TRUNK_CLEAN_PATH}}`
4. Never have two worktrees on the same branch.
5. Document every worktree in `ops/slices/REGISTRY.md`.
