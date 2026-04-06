# Runbook: Bug Patrol ({{AUTOMATION_MAC_NAME}})

> **This station is BUG-ONLY.** Runs on the {{AUTOMATION_MAC_NAME}}. Monitors GitHub Issues, auto-fixes bugs, and escalates feature requests to the {{OPERATOR_ROLE}} who hands them off to Feature Patrol on the {{PRIMARY_MAC_NAME}}.
>
> **See also:** `ops/runbooks/feature-patrol.md` — the {{PRIMARY_MAC_NAME}}'s feature development loop.

## Two Stations, Two Roles

| Station | Mac | Session | Role |
|---------|-----|---------|------|
| **Bug Patrol** (this runbook) | {{AUTOMATION_MAC_NAME}} | `{{AUTOMATION_MAC_SESSION}}` | Auto-fix bugs, escalate features |
| **Feature Patrol** | {{PRIMARY_MAC_NAME}} | `{{PRIMARY_MAC_SESSION}}` | Build approved features, monitor |

Bug Patrol never builds features. Feature Patrol never auto-fixes bugs without an issue. Both share the same quality gates (`ops/runbooks/pr-workflow.md`).

## How to Enable

Start the bug patrol loop:

```
/loop 30m Bug Patrol: Check gh issue list --repo {{GH_ORG}}/{{REPO_NAME}} --state open for new issues. Classify as BUG or FEATURE REQUEST. Fix bugs on branch, create PR, wait for CI + review, then send PR email. Escalate feature requests. Check site health: curl {{SITE_URL}}. Follow ops/runbooks/bug-patrol.md and ops/runbooks/pr-workflow.md.
```

## What Bug Patrol Does

Every cycle:

1. **Health check**: `curl -s -o /dev/null -w "%{http_code}" {{SITE_URL}}` — alert if non-200
2. **CI health check**: `bash scripts/check-ci-health.sh --auto-issue` — if CI is red on `{{MAIN_BRANCH}}`, auto-creates a GitHub issue with failure details, which Bug Patrol then picks up and fixes
3. **Check issues**: `gh issue list --repo {{GH_ORG}}/{{REPO_NAME}} --state open`
4. **Classify** each issue as BUG or FEATURE REQUEST (CI failure issues are bugs)
5. **For bugs** (including CI failures): Create branch, fix, PR, wait for CI + review, send PR email
6. **For feature requests**: Escalate — do NOT auto-implement

## Classification Rules

A **bug** is:
- Something that was working and broke (regression)
- Something that doesn't work as designed
- A crash, error, or data issue
- A security vulnerability
- A usability issue that prevents normal operation

A **feature request** is:
- "Can we add..."
- "I'd like to see..."
- "It would be nice if..."
- A new capability that doesn't exist yet
- A redesign or workflow change

### Gray Areas

- If it's blocking the user from completing a workflow → treat as bug, fix it
- If it's a "nice to have" or cosmetic → escalate as feature request
- When in doubt, ask — don't build

## Escalation Rules — Feature Requests

**CRITICAL: Only bugs get auto-fixed. Feature requests require {{OPERATOR_ROLE}} approval.**

When a feature request is found:

1. **Do NOT auto-implement** — this station handles bugs only
2. Comment on the GitHub issue: "This appears to be a feature request, not a bug. Escalating for approval."
3. **Send escalation email**: `bash scripts/send-escalation-email.sh <issue-number>`
4. **Stop here.** The {{OPERATOR_ROLE}} reviews and, if approved, hands to Feature Patrol.

### Feature Handoff Awareness

When scanning open issues, **skip issues that have been claimed by the feature agent.** Look for:
- A comment indicating another agent/developer is taking over
- Tags or labels indicating the issue is assigned to feature development
- Any comment from the {{OPERATOR_ROLE}} approving and assigning the work

## Bug Fix Workflow (Per Issue)

Follow `ops/runbooks/bug-fix.md`:

1. **Identify**: `gh issue view <number> --repo {{GH_ORG}}/{{REPO_NAME}}`
2. **Branch**: `git checkout -b auto/bugfix-{issue}`
3. **Scout**: Investigate root cause
4. **Fix**: Minimal change, follow project rules
5. **Local verify**: `{{CI_BUILD_COMMAND}}` must pass
6. **Create PR**: `gh pr create --repo {{GH_ORG}}/{{REPO_NAME}}`
7. **Wait for CI**: `gh pr checks {pr-number} --repo {{GH_ORG}}/{{REPO_NAME}} --watch` — if fails, fix and push
8. **Wait for code review**: Check for review comments — if suggestions, fix, push, comment on PR with what you changed (audit trail)
9. **Send PR email**: `bash scripts/send-pr-email.sh {pr-number}` — ONLY after CI green + review clear
10. **MERGE PR (MANDATORY)**: `gh pr merge {pr-number} --repo {{GH_ORG}}/{{REPO_NAME}} --merge --delete-branch` — **CI green + review clear + email sent = MERGE NOW. An unmerged green PR is an incomplete task. Do NOT move to the next bug until the PR is merged.**
11. **Close GitHub Issue**: `gh issue close <number> --repo {{GH_ORG}}/{{REPO_NAME}} --comment "Fixed in PR #X: ..."` with detailed resolution
12. **Update Changelog**: If the fix is significant

## Loop Behavior

- Runs every 30 minutes while the session is active
- Each cycle is independent — if no new issues, report "No new issues"
- Multiple issues in one cycle get handled in priority order (CRITICAL → HIGH → MEDIUM → LOW)

## Quick Reference

```bash
# Check open issues
gh issue list --repo {{GH_ORG}}/{{REPO_NAME}} --state open

# Close a GitHub issue
gh issue close <number> --repo {{GH_ORG}}/{{REPO_NAME}} --comment "Fixed: ..."

# Send feature request escalation email
bash scripts/send-escalation-email.sh <issue-number>

# Health check
curl -s -o /dev/null -w "%{http_code}" {{SITE_URL}}
```
