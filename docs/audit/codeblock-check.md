# docs.murmur.dev Code Block Audit

**Date:** 2026-05-15  
**Branch:** `murmur/w/pizza/github_oauth/clairerosenfeld/docs-codeblock-check`  
**Methodology:** Crawled all 127 pages in the sitemap, extracted 679 fenced code blocks, classified by language, ran safe bash blocks, validated YAML/JSON/Markdown/HCL syntax, and classified each result.

---

## Summary Table

| Category | Count |
|---|---|
| Total pages crawled | 127 |
| Total code blocks found | 679 |
| shellscript blocks | 370 |
| text (output samples) | 175 |
| json blocks | 64 |
| yaml blocks | 62 |
| markdown (flight files) | 6 |
| hcl (Terraform) | 2 |

### Shellscript Block Disposition

| Status | Count |
|---|---|
| WORKS | 32 |
| DRIFTED | 2 |
| BROKEN | 3 |
| UNRUNNABLE — example resource not found | 12 |
| UNRUNNABLE — requires admin/operator permissions (not documented) | 15 |
| UNRUNNABLE — requires external context (interactive, creds, side effects) | 245 |
| UNRUNNABLE — synopsis/usage display only | 12 |
| UNRUNNABLE — `murmur get agent` slow (>22 s) | 1 |

### Non-Bash Block Validation

| Language | Blocks | Valid | Broken |
|---|---|---|---|
| yaml | 62 | 62 | 0 |
| json | 64 | 64 | 0 |
| markdown (flight frontmatter) | 6 | 6 | 0 |
| hcl | 2 | 2 (manual review only — no `terraform` on VM) | 0 |
| text | 175 | N/A (output samples, not runnable) | — |

---

## BROKEN — Commands Fail as Written

### 1. `murmur check-permissions agent.edit --resource agent/my-task`

**URL:** https://docs.murmur.dev/cli/check-permissions

**Command (as shown in docs):**
```
murmur check-permissions agent.edit --resource agent/my-task
```

**Actual stderr:**
```
murmur: invalid permission "--resource": must be "{kind}.{verb}"
```

**Root cause:** Go's `flag` package stops parsing flags after the first positional argument. `agent.edit` is consumed as the first positional arg, and `--resource` is then treated as another positional (permission name). The flag must precede all positional arguments:
```
murmur check-permissions --resource agent/my-task agent.edit
```

**Verified:** Running with `--resource` first works (exits 1 only because `agent/my-task` does not exist on this system).

---

### 2. `murmur bakes ls --page-size 10 --page-token=eyJsYXN0X2lkIjoiMTAifQ==`

**URL:** https://docs.murmur.dev/cli/bakes-ls

**Command (as shown in docs):**
```
murmur bakes ls --page-size 10 --page-token=eyJsYXN0X2lkIjoiMTAifQ==
```

**Actual stderr:**
```
murmur: list bakes: rpc error: code = InvalidArgument desc = invalid page_token
```

**Root cause:** The example page token `eyJsYXN0X2lkIjoiMTAifQ==` (base64 of `{"last_id":"10"}`) is not a valid page token for the current server implementation. The docs present it as a concrete follow-on example after `--page-size 10`, but the token format has drifted from the documentation.

---

### 3. `murmur pool status`

**URL:** https://docs.murmur.dev/cli/pool-status

**Command (as shown in docs):**
```
murmur pool status
```

**Actual stderr:**
```
murmur: pool commands are not supported on VMs
```

**Root cause:** Pool management commands (`pool status`, `pool up`, `pool flush`) are only available when the CLI is running on a developer laptop/workstation. Running the same command from inside a murmur VM — which is exactly where an agent would run — produces this error. The docs page does not mention this context requirement.

---

## DRIFTED — Runs but Output Differs from Docs

### 1. `murmur version`

**URL:** https://docs.murmur.dev/cli/version

**Command:**
```
murmur version
```

**Docs show:**
```
Client: 0.4 (a1b2c3d4)
API:    api.murmur.sh:443
Server: 0.4 (e5f6a7b8)
```

**Actual output:**
```
Client: 80.1 (e1865153)
API:    api.murmur.dev:9090
Server: 80.1+e1865153 (e1865...)
```

**Drift:**
- API endpoint changed from `api.murmur.sh:443` to `api.murmur.dev:9090`.
- Version numbering scheme changed from `0.4 (hash)` to `80.1 (hash)` (major version bump, presumably a real release increment).
- Server version format changed from `0.4 (hash)` to `80.1+hash (hash)`.

