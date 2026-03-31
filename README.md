# Maintainer Gate Blueprint

Maintainer Gate Blueprint is an ArgentOS-sponsored blueprint for making multi-agent software projects safer to maintain.

It gives maintainers a reusable operating model for:

- structured issue intake
- stricter PR intake
- slice and worktree discipline
- machine-checkable handoff packets
- clean dev/release-lane reconstruction
- operator validation before promotion to `main`
- separate handling for public-docs and multi-repo work

This is for projects where multiple agents, humans, or automation threads are working in parallel and maintainers need a reliable way to prevent regressions, merge the right work, and promote changes safely.

## What Problem It Solves

In fast-moving repos, the failure mode is predictable:

- agents work from dirty trees
- branch names stop being trustworthy
- handoffs are vague
- docs changes get mixed into product changes
- regressions are discovered after merge
- maintainers end up reconstructing intent from chat instead of from source-of-truth artifacts

Maintainer Gate Blueprint fixes that by making the workflow explicit and checkable.

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
