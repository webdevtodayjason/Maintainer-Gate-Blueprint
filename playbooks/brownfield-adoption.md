# Brownfield Adoption

Use this when the target repo already has active contributors, unstable CI, or
existing release pressure.

## Goal

Adopt the workflow in layers so the repo gets safer without freezing delivery.

## Phase 1: Process Surface

Add:

- `ops/README.md`
- `ops/rules/*`
- `ops/runbooks/slice-management.md`
- `ops/runbooks/threadmaster-handoff.md`
- `ops/log/JOURNAL.md`
- `ops/slices/REGISTRY.md`

Do not enforce CI changes yet.

## Phase 2: Handoff Discipline

Add:

- `scripts/check-handoff.mjs`
- the canonical handoff packet
- the multi-repo split rule
- the clean dev/release-lane rule
- the operator validation rule

Train agents and maintainers on the new packet first.

## Phase 3: Intake Discipline

Add:

- `.github/pull_request_template.md`
- issue forms
- `scripts/check-pr-intake.mjs`
- PR-intake CI job

At this stage, handoff and PR quality become machine-checkable.

## Phase 4: Validation Gates

Add or tighten CI:

- build
- check/lint
- tests
- protocol or schema drift checks
- dashboard/docs build where relevant

Only require these in branch protection after the repo passes reliably.

## Phase 5: Branch Protection

Require:

- PR intake
- install/dependency job
- validation matrix
- secret scanning

Then require promotion through the clean integration lane before `main`.

## Common Brownfield Risks

- over-strict CI before the repo is actually green
- mixing docs repo changes into the main repo handoff
- agents claiming success from dirty worktrees without exclusions
- maintainers trusting branch names instead of commit/file truth
