# {{PROJECT_NAME}} Operations Hub

> Every agent session starts here. Read this file before touching code.

This is the operational source of truth for {{PROJECT_NAME}} development. It
lives at `ops/` in the private `{{REPO_NAME}}` repo.

## How to Use This

1. New session? Read this file, then check `slices/REGISTRY.md` and `projects/ACTIVE.md`
2. Starting work? Claim your slice in `REGISTRY.md` before creating branches
3. Finishing work? Update `REGISTRY.md`, update `projects/ACTIVE.md`, write a log entry
4. Need a process? Check `runbooks/` before improvising
5. Handing work back to {{THREADMASTER_ROLE}}? Follow `runbooks/threadmaster-handoff.md`
6. Research or architecture request? Follow `runbooks/research-planning.md`
7. Unsure about a rule? Check `rules/` because they override your instincts

Threadmaster handoffs are machine-checkable:

```bash
node scripts/check-handoff.mjs path/to/handoff.md
```

## Directory Layout

```text
ops/
├── README.md
├── runbooks/
│   ├── dev-workflow.md
│   ├── maintainer-gate.md
│   ├── research-planning.md
│   ├── slice-management.md
│   └── threadmaster-handoff.md
├── projects/
│   └── ACTIVE.md
├── rules/
│   ├── agent-coordination.md
│   ├── branching.md
│   ├── linear.md
│   └── never-do.md
├── slices/
│   └── REGISTRY.md
└── log/
    └── JOURNAL.md
```

## Issue Tracker

{{ISSUE_TRACKER_NOTE}}

## The Three Rules

1. Check before you act.
2. Claim before you touch.
3. Log when you're done.
