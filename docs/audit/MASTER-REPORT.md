# Murmur / docs.murmur.dev Master Audit Report

**Date:** 2026-05-15  
**Synthesizer:** `pizza/docs-master-report`  
**Audit fleet:** 8 sibling agents (all 8 completed with PRs)  
**Scope:** murmur CLI v80.1, MCP server v80.1, docs.murmur.dev (≈127 pages), `ilovepizza2026/pizza` workspace

**Owner key:** `DOCS-OPS` = Claire can fix by editing docs.murmur.dev · `ENGINEERING` = requires a code/infra change · `NEEDS-ENG-DECISION` = Claire is waiting on an answer before she can update docs

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

## Claire's Punch List

*DOCS-OPS only — things Claire can fix by editing docs.murmur.dev without waiting on engineering. Ordered by user impact.*

### Tier 1 — Fix first (currently blocking users)

| # | What to fix | Where | Finding |
|---|-------------|-------|---------|
| 1 | Replace every MCP absolute-path example: `/w/workspace/u/account/slug` → `/w/workspace/github_oauth/account/slug` (note: the provider token varies — add a sentence explaining `github_oauth` for OAuth users, `github_app` for app-installed accounts) | All MCP docs pages that show absolute paths | B-04 |
| 2 | Move admin-gate warning to **first sentence** of both the landing page and the developer quickstart: "⚠️ Before you start: your GitHub org admin must complete the Admin Quickstart first." | docs.murmur.dev landing, `/quickstart` | B-05 |
| 3 | Add one sentence on first Macroscope mention: "Murmur uses a GitHub App called **Macroscope** to access your repositories — it's the same product, just the name of its GitHub integration." | Landing page, admin quickstart | B-06 |
| 4 | Replace both `murmur install` references with `murmur setup` | `/configuration/local-overlays`, `/security/encryption` | B-17 |
| 5 | Replace `murmur attach` reference with `murmur ssh --attach <slug>` | `/configuration/local-overlays` | B-18 |
| 6 | Document flight YAML frontmatter: add a callout box showing the required `workspace:` frontmatter block before every flight body example. Also note: `name:` in frontmatter is shown in `describe flight` template but is rejected at runtime — the name comes from the `murmur set flight <name>` argument only. | `/concepts/flights`, `/guides/multi-agent-orchestration` | B-13, C-12 |
| 7 | Fix `check-permissions` docs example: `--resource` flag must come before positionals. Change `murmur check-permissions agent.edit --resource agent/my-task` → `murmur check-permissions --resource agent/my-task agent.edit` | `/cli/check-permissions` | B-21 |
| 8 | Add context note to pool command pages: "Pool commands (`pool status`, `pool up`, `pool flush`) run on the developer workstation. Running them inside a murmur VM returns an unsupported operation error." | `/cli/pool-status` (and pool-up, pool-flush) | B-22 |

### Tier 2 — Important context gaps

| # | What to fix | Where | Finding |
|---|-------------|-------|---------|
| 9 | Add prerequisites section to "Spawn Your First Agent": admin must have completed Admin Quickstart; `murmur setup` must be done; current branch must be pushed to origin; at least one workspace must exist. | `/spawn-your-first-agent` | M-20 |
| 10 | Update `murmur version` example output: `api.murmur.sh:443` → `api.murmur.dev:9090`. Optionally replace hard-coded version numbers with `<version>` placeholders to prevent future drift. | `/cli/version`, `/cli/overview` | M-11 |
| 11 | Define terms inline on first use: **tenant** (a GitHub org), **workspace** (a named configuration set within a tenant), **persona** (an AI agent role definition), **flight** (a Markdown-based multi-agent workflow), **placement** (a cloud region/provider config), **recipe** (a VM environment template). Link to Concepts on each. | Landing page, both quickstarts | M-16 |
| 12 | Explain `murmur setup` vs `murmur init` run order. Add an ordered list to the developer quickstart: (1) admin completes Admin Quickstart, (2) developer runs `murmur setup`, (3) developer runs `murmur init` in their repo. | `/quickstart`, `/admin-quickstart` | M-17 |
| 13 | Add OpenAI credentials (`OPENAI_API_KEY`) to the developer quickstart prerequisites. Currently only Claude credentials are mentioned but `murmur setup` prompts for both. | `/quickstart` | M-18 |
| 14 | Add link/explanation for `CLAUDE_CODE_OAUTH_TOKEN` in the non-interactive setup section. Explain it's different from `ANTHROPIC_API_KEY` and how to obtain it. | `/cli/setup` | M-19 |
| 15 | Document the personal-tenant fast path for solo developers: "If you don't have org admin access, you can use your personal tenant (`github_oauth/<your-username>`) for individual testing — no GitHub App installation required." | Landing page, `/quickstart` | M-33 |

