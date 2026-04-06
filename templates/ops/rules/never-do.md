# Never Do

## Merge Discipline
- Never merge directly from a dirty implementation slice to `{{MAIN_BRANCH}}`.
- Never ask {{THREADMASTER_ROLE}} to trust branch name alone when commit/file truth is stronger.
- Never mix unrelated repo changes into one handoff packet.
- Never claim validation you did not run.
- Never skip explicit exclusions when handing off from a dirty tree.
- Never push directly to `{{MAIN_BRANCH}}` — all changes must go through PRs.

## Quality Gates
- Never send PR email until CI passes AND code review has no blocking issues.
- Never merge without all quality gates: CI green + review complete + email sent.
- Never skip changelog updates — every feature, fix, and security change gets documented.

## Feature Requests
- Never auto-implement feature requests — only bugs get auto-fixed.
- Never build features without {{OPERATOR_ROLE}} approval.
- Never skip escalation email for feature requests: `bash scripts/send-escalation-email.sh <issue-number>`

## Production Safety
- Never ignore a deployment failure or site outage — send alert immediately.
- Never modify the production database without a backup.
- Never push without ops sync: REGISTRY, ACTIVE, JOURNAL all up-to-date.
