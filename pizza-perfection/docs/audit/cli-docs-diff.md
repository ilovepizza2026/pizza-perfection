# Murmur CLI ↔ Docs Audit

Audit date: 2026-05-15  
Methodology: `murmur --help` + recursive `murmur <subcmd> --help` compared against every page under docs.murmur.dev/cli/*.  
Docs baseline: docs.murmur.dev (fetched 2026-05-15).

---

## Summary Table

| Category | Count |
|----------|-------|
| **Phantom** — documented or listed but absent/broken in CLI | 1 |
| **Undocumented** — in CLI but no docs page / no mention | 7 |
| **Drifted** — both exist but disagree on description, flags, defaults, or signature | 7 |

---

## PHANTOM — Documented but missing / broken in CLI

### P1 · `murmur flight` — BLOCKING

**What docs say (cli/overview):**
> `murmur flight` — "Manage orchestration flights (validate, run)"

**What `murmur --help` says:**
```
  flight       Manage orchestration flights (validate, run)
```

**What actually happens:**
```
$ murmur flight --help
murmur: unknown command "flight"
```

The command appears in the top-level `murmur --help` listing but throws an "unknown command"
error when invoked. Any user following the docs or reading `--help` output and attempting to
use `murmur flight` will get an error.

**Severity: BLOCKING** — Command is advertised but non-functional.

---

## UNDOCUMENTED — CLI features with no docs coverage

### U1 · `murmur pool reconcile-visibility` — MISLEADING

The `pool` subcommand has four sub-subcommands: `status`, `up`, `flush`, and
`reconcile-visibility`. The docs overview lists only the first three:

> `murmur pool status`, `murmur pool up`, `murmur pool flush`

`reconcile-visibility` is absent from all docs pages and from the top-level `murmur pool --help`
summary text. The subcommand works:

```
$ murmur pool reconcile-visibility --help
usage: murmur pool reconcile-visibility [flags]

Trigger an immediate janitor sweep of orphaned Redis streams and stale
visibility entries. This is the same cleanup that the pool workflow runs
daily — use this command to clean up ghost sidebar agents on demand.
  -workspace string
        Workspace name (overrides murmur.yaml)
```

**Severity: MISLEADING** — Users encountering ghost sidebar agents have no documented recourse.

---

### U2 · `murmur bakes ls` — all flags undocumented — MISLEADING

`murmur bakes ls` is mentioned in the docs overview but there is no dedicated docs page
(`/cli/bakes` returns 404). Six flags are completely undocumented:

```
$ murmur bakes ls --help
usage: murmur bakes ls [flags]

List bake workflows for the current tenant.
  -all
        Include completed/failed bakes (false = running only) (default true)
  -environment string
        Filter by environment name
  -full-hash
        Show full image hash instead of truncated
  -page-size int
        Results per page [1-100] (server default: 25)
  -page-token string
        Opaque token for fetching the next page
  -placement string
        Filter by placement name
```

Note: `-all` defaults to `true` (show all bakes including completed), which is
counter-intuitive — users who expect only active bakes by default will be surprised.

**Severity: MISLEADING** — Key filtering flags (environment, placement) are invisible to docs readers.

---

### U3 · Hidden commands absent from `murmur --help` listing — MISLEADING

The following seven commands exist and work, but are **not listed in `murmur --help`**.
They are documented on docs.murmur.dev with dedicated pages:

| Command | Key flags | Docs page |
|---------|-----------|-----------|
| `murmur sleep` | `-workspace` | `/cli/sleep` ✓ |
| `murmur wake` | `-workspace` | `/cli/wake` ✓ |
| `murmur ssh` | `-attach`, `-v`, `-workspace` | `/cli/ssh` ✓ |
| `murmur wait` | `-phase`, `-workspace` | `/cli/wait` ✓ |
| `murmur rekey` | `-workspace` | `/cli/rekey` ✓ |
| `murmur install-repo` | `--webhook-url` (required) | `/cli/install-repo` ✓ |
| `murmur describe` | (none) | `/cli/describe` ✓ |

A user who discovers the CLI by running `murmur --help` gets no hint these commands exist.

**Severity: MISLEADING** — `sleep/wake` and `ssh` are core operational commands;
`describe` is explicitly referenced by `get/set/rm` help text yet absent from the listing.

---

### U4 · `murmur spawn --stream` flag undocumented — COSMETIC

CLI:
```
  -stream
        Use agentproc streaming backend (long-lived session)
```

The docs page `/cli/spawn` lists all other flags but omits `-stream` entirely.

**Severity: COSMETIC** — Power-user flag; absence from docs is a gap but not blocking.

---

### U5 · No dedicated docs pages for several command groups — COSMETIC

The following command groups have only a one-line entry in the overview;
all individual flags and subcommand details are undocumented (`/cli/<name>` returns 404):

| Group | Subcommands | Notable undocumented flags |
|-------|-------------|---------------------------|
| `murmur session` | `watch`, `send`, `interrupt`, `stop` | `session watch -from`, `session watch -json` |
| `murmur queue` | `add`, `clear`, `strategy`, `conflict-resolution` | `queue add -agent`, `queue add -task` |
| `murmur subscriptions` | `add`, `remove`, `flush`, `ls` | `-branch`, `-file`, `-repo` |
| `murmur task` | `create`, `update`, `ls`, `get` | `task create -activate-when`, `task create -pattern`, `task ls -active`, `task update -blocked-by`, `task update -blocks` |
| `murmur url` | `port`, `agent` | (both subcommands entirely) |

**Severity: COSMETIC** — Commands are discoverable via `--help`; missing docs pages add friction.

---

### U6 · `murmur task update -s deleted` status value undocumented — COSMETIC

CLI:
```
  -s string
        Status (pending, in_progress, completed, deleted)
```

The docs overview mentions `task update` but lists no accepted status values. The `deleted`
value is notable — it is the soft-delete mechanism, distinct from `completed`.

**Severity: COSMETIC** — Users may not know tasks can be removed via status update.

---

### U7 · `murmur queue conflict-resolution` full signature undocumented — COSMETIC

CLI:
```
usage: murmur queue conflict-resolution [flags] <slug> <repo> <strategy>
```

The docs overview says only "Set the conflict resolution strategy for a specific repo."
The three-argument positional signature (`slug`, `repo`, `strategy`) is not shown anywhere
in the docs.

**Severity: COSMETIC** — Command is mentioned but unusable without the signature.

---

## DRIFTED — Both CLI and docs exist but disagree

### D1 · `murmur wait / sleep / wake` argument name: `[path]` vs `[slug]` — MISLEADING

**CLI (all three commands):**
```
usage: murmur wait [flags] [path]
usage: murmur sleep [flags] [path]
usage: murmur wake [flags] [path]
```

**Docs (`/cli/wait`, `/cli/sleep`, `/cli/wake`):**
> "slug (string): Agent identifier; required on laptops, optional on VMs"

The CLI usage strings call the positional argument `[path]` — a copy-paste artifact from a
different command. The argument is actually an agent slug. A user reading the usage string
may attempt to pass a file path instead.

**Severity: MISLEADING** — Wrong argument label actively misleads users about what value to provide.

---

### D2 · `murmur pool --help` claims `up --nuke` but `-nuke` lives on `flush` — MISLEADING

**Top-level `murmur --help`:**
```
  pool         Manage the VM pool (status, up, flush, up --nuke)
```

**Actual `pool up` flags:**
```
$ murmur pool up --help
usage: murmur pool up [flags]
  -workspace string
        Workspace name (overrides murmur.yaml)
```

**Where `-nuke` actually lives:**
```
$ murmur pool flush --help
  -nuke
        Terminate ALL workflows and delete ALL VMs (nuclear option)
```

The top-level help advertises `pool up --nuke`, which does not exist. A user following
this hint will get: `flag provided but not defined: -nuke`.

**Severity: MISLEADING** — Wrong subcommand name for a destructive operation.

---

### D3 · `murmur spawn --flight` makes slug optional in docs but required in CLI — MISLEADING

**CLI usage string:**
```
usage: murmur spawn [flags] <slug> [description]
```
`<slug>` is shown as a required positional argument with no exceptions.

**Docs (`/cli/spawn`):**
> "slug: Required (unless `--flight`)"  
> "slug defaults to `flight-<name>`"

According to docs, `murmur spawn --flight billing-migration` (no slug) is valid. The CLI
usage string gives no indication of this optional-slug behavior.

**Severity: MISLEADING** — Contradictory signatures between CLI and docs.

---

### D4 · `murmur spawn --flight` value: "file path" (CLI) vs "flight name" (docs) — MISLEADING

**CLI:**
```
  -flight string
        Flight file path relative to .murmur/flights/ — reads and executes the flight via a pilot agent
```

**Docs (`/cli/spawn`):**
> `--flight string` — "Flight name; slug defaults to `flight-<name>`"

The CLI says the value is a **file path** (`relative to .murmur/flights/`). The docs say
it is a **name**. These produce different mental models: a user reading CLI help would
pass `deploy/billing.md`; a user reading docs would pass `billing`.

**Severity: MISLEADING** — Users cannot determine the correct argument format without testing.

---

### D5 · `murmur ls -a` description omits "canceled" — COSMETIC

**CLI:**
```
  -a    Include completed and failed workflows
```

**Docs (`/cli/ls`):**
> "`-a` — Include completed, failed, and canceled agents"

The CLI omits "canceled" from the flag description. Canceled agents are a distinct terminal
state.

**Severity: COSMETIC** — Wording omission; behavior is correct.

---

### D6 · `murmur setup --out` default omits directory context — COSMETIC

**CLI:**
```
  -out string
        Write local config to this path (- for stdout, default: murmur.local.yaml)
```

**Docs (`/cli/setup`):**
> "`--out` — Default: `murmur.local.yaml` in `.murmur/`"

The docs specify the file is written inside `.murmur/`; the CLI omits the directory,
leaving users unsure where to find the output file after running setup.

**Severity: COSMETIC** — Omits directory context from the default path description.

---

### D7 · Flag notation: single-dash (CLI) vs double-dash (docs) — COSMETIC

The CLI uses Go's `flag` package and displays single-dash form (`-workspace`, `-force-new`).
The docs consistently show double-dash form (`--workspace`, `--force-new`). Both forms work
at runtime, but cross-referencing examples between sources requires mental translation.

**Example — CLI help:**
```
  -force-new
        Start fresh even if a prior session exists for this slug
```

**Example — Docs (`/cli/spawn`):**
> `--force-new` (bool, default false) — "Start fresh; mutually exclusive with `--resurrect`"

**Severity: COSMETIC** — Both forms work; friction when copying examples between sources.

---

## Appendix A: Full CLI surface (from `--help` recursive walk)

Commands listed in `murmur --help`:
`version`, `setup`, `init`, `director`, `spawn`, `each`, `ls`, `status`, `kill`, `pool`,
`port-forward`, `url`, `watch`, `notify`, `upload`, `mcp`, `subscriptions`, `session`,
`flight` (**broken — unknown command**), `queue`, `task`, `auth`, `secret`, `get`, `set`,
`patch`, `rm`, `bake`, `bakes ls`, `check-permissions`

Commands functional but absent from `murmur --help` listing:
`sleep`, `wake`, `ssh`, `wait`, `rekey`, `install-repo`, `describe`

---

## Appendix B: Docs pages returning 404 (fetched 2026-05-15)

- `https://docs.murmur.dev/cli/session`
- `https://docs.murmur.dev/cli/queue`
- `https://docs.murmur.dev/cli/pool`
- `https://docs.murmur.dev/cli/subscriptions`
- `https://docs.murmur.dev/cli/task`
- `https://docs.murmur.dev/cli/url`
- `https://docs.murmur.dev/cli/bakes`
- `https://docs.murmur.dev/cli/catalog`
- `https://docs.murmur.dev/cli/flight`
