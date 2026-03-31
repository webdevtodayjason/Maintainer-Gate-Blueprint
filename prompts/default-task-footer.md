Start this task and follow the project ops workflow exactly.

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
2. Check or create the {{ISSUE_TRACKER_NAME}} issue.
3. Claim a slice in `ops/slices/REGISTRY.md` and work on a scoped `codex/*` branch.
4. Use an isolated worktree if the current workspace is dirty or unsafe.
5. Keep the slice narrow. Do not mix unrelated work or overwrite other agents' changes.
6. Update the relevant ops tracking and append to `ops/log/JOURNAL.md`.
7. If docs are affected:
   - update internal docs in `{{REPO_NAME}}` as needed
   - treat `{{DOCS_REPO_PATH}}` as a separate repo with a separate slice and separate handoff if public docs need changes
8. Run the most direct validation for the touched surface and report results truthfully as `PASS`, `FAIL`, or `NOT RUN`.
9. If handoff is needed, use the canonical packet in `ops/runbooks/threadmaster-handoff.md`.

Complete the implementation and report back with:
- problem summary and root cause
- code changes made
- docs and ops changes made
- tests and verification performed
- why the issue is resolved
- remaining risks, assumptions, or follow-ups
