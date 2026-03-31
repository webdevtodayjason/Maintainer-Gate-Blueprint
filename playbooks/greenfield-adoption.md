# Greenfield Adoption

Use this when a repo is new enough that you can start strict.

## Goal

Install the maintainer-gate surface before the repo develops unsafe habits.

## Sequence

1. Fill in a project manifest.
2. Apply the blueprint into the repo.
3. Review generated `ops/` docs and replace any repo-specific examples.
4. Confirm the CI commands in `.github/workflows/ci.yml`.
5. Run:
   - `node --check scripts/check-handoff.mjs`
   - `node --check scripts/check-pr-intake.mjs`
6. Create one sample handoff packet and verify:
   - canonical packet passes
   - malformed packet fails
7. Enable branch protection only after the generated checks are green.

## Recommended Defaults

- use `codex/*` for implementation branches
- keep a clean `{{DEV_BRANCH}}` lane
- keep a clean `{{MAIN_BRANCH}}` lane
- require operator validation before `{{MAIN_BRANCH}}`
- treat public docs repo changes as a separate repo workflow

## Rollout Outcome

The repo should have:

- enforced PR intake
- structured issue intake
- explicit slice ownership
- a standard handoff contract
- a machine-checkable packet before maintainer intake
