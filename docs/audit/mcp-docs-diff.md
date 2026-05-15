# MCP Docs Diff Audit

**Audit date:** 2026-05-15  
**Server version:** client 80.1, `api.murmur.dev:9090`  
**Source of truth – server:** function definitions advertised by the MCP server in this session  
**Source of truth – docs:** every page under `docs.murmur.dev/mcp-server/` plus the overview

---

## Methodology

1. Enumerated all `mcp__murmur__*` tools advertised by the running MCP server (tool names + full JSON-schema parameter definitions as injected into the Claude Code system prompt).
2. Fetched every docs page at `docs.murmur.dev/mcp-server/` (overview + 15 per-tool pages) and extracted parameter tables, required/optional status, type annotations, and example payloads.
3. Performed a field-by-field comparison.
4. No test agents were spawned. No prod identifiers are included in this document.

---

## Summary Table

| # | Tool | Category | Severity | Finding |
|---|------|----------|----------|---------|
| 1 | `spawn` | Drifted | MISLEADING | `slug` marked Required in docs; server schema has no formal `required` entry — it is auto-derived when `flight` is set |
| 2 | `spawn` | Drifted | MISLEADING | `workspace` marked Required in docs; server schema marks it optional (docs say "Required for new spawns") |
| 3 | `spawn` | Drifted | MISLEADING | `description` marked Required in docs; server schema marks it optional (conditionally required at runtime) |
| 4 | `spawn` | Drifted | MISLEADING | Docs document a `base_branch` field for `repos[]` objects; server description omits it |
| 5 | `spawn` | Drifted | COSMETIC | Boolean defaults (`force_new`, `resurrect`) stored as string `"false"` in server schema; docs show correct boolean `false` |
| 6 | `port_url` | Drifted | COSMETIC | Server schema types `port` as `number`; docs say `integer` and add a (1–65535) range constraint |
| 7 | `task_update` | Drifted | MISLEADING | Server description for `status` gives no valid values; docs enumerate `pending`, `in_progress`, `completed`, `deleted` |
| 8 | `version` | Drifted | COSMETIC | No dedicated docs page; overview says only "Print the client version" — omits `api_host` return field and environment-check purpose |
| — | `interrupt` | Previously Phantom | RESOLVED | Prior audits flagged `interrupt` as documented-but-missing; it is now present in both server and docs |

**Undocumented (server has, docs lack):** None  
**Phantom (docs have, server lacks):** None

---

## Finding 1 — `spawn`: `slug` required-field mismatch

**Severity: MISLEADING**

### Server schema
```
slug:
  type: string
  description: "Agent task slug (e.g. \"fix-auth-bug\"). When flight is set, defaults
                to \"flight-<name>\"."
  # NOT present in the JSON Schema `required` array
```

### Docs (`/mcp-server/spawn.md`)
> | `slug` | string | **Required** | "Agent task slug (e.g. `fix-auth-bug`)" |

### Analysis
The server description itself says `slug` *defaults* to `"flight-<name>"` when `flight` is provided, meaning it is conditionally optional. It is absent from the schema's `required` array. Docs unconditionally label it Required, which is incorrect for flight-based invocations and may cause users to believe a missing `slug` will produce a schema validation error rather than the runtime derivation that actually occurs.

---

## Finding 2 — `spawn`: `workspace` required-field mismatch

**Severity: MISLEADING**

### Server schema
```
workspace:
  type: string
  description: "Workspace name. Required for new spawns (not follow-ups). The server
                resolves repos and environment from the workspace definition."
  # NOT present in the JSON Schema `required` array
```

### Docs (`/mcp-server/spawn.md`)
> | `workspace` | string | **Required (new spawns)** | "Workspace name. Required for new spawns…" |

### Analysis
The distinction "new spawns vs. follow-ups" is present in the server description but absent from the JSON schema's `required` array. Docs display "Required (new spawns)" which is accurate prose, but the table heading says "Status" and the value is "Required", leading readers to believe the field is schema-enforced. Runtime enforcement is server-side, not schema-side.

---

## Finding 3 — `spawn`: `description` required-field mismatch

**Severity: MISLEADING**

### Server schema
```
description:
  type: string
  description: "Task description or follow-up message. Required for autonomous mode
                unless flight is set."
  # NOT present in the JSON Schema `required` array
```

### Docs (`/mcp-server/spawn.md`)
> | `description` | string | **Required (autonomous)** | "Task description or follow-up message. Required for autonomous mode unless `flight` is set" |

### Analysis
Same pattern as Findings 1 and 2. The field is runtime-required under certain modes but is not in the JSON schema `required` array. Agents and tooling that validate schemas before calling will not catch a missing `description` before the server rejects the call.

---

## Finding 4 — `spawn.repos[]`: undocumented `base_branch` field in server; documented in docs

**Severity: MISLEADING**

### Server schema description
```
repos:
  type: array
  description: "Repos to clone with optional branch overrides. Each entry must have
                clone_url. Entries matching workspace repos override branch config;
                new entries are additional repos."
  # No items schema defined; only clone_url and branch mentioned
```

### Docs (`/mcp-server/spawn.md`) — Repo Object Fields table
> | `clone_url` | string | **Required** | "Canonical clone URL" |  
> | `base_branch` | string | Optional | "Base branch for branching; resolved from tenant config if omitted" |  
> | `branch` | string | Optional | "Working branch for this repo; overrides top-level branch" |

