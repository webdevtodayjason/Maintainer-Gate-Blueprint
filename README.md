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
- **automated patrol loops** (Bug Patrol + Feature Patrol on separate machines)
- **PR quality gates** (CI → Code Review → Email → Merge)
- **incident response** and health monitoring
- **changelog and version management**

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

- reusable `ops/` structure with 14 runbooks
- maintainer runbooks (merge gate, handoff, dev workflow)
- **DevOps automation runbooks** (bug patrol, feature patrol, PR workflow, incident response, health monitoring, daily digest, changelog, ops sync)
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
│   │   ├── workflows/ci.yml
│   │   ├── pull_request_template.md
│   │   └── ISSUE_TEMPLATE/
│   │       ├── bug_report.yml
│   │       └── feature_request.yml
│   ├── ops/
│   │   ├── README.md
│   │   ├── runbooks/
│   │   │   ├── bug-fix.md              # End-to-end bug fix workflow
│   │   │   ├── bug-patrol.md           # Automation Mac — auto-fix bugs
│   │   │   ├── feature-patrol.md       # Primary Mac — build features
│   │   │   ├── pr-workflow.md          # PR + quality gates + email
│   │   │   ├── incident-response.md    # Site down? Start here
│   │   │   ├── health-monitoring.md    # Deep health checks
│   │   │   ├── daily-digest.md         # Morning summary report
│   │   │   ├── changelog.md           # Version management
│   │   │   ├── ops-sync.md            # Keep tracking in sync
│   │   │   ├── dev-workflow.md         # Day-to-day development
│   │   │   ├── maintainer-gate.md      # Merge validation
│   │   │   ├── research-planning.md    # Planning workflow
│   │   │   ├── slice-management.md     # Work isolation
│   │   │   └── threadmaster-handoff.md # Handoff packets
│   │   ├── rules/
│   │   ├── projects/
│   │   ├── slices/
│   │   └── log/
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

## AI Agent Setup

Point any AI agent (Claude Code, Codex, etc.) at this repo and give it this instruction:

> Apply the Maintainer Gate Blueprint from `/path/to/Maintainer-Gate-Blueprint` to this repo. Read `playbooks/ai-agent-setup.md` for the full step-by-step process, then create a manifest and run the installer.

The agent setup guide covers:
- How to auto-detect manifest values from the target repo
- Greenfield vs brownfield adoption path selection
- Post-install verification and customization
- Patrol loop setup for multi-machine automation
- Branch protection configuration

See **[`playbooks/ai-agent-setup.md`](playbooks/ai-agent-setup.md)** for the complete instructions.

## Manifest Values

The installer replaces `{{PLACEHOLDER}}` tokens in template files using the
manifest JSON values.

### Core Fields

| Token | Purpose | Example |
|-------|---------|---------|
| `PROJECT_NAME` | Display name | `"MyProject"` |
| `REPO_NAME` | Repository identifier | `"my-project"` |
| `REPO_ROOT_PATH` | Absolute path to repo | `"/Users/you/code/my-project"` |
| `DOCS_REPO_PATH` | Path to docs repo | `"/Users/you/code/my-project-docs"` |
| `DOCS_SITE_URL` | Public docs URL | `"https://docs.myproject.io"` |
| `ISSUE_TRACKER_NAME` | Issue tracking system | `"Linear"` |
| `ISSUE_TRACKER_NOTE` | Custom integration note | `"Check before significant work..."` |
| `THREADMASTER_ROLE` | Release/merge owner | `"Threadmaster"` |
| `OPERATOR_ROLE` | Validation/approval role | `"operator"` |
| `DEV_BRANCH` | Integration branch | `"develop"` |
| `MAIN_BRANCH` | Production branch | `"main"` |

### Workspace Fields

| Token | Purpose | Example |
|-------|---------|---------|
| `DEV_WORKSPACE_PATH` | Active dev workspace | `"/Users/you/code/my-project"` |
| `DEVELOP_CLEAN_PATH` | Clean integration workspace | `"/Users/you/code/my-project-develop-clean"` |
| `TRUNK_CLEAN_PATH` | Clean trunk workspace | `"/Users/you/code/my-project-main-clean"` |

### CI Fields

| Token | Purpose | Example |
|-------|---------|---------|
| `PACKAGE_MANAGER_INSTALL_COMMAND` | Install deps | `"npm install"` |
| `CI_BUILD_COMMAND` | Build command | `"npm run build"` |
| `CI_CHECK_COMMAND` | Lint/check | `"npm run lint"` |
| `CI_TEST_COMMAND` | Test command | `"npm test"` |
| `CI_PROTOCOL_COMMAND` | Schema validation | `"npm run check:types"` |
| `CI_DASHBOARD_COMMAND` | Dashboard build | `"npm run build:dashboard"` |
| `RUNTIME_VERSION` | Node/runtime version | `"22.x"` |

### DevOps Automation Fields

| Token | Purpose | Example |
|-------|---------|---------|
| `GH_ORG` | GitHub organization | `"my-org"` |
| `SITE_URL` | Production site URL | `"https://myproject.io"` |
| `NOTIFICATION_EMAIL` | Alert/PR email recipient | `"owner@example.com"` |
| `AUTOMATION_MAC_NAME` | Bug Patrol machine name | `"Automation Mac"` |
| `AUTOMATION_MAC_SESSION` | Bug Patrol tmux session | `"patrol"` |
| `PRIMARY_MAC_NAME` | Feature Patrol machine name | `"Primary Mac"` |
| `PRIMARY_MAC_SESSION` | Feature Patrol tmux session | `"dev"` |

## Generated Surfaces

The installer writes:

- `ops/` — operational hub with 14 runbooks, rules, tracking docs
- `.github/` — PR template, issue templates, CI workflow
- `scripts/` — `check-handoff.mjs`, `check-pr-intake.mjs`

It does not overwrite files outside the blueprint surface.

### Runbook Categories

| Category | Runbooks | Purpose |
|----------|----------|---------|
| **Automation** | bug-patrol, feature-patrol, daily-digest | Continuous monitoring loops |
| **Quality** | pr-workflow, maintainer-gate, changelog | PR gates, merge validation, versioning |
| **Operations** | dev-workflow, ops-sync, slice-management | Day-to-day development process |
| **Incident** | incident-response, health-monitoring | Outage triage, deep health checks |
| **Handoff** | threadmaster-handoff, research-planning, bug-fix | Agent coordination and task workflows |

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
