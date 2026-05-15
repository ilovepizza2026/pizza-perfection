# Murmur / docs.murmur.dev Master Audit Report

**Date:** 2026-05-15  
**Synthesizer:** `pizza/docs-master-report`  
**Audit fleet:** 8 sibling agents (all 8 completed with PRs)  
**Scope:** murmur CLI v80.1, MCP server v80.1, docs.murmur.dev (≈127 pages), `ilovepizza2026/pizza` workspace

---

## Executive Summary

1. **New users on Linux/Windows cannot install the CLI at all.** Every install instruction points to `brew tap prassoai/tap`, with no Linux/Windows alternative. The homebrew tap is also stuck at v79.1 while the server requires v80.x — so even macOS users who follow the docs end up with an incompatible client. New users face a full installation deadlock before running a single command.

2. **`murmur flight` is listed in `murmur --help` and every docs CLI overview but returns "unknown command" when invoked.** The `--flight` flag on `murmur spawn` does a catalog lookup by name, not a local file read (contradicting its own help text). Flight frontmatter requirements are completely undocumented. The flight system is effectively unusable from docs alone.

3. **The MCP docs path examples are universally wrong.** Every copy-pasteable absolute-path example in the MCP docs uses `/w/workspace/u/account/slug` (the `u` form), which the server rejects with "unknown owner_provider 'u'". The correct form requires the provider token (`github_oauth`, `github_app`). Anyone following the docs will get an error.

4. **VMs spawned into a non-native tenant get the wrong `murmur.yaml`.** A VM in the `ilovepizza2026` tenant receives a `murmur.yaml` stamped with `tenant.org: prassoai`. All catalog operations (workspace lookup, placement lookup, permission checks) silently query the wrong tenant. Agent operations work correctly (they use the VM API token), but the split behavior is invisible to users.

5. **Six BLOCKING CLI bugs are confirmed as still present at v80.1.** These include: `wait --phase` returning immediately (confirmed from two separate runs), `patch agent-persona --set` always failing with a cryptic error, `task update -s` silently no-oping regardless of status, `queue conflict-resolution --help` showing the wrong argument count, `murmur each` failing with `session_mode is required` while the docs show it working, and port-proxy URLs returning 403 while the docs call them "public."

6. **Docs have 8+ pages returning 404 for documented commands.** The CLI command groups `session`, `queue`, `subscriptions`, `task`, `url`, `bakes`, and `catalog` are all referenced in the overview with no individual docs pages behind them. Any user who clicks through gets a 404.

7. **Two fixes confirmed since the last audit:** MCP `interrupt` tool is now advertised by the server (was phantom in prior audits). `murmur task ls -json` now returns valid JSON. These are genuinely fixed and should be closed off the bug list.

8. **Every end-to-end scenario tried from docs alone hit gaps.** Four of five common user journeys (CI watcher bot, multi-agent fanout, port-proxy, write-and-run a flight) required guessing to complete. Only the session fork scenario succeeded purely from docs. The docs cover primitives well but do not string them into working workflows.

---

## Severity Rankings

### BLOCKING — User cannot complete the task

