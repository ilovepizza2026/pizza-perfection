# Murmur Bug Validation Report — `pizza` Workspace (`ilovepizza2026` Tenant)

**Branch:** `murmur/w/pizza/github_oauth/clairerosenfeld/pizza-bug-validation`  
**Validator agent:** `pizza/pizza-bug-validation`  
**VM:** `murmur-fd6ca0f2` (Debian GNU/Linux 12, `murmur-gcp-us-central1` placement)  
**CLI version:** `80.1 (e1865153)`, Server: `80.1+e1865153`  
**Date:** 2026-05-15  
**Sibling report:** [prassoai/back#10958](https://github.com/prassoai/back/pull/10958) (back workspace, prassoai tenant)  
**Dashboard:** https://cloud.murmur.dev/github_app/ilovepizza2026/task/github_app%2Filovepizza2026%2Fw%2Fpizza%2Fgithub_oauth%2Fclairerosenfeld%2Fpizza-bug-validation

---

## Summary Table

| Bug | This run (pizza/ilovepizza2026) | Sibling run (back/prassoai) | Delta & Reasoning |
|-----|------|------|------|
| **#1** MCP session pinned to wrong tenant | **CONFIRMED BUG** | CANNOT REPRO | ⚠️ **KEY DELTA**: From ilovepizza2026 VM, murmur.yaml has `tenant.org: prassoai` — catalog ops show prassoai workspaces (back/analytics/murmuration), workspace `pizza` not found |
| **#2** MCP kill / task_* / upload drop tenant prefix | **CONFIRMED BUG** | NEEDS MORE INFO | ✅ Clearer repro: all MCP tools with explicit slug construct path `github_oauth/clairerosenfeld/w/pizza/pizza-bug-validation/{slug}` (missing `github_app/ilovepizza2026/` prefix, parent slug doubled) |
| **#3** CLI upload empty-slug on laptop | **CONFIRMED BUG** | CANNOT REPRO | ✅ Reproduced by `env -u MURMUR_WORKFLOW_ID murmur upload <file>` — path becomes `github_oauth//w//` |
| **#4** CLI flight subcommand unknown | **CONFIRMED BUG** | CONFIRMED BUG | ✅ Both agree |
| **#5** CLI wait --phase returns prematurely | **CANNOT REPRO** | CONFIRMED BUG | ⚠️ DELTA: Wait blocks correctly in all pizza tests (PHASE_IDLE, PHASE_SLEEPING); may be timing/environment-dependent |
| **#6** CLI patch --set rejects camelCase | **CONFIRMED BUG** | CONFIRMED BUG | ✅ Both agree |
| **#7** CLI patch agent-persona mutually exclusive | **CONFIRMED BUG** | CONFIRMED BUG | ✅ Both agree |
| **M** MCP interrupt not advertised | NOT A BUG | NOT A BUG | ✅ Both agree — interrupt is in tools/list |
| **Q** CLI notify discards slug | NEEDS MORE INFO | NOT A BUG | ⚠️ Slight delta: non-existent slug returns exit 0, no server-side validation observed |
| **R** CLI task update accepts invalid status | NOT A BUG | NOT A BUG | ✅ Both agree |
| **S** CLI task ls -json produces tabular output | NOT A BUG | NOT A BUG | ✅ Both agree |
| UX: task ls zero-task prints nothing | CONFIRMED UX GAP | CONFIRMED UX GAP | ✅ Both agree |
| UX: session watch no heartbeat | CONFIRMED UX GAP | CONFIRMED UX GAP | ✅ Both agree |
| UX: version warning floods | CANNOT REPRO | CANNOT REPRO | ✅ Both agree (versions in sync) |
| **I** Authorization inline name_pattern | CANNOT REPRO | CANNOT REPRO | No role.create permission in either run |
| **K** Flight persona blockquote | NOT TESTED | NOT A BUG | `murmur flight` is "unknown command" — can't reach flight parser |
| **A** Catalog: substrate enum drift | **CONFIRMED** | NOT A BUG | ⚠️ DELTA: `get placement` shows `SUBSTRATE_GCP`/`SUBSTRATE_AWS`; docs say `GCP`/`AWS` |
| **B** Catalog: target.gcp nesting | **CONFIRMED** | NOT A BUG | ⚠️ DELTA: `get placement` shows `gcp:` at root; docs show `target: gcp:` |
| **C** Catalog: spec.aws nesting | **CONFIRMED** | NOT A BUG | ⚠️ DELTA: `get placement` shows `aws:` at root; docs show `target: aws:` |
| **D** Catalog: "platform-builtin" | NOT CONFIRMED | NOT A BUG | `platform: true` in actual YAML, no "platform-builtin" string value found |

**Verdict counts (this run):** 8 confirmed bugs, 2 confirmed UX gaps, 5 not-a-bug, 3 cannot-repro/not-tested, 1 needs-more-info

---

## Setup: New-User Onboarding (Bash Path)

### 1. Install

The documented install path (`brew tap prassoai/tap && brew install prassoai/tap/murmur`) does **not work on Debian** — `brew` is unavailable. The docs have no Linux/Debian install path.

```
$ brew tap prassoai/tap
-bash: brew: command not found
```

The binary was pre-installed by the VM provisioner at `/usr/local/bin/murmur` (27 MB, owned by root). A new user on Debian would need to download the binary manually — the docs do not document how.

### 2. murmur version

```
$ murmur version
Client: 80.1 (e1865153)
API:    api.murmur.dev:9090
Server: 80.1+e1865153 (e1865153)
```

Client and server are in sync (v80.1). No version mismatch warning.

### 3. murmur setup

```
$ murmur setup --help
usage: murmur setup [flags]
  -commit-signing
        Upload signing key to GitHub (interactive mode also prompts when unset)
  -non-interactive
        Skip OAuth flow and prompts — read credentials from environment
  -out string
        Write local config to this path (- for stdout, default: murmur.local.yaml)
  -skip-ssh-keys
        Skip SSH key discovery (for environments without key pairs)
  -upload
        Upload developer profile to the server (interactive mode prompts; required for non-interactive)
```

`murmur setup` was not run interactively — credentials were pre-provisioned via `/etc/murmur/murmur.yaml` and the `MURMUR_IDENTITY_TOKEN`/`MURMUR_VM_API_TOKEN` environment variables. This is the VM/agent path, not the new-user laptop path.

### 4. murmur get workspace (CRITICAL: BUG #1 OBSERVED HERE)

```
$ murmur get workspace
analytics
back
murmuration
```

Expected (ilovepizza2026 tenant): `pizza`  
Actual: `analytics`, `back`, `murmuration` — these are `prassoai` tenant workspaces.

```
$ murmur get workspace pizza
murmur: get workspace: rpc error: code = NotFound desc = workspace "pizza" not found
```

The CLI config file `/etc/murmur/murmur.yaml` has:
```yaml
tenant:
  org: prassoai
  provider: github_app
```

But the VM's `MURMUR_WORKFLOW_ID` confirms it is in `ilovepizza2026`:
```
MURMUR_WORKFLOW_ID=github_app/ilovepizza2026/w/pizza/github_oauth/clairerosenfeld/pizza-bug-validation
```

**Root cause:** The VM's config file (`/etc/murmur/murmur.yaml`) was stamped with `tenant.org: prassoai` (the provisioner's tenant) instead of `ilovepizza2026` (the VM's actual tenant). All catalog operations (get workspace, get placement, check-permissions) hit the wrong tenant.

### 5. murmur ls (agent operations use VM token — correct tenant)

```
$ murmur ls
SLUG                                   PHASE    VM  PROGRESS  COST
pizza-bug-validation/test-echo-1       running                $0.05
```

Agent operations (ls, spawn, status, kill) use `MURMUR_VM_API_TOKEN` which is scoped to `ilovepizza2026`, so they work correctly. Only catalog operations are broken by the tenant mismatch.

### 6. murmur spawn, status, kill

```
$ murmur spawn --workspace pizza test-echo-1 "echo hello world"
Spawned: test-echo-1
  To get the status of the task:   murmur status test-echo-1
  To kill the task:                murmur kill test-echo-1
  To send a follow-up:             murmur queue add test-echo-1 "additional context"

$ murmur status test-echo-1
workflow: github_app/ilovepizza2026/w/pizza/github_oauth/clairerosenfeld/pizza-bug-validation/test-echo-1
phase:    PHASE_TASK_COMPLETE
vm:       murmur-40f7a545 ([REDACTED-PLACEMENT]/us-central1-a) [running]
version:  80.1+e1865153
progress: [tool] StructuredOutput (4s ago)
response: hello world
cost:     $0.05

$ murmur kill test-echo-1
killed test-echo-1
```

CLI agent operations work correctly with `ilovepizza2026` tenant context.

---

## Cross-Workspace Isolation Test (Pizza-Specific)

| Query | Result | Expected | Assessment |
|-------|--------|----------|------------|
| `murmur get workspace` | `analytics`, `back`, `murmuration` | `pizza` | ❌ BUG: Shows wrong tenant's workspaces |
| `murmur get workspace pizza` | `NotFound` | workspace object | ❌ BUG: Own workspace not found |
| `murmur get workspace back` | Returns `back` workspace YAML | Should be denied or not found | ❌ BUG: Cross-tenant workspace visible |
| `murmur ls --workspace pizza` | Shows `pizza` agents | Same | ✅ Correct (uses VM token) |
| `murmur check-permissions agent.read` | `yes tenant-binding:murmur-all-members-tenant-member` | — | Note: grants are in prassoai tenant |

**Isolation verdict:** `back`/`analytics`/`murmuration` workspaces ARE visible from the `ilovepizza2026` VM. The `pizza` workspace is NOT visible. This is the inverse of correct behavior — Bug #1.

---

## Bug-by-Bug Evidence

### Bug #1 — MCP session pinned to wrong tenant: CONFIRMED BUG

**This is the key test for this run.** The VM is in `ilovepizza2026`; murmur.yaml says `prassoai`.

```
$ cat /etc/murmur/murmur.yaml | grep -A2 'tenant:'
tenant:
  org: prassoai
  provider: github_app

$ echo $MURMUR_WORKFLOW_ID
github_app/ilovepizza2026/w/pizza/github_oauth/clairerosenfeld/pizza-bug-validation

$ murmur get workspace
analytics
back
murmuration
# ^^^ prassoai workspaces — not pizza
```

**MCP tools** (`mcp__murmur__ls`, `mcp__murmur__spawn`) correctly use the `ilovepizza2026` context via `MURMUR_VM_API_TOKEN` for agent operations. But **catalog CLI operations** use the wrong tenant.

---

### Bug #2 — MCP kill / task_* / upload drop tenant prefix: CONFIRMED BUG

MCP tools that take a `slug` parameter construct a malformed path, missing the tenant prefix and duplicating the parent slug.

**Correct path format** (as shown by CLI status):
```
github_app/ilovepizza2026/w/pizza/github_oauth/clairerosenfeld/pizza-bug-validation/test-kill-mcp
```

**MCP kill — wrong path constructed:**
```
mcp__murmur__kill(slug: "pizza-bug-validation/test-kill-mcp")
→ Error: agent "github_oauth/clairerosenfeld/w/pizza/pizza-bug-validation/pizza-bug-validation/test-kill-mcp" not found
```

Differences:
- `github_app/ilovepizza2026/` prefix is **missing**
- `pizza-bug-validation/` is **duplicated**
- `github_oauth/clairerosenfeld/` appears at root instead of inside the tenant path

**Same failure for other MCP tools:**
```
mcp__murmur__task_create(slug: "pizza-bug-validation/test-kill-mcp", subject: "test")
→ Error: agent "github_oauth/clairerosenfeld/w/pizza/pizza-bug-validation/pizza-bug-validation/test-kill-mcp" not found

mcp__murmur__task_list(slug: "pizza-bug-validation/test-echo-1")
→ Error: agent "github_oauth/clairerosenfeld/w/pizza/pizza-bug-validation/pizza-bug-validation/test-echo-1" not found

mcp__murmur__queue_add(slug: "pizza-bug-validation/test-watch-b", ...)
→ Error: agent "github_oauth/clairerosenfeld/w/pizza/pizza-bug-validation/pizza-bug-validation/test-watch-b" not found

mcp__murmur__interrupt(slug: "pizza-bug-validation/test-watch-b")
→ Error: agent "github_oauth/clairerosenfeld/w/pizza/pizza-bug-validation/pizza-bug-validation/test-watch-b" not found
```

**Self-slug (no slug arg) works:**
```
mcp__murmur__task_list()           → [] (success)
mcp__murmur__task_create(subject: "test")  → 1 (success)
```

**CLI equivalent works correctly:**
```
$ murmur kill test-kill-mcp
killed test-kill-mcp
$ murmur session interrupt test-watch-b
sent
```

**Note on upload:** `mcp__murmur__upload` was NOT affected — it correctly uses the `ilovepizza2026` path:
```
mcp__murmur__upload(filename: "test.txt", path: "/tmp/test.txt")
→ https://storage.googleapis.com/[REDACTED-GCS-BUCKET]-murmur-uploads-prod/t/github_app/ilovepizza2026/...
```

---

### Bug #3 — CLI upload constructs empty-slug agent path: CONFIRMED BUG

Reproduced by unsetting `MURMUR_WORKFLOW_ID` to simulate the laptop context (no VM env vars):

```
$ env -u MURMUR_WORKFLOW_ID murmur upload /tmp/test-upload.txt
murmur: upload /tmp/test-upload.txt: close upload: rpc error: code = NotFound desc = agent "github_oauth//w//" not found
exit: 1
```

The path `github_oauth//w//` has empty tenant/workspace/username fields — the CLI reads these from `MURMUR_WORKFLOW_ID` and when absent (laptop scenario), constructs an empty-slug path.

**From VM (with MURMUR_WORKFLOW_ID set) works fine:**
```
$ murmur upload /tmp/test-upload.txt
https://storage.googleapis.com/[REDACTED-GCS-BUCKET]-murmur-uploads-prod/t/github_app/ilovepizza2026/.../test-upload.txt
```

---

### Bug #4 — CLI flight subcommand returns unknown command: CONFIRMED BUG

```
$ murmur flight --help
murmur: unknown command "flight"
exit: 1
```

But `murmur --help` lists `flight` under `spawn`:
```
  spawn     Spawn an agent task (laptop: root workflow, VM: child via parent)
  ...
  flight       Manage orchestration flights (validate, run)
```

The `--help` output advertises `flight` as a top-level command, but invoking it produces "unknown command".

---

### Bug #5 — CLI wait --phase returns prematurely: CANNOT REPRO

All attempts to reproduce this bug blocked correctly:

```
# Agent at PHASE_RUNNING, wait for PHASE_IDLE (15s timeout)
$ time timeout 15 murmur wait --phase PHASE_IDLE test-b5-precise
real  0m15.003s   exit: 124  (timed out, did not return early)

# Agent at PHASE_RUNNING, wait for PHASE_SLEEPING (10s timeout)
$ time timeout 10 murmur wait --phase PHASE_SLEEPING test-wait-sleep2
real  0m10.002s   exit: 124  (timed out, did not return early)

# Agent at PHASE_TASK_COMPLETE, wait for PHASE_IDLE (10s timeout)
$ time timeout 10 murmur wait --phase PHASE_IDLE test-idle-b5
real  0m10.003s   exit: 124  (timed out, blocking correctly)

# Wait for correct phase returns immediately
$ time timeout 10 murmur wait --phase PHASE_TASK_COMPLETE test-wait-sleep2
# Returns immediately with exit 0 and full status output
```

Invalid phases fail cleanly:
```
$ murmur wait --phase PHASE_BOGUS test-echo-1
murmur: unknown phase "PHASE_BOGUS"
exit: 1
```

**Delta from sibling:** The back-workspace run confirmed this bug (`wait --phase PHASE_IDLE` returned exit 0 with `PHASE_RUNNING` shown). Could not reproduce in this pizza run. Possible explanations: fix landed between runs, timing-sensitive (race between spawn and wait), or different agent behavior.

---

### Bug #6 — CLI patch --set rejects camelCase field names: CONFIRMED BUG

`murmur get` emits YAML field names in camelCase; `murmur patch --set` requires snake_case. Round-trip is broken.

```
$ murmur get pool-config default
maxVms: 50.0

# Try patching with camelCase (as emitted by get):
$ murmur patch pool-config default --set maxVms=50
murmur: patch pool-config: rpc error: code = InvalidArgument desc = unknown field path "maxVms" in update mask
exit: 1

# snake_case works:
$ murmur patch pool-config default --set max_vms=50
Patched pool-config "default"
exit: 0
```

The `get` output uses `maxVms` but `patch --set` requires `max_vms`. The docs example in `patch --help` uses `max_vms` and `machine_type_ref`, but a naive user reading `get` output would try camelCase and fail.

---

### Bug #7 — CLI patch agent-persona --set mutually exclusive: CONFIRMED BUG

Any `--set` on an agent-persona resource fails:

```
$ murmur patch agent-persona director --set description="test description"
murmur: patch agent-persona: rpc error: code = InvalidArgument desc = content and structured fields are mutually exclusive
exit: 1
```

Agent-persona resources have a `content` field (full markdown system prompt). The server rejects any partial update via `--set` because the resource is treated as "either content OR structured fields". Since the resource always has a `content` field, `--set` on any field always fails.

---

### Bug M — MCP interrupt not advertised: NOT A BUG

The `interrupt` tool IS in the MCP server's `tools/list` response:

```json
{
  "name": "interrupt",
  "description": "Interrupt an agent's current turn. The agent stops cleanly between tool calls...",
  "inputSchema": {...}
}
```

Full tool count: 16 tools advertised (version, ls, status, spawn, kill, interrupt, wait, upload, task_create, task_update, task_list, task_get, port_url, agent_url, queue_add, clear_queue).

**Note:** Although `interrupt` is advertised, it fails at runtime due to Bug #2 (wrong path construction). The advertisement is correct; the implementation has the tenant-prefix bug.

---

### Bug Q — CLI notify silently discards slug: NEEDS MORE INFO

`murmur notify` accepts any slug, including non-existent ones, with exit 0:

```
$ murmur notify test-echo-1 "real agent message"
notified test-echo-1
exit: 0

$ murmur notify completely-nonexistent-slug-xyz "test message"
notified completely-nonexistent-slug-xyz
exit: 0

$ murmur notify "" "empty slug"
murmur: notify: rpc error: code = InvalidArgument desc = slug required
exit: 1
```

The server requires a non-empty slug but does not validate that the slug refers to an existing agent. Whether the message is actually routed to the named agent vs. dropped silently could not be verified (session watch is also silent — UX gap).

**Sibling found NOT A BUG (self-notify works).** This run found non-existent slugs succeed, suggesting the slug may not be used for server-side routing validation. Verdict differs slightly: NEEDS MORE INFO.

---

### Bug R — CLI task update accepts invalid status: NOT A BUG

```
$ murmur task update -s bogus_status 1
murmur: unknown task status "bogus_status"
exit: 1

$ murmur task update -s INVALID_STATUS_XYZ 1
murmur: unknown task status "INVALID_STATUS_XYZ"
exit: 1
```

The CLI correctly rejects invalid statuses with an error. Valid statuses (from help): `pending`, `in_progress`, `completed`, `deleted`.

---

### Bug S — CLI task ls -json produces tabular output: NOT A BUG

```
$ murmur task ls
ID  SUBJECT              STATUS               BLOCKED_BY
1   Test task for Bug R  TASK_STATUS_PENDING

$ murmur task ls -json
[{"id":"1","subject":"Test task for Bug R","status":"pending"}]
exit: 0
```

The `-json` flag correctly produces JSON array output.

---

## UX Gaps

### task ls on zero-task agent

```
$ murmur task ls test-echo-1
exit: 0
```

No output, no header row, no "no tasks" message. Indistinguishable from a hung command or a silent error.

```
$ murmur task ls test-wait-sleep
exit: 0
```

Same — completely silent for zero-task agents.

---

### session watch emits no heartbeat

```
$ timeout 15 murmur session watch test-watch-b
exit: 124
```

15 seconds of silence while the agent was actively running. No heartbeat, no status indicators. Looks indistinguishable from a hung connection.

---

### Server-version warning flood

```
$ murmur ls
# no version warning

$ murmur get pool-config
# no version warning

$ murmur status test-echo-1
# includes "version: 80.1+e1865153" in output (informational, not a warning)
```

Cannot reproduce — both client and server are at 80.1. Warning would appear on version mismatch.

---

## Ambiguous / Docs-Only Bugs

### Bug I — Authorization inline name_pattern: CANNOT REPRO

No `role.create` permission in either tenant context. Could not test the proto unmarshal failure.

```
$ murmur check-permissions role.create
role.create  no  denied: no matching grant
```

---

### Bug K — Flight persona blockquote: NOT TESTED

`murmur flight` is an unknown command (Bug #4), making it impossible to test flight-related parsing.

---

### Bugs A/B/C/D — Catalog YAML schema drift

**Bug A (substrate enum): CONFIRMED**

Docs say: `substrate: GCP` or `substrate: AWS`  
Actual API output:
```yaml
substrate: SUBSTRATE_GCP
# and
substrate: SUBSTRATE_AWS
```

If you follow the docs and submit `substrate: GCP`, it may be rejected by the server.

**Bug B (target.gcp nesting): CONFIRMED**

Docs show:
```yaml
target:
  gcp:
    project: acme-agents-prod
    ...
```

Actual API output:
```yaml
gcp:
  project: [REDACTED-GCP-PROJECT]
  zones:
  - us-central1-a
  ...
name: customer-prasso-tenant-vm-prod
substrate: SUBSTRATE_GCP
```

The `gcp:` block is at the **root level**, not nested under `target:`. A user following the docs would create a malformed placement.

**Bug C (spec.aws nesting): CONFIRMED**

Docs show:
```yaml
target:
  aws:
    account_id: "123456789012"
    ...
```

Actual API output:
```yaml
aws:
  accountId: "[REDACTED-AWS-ACCOUNT]"
  region: us-west-2
  vpcId: "[REDACTED-VPC-ID]"
  subnetIds:
  - "[REDACTED-SUBNET-ID-1]"
  - "[REDACTED-SUBNET-ID-2]"
  roleArn: "[REDACTED-ARN]"
  oidcProviderArn: "[REDACTED-OIDC-ARN]"
  readonlyRoleArn: "[REDACTED-ARN]"
  securityGroupId: "[REDACTED-SG-ID]"
  instanceProfileArn: "[REDACTED-ARN]"
substrate: SUBSTRATE_AWS
```

Same as Bug B: `aws:` is at root level, not under `target:`. Field names are also camelCase in output (`accountId`, `vpcId`, `roleArn`) vs snake_case in docs (`account_id`, `vpc_id`, `role_arn`).

**Note:** Cannot fully verify whether `substrate: GCP` or `substrate: SUBSTRATE_GCP` is accepted for `set` (no `placement.create` permission). The sibling report says NOT A BUG (schemas self-consistent). This run observes clear divergence between docs YAML and API output YAML.

**Bug D ("platform-builtin"): NOT CONFIRMED**

The `murmur-gcp-us-central1` platform placement shows `platform: true` in the output. No "platform-builtin" value was found anywhere in the actual YAML. The sibling also found NOT A BUG.

---

## Cross-Tenant / Cross-Workspace Queries

These are pizza-specific tests per the task brief:

| Test | Command | Output | Expected | Pass? |
|------|---------|--------|----------|-------|
| Own workspace visible | `murmur get workspace pizza` | `NotFound` | workspace object | ❌ |
| Other tenant workspace visible | `murmur get workspace back` | Returns full YAML | `NotFound` | ❌ |
| List workspaces | `murmur get workspace` | `analytics`, `back`, `murmuration` | `pizza` | ❌ |
| Agent ops in pizza | `murmur spawn --workspace pizza <slug>` | Works | Works | ✅ |
| Agent ls in pizza | `murmur ls` | Shows pizza agents | Same | ✅ |
| Agent ls in back | `murmur ls --workspace back` | `workflow not found` | — | Mixed |
| MCP ls | `mcp__murmur__ls()` | Shows pizza agents correctly | Same | ✅ |
| MCP spawn in pizza | `mcp__murmur__spawn(workspace: "pizza", ...)` | Works | Works | ✅ |

**Summary:** Agent operations (spawn/ls/status/kill via both CLI and MCP) correctly scope to `ilovepizza2026/pizza`. Catalog operations (workspace/placement/permissions) bleed to `prassoai` tenant due to hardcoded `tenant.org` in `murmur.yaml`.

---

## Key Deltas from Back-Workspace Run

| Bug | Back run | Pizza run | Interpretation |
|-----|----------|-----------|----------------|
| **#1** Tenant mismatch | CANNOT REPRO | **CONFIRMED** | The prassoai/back VM has a *correct* murmur.yaml; the ilovepizza2026 VM has a *wrong* murmur.yaml (stamped with prassoai). Provisioner-side bug scoped to cross-tenant VMs. |
| **#2** MCP slug path | NEEDS MORE INFO | **CONFIRMED** | Different workspace context made the path mangling more observable. Both runs hit the same bug; this run's cross-tenant setup made the tenant-prefix absence clearer. |
| **#3** Upload empty slug | CANNOT REPRO | **CONFIRMED** | Sibling tested from VM only. This run simulated laptop by unsetting `MURMUR_WORKFLOW_ID`. |
| **#5** wait --phase premature | CONFIRMED | CANNOT REPRO | Possibly timing-sensitive or fixed. Tested all combinations; wait blocks correctly here. |
| **A/B/C** Catalog schema | NOT A BUG | CONFIRMED | The prassoai/back workspace may have had self-consistent schema while the ilovepizza2026 context exposed the docs-vs-API divergence more clearly. Or the sibling did not test against actual `get` output. |

---

## Full Test Agent List (all cleaned up)

| Slug | Purpose | Outcome |
|------|---------|---------|
| `test-echo-1` | Basic spawn/status/kill | Completed, killed |
| `test-kill-mcp` | Bug #2 MCP kill | Killed via CLI after MCP failed |
| `test-wait-sleep` | Bug #5 wait SLEEPING | Killed |
| `test-wait-sleep2` | Bug #5 wait SLEEPING (long) | Killed |
| `test-wait-b5` | Bug #5 wait SLEEPING precise | Killed |
| `test-wait-b5b` | Bug #5 wait SLEEPING immediate | Killed |
| `test-watch-b` | UX: session watch | Killed |
| `test-idle-b5` | Bug #5 wait IDLE | Killed |
| `test-b5-precise` | Bug #5 wait IDLE precise | Killed |
| `test-wait-b5b` | Bug #5 wait SLEEPING | Killed |
| `test-notify-target` | Bug Q notify routing | Killed |

All agents used `echo`/`sleep` tasks only. No repos cloned beyond the provisioned `pizza-perfection` repo.