The example numbers in the docs (`0.4`, `a1b2c3d4`) are clearly placeholders, but the **API host** (`api.murmur.sh` vs `api.murmur.dev`) is a factual claim that is now wrong.

---

### 2. `murmur check-permissions agent.read agent.list agent.delete`

**URL:** https://docs.murmur.dev/cli/check-permissions

**Command:**
```
murmur check-permissions agent.read agent.list agent.delete
```

**Docs show:**
```
PERMISSION      GRANTED  REASON
agent.read      yes      granted by role "developer"
agent.list      yes      granted by role "developer"
agent.delete    no       no matching grant
```

**Actual output (exit 1 — expected because delete denied):**
```
PERMISSION    GRANTED  REASON
agent.read    yes      tenant-binding:murmur-all-members-tenant-member
agent.list    yes      tenant-binding:murmur-all-members-tenant-member
agent.delete  no       denied: no matching grant
```

**Drift:**
- REASON format for granted permissions changed from `granted by role "developer"` to the raw tenant-binding name (`tenant-binding:murmur-all-members-tenant-member`).
- REASON format for denied permissions changed from `no matching grant` to `denied: no matching grant`.
- Column alignment changed (minor).

The semantics are the same, but the REASON string format has changed materially.

---

## UNRUNNABLE — Example Resources / Permissions Not Available

The following commands fail because they reference example resource names that do not exist in this environment, or because the calling context (agent VM) does not hold the required admin permissions. These are **documentation gaps**, not product bugs — but the docs would benefit from a callout noting required permissions or marking examples as illustrative.

### Commands failing with `NotFound` (example placeholder names)

| Command | Doc URL | Error |
|---|---|---|
| `murmur get alias dashboard` | /catalog/alias | alias "dashboard" not found |
| `murmur get environment large` | /catalog/environment | environment "large" not found |
| `murmur get image debian12-base` | /catalog/image | image "debian12-base" not found |
| `murmur get placement my-gcp` | /catalog/placement | placement "my-gcp" not found |
| `murmur get recipe python-toolchain` | /catalog/recipe | recipe "python-toolchain" not found |
| `murmur get workspace default` | /catalog/workspace, /cli/get | workspace "default" not found |
| `murmur status fix-auth` | /cli/status, /cli/kill, /cli/sleep | agent "…/fix-auth" not found |
| `murmur status director --children` | /cli/status | agent "…/director" not found |
| `murmur status merge-queue --service` | /cli/status | agent "…/merge-queue" not found |
| `murmur subscriptions ls fix-auth` | /cli/subscriptions-ls | agent "…/fix-auth" not found |
| `murmur subscriptions ls idle-agent` | /cli/subscriptions-ls | agent "…/idle-agent" not found |
| `murmur subscriptions ls director` | /cli/subscriptions-ls | agent "…/director" not found |

### Commands failing with `PermissionDenied` (require admin/operator role)

The docs show these commands as generally runnable, but they require permissions not granted to a standard developer VM. The docs should note the required permission or role.

| Command | Permission required | Doc URL |
|---|---|---|
| `murmur get disk-type` | `disk-type.list` | /catalog/disk-type |
| `murmur get disk-type murmur-pd-balanced` | `disk-type.read` | /catalog/disk-type |
| `murmur get group` | `group.list` | /catalog/group |
| `murmur get machine-type` | `machine-type.list` | /catalog/machine-type |
| `murmur get machine-type murmur-n2-standard-32` | `machine-type.read` | /catalog/machine-type |
| `murmur get repo-config` | `repo-config.list` | /catalog/repo-config |
| `murmur get repo-config "https://github.com/acme/backend"` | `repo-config.read` | /catalog/repo-config |
| `murmur get role` | `role.list` | /catalog/role |
| `murmur get role agent-operator` | `role.read` | /catalog/role |
| `murmur secret ls` | `secret.list` | /catalog/secret, /cli/secret-ls |
| `murmur get service-profile` | `service-profile.list` | /catalog/service-profile |
| `murmur get service-profile ci-builder` | `service-profile.read` | /catalog/service-profile |
| `murmur get tenant-binding` | `tenant-binding.list` | /catalog/tenant-binding, /security/permissions |
| `murmur get tenant-binding engineers-workspace-admin` | `tenant-binding.read` | /catalog/tenant-binding |
| `murmur get user-secret` | `user-secret.list` | /catalog/user-secret |

---

## Performance Flag — `murmur get agent`

**URL:** https://docs.murmur.dev/catalog/agent

**Command:**
```
murmur get agent
```