### Tier 3 — Missing documentation (commands that work but aren't documented)

| # | What to fix | Where | Finding |
|---|-------------|-------|---------|
| 16 | Document `pool reconcile-visibility`: what it does (cleans up ghost sidebar agents), when to use it, and its `-workspace` flag. *First confirm with engineering that this is a supported public command.* | New page `/cli/pool-reconcile-visibility` or add to pool docs | M-08 |
| 17 | Document all six `bakes ls` flags: `-all` (default true — note this counter-intuitive default), `-environment`, `-placement`, `-full-hash`, `-page-size`, `-page-token` | `/cli/bakes-ls` | M-09 |
| 18 | Fix `bakes ls --page-token` example: remove the hardcoded token `eyJsYXN0X2lkIjoiMTAifQ==` (invalid) and replace with `<token from previous output>` | `/cli/bakes-ls` | M-21 |
| 19 | Document that `murmur subscriptions add` subscribes to **all** event types on a branch — there is no per-event-type filter. Add an `--on-idle keep-alive` spawn example for long-running watcher agents. | `/concepts/events`, `/cli/subscriptions-add` | M-26, M-27 |
| 20 | Update Go version in image/recipe examples from 1.22.x to 1.24.x. Fix the inconsistency between pages (1.22.4 vs 1.22.0). | `/guides/custom-images`, `/catalog/recipe`, `/configuration/vm-environment` | M-29 |
| 21 | Update Poetry from 1.8.3 → 2.x and Ruff from 0.4.8 → 0.9.x in recipe examples, or remove pins and note "use latest stable." | `/catalog/recipe` | M-30 |
| 22 | Replace date-versioned Claude model string `claude-sonnet-4-20250514` with the undated alias `claude-sonnet-4` and add a note to check Anthropic's model docs for the latest snapshot. | `/configuration/vm-environment` | M-31 |
| 23 | Update `check-permissions` REASON column in docs example: `granted by role "developer"` → `tenant-binding:murmur-all-members-tenant-member`; `no matching grant` → `denied: no matching grant` | `/cli/check-permissions` | M-32 |
| 24 | Document `murmur install-repo --webhook-url` — specifically what URL format/value to supply. *Ask engineering for this value first.* | `/cli/install-repo` | M-28 |

### Tier 4 — Cosmetic / completeness

