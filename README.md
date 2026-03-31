# Maintainer Gate Blueprint

Maintainer Gate Blueprint is an ArgentOS-sponsored blueprint for making
multi-agent software projects safer to maintain.

It gives maintainers a reusable operating model for:

- structured issue intake
- stricter PR intake
- slice and worktree discipline
- machine-checkable handoff packets
- clean dev/release-lane reconstruction
- operator validation before promotion to `main`
- separate handling for public-docs and multi-repo work

This is for projects where multiple agents, humans, or automation threads are
working in parallel and maintainers need a reliable way to prevent regressions,
merge the right work, and promote changes safely.

## What Problem It Solves

In fast-moving repos, the failure mode is predictable:

- agents work from dirty trees
- branch names stop being trustworthy
- handoffs are vague
- docs changes get mixed into product changes
- regressions are discovered after merge
- maintainers end up reconstructing intent from chat instead of source-of-truth artifacts

Maintainer Gate Blueprint fixes that by making the workflow explicit,
repeatable, and machine-checkable.

## What You Get

The blueprint includes:

- reusable `ops/` structure
- maintainer runbooks
- slice registry and journal conventions
- PR and issue templates
- CI intake checks
- `check-handoff.mjs`
- `check-pr-intake.mjs`
- prompt footers for everyday agent tasks and maintainer-grade tasks
- greenfield and brownfield adoption playbooks
- an installer that stamps the blueprint into a target repo from a simple manifest

## Project Layout

```text
maintainer-gate-blueprint/
├── bin/
│   └── apply-blueprint.mjs
├── examples/
│   └── project.manifest.json
├── playbooks/
│   ├── greenfield-adoption.md
│   └── brownfield-adoption.md
├── prompts/
│   ├── default-task-footer.md
│   └── maintainer-task-footer.md
├── templates/
│   ├── .github/
│   ├── ops/
│   └── scripts/
├── package.json
└── README.md
```

## How It Works

1. Copy a project manifest from `examples/project.manifest.json`.
2. Fill in repo-specific paths, branch names, role names, and CI commands.
3. Run the installer to stamp the templates into the target repo.
4. Review the generated files and tighten any project-specific rules.
5. Roll the stricter gates out in phases if the repo is brownfield.

## Core Model

The blueprint enforces a few non-negotiable ideas:

1. Use commit/file truth, not branch-name truth.
2. Do not merge directly from an implementation slice to `main`.
3. Reconstruct changes in a clean dev/release lane first.
4. Require operator or human validation before promotion.
5. If work spans multiple repos, use separate slices and separate handoff packets.

## Who This Is For

This blueprint is meant for:

- maintainers managing multiple AI agent sessions
- teams using Codex, Claude Code, or similar autonomous contributors
- repos with release-sensitive install, runtime, infra, or docs surfaces
- projects that need stronger merge hygiene without inventing process from scratch

## Quick Start

```bash
cp examples/project.manifest.json /tmp/my-project-blueprint.json
# edit the manifest
node bin/apply-blueprint.mjs /tmp/my-project-blueprint.json
```

## Manifest Values

The installer replaces `{{PLACEHOLDER}}` tokens in template files using the
manifest JSON values.

Core fields:

- `PROJECT_NAME`
- `REPO_NAME`
- `REPO_ROOT_PATH`
- `DOCS_REPO_PATH`
- `DOCS_SITE_URL`
- `ISSUE_TRACKER_NAME`
- `ISSUE_TRACKER_NOTE`
- `THREADMASTER_ROLE`
- `OPERATOR_ROLE`
- `DEV_BRANCH`
- `MAIN_BRANCH`
- `DEV_WORKSPACE_PATH`
- `DEVELOP_CLEAN_PATH`
- `TRUNK_CLEAN_PATH`
- `PACKAGE_MANAGER_INSTALL_COMMAND`
- `CI_BUILD_COMMAND`
- `CI_CHECK_COMMAND`
- `CI_TEST_COMMAND`
- `CI_PROTOCOL_COMMAND`
- `CI_DASHBOARD_COMMAND`
- `RUNTIME_VERSION`

## Generated Surfaces

The installer writes:

- `ops/` docs and rules
- `.github/` PR and issue intake templates
- `.github/workflows/ci.yml`
- `scripts/check-handoff.mjs`
- `scripts/check-pr-intake.mjs`

It does not overwrite files outside the blueprint surface.

## Adoption Guidance

- For greenfield repos, apply the full blueprint early.
- For brownfield repos, use `playbooks/brownfield-adoption.md` and phase the
  rollout so CI and branch protection do not freeze delivery.

See:

- `playbooks/greenfield-adoption.md`
- `playbooks/brownfield-adoption.md`

## Prompt Pack

Use the prompt footers in `prompts/` when instructing agents:

- `default-task-footer.md`
- `maintainer-task-footer.md`

## Verification

After applying the blueprint in a target repo:

1. run the generated handoff checker against a sample packet
2. run the PR intake checker against a sample event payload
3. confirm the repo-specific CI commands in `.github/workflows/ci.yml`
4. wire the required checks into branch protection

## Scope

This blueprint is intentionally opinionated about merge safety.

It is not a release manager by itself. It creates the process surface so a
maintainer or Threadmaster can safely intake, reconstruct, validate, and
promote work.

## Sponsorship

Maintainer Gate Blueprint is sponsored by ArgentOS and built from real
maintainer workflow hardening in a multi-agent production codebase.

## License

MIT