**Result:** Exits 0, lists all agents. But takes **~22 seconds** (measured: `22.665s real`), returning ~417 lines of agent IDs. The docs show it as a quick listing command with no latency disclaimer. On the first run with a 30 s timeout it appeared to hang; a 60 s timeout succeeded. If agent count grows, this will likely regress further.

---

## WORKS — Commands Confirmed Functional

The following 32 commands ran successfully (exit 0, sensible output):

| Command | Doc URL |
|---|---|
| `murmur version` | /cli/version, /cli/overview |
| `murmur ls` | /cli/ls |
| `murmur ls -a` | /cli/ls |
| `murmur ls -A` | /cli/ls |
| `murmur ls -q` | /cli/ls |
| `murmur ls -json` | /cli/ls |
| `murmur status` (no args — prints own status) | /cli/status |
| `murmur describe` | /cli/describe |
| `murmur describe environment` | /cli/describe |
| `murmur get agent-persona` | /cli/get |
| `murmur ls agent-persona` | /catalog/agent-persona |
| `murmur get alias` | /catalog/alias |
| `murmur get environment` | /catalog/environment, /cli/get |
| `murmur get flight` | /catalog/flight |
| `murmur get image` | /catalog/image |
| `murmur get placement` | /catalog/placement |
| `murmur get pool-config default` | /catalog/pool-config |
| `murmur get recipe` | /catalog/recipe |
| `murmur get workspace` | /catalog/workspace |
| `murmur get agent` | /catalog/agent (slow — ~22s; see Performance Flag above) |
| `murmur bakes ls` | /cli/bakes-ls |
| `murmur bakes ls --all=false` | /cli/bakes-ls |
| `murmur bakes ls --placement us-central1` | /cli/bakes-ls |
| `murmur bakes ls --environment staging` | /cli/bakes-ls |
| `murmur bakes ls --full-hash` | /cli/bakes-ls |
| `murmur bakes ls --page-size 10` | /cli/bakes-ls |
| `murmur check-permissions agent.read agent.list agent.delete` | /cli/check-permissions (exit 1 expected; DRIFTED output) |
| `murmur subscriptions ls` | /cli/subscriptions-ls |
| `murmur url agent` | /cli/url-agent |
| `murmur url agent fix-auth` | /cli/url-agent (constructs URL without verifying slug exists — expected) |
| `murmur url port 3000` | /cli/url-port |
| `murmur url port 3000 8080` | /cli/url-port |

---

## UNRUNNABLE — Non-Bash Blocks Requiring External Setup

| Language | Count | Reason |
|---|---|---|
| shellscript — `brew` install | 3 | macOS-only; not available on Linux VM |
| shellscript — `murmur setup` | 3 | Interactive wizard |
| shellscript — `git commit` / `git push` | 6 | Requires a git working tree with pending changes |
| shellscript — `murmur spawn` | ~20 | Spawns agents (side effects) |
| shellscript — `murmur set`/`rm`/`patch` | ~40 | Modifies catalog state |
| shellscript — `murmur director` | 3 | Interactive session |
| shellscript — `murmur port-forward` / `murmur ssh` | 4 | Requires running task VM |
| shellscript — `murmur session *` | 8 | Requires live agent session |
| shellscript — `murmur pool up/flush` | 4 | Admin pool management |
| shellscript — `murmur report-*` | 3 | CI reporting (runs in CI context) |
| shellscript — `murmur bake` | 2 | Requires image configuration |
| hcl | 2 | Terraform modules; require `terraform` binary + cloud credentials |
| text | 175 | Output samples, not commands |

---

## SKIPPED-RISKY — Not Run

No commands matched the destructive-operation patterns (force-push, mass-delete). All skippable operations were classified as UNRUNNABLE instead.

---

## Recommended Fixes

| Priority | Issue | Fix |
|---|---|---|
| P0 | `check-permissions --resource` flag order broken | Swap example to `murmur check-permissions --resource agent/my-task agent.edit` |
| P0 | `bakes ls --page-token` example is invalid | Remove hardcoded token or replace with a note like `<token-from-previous-output>` |
| P1 | `pool status` fails from VM | Add note: "pool commands run on the developer workstation, not inside a VM" |
| P1 | `version` output references `api.murmur.sh:443` | Update example to `api.murmur.dev:9090` |
| P1 | `check-permissions` REASON format drifted | Update example output to match current format |
| P2 | Admin-only `get` commands show no permission requirement | Add `> Requires: admin role` callout on disk-type, group, machine-type, repo-config, role, secret, service-profile, tenant-binding, user-secret pages |
| P2 | `murmur get agent` takes ~22s | Add latency note or investigate server-side pagination default |
