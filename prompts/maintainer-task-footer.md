Start this task and follow the project ops workflow exactly.

This task must be prepared for {{THREADMASTER_ROLE}} and {{OPERATOR_ROLE}} intake.

Required workflow:
1. Read the relevant ops guidance first:
   - `{{REPO_ROOT_PATH}}/ops/README.md`
   - `{{REPO_ROOT_PATH}}/ops/rules/agent-coordination.md`
   - `{{REPO_ROOT_PATH}}/ops/rules/branching.md`
   - `{{REPO_ROOT_PATH}}/ops/runbooks/dev-workflow.md`
   - `{{REPO_ROOT_PATH}}/ops/runbooks/slice-management.md`
   - `{{REPO_ROOT_PATH}}/ops/runbooks/threadmaster-handoff.md`
   - `{{REPO_ROOT_PATH}}/AGENTS.md`
   - `{{REPO_ROOT_PATH}}/CLAUDE.md`
2. Check or create the {{ISSUE_TRACKER_NAME}} issue and use it as the tracking source of truth.
3. Claim a slice in `ops/slices/REGISTRY.md` and work on a scoped `codex/*` branch.
4. Use an isolated worktree if the current workspace is dirty or if clean validation will matter.
5. Keep the implementation scoped and do not mix unrelated work.
6. If work spans multiple repos, create separate slices and separate handoff packets for each repo.
   - Public docs site repo: `{{DOCS_REPO_PATH}}`
   - Do not include docs-repo work inside a `{{REPO_NAME}}` handoff packet.
7. Update ops tracking, {{ISSUE_TRACKER_NAME}}, and `ops/log/JOURNAL.md` as you go.
8. Run the appropriate validation and report each result truthfully as `PASS`, `FAIL`, or `NOT RUN`.
9. Prepare a canonical {{THREADMASTER_ROLE}} handoff packet using `ops/runbooks/threadmaster-handoff.md`.
10. Run the machine check before handoff:
    - `node scripts/check-handoff.mjs <handoff-file>`
11. The handoff must explicitly state:
    - source-of-truth branch, worktree, commit, and tree state
    - intended files only
    - explicit exclusions
    - validation performed
    - {{OPERATOR_ROLE}} validation still required
    - that {{THREADMASTER_ROLE}} must reconstruct in the clean dev/release lane first
    - that {{OPERATOR_ROLE}} or human validation is required before any recommendation to merge to `{{MAIN_BRANCH}}`
12. Present the {{OPERATOR_ROLE}} with the handoff document.

Complete the implementation and report back with:
- problem summary and root cause
- code changes made
- docs and ops changes made
- tests and verification performed
- why the issue is resolved
- remaining risks, assumptions, or follow-ups
- exact handoff status, including whether `scripts/check-handoff.mjs` passed
