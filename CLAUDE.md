# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 5. README and Documentation Security

Keep the README comprehensive, accurate, and sufficient for an authorized developer to set up, run, test, and understand the project. Document processes, architecture, dependencies, required environment-variable names, and sanitized examples—but never include real secrets, credentials, API keys, tokens, private certificates, production connection strings, personal data, internal infrastructure details, or confidential security procedures.

Use placeholders in examples and maintain an up-to-date `.env.example` containing variable names only. Store sensitive operational documentation in an appropriately access-controlled location rather than the repository.

When updating functionality, dependencies, configuration, setup steps, or developer workflows, update the README in the same change. Before committing documentation, review it for accidentally exposed sensitive data. If a secret may have been committed, flag it immediately; removing it from the current file is not sufficient, and the secret must be rotated and removed from repository history.

## 7. Keep README.md Current

**Every new dependency must be documented the moment it is added.**

When you install a package or change the setup in any way:
- Add it to the **Dependencies** table in `README.md` with its version and a one-line purpose.
- If the setup process gains a new step (new env var, new third-party account, new CLI command), update the relevant section in `README.md` immediately — in the same commit as the code change.
- If a dependency is removed, delete its row from the table.

The test: a developer who has never seen this repo should be able to clone it and run it successfully using only `README.md`.

## 8. Clear Git Commit History

**One logical feature or change per commit. Commit messages must explain why, not just what.**

Rules:
- Each commit covers exactly one feature, fix, or architectural change — not a grab-bag of unrelated edits.
- Commit message format: short imperative subject line (≤ 72 chars) + optional body explaining motivation.
- New screens, routes, integrations, and config changes each get their own commit.
- Never bundle a feature with unrelated cleanup or formatting fixes.
- Never commit broken code or half-finished features to `main`.

Examples of good subjects:
- `Add eBay OAuth routes and background data sync`
- `Wire onboarding to real auth, eBay connect, and Q&A`
- `Fix sync-status polling race condition`

Examples of bad subjects:
- `updates` / `wip` / `misc fixes`
- `Add dashboard and also fix a typo and update readme`

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, clarifying questions come before implementation rather than after mistakes, the README always reflects reality, and `git log` reads like a coherent feature history.