| # | What to fix | Where | Finding |
|---|-------------|-------|---------|
| 25 | Add a dedicated `version` docs page explaining both return fields (`client_version`, `api_host`) and the intended use (verify you're connected to prod vs. nonprod). | New page `/mcp-server/version` | C-03 |
| 26 | Create stub pages for 8 missing command groups: `session`, `queue`, `subscriptions`, `task`, `url`, `bakes`, `catalog`, `flight`. Each 404 is a dead link. At minimum, redirect each to the overview with a "full reference coming soon" note. | `/cli/session`, `/cli/queue`, etc. | C-06 |
| 27 | Add `deleted` status value to `task update -s` docs (currently only `pending`, `in_progress`, `completed` are shown). | `/cli/task-update` (or equivalent) | C-07 |
| 28 | Document `queue conflict-resolution` full signature: `murmur queue conflict-resolution <slug> <repo> <strategy>` — the top-level `queue --help` shows only 2 args but 3 are required. | `/cli/queue` | C-08 |
| 29 | Replace `https://github.com/acme-corp/api` fictional example with `https://github.com/your-org/your-repo` or another clearly non-resolvable placeholder. | `/catalog/flight` | C-10 |
| 30 | Add `--workspace <name>` to all `murmur spawn` docs examples — it's required in practice when `murmur.yaml` doesn't set a default. | All spawn examples | C-11 |
| 31 | Add a changelog note that `murmur session watch` now streams live events in v80.1 (previously showed only the version-mismatch warning). | Release notes or `/cli/session` | C-13 |
| 32 | Explain the `prassoai` organization name on first use in install docs: "The CLI is published by Prasso AI (the company behind Murmur) under the `prassoai` Homebrew tap." | `/quickstart`, install sections | C-14 |
| 33 | Fix developer quickstart internal link: link text says "Developer quickstart" but destination is `/quickstart`. Either rename the page to `/developer-quickstart` or update the link text to match. | Landing page | C-15 |
| 34 | Standardize docs examples to single-dash notation (`-workspace`, `-force-new`) to match what the CLI actually prints in `--help` output. Both forms work at runtime, but cross-referencing is friction when sources disagree. | All CLI docs pages | C-04 |
| 35 | Add `spawn --stream` flag to docs. *Ask engineering first: is this intentionally undocumented (experimental) or just forgotten?* | `/cli/spawn` | C-05 |
| 36 | Add a latency callout to `murmur get agent`: "Listing all agents may take 20+ seconds in large tenants." | `/catalog/agent` | C-09 |

---

## Flag to Engineering

*Findings where Claire cannot fix the root cause — the CLI, MCP server, or infrastructure needs a code change. Each item is a one-liner suitable for a ticket description.*

### CLI

| ID | Component | One-liner for ticket |
|----|-----------|----------------------|
| B-02 | Homebrew tap ops | Publish murmur v80.x to `prassoai/homebrew-tap` stable channel; currently stuck at v79.1, blocking all brew users from reaching a server-compatible version |
| B-03 | CLI subcommand registration | Register `murmur flight` subcommand — it appears in `murmur --help` and docs overview but returns "unknown command" on invocation |
| B-07 | `wait` command | `murmur wait --phase PHASE_SLEEPING` returns exit 0 in <1s when agent is in PHASE_RUNNING; should block until target phase is reached |
| B-08 | `patch` command | `murmur patch agent-persona --set <field>=<value>` always fails with "content and structured fields are mutually exclusive" — `--set` is unusable for markdown-format catalog kinds |
| B-09 | `task update` command | `murmur task update -s <status>` silently no-ops for all valid statuses (`completed`, `in_progress`, `deleted`) and even invalid ones; exits 0 with no indication of failure |
| B-10 | `each` command | `murmur each` fails with `session_mode is required` on actual spawn (not `--dry-run`); `murmur spawn` succeeds without this flag, so `each` should default the same way |
| B-12 | `spawn --flight` help text | `spawn --flight` help says "Flight file path relative to `.murmur/flights/`" but actual behavior is catalog name lookup — local file paths fail; help text needs correction |
| B-19 | `patch --set` | `murmur patch --set` rejects camelCase field names emitted by `murmur get` (`provisioningTimeout`, `baseImageGceRef`); requires snake_case (`provisioning_timeout`) — round-trip is broken |
| M-04 | `wait`/`sleep`/`wake` help | These three commands show `[path]` as the positional argument name in usage strings; should be `[slug]` |
| M-05 | `pool --help` | Top-level `murmur --help` and `murmur pool --help` advertise `pool up --nuke`; `-nuke` actually lives on `pool flush`, not `pool up` |
| M-06 | `spawn --flight` help | `--flight` description should say "flight name as registered in the catalog" not "file path relative to `.murmur/flights/`" |
| M-07 | `spawn` usage string | Usage shows `<slug>` as required positional even when `--flight` is set (which makes slug optional/auto-derived) |
| M-10 | `murmur --help` listing | `sleep`, `wake`, `ssh`, `wait`, `rekey`, `install-repo`, `describe` are functional, documented commands that do not appear in `murmur --help`; add them to the listing |
| M-13 | `setup --out` help | Help text says default is `murmur.local.yaml`; actual default is `.murmur/murmur.local.yaml` — the `.murmur/` directory is omitted |
| M-14 | `queue conflict-resolution` help | Top-level `queue --help` shows `<slug> <strategy>` (2 args); actual implementation requires `<slug> <repo> <strategy>` (3 args) |
| M-15 | `task ls` UX | `murmur task ls <slug>` on a zero-task agent produces no output (exit 0) — indistinguishable from a hung command; should print `(no tasks)` or `[]` |
| M-34 | `session watch` UX | `murmur session watch` has no startup confirmation line ("watching <slug>…") and no heartbeat during idle; a silent stream looks hung |
| M-35 | `notify` validation | `murmur notify <non-existent-slug> "msg"` exits 0 with "notified" even when slug doesn't exist; server should validate the target agent exists |
| C-02 | `spawn` schema | `spawn.force_new` and `spawn.resurrect` have default value `"false"` (string) in the JSON schema despite being declared `type: boolean`; should be `false` (boolean) |
| C-12 | `describe flight` | The `describe flight` template includes a `name:` frontmatter field but `murmur set flight` rejects it at parse time; template should be corrected |

### MCP Server

| ID | Component | One-liner for ticket |
|----|-----------|----------------------|
| M-01 | `spawn` tool schema | `slug`, `workspace`, `description` are absent from JSON schema `required` array but the server enforces them at runtime; schema should reflect runtime requirements |
| M-02 | `spawn` tool schema | `spawn.repos[]` server description omits the `base_branch` field that docs expose; add `base_branch` to the schema description |
| M-03 | `task_update` tool schema | `task_update.status` server description says only "New task status." with no valid values; add enum: `pending`, `in_progress`, `completed`, `deleted` |
| C-01 | `port_url` tool schema | `port_url.port` is typed `number` in server schema (accepts fractional values); should be `integer` with a 1–65535 range constraint |

### Provisioner / Infrastructure

| ID | Component | One-liner for ticket |
|----|-----------|----------------------|
| B-14a | VM provisioner | VMs in non-native tenants receive `murmur.yaml` stamped with the provisioner's tenant (`prassoai`) instead of the VM's actual tenant (`ilovepizza2026`); catalog ops silently query wrong tenant |
| B-14b | MCP path construction | MCP tools that take a relative `slug` argument for child agents construct a malformed path: missing the tenant prefix (`github_app/<org>/`) and duplicating the parent slug; affects `kill`, `task_*`, `queue_add`, `interrupt` |

### Needs Engineering Decision (Claire is blocked)

Before Claire can update the docs for these items, engineering needs to make a call:

| ID | Question | Context |
|----|----------|---------|
| B-01 | Does a Linux binary download URL exist? If yes, share with Claire so she can add it to the install docs. If no, publish one or provide a Docker image. | Brew is macOS-only; Linux VMs already have the binary at `/usr/local/bin/murmur`, implying a binary is produced |
| B-11 | Are port-proxy URLs intentionally auth-gated (tenant members only), or is the 403 a bug? | Claire needs to know: if intended, she'll update docs to say "accessible to murmur tenant members"; if a bug, she'll wait for the fix |
| B-15 | Will `--reasoning-effort` be added to the `murmur spawn` CLI flag? If yes, when? If no, Claire removes it from docs. | Flag is documented at `/concepts/agents`; exists in MCP tool but not in CLI |
| B-16 | Will `--service-profile` be added to the `murmur spawn` CLI flag? If yes, when? If no, Claire removes it from docs. | Flag is documented at `/concepts/service-profiles` but not in CLI |
| B-20 | Will `prassoai/murmuration` Terraform module repo be made public? If yes, also fix the double-slash URL typo. If no, Claire removes the links from `/guides/customer-placements`. | Both Terraform links return 404; the `prassoai/murmuration` repo does not exist |
| M-08 | Is `pool reconcile-visibility` an officially supported command? If yes, Claire will write a docs page. If it's an internal/experimental command, engineering should consider hiding it from `--help`. | Command is functional but undocumented; solves the ghost-sidebar-agent problem |
| M-10 | Are `sleep`, `wake`, `ssh`, `wait`, `rekey`, `install-repo`, `describe` intentionally hidden from `murmur --help`? | If oversight → engineering adds them to the listing. If intentional → Claire adds a "hidden commands" note to docs so users know to look. |
| M-22/M-23/M-24 | Which YAML field names and nesting does the server actually accept for `murmur set placement` / `murmur patch placement`? | `murmur get placement` emits `substrate: SUBSTRATE_GCP` and `gcp:` at root; docs show `substrate: GCP` and `target: { gcp: ... }`. Claire cannot write correct examples until engineering confirms the canonical write format. |
| M-28 | What URL should users pass to `murmur install-repo --webhook-url`? | Command is documented but the URL value is never explained; users have no way to know what to supply |
| C-05 | Is `spawn --stream` intentionally undocumented (experimental) or just forgotten? | If stable → Claire documents it. If experimental → Claire adds an "experimental, unsupported" callout. |

---

## Severity Rankings

*Owner column added to every finding. See key at top of document.*

### BLOCKING — User cannot complete the task

| ID | Finding | Owner | Source |
|----|---------|-------|--------|
| B-01 | Brew-only CLI install; no Linux/Windows path documented | NEEDS-ENG-DECISION (does a binary DL URL exist?) | newbie-onboarding, codeblock-check, pizza-bug-validation |
| B-02 | Homebrew tap stuck at v79.1; server requires v80.x; `brew upgrade murmur` is a no-op | ENGINEERING | bug-verification, pizza-bug-validation |
| B-03 | `murmur flight` listed in `--help` and docs overview but returns "unknown command" | ENGINEERING | cli-docs-diff, bug-verification, pizza-bug-validation, scenario-walkthroughs |
| B-04 | MCP absolute path examples use `/u/account/` form which server rejects | DOCS-OPS | bug-verification, pizza-bug-validation, mcp-docs-diff |
| B-05 | Admin-gated developer path: docs bury the admin prerequisite until mid-page | DOCS-OPS | newbie-onboarding |
| B-06 | "Macroscope" GitHub App name never explained in relation to "Murmur" | DOCS-OPS | newbie-onboarding |
| B-07 | `murmur wait --phase` returns exit 0 immediately when agent is still RUNNING | ENGINEERING | bug-verification |
| B-08 | `murmur patch agent-persona --set` always fails ("content and structured fields are mutually exclusive") | ENGINEERING | bug-verification, pizza-bug-validation |
| B-09 | `murmur task update -s` is a silent no-op for all status values; exit 0 gives false success | ENGINEERING | bug-verification, pizza-bug-validation |
| B-10 | `murmur each` CLI fails with `session_mode is required`; docs present it as working | ENGINEERING | scenario-walkthroughs |
| B-11 | Port-proxy URLs return 403; docs describe them as "public" with no auth caveat | NEEDS-ENG-DECISION (intentional auth gate or bug?) | scenario-walkthroughs |
| B-12 | `--flight` flag does catalog lookup, not local file read; contradicts its own help text | ENGINEERING | scenario-walkthroughs, pizza-bug-validation |
| B-13 | Flight YAML frontmatter (`workspace` field) required but undocumented; docs examples fail to parse | DOCS-OPS | scenario-walkthroughs |
| B-14 | VM in non-native tenant gets wrong `murmur.yaml`; catalog ops silently hit wrong tenant | ENGINEERING | pizza-bug-validation |
| B-15 | `--reasoning-effort` flag documented for `murmur spawn` but does not exist in CLI | NEEDS-ENG-DECISION (ship flag or remove from docs?) | link-sweep |
| B-16 | `--service-profile` flag documented for `murmur spawn` but does not exist in CLI | NEEDS-ENG-DECISION (ship flag or remove from docs?) | link-sweep |
| B-17 | `murmur install` referenced on two docs pages but command does not exist | DOCS-OPS | link-sweep |
| B-18 | `murmur attach` referenced on two docs pages but command does not exist | DOCS-OPS | link-sweep |
| B-19 | `murmur patch --set` rejects camelCase from `murmur get`; round-trip broken | ENGINEERING | bug-verification, pizza-bug-validation |
| B-20 | Terraform module links return 404 (repo doesn't exist; URLs also have double-slash) | NEEDS-ENG-DECISION (publish repo or remove links?) | link-sweep |
| B-21 | `check-permissions --resource` flag must come before positionals; docs example has wrong order | DOCS-OPS | codeblock-check |
| B-22 | `murmur pool status` fails from inside a VM; docs don't mention context requirement | DOCS-OPS | codeblock-check |

### MISLEADING — User gets wrong output or forms wrong mental model

| ID | Finding | Owner | Source |
|----|---------|-------|--------|
| M-01 | MCP `spawn.slug`, `.workspace`, `.description` marked Required in docs but absent from JSON schema `required` array | ENGINEERING | mcp-docs-diff |
| M-02 | MCP `spawn.repos[].base_branch` documented but not in server schema description | ENGINEERING | mcp-docs-diff |
| M-03 | MCP `task_update.status` valid values (`pending`, `in_progress`, `completed`, `deleted`) absent from server description | ENGINEERING | mcp-docs-diff |
| M-04 | `murmur wait/sleep/wake` CLI usage shows `[path]` argument name; docs correctly call it `[slug]` | ENGINEERING | cli-docs-diff |
| M-05 | `murmur pool --help` advertises `pool up --nuke`; `-nuke` actually lives on `pool flush` | ENGINEERING | cli-docs-diff |
| M-06 | `murmur spawn --flight` value: CLI says "file path", docs say "flight name" | ENGINEERING | cli-docs-diff |
| M-07 | `murmur spawn --flight` makes slug optional (docs), required (CLI usage string) | ENGINEERING | cli-docs-diff |
| M-08 | `pool reconcile-visibility` undocumented; users can't discover it to fix ghost sidebar agents | DOCS-OPS + NEEDS-ENG-DECISION (confirm it's a supported public command first) | cli-docs-diff |
| M-09 | `murmur bakes ls` six flags undocumented (incl. environment/placement filters) | DOCS-OPS | cli-docs-diff |
| M-10 | 7 functional CLI commands hidden from `murmur --help`: `sleep`, `wake`, `ssh`, `wait`, `rekey`, `install-repo`, `describe` | ENGINEERING (fix `--help` listing) + NEEDS-ENG-DECISION (intentional or oversight?) | cli-docs-diff |
| M-11 | `murmur version` example output shows `api.murmur.sh:443`; actual is `api.murmur.dev:9090` | DOCS-OPS | link-sweep, codeblock-check |
| M-12 | `murmur ls -a` docs description omits "canceled" agent state | DOCS-OPS | cli-docs-diff |
| M-13 | `murmur setup --out` CLI help text omits `.murmur/` directory context; docs are correct | ENGINEERING | cli-docs-diff |
| M-14 | `murmur queue conflict-resolution --help` shows 2-arg signature; implementation requires 3 args | ENGINEERING | bug-verification, pizza-bug-validation, cli-docs-diff |
| M-15 | `murmur task ls` zero-task agent produces no output; indistinguishable from hung command | ENGINEERING | bug-verification, pizza-bug-validation |
| M-16 | Undefined terms on first use: `tenant`, `workspace`, `persona`, `flight`, `placement`, `recipe` | DOCS-OPS | newbie-onboarding |
| M-17 | `murmur setup` vs `murmur init` run order never explained; `murmur init` missing from quickstarts | DOCS-OPS | newbie-onboarding |
| M-18 | OpenAI credentials required by `murmur setup` wizard but not listed in prerequisites | DOCS-OPS | newbie-onboarding |
| M-19 | `CLAUDE_CODE_OAUTH_TOKEN` referenced in non-interactive setup mode; no link to how to obtain it | DOCS-OPS | newbie-onboarding |
| M-20 | "Spawn Your First Agent" page has no prerequisites section | DOCS-OPS | newbie-onboarding |
| M-21 | `bakes ls --page-token` example token is invalid; returns InvalidArgument from server | DOCS-OPS | codeblock-check |
| M-22 | Catalog YAML schema divergence: docs show `substrate: GCP`; API emits `SUBSTRATE_GCP` | NEEDS-ENG-DECISION (which form does server accept for writes?) | pizza-bug-validation |
| M-23 | Catalog YAML schema divergence: docs show `target: { gcp: ... }` nesting; API emits `gcp:` at root | NEEDS-ENG-DECISION (which form does server accept for writes?) | pizza-bug-validation |
| M-24 | Catalog YAML schema divergence: docs show `target: { aws: ... }` nesting; API emits `aws:` at root with camelCase fields | NEEDS-ENG-DECISION (which form does server accept for writes?) | pizza-bug-validation |
| M-25 | `murmur each --dry-run` works; actual spawn silently fails with `session_mode is required` (no docs warning) | ENGINEERING | scenario-walkthroughs |
| M-26 | Subscriptions API has no event-type filter; docs imply per-event subscription is possible | DOCS-OPS (document the limitation) | scenario-walkthroughs |
| M-27 | No `--on-idle keep-alive` example for long-running watcher agents | DOCS-OPS | scenario-walkthroughs |
| M-28 | `murmur install-repo --webhook-url` required but the correct URL value never documented | DOCS-OPS + NEEDS-ENG-DECISION (what URL does engineering want users to supply?) | scenario-walkthroughs |
| M-29 | Go 1.22.x in image/recipe examples is outdated (EOL); current stable is 1.24.x | DOCS-OPS | link-sweep |
| M-30 | Poetry 1.8.3 and Ruff 0.4.8 in recipe examples are outdated (current: Poetry 2.x, Ruff 0.9.x) | DOCS-OPS | link-sweep |
| M-31 | Date-versioned Claude model string in VM environment example will become stale | DOCS-OPS | link-sweep |
| M-32 | `murmur check-permissions` REASON format has drifted from docs example | DOCS-OPS | codeblock-check |
| M-33 | No personal-tenant fast path documented (solo dev without org admin is fully blocked) | DOCS-OPS | newbie-onboarding |
| M-34 | `murmur session watch` has no startup confirmation line; idle agents produce silence | ENGINEERING | bug-verification |
| M-35 | `murmur notify` accepts non-existent slugs with exit 0; no server-side validation of slug existence | ENGINEERING | pizza-bug-validation |

### COSMETIC — Friction but not blocking

| ID | Finding | Owner | Source |
|----|---------|-------|--------|
| C-01 | MCP `port_url.port` typed as `number`; docs say `integer` with 1–65535 range | ENGINEERING (fix schema type + range) | mcp-docs-diff |
| C-02 | MCP `spawn.force_new`/`.resurrect` defaults stored as string `"false"` not boolean `false` | ENGINEERING | mcp-docs-diff |
| C-03 | MCP `version` has no dedicated docs page; `api_host` return field and purpose underdescribed | DOCS-OPS | mcp-docs-diff |
| C-04 | Single-dash (CLI) vs double-dash (docs) notation throughout; both work but cross-referencing is friction | DOCS-OPS (standardize docs to single-dash) | cli-docs-diff |
| C-05 | `murmur spawn --stream` flag undocumented | DOCS-OPS + NEEDS-ENG-DECISION (intentional or forgotten?) | cli-docs-diff |
| C-06 | No docs pages for `session`, `queue`, `subscriptions`, `task`, `url`, `bakes`, `catalog` groups (all 404) | DOCS-OPS | cli-docs-diff |
| C-07 | `murmur task update -s deleted` status value undocumented | DOCS-OPS | cli-docs-diff |
| C-08 | `murmur queue conflict-resolution` full 3-arg signature not documented anywhere | DOCS-OPS | cli-docs-diff |
| C-09 | `murmur get agent` takes ~22 seconds; no latency disclaimer | DOCS-OPS (add note) + ENGINEERING (performance, investigate pagination default) | codeblock-check |
| C-10 | Fictional example URL `github.com/acme-corp/api` returns 404 | DOCS-OPS | link-sweep |
| C-11 | `--workspace` flag omitted from docs `murmur spawn` examples; required in practice | DOCS-OPS | scenario-walkthroughs |
| C-12 | Flight `name:` frontmatter field in `describe flight` template is rejected at runtime | ENGINEERING | scenario-walkthroughs |
| C-13 | `murmur session watch` v79.1→v80.1 improvement (events now stream) not documented | DOCS-OPS | bug-verification |
| C-14 | `prassoai` tap namespace never explained in install docs | DOCS-OPS | newbie-onboarding |
| C-15 | Developer quickstart at `/quickstart` URL, not `/developer-quickstart` as link text implies | DOCS-OPS | newbie-onboarding |

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