### Analysis
The docs expose a `base_branch` field for repo objects that the server schema description does not mention. A user reading only the server description would never know `base_branch` exists. Conversely, a user reading only the server description and assuming the field list is exhaustive would omit `base_branch` even when needed.

---

## Finding 5 — `spawn`: Boolean defaults stored as strings in server schema

**Severity: COSMETIC**

### Server schema (observed)
```json
"force_new":  { "type": "boolean", "default": "false" }
"resurrect":  { "type": "boolean", "default": "false" }
```

### Docs (`/mcp-server/spawn.md`)
> | `force_new` | boolean | Optional | "Start fresh despite prior sessions **(default: false)**" |  
> | `resurrect` | boolean | Optional | "Resume completed/killed agent **(default: false)**" |

### Contrast with `status.children`
```json
"children": { "type": "boolean", "default": false }   // boolean, not string
```

### Analysis
`force_new` and `resurrect` use the string `"false"` as their default despite being declared `type: boolean`. Other boolean params in the same server (e.g. `status.children`) use the correct JSON boolean `false`. The docs correctly show boolean `false`. This inconsistency exists within the server schema itself; the docs are accurate but the server schema contains a type anomaly.

---

## Finding 6 — `port_url.port`: `number` vs `integer`, missing range

**Severity: COSMETIC**

### Server schema
```json
"port": {
  "type": "number",
  "description": "TCP port number (e.g. 3000)."
}
```

### Docs (`/mcp-server/port-url.md`)
> | `port` | **integer** | Required | "TCP port number **(1-65535)**. The port must be listening on the VM." |

### Analysis
The server schema uses the JSON Schema type `"number"` (which accepts fractional values such as `3000.5`), while the docs correctly describe the field as an integer with the valid range 1–65535. The server likely enforces integer semantics at runtime, so this is unlikely to cause failures, but the schema is technically incorrect. The missing range constraint also means schema-based validators will not reject out-of-range port numbers before the call is made.

---

## Finding 7 — `task_update.status`: valid values missing from server description

**Severity: MISLEADING**

### Server schema
```json
"status": {
  "type": "string",
  "description": "New task status."
}
```

### Docs (`/mcp-server/task-update.md`)
> Accepts `pending`, `in_progress`, `completed`, or `deleted` values

### Example from docs
```json
{ "task_id": "t_abc123", "status": "completed" }
{ "task_id": "t_abc123", "status": "deleted" }
```

### Analysis
The server schema description "New task status." gives no guidance on valid values. A caller relying solely on the server schema has no way to know the accepted enum values without consulting the docs or trying random strings. The `deleted` value is especially non-obvious. An `enum` constraint in the schema would make this self-documenting; alternatively, the description should list the valid values as the docs do.

---

## Finding 8 — `version`: no dedicated docs page; return-value description incomplete

**Severity: COSMETIC**

### Server schema description
```
"Print the client version and API host. Use this to verify which environment
 (prod vs. nonprod) the session is connected to."
```

### Actual response (verified this session)
```json
{
  "client_version": "80.1",
  "client_commit": "e1865153",
  "api_host": "api.murmur.dev:9090"
}
```

### Docs coverage
- **Overview** (`/mcp-server/overview.md`): `version — "Print the client version"` (one-liner, no dedicated page)
- **No** `/mcp-server/version.md` page exists (the `llms.txt` index does not list one)

### Analysis
The docs overview truncates the purpose to "Print the client version", omitting that:
1. The tool also returns `api_host` — useful for distinguishing prod vs. nonprod environments.
2. The tool returns `client_commit` — useful for bug reports.
3. The intended use-case is environment verification, not just version lookup.

This is the only tool among the 16 without a dedicated docs page.

---

## Previously Reported Finding — `interrupt`: RESOLVED

Prior audits flagged `interrupt` as a *Phantom* tool (documented but not advertised by the server). As of this audit (2026-05-15, server version 80.1):

- `mcp__murmur__interrupt` **is** present in the server's advertised schema.
- `/mcp-server/interrupt.md` **exists** and accurately describes the tool's two parameters (`slug` [required], `workspace` [optional]) and example payloads.

**Status: No longer a finding.** The tool was added to the server and the discrepancy is resolved.

---

## Appendix: Full Server Tool Inventory

Verified from MCP server function definitions injected into this session:

| Tool name | Required params | Optional params |
|-----------|----------------|-----------------|
| `spawn` | *(none in schema `required` array)* | agent, append_system_prompt, backend, branch, completion_check, dequeue_strategy, description, each, flight, flight_inputs, force_new, fork_from, model, on_idle, out, purpose, reasoning_effort, reasoning_summary, repos, resurrect, service_tier, session_mode, slug, tasks, verbosity, workspace |
| `status` | slug | children, timeline, workspace |
| `ls` | *(none)* | all, developer, workspace |
| `kill` | slug | workspace |
| `interrupt` | slug | workspace |
| `wait` | slug | phase, workspace |
| `queue_add` | slug, description | agent, tasks, workspace |
| `clear_queue` | *(none)* | slug, workspace |
| `task_create` | subject | activate_when, description, pattern, slug, workspace |
| `task_get` | task_id | slug, workspace |
| `task_list` | *(none)* | slug, workspace |
| `task_update` | task_id | add_blocked_by, add_blocks, description, slug, status, subject, workspace |
| `upload` | filename, path | content_type, workspace |
| `port_url` | port | *(none)* |
| `agent_url` | *(none)* | slug, workspace |
| `version` | *(none)* | *(none)* |