| ID | Finding | Source |
|----|---------|--------|
| B-01 | Brew-only CLI install; no Linux/Windows path documented | newbie-onboarding, codeblock-check, pizza-bug-validation |
| B-02 | Homebrew tap stuck at v79.1; server requires v80.x; `brew upgrade murmur` is a no-op | bug-verification, pizza-bug-validation |
| B-03 | `murmur flight` listed in `--help` and docs overview but returns "unknown command" | cli-docs-diff, bug-verification, pizza-bug-validation, scenario-walkthroughs |
| B-04 | MCP absolute path examples use `/u/account/` form which server rejects | bug-verification, pizza-bug-validation, mcp-docs-diff |
| B-05 | Admin-gated developer path: docs bury the admin prerequisite until mid-page | newbie-onboarding |
| B-06 | "Macroscope" GitHub App name never explained in relation to "Murmur" | newbie-onboarding |
| B-07 | `murmur wait --phase` returns exit 0 immediately when agent is still RUNNING | bug-verification |
| B-08 | `murmur patch agent-persona --set` always fails ("content and structured fields are mutually exclusive") | bug-verification, pizza-bug-validation |
| B-09 | `murmur task update -s` is a silent no-op for all status values; exit 0 gives false success | bug-verification, pizza-bug-validation |
| B-10 | `murmur each` CLI fails with `session_mode is required`; docs present it as working | scenario-walkthroughs |
| B-11 | Port-proxy URLs return 403; docs describe them as "public" with no auth caveat | scenario-walkthroughs |
| B-12 | `--flight` flag does catalog lookup, not local file read; contradicts its own help text | scenario-walkthroughs, pizza-bug-validation |
| B-13 | Flight YAML frontmatter (`workspace` field) required but undocumented; docs examples fail to parse | scenario-walkthroughs |
| B-14 | VM in non-native tenant gets wrong `murmur.yaml`; catalog ops silently hit wrong tenant | pizza-bug-validation |
| B-15 | `--reasoning-effort` flag documented for `murmur spawn` but does not exist in CLI | link-sweep |
| B-16 | `--service-profile` flag documented for `murmur spawn` but does not exist in CLI | link-sweep |
| B-17 | `murmur install` referenced on two docs pages but command does not exist | link-sweep |
| B-18 | `murmur attach` referenced on two docs pages but command does not exist | link-sweep |
| B-19 | `murmur patch --set` rejects camelCase from `murmur get`; round-trip broken | bug-verification, pizza-bug-validation |
| B-20 | Terraform module links return 404 (repo doesn't exist; URLs also have double-slash) | link-sweep |
| B-21 | `check-permissions --resource` flag must come before positionals; docs example has wrong order | codeblock-check |
| B-22 | `murmur pool status` fails from inside a VM; docs don't mention context requirement | codeblock-check |

### MISLEADING — User gets wrong output or forms wrong mental model

| ID | Finding | Source |
|----|---------|--------|
| M-01 | MCP `spawn.slug`, `.workspace`, `.description` marked Required in docs but absent from JSON schema `required` array | mcp-docs-diff |
| M-02 | MCP `spawn.repos[].base_branch` documented but not in server schema description | mcp-docs-diff |
| M-03 | MCP `task_update.status` valid values (`pending`, `in_progress`, `completed`, `deleted`) absent from server description | mcp-docs-diff |
| M-04 | `murmur wait/sleep/wake` CLI usage shows `[path]` argument name; docs correctly call it `[slug]` | cli-docs-diff |
| M-05 | `murmur pool --help` advertises `pool up --nuke`; `-nuke` actually lives on `pool flush` | cli-docs-diff |
| M-06 | `murmur spawn --flight` value: CLI says "file path", docs say "flight name" | cli-docs-diff |
| M-07 | `murmur spawn --flight` makes slug optional (docs), required (CLI usage string) | cli-docs-diff |
| M-08 | `pool reconcile-visibility` undocumented; users can't discover it to fix ghost sidebar agents | cli-docs-diff |
| M-09 | `murmur bakes ls` six flags undocumented (incl. environment/placement filters) | cli-docs-diff |
| M-10 | 7 functional CLI commands hidden from `murmur --help`: `sleep`, `wake`, `ssh`, `wait`, `rekey`, `install-repo`, `describe` | cli-docs-diff |
| M-11 | `murmur version` example output shows `api.murmur.sh:443`; actual is `api.murmur.dev:9090` | link-sweep, codeblock-check |
| M-12 | `murmur ls -a` description omits "canceled" agent state | cli-docs-diff |
| M-13 | `murmur setup --out` default omits `.murmur/` directory context | cli-docs-diff |
| M-14 | `murmur queue conflict-resolution --help` shows 2-arg signature; implementation requires 3 args | bug-verification, pizza-bug-validation, cli-docs-diff |
| M-15 | `murmur task ls` zero-task agent produces no output; indistinguishable from hung command | bug-verification, pizza-bug-validation |
| M-16 | Undefined terms on first use: `tenant`, `workspace`, `persona`, `flight`, `placement`, `recipe` | newbie-onboarding |
| M-17 | `murmur setup` vs `murmur init` run order never explained; `murmur init` missing from quickstarts | newbie-onboarding |
| M-18 | OpenAI credentials required by `murmur setup` wizard but not listed in prerequisites | newbie-onboarding |
| M-19 | `CLAUDE_CODE_OAUTH_TOKEN` referenced in non-interactive setup mode; no link to how to obtain it | newbie-onboarding |
| M-20 | "Spawn Your First Agent" page has no prerequisites section | newbie-onboarding |
| M-21 | `bakes ls --page-token` example token is invalid; returns InvalidArgument from server | codeblock-check |
| M-22 | Catalog YAML schema divergence: docs show `substrate: GCP`; API emits `SUBSTRATE_GCP` | pizza-bug-validation |
| M-23 | Catalog YAML schema divergence: docs show `target: { gcp: ... }` nesting; API emits `gcp:` at root | pizza-bug-validation |
| M-24 | Catalog YAML schema divergence: docs show `target: { aws: ... }` nesting; API emits `aws:` at root with camelCase fields | pizza-bug-validation |
| M-25 | `murmur each --dry-run` works; actual spawn silently fails with `session_mode is required` (no docs warning) | scenario-walkthroughs |
| M-26 | Subscriptions API has no event-type filter; docs imply per-event subscription is possible | scenario-walkthroughs |
| M-27 | No `--on-idle keep-alive` example for long-running watcher agents | scenario-walkthroughs |
| M-28 | `murmur install-repo --webhook-url` required but the correct URL value never documented | scenario-walkthroughs |
| M-29 | Go 1.22.x in image/recipe examples is outdated (EOL); current stable is 1.24.x | link-sweep |
| M-30 | Poetry 1.8.3 and Ruff 0.4.8 in recipe examples are outdated (current: Poetry 2.x, Ruff 0.9.x) | link-sweep |
| M-31 | Date-versioned Claude model string in VM environment example will become stale | link-sweep |
| M-32 | `murmur check-permissions` REASON format has drifted from docs example | codeblock-check |
| M-33 | No personal-tenant fast path documented (solo dev without org admin is fully blocked) | newbie-onboarding |
| M-34 | `murmur session watch` has no startup confirmation line; idle agents produce silence | bug-verification |
| M-35 | `murmur notify` accepts non-existent slugs with exit 0; no server-side validation of slug existence | pizza-bug-validation |

### COSMETIC — Friction but not blocking

| ID | Finding | Source |
|----|---------|--------|
| C-01 | MCP `port_url.port` typed as `number`; docs say `integer` with 1–65535 range | mcp-docs-diff |
| C-02 | MCP `spawn.force_new`/`.resurrect` defaults stored as string `"false"` not boolean `false` | mcp-docs-diff |
| C-03 | MCP `version` has no dedicated docs page; `api_host` return field and purpose underdescribed | mcp-docs-diff |
| C-04 | Single-dash (CLI) vs double-dash (docs) notation throughout; both work but cross-referencing is friction | cli-docs-diff |
| C-05 | `murmur spawn --stream` flag undocumented | cli-docs-diff |
| C-06 | No docs pages for `session`, `queue`, `subscriptions`, `task`, `url`, `bakes`, `catalog` groups (all 404) | cli-docs-diff |
| C-07 | `murmur task update -s deleted` status value undocumented | cli-docs-diff |
| C-08 | `murmur queue conflict-resolution` full 3-arg signature not documented anywhere | cli-docs-diff |
| C-09 | `murmur get agent` takes ~22 seconds; no latency disclaimer | codeblock-check |
| C-10 | Fictional example URL `github.com/acme-corp/api` returns 404 | link-sweep |
| C-11 | `--workspace` flag omitted from docs `murmur spawn` examples; required in practice | scenario-walkthroughs |
| C-12 | Flight `name:` frontmatter field in `describe flight` template is rejected at runtime | scenario-walkthroughs |
| C-13 | `murmur session watch` v79.1→v80.1 improvement (events now stream) not documented | bug-verification |
| C-14 | `prassoai` tap namespace never explained in install docs | newbie-onboarding |
| C-15 | Developer quickstart at `/quickstart` URL, not `/developer-quickstart` as link text implies | newbie-onboarding |

### FIXED (confirmed resolved at v80.1)

| ID | Finding | Source |
|----|---------|--------|
| F-01 | MCP `interrupt` tool was phantom (doc'd but not advertised); now in server tools list ✅ | bug-verification, pizza-bug-validation, mcp-docs-diff |
| F-02 | `murmur task ls -json` returned tabular output on v79.1; now returns valid JSON ✅ | bug-verification, pizza-bug-validation |
| F-03 | `murmur session watch` was silent on v79.1 due to version-check barrier; events now stream ✅ | bug-verification |

---

## Cross-Cutting Themes

### Theme 1: Broken Installation Pipeline (5 agents)

Newbie-onboarding, codeblock-check, pizza-bug-validation, link-sweep, and bug-verification all independently hit the same wall: brew is the only install path, the brew tap is stuck at v79.1, and the server requires v80.x. The result is a complete installation deadlock. A new user following the docs literally cannot reach a working CLI.

*Reporters: newbie-onboarding, bug-verification (Bug 15), pizza-bug-validation (Setup §1), codeblock-check (UNRUNNABLE brew blocks), link-sweep (VD-1)*

### Theme 2: Flight System Is Unusable From Docs (4 agents)

The `flight` concept is prominently featured in marketing and docs overview. Four separate agents independently discovered that the flight system cannot be exercised from docs alone: `murmur flight` is a dead command, `--flight` has contradictory semantics between CLI help and docs, frontmatter requirements are undocumented, and the catalog lookup for spawning by flight name fails silently across workspace/tenant contexts.

*Reporters: cli-docs-diff (P1 finding), bug-verification (Bug 3), pizza-bug-validation (Bug #4), scenario-walkthroughs (Scenario 5)*

### Theme 3: MCP Path Format Wrong Everywhere (3 agents)

The `/u/account/` path form shown in every MCP docs example fails universally. Three agents independently hit this: the correct form uses the provider token (`github_oauth`, `github_app`, etc.). Additionally, MCP tools that accept a `slug` argument in a child context construct malformed paths (missing tenant prefix, parent slug duplicated). The two bugs compound each other.

*Reporters: bug-verification (Bug 1), pizza-bug-validation (Bug #2), mcp-docs-diff (Finding 4)*

### Theme 4: Silent Failures and False Success Signals (3 agents)

Three agents caught the pattern of commands that exit 0 and print output as if they succeeded while doing nothing: `task update -s` accepts any status and silently drops it; `task ls` on a zero-task agent produces no output (indistinguishable from a hung command); `notify` accepts non-existent slugs with exit 0. Combined with `wait --phase` returning prematurely, CLI reliability is fundamentally undermined.

*Reporters: bug-verification (Bugs 4, 7, 12), pizza-bug-validation (Bugs #5, UX gaps, Q), scenario-walkthroughs (indirect via wait)*

### Theme 5: Docs Cover Primitives, Not Workflows (3 agents)

Three agents independently found that docs excel at describing individual commands but fail at composing them into end-to-end workflows. The scenario-walkthroughs agent got 4 of 5 scenarios to GAPS. The newbie-onboarding agent couldn't spawn a single agent. The codeblock-check agent found that 245 of 370 bash blocks are UNRUNNABLE from docs context alone (require external creds, agents already running, or admin permissions not mentioned on the page).

*Reporters: scenario-walkthroughs (4/5 GAPS), newbie-onboarding (complete blockage), codeblock-check (245 UNRUNNABLE blocks)*

### Theme 6: Wrong Tenant in murmur.yaml for Cross-Tenant VMs (pizza-specific, unique)

The pizza-bug-validation agent uncovered a bug specific to cross-tenant VM provisioning: a VM in `ilovepizza2026` receives `murmur.yaml` stamped with `tenant.org: prassoai`. Agent operations (spawn, ls, kill) use the VM API token and correctly scope to `ilovepizza2026`. Catalog operations (workspace lookup, placement, permissions) use the wrong tenant. The split is invisible — both succeed, but catalog ops return wrong-tenant data. This explains why Bug #1 verdicts differed between the pizza and back-workspace runs.

*Reporter: pizza-bug-validation (Bug #1, Cross-Workspace Isolation section)*

---

## Per-Sibling Summary

### 1. `docs-newbie-onboarding` — PR [#9](https://github.com/ilovepizza2026/pizza-perfection/pull/9)
Simulated a brand-new developer following docs.murmur.dev linearly from the landing page. Couldn't spawn a single agent: blocked by (1) Linux = no brew, (2) org admin required to install Macroscope, (3) admin must complete setup before dev can proceed — buried on the dev quickstart page rather than the landing page. Eight specific friction points documented in order of severity, including the most impactful: "Macroscope" is used without explanation, personal tenant fast path isn't documented (would unblock solo devs without org admin), and `murmur init` is referenced in the landing-page overview but absent from both quickstart pages.

### 2. `mcp-docs-diff` — PR [#10](https://github.com/ilovepizza2026/pizza-perfection/pull/10)
Enumerated all 16 MCP tools advertised by the server and compared field-by-field against every docs.murmur.dev/mcp-server/ page. Found zero undocumented tools, zero phantom tools. Eight drifted findings: three MISLEADING required-field mismatches on `spawn`, one MISLEADING missing `base_branch` field, one MISLEADING missing `task_update.status` enum values, and three COSMETIC type/default/completeness issues. Previously reported `interrupt` as phantom — confirmed FIXED.

### 3. `bug-verification` — PR [prassoai/murmuration-docs#27](https://github.com/prassoai/murmuration-docs/pull/27)
Independently verified all 15 bugs from prior audit PR #24. Ran fresh from inside a v80.1 VM, consulting no prior results until after all tests completed. Result: 9 bugs still legit, 2 fixed, 1 partially fixed, 2 cannot repro from VM. Key still-legit: `wait --phase` returns immediately from PHASE_RUNNING (Bug 4), `task update -s` silent no-op (Bug 12), MCP `/u/account/` path still fails (Bug 1), brew tap stuck at v79.1 (Bug 15). Key fixed: `interrupt` now in server (Bug 10), `task ls -json` now returns JSON (Bug 13). Key partial: `session watch` now streams events but still no startup line or heartbeat during idle.

### 4. `cli-docs-diff` — PR [#11](https://github.com/ilovepizza2026/pizza-perfection/pull/11)
Walked the full CLI via recursive `--help` and compared against every docs.murmur.dev/cli/ page. Produced three lists: 1 phantom (flight — BLOCKING), 7 undocumented (incl. `pool reconcile-visibility`, full `bakes ls` flag set, 7 functional commands hidden from `--help`), 7 drifted (incl. `[path]` vs `[slug]` argument naming, `pool up --nuke` vs `pool flush --nuke`, `--flight` value semantics). Also enumerated 8 docs pages that return 404 for documented command groups.

### 5. `docs-link-sweep` — PR [#12](https://github.com/ilovepizza2026/pizza-perfection/pull/12)
Crawled all 110+ docs pages, checked every link, scanned for version drift and dated language. Found 0 internal 404s (good), 3 external 404s (Terraform module links, fictional example link), 0 stale screenshots (site is text-only). Found 7 version drift issues: API endpoint (`murmur.sh` → `murmur.dev`), CLI version numbers, two phantom flags (`--reasoning-effort`, `--service-profile`), two phantom commands (`murmur install`, `murmur attach`), stale Go/Python toolchain versions in image examples, and a date-versioned Claude model string.

### 6. `docs-codeblock-check` — PR [#14](https://github.com/ilovepizza2026/pizza-perfection/pull/14)
Crawled all 127 docs pages, extracted 679 fenced code blocks (370 shellscript). Of those: 32 WORKS, 2 DRIFTED, 3 BROKEN, 272 UNRUNNABLE. The 3 broken commands: `check-permissions --resource` flag order wrong in docs, `bakes ls --page-token` example invalid, `pool status` fails from VM. The 272 UNRUNNABLE blocks reveal a pervasive docs gap: examples require admin permissions, running agents, external creds, or interactive sessions — none flagged on the page. Also found `murmur get agent` takes ~22 seconds with no latency warning.

### 7. `docs-scenario-walkthroughs` — PR [#15](https://github.com/ilovepizza2026/pizza-perfection/pull/15)
Attempted five common end-to-end user scenarios using only docs as a guide. Result: 1 WORKED (session fork), 4 GAPS (CI watcher bot, multi-agent fanout, port-proxy, flight). Key gaps: subscriptions have no event-type filter; `murmur each` CLI fails with `session_mode is required`; port-proxy URLs require tenant auth but docs say "public"; flight frontmatter is undocumented and `--flight` does a catalog lookup not a file read. The fork scenario worked but required guessing `--workspace` was needed (absent from docs example).

### 8. `pizza-bug-validation` — PR [#13](https://github.com/ilovepizza2026/pizza-perfection/pull/13)
Re-ran the same bug list as the back-workspace sibling from inside an `ilovepizza2026` VM. Key finding unique to this run: the VM's `murmur.yaml` is stamped with `prassoai` tenant, causing all catalog operations to silently query the wrong tenant — workspace `pizza` is not found while `back`/`analytics`/`murmuration` (prassoai workspaces) are visible. Confirmed 8 bugs, 2 confirmed UX gaps. Key deltas vs back-workspace run: Bug #1 (tenant mismatch) confirmed here but could not be reproduced in back-workspace run because that VM has the correct tenant; Bug #5 (wait --phase) could not be reproduced in this run (confirmed in back-workspace run); Catalog schema drift (A/B/C) confirmed here, not reproduced in back-workspace run.

---

## Coverage Gaps

The following areas were not covered by any sibling audit and remain unaudited:

- **Bake pipeline end-to-end**: The `murmur bake` command and custom image workflow were not exercised. The `bakes ls` command was tested but not the full build cycle.
- **Authorization / RBAC**: The security/authorization page and role-binding mechanics were not successfully tested (no `role.create` permission in any VM context). The inline `name_pattern` proto unmarshal failure (Bug I) remains unconfirmed.
- **Subscription webhooks and event delivery**: Whether `ci_result` events actually arrive in agent context was not verified end-to-end.
- **`murmur director` interactive mode**: All agents were running in autonomous/non-interactive mode; the director workflow was not exercised.
- **`murmur report-*` CI reporting commands**: These require a CI context and were flagged UNRUNNABLE in the codeblock check without being explicitly tested.
- **Laptop-context bugs (upload empty slug, notify slug drop)**: Confirmed reproducible by unsetting `MURMUR_WORKFLOW_ID` in pizza-bug-validation, but no actual laptop run was performed.
- **Multi-tenant isolation from the `prassoai` side**: The back-workspace sibling PR (#10958 in prassoai/back) was referenced but not directly incorporated here.
- **Windows documentation**: No audit of Windows-specific install or CLI behavior.

---

## Recommended Next Actions

**Immediate (block new-user path):**
1. **Fix homebrew tap** — Publish v80.x to the stable channel. This unblocks all brew users and resolves the version mismatch warning.
2. **Add Linux install path** — Document `curl`-based binary download or Docker image. Mark brew as macOS-only.
3. **Move admin-gate warning** — First sentence of both the landing page and developer quickstart must state that org admin must complete setup first. Add the personal-tenant fast path for solo developers.
4. **Fix MCP absolute path docs** — Replace all `/u/account/` examples with the correct `/github_oauth/account/` form (or document that the provider token varies and how to discover it).
5. **Fix flight docs or remove the command from `--help`** — Either document the correct workflow (frontmatter requirements, catalog-based lookup) or remove `murmur flight` from `--help` until it's functional.

**Short-term (fix broken commands):**
6. **Fix `task update -s` silent no-op** — The command should error on failure, not print the task ID and exit 0.
7. **Fix `murmur wait --phase` premature return** — Should block when agent is PHASE_RUNNING and the target phase hasn't been reached.
8. **Fix `murmur each` session_mode requirement** — Either default session_mode the same way `murmur spawn` does, or document the required flag.
9. **Fix `patch agent-persona --set`** — Document the limitation (content and structured fields mutually exclusive) and suggest the workaround (patch full content via stdin).
10. **Fix wrong-tenant `murmur.yaml` for cross-tenant VMs** — The provisioner should stamp the actual tenant, not the provisioner's tenant.
11. **Fix MCP child-slug path construction** — Remove the tenant-prefix drop and parent-slug duplication when constructing paths for child agent operations.

**Medium-term (improve docs completeness):**
12. **Add docs pages for missing command groups** — `session`, `queue`, `subscriptions`, `task`, `url`, `bakes`, `catalog`, `flight` all lack individual pages.
13. **Update version/API endpoint in docs** — Replace `api.murmur.sh:443` with `api.murmur.dev:9090` and `Client: 0.4` with a non-hardcoded placeholder.
14. **Fix phantom CLI flags** — Remove `--reasoning-effort`, `--service-profile`, `murmur install`, `murmur attach` from docs (or implement them).
15. **Add permission requirements to admin-only `get` commands** — disk-type, group, machine-type, repo-config, role, secret, service-profile, tenant-binding, user-secret pages should note required permissions.
16. **Add end-to-end workflow guides** — The docs cover primitives but not compositions. Needed: CI watcher bot tutorial, flight write-and-run tutorial, port-proxy with auth explanation, `murmur each` working example.
17. **Update toolchain versions** — Go 1.22.x → 1.24.x, Poetry 1.8.3 → 2.x, Ruff 0.4.8 → 0.9.x in recipe and image examples.
18. **Fix `check-permissions` docs example** — Move `--resource` flag before positional arguments.
19. **Add `pool status` VM context note** — "Pool commands are only available on developer workstations, not inside murmur VMs."

---

## Appendix: Sibling PR Index

| Agent | PR | Repo | Findings |
|-------|-----|------|---------|
| `docs-newbie-onboarding` | [#9](https://github.com/ilovepizza2026/pizza-perfection/pull/9) | ilovepizza2026/pizza-perfection | 8 friction points, 5 blockers |
| `mcp-docs-diff` | [#10](https://github.com/ilovepizza2026/pizza-perfection/pull/10) | ilovepizza2026/pizza-perfection | 0 phantom, 0 undocumented, 8 drifted |
| `cli-docs-diff` | [#11](https://github.com/ilovepizza2026/pizza-perfection/pull/11) | ilovepizza2026/pizza-perfection | 1 phantom, 7 undocumented, 7 drifted |
| `docs-link-sweep` | [#12](https://github.com/ilovepizza2026/pizza-perfection/pull/12) | ilovepizza2026/pizza-perfection | 3 broken links, 7 version drifts |
| `pizza-bug-validation` | [#13](https://github.com/ilovepizza2026/pizza-perfection/pull/13) | ilovepizza2026/pizza-perfection | 8 confirmed bugs, 2 UX gaps, 5 not-a-bug |
| `docs-codeblock-check` | [#14](https://github.com/ilovepizza2026/pizza-perfection/pull/14) | ilovepizza2026/pizza-perfection | 3 broken, 2 drifted, 272 unrunnable of 370 bash blocks |
| `docs-scenario-walkthroughs` | [#15](https://github.com/ilovepizza2026/pizza-perfection/pull/15) | ilovepizza2026/pizza-perfection | 1 WORKED, 4 GAPS of 5 scenarios |
| `bug-verification` | [#27](https://github.com/prassoai/murmuration-docs/pull/27) | prassoai/murmuration-docs | 9 still legit, 2 fixed, 1 partial, 2 cannot repro |

*No sibling PRs were merged. All findings are based on reports committed to sibling branches as of 2026-05-15.*
