# AI Agent Setup Instructions

> Complete instructions for an AI agent (Claude Code, Codex, or similar) to apply the Maintainer Gate Blueprint to any repository.

## Quick Version (Copy-Paste to Agent)

```
Apply the Maintainer Gate Blueprint from /path/to/Maintainer-Gate-Blueprint to this repo.

1. Copy examples/project.manifest.json to /tmp/manifest.json
2. Fill in ALL tokens with values for THIS project (ask me if unsure about any value)
3. Run: node /path/to/Maintainer-Gate-Blueprint/bin/apply-blueprint.mjs /tmp/manifest.json
4. Review generated files, tighten project-specific rules
5. Verify: node --check scripts/check-handoff.mjs && node --check scripts/check-pr-intake.mjs
6. If brownfield: follow playbooks/brownfield-adoption.md phases
7. If greenfield: follow playbooks/greenfield-adoption.md sequence
```

---

## Full Setup Guide

### Step 1: Determine Adoption Path

**Greenfield** (new repo, few contributors, no CI yet):
- Apply the full blueprint in one pass
- Enable all gates immediately
- Follow `playbooks/greenfield-adoption.md`

**Brownfield** (existing repo, active contributors, existing CI):
- Apply in 5 phases to avoid freezing delivery
- Follow `playbooks/brownfield-adoption.md`

### Step 2: Create the Manifest

Copy the example manifest and fill in every field:

```bash
cp /path/to/Maintainer-Gate-Blueprint/examples/project.manifest.json /tmp/manifest.json
```

#### Required Fields (Must Fill)

| Token | What to Put | How to Find It |
|-------|-------------|----------------|
| `PROJECT_NAME` | Human-readable project name | Ask the user or read `package.json` name field |
| `REPO_NAME` | GitHub repo identifier | `basename $(git remote get-url origin) .git` |
| `REPO_ROOT_PATH` | Absolute path to this repo | `pwd` in the repo root |
| `MAIN_BRANCH` | Production branch name | `git symbolic-ref refs/remotes/origin/HEAD \| sed 's@^refs/remotes/origin/@@'` |
| `DEV_BRANCH` | Integration branch | Usually `develop` or `dev`; create if doesn't exist |
| `GH_ORG` | GitHub organization or user | `git remote get-url origin \| sed 's/.*[:/]\([^/]*\)\/.*/\1/'` |
| `SITE_URL` | Production URL | Ask the user; check Railway/Vercel/Netlify dashboard |
| `NOTIFICATION_EMAIL` | Where alerts go | Ask the user |

#### Build Fields (Read from Package Manager)

| Token | How to Find It |
|-------|----------------|
| `CI_BUILD_COMMAND` | Check `package.json` scripts for `build` |
| `CI_CHECK_COMMAND` | Check for `lint`, `check`, or `eslint` script |
| `CI_TEST_COMMAND` | Check for `test` script |
| `PACKAGE_MANAGER_INSTALL_COMMAND` | Look for `pnpm-lock.yaml` → `pnpm install`, `yarn.lock` → `yarn install`, else `npm install` |
| `RUNTIME_VERSION` | Check `.nvmrc`, `.node-version`, `engines` in `package.json`, or `node --version` |

#### Optional Fields (Use Defaults If Unknown)

| Token | Default | When to Change |
|-------|---------|---------------|
| `DOCS_REPO_PATH` | `""` | If project has a separate docs repo |
| `DOCS_SITE_URL` | `""` | If docs are published to a URL |
| `ISSUE_TRACKER_NAME` | `"GitHub Issues"` | If using Linear, Jira, etc. |
| `THREADMASTER_ROLE` | `"Threadmaster"` | If the team uses a different term |
| `OPERATOR_ROLE` | `"operator"` | If using "maintainer", "owner", etc. |
| `AUTOMATION_MAC_NAME` | `"Automation Mac"` | Name of the machine running Bug Patrol |
| `AUTOMATION_MAC_SESSION` | `"patrol"` | tmux session name for Bug Patrol |
| `PRIMARY_MAC_NAME` | `"Primary Mac"` | Name of the machine running Feature Patrol |
| `PRIMARY_MAC_SESSION` | `"dev"` | tmux session name for Feature Patrol |
| `CI_PROTOCOL_COMMAND` | `""` | If no schema/protocol validation exists |
| `CI_DASHBOARD_COMMAND` | `""` | If no dashboard build step |

### Step 3: Run the Installer

```bash
node /path/to/Maintainer-Gate-Blueprint/bin/apply-blueprint.mjs /tmp/manifest.json
```

This creates:
- `ops/` — 14 runbooks, rules, tracking docs (REGISTRY, ACTIVE, JOURNAL)
- `.github/` — PR template, issue templates, CI workflow
- `scripts/` — Validation scripts (check-handoff, check-pr-intake)

### Step 4: Verify the Installation

```bash
# Syntax check the validation scripts
node --check scripts/check-handoff.mjs
node --check scripts/check-pr-intake.mjs

# Verify all tokens were replaced (should return nothing)
grep -r '{{' ops/ .github/ scripts/ 2>/dev/null && echo "UNREPLACED TOKENS FOUND" || echo "All tokens replaced"
```

### Step 5: Review and Customize

After installation, review these files and tighten for your project:

1. **`ops/rules/never-do.md`** — Add any project-specific prohibitions
2. **`.github/workflows/ci.yml`** — Verify CI commands match your project
3. **`ops/runbooks/dev-workflow.md`** — Confirm workspace paths exist
4. **`ops/README.md`** — Verify the directory listing matches

### Step 6: Set Up Patrol Loops (Optional)

If the project has a production site and uses multi-machine automation:

**On the Automation Mac (Bug Patrol):**
```
/loop 30m Bug Patrol: Check gh issue list --repo <org>/<repo> --state open...
```
See `ops/runbooks/bug-patrol.md` for the full loop command.

**On the Primary Mac (Feature Patrol):**
```
/loop 30m Feature Patrol: Check gh issue list --repo <org>/<repo> --state open...
```
See `ops/runbooks/feature-patrol.md` for the full loop command.

### Step 7: Enable Branch Protection

After CI is green and the team is comfortable with the workflow:

1. Go to GitHub → Settings → Branches → Add rule for the main branch
2. Require pull request reviews before merging
3. Require status checks to pass (CI build, lint, tests)
4. No direct pushes to main

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Installer fails with "Missing manifest value for X" | Fill in the missing token in your manifest JSON |
| `grep '{{' ops/` shows unreplaced tokens | A manifest field was empty string — fill it in and re-run |
| CI workflow fails | Check that `CI_BUILD_COMMAND` etc. match your actual package.json scripts |
| Validation scripts won't run | Ensure `"type": "module"` is in your package.json (scripts use ES modules) |
| Patrol loops find no issues | Normal — this means no one has filed bugs. The loop will catch them when they arrive |

## What the Agent Should NOT Do

- Do not modify application code during blueprint setup
- Do not change existing CI workflows — the blueprint adds its own
- Do not delete existing ops/ files if the repo already has them — merge manually
- Do not enable branch protection before CI is reliably green
- Do not start patrol loops before the manifest is verified and committed
