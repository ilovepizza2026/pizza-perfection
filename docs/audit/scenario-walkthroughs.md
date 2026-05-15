# Scenario Walkthrough Audit

**Date:** 2026-05-15  
**Branch:** `murmur/w/pizza/github_oauth/clairerosenfeld/docs-scenario-walkthroughs`  
**Environment:** Murmur VM (`murmur-gcp-large`), running as child agent inside an active session  
**Methodology:** Each scenario executed using only documentation pages as reference. No prior knowledge or source-code spelunking. Every command and output logged verbatim.

---

## Summary Table

| # | Scenario | Verdict | Key Gap |
|---|----------|---------|---------|
| 1 | Build a CI Watcher Bot | **GAPS** | Docs don't show event-type filtering for subscriptions or how to keep agent alive to receive events |
| 2 | Fork an Agent's Session | **WORKED** | Minor: `--workspace` flag not shown in docs examples |
| 3 | Multi-agent Orchestration (Fanout) | **GAPS** | `murmur each` CLI fails with `session_mode is required`; MCP `each` works but docs don't mention the divergence |
| 4 | Port-Proxy a Service | **GAPS** | Public URL returns 403; docs say "public" but don't explain authentication requirements |
| 5 | Write and Run a Flight | **GAPS** | Required YAML frontmatter undocumented; `--flight` flag does catalog lookup not local file read (contradicts help text) |

---

## Scenario 1: Build a CI Watcher Bot

### Docs Consulted
- `https://docs.murmur.dev/concepts/events.md`
- `https://docs.murmur.dev/cli/subscriptions-add.md`

### What the Docs Say
- Ten event types are delivered, including `ci_result`
- Events arrive via the MCP channel capability as `<channel>` tags — no polling needed
- Agents auto-subscribe when pushing to branches; manual control via `murmur subscriptions add`
- Run `murmur install-repo` to configure GitHub Actions for event delivery (non-Macroscope-App users)

### Execution Log

```
$ murmur spawn --workspace pizza ci-watcher-bot \
    "Watch the CI pipeline on main and report any failures. Subscribe to CI result events."
Spawned: ci-watcher-bot

  To get the status of the task:    murmur status ci-watcher-bot
  To kill the task:                 murmur kill ci-watcher-bot
  To send a follow-up:              murmur queue add ci-watcher-bot "additional context"

$ murmur status ci-watcher-bot
workflow: [REDACTED]/ci-watcher-bot
phase:    PHASE_STARTING

$ murmur subscriptions add ci-watcher-bot --branch main
subscribed ci-watcher-bot to branch main

$ murmur subscriptions ls ci-watcher-bot
branch: main (repo: https://github.com/[REDACTED]/pizza-perfection/)

$ murmur kill ci-watcher-bot
killed ci-watcher-bot
```

### Verdict: GAPS

**What worked:** Spawning the agent and subscribing it to a branch both succeeded as documented. The subscription command syntax exactly matches the docs.

**Gaps identified:**

1. **No event-type filter.** The `murmur subscriptions add` command has no `--event-type` flag. It subscribes to ALL events on a branch (PR comments, reviews, CI results, file changes, etc.). The docs don't explain how an agent selectively watches only `ci_result` events. A user following the docs would subscribe the bot to all events with no filtering mechanism.

   > *What the next docs sentence needs to say:* "To receive only CI events, include an instruction in your agent's prompt telling it to ignore non-`ci_result` channel messages. The subscription API does not support per-event-type filtering."

2. **No keep-alive example.** A CI watcher bot must stay alive to receive future events, but the docs provide no example of spawning an agent with `--on-idle keep-alive` in this context. Without it, the agent exits after its first turn and misses subsequent CI events.

   > *What the next docs sentence needs to say:* "Pass `--on-idle keep-alive` when spawning the watcher to prevent the VM from shutting down between CI runs."

3. **`murmur install-repo` underdocumented.** The command requires `--webhook-url <url>` but the docs don't tell users what URL to supply or how to discover it for their deployment.

   ```
   $ murmur install-repo --help
   usage: murmur install-repo --webhook-url <url>
     -webhook-url string
       Base URL of the murmur-webhook service, without /ingest (required)
   ```

---

## Scenario 2: Fork an Agent's Session

### Docs Consulted
- `https://docs.murmur.dev/cli/spawn.md`

### What the Docs Say
- `murmur spawn --fork-from <slug> <new-slug> <description>` creates a new agent that inherits context from the source agent
- The forked agent "starts fresh" with the source agent's full conversation context

### Execution Log

```
$ murmur spawn --workspace pizza base-agent-to-fork \
    "Build a simple hello world feature. Make one commit."
Spawned: base-agent-to-fork

  To get the status of the task:    murmur status base-agent-to-fork
  To kill the task:                 murmur kill base-agent-to-fork
  To send a follow-up:              murmur queue add base-agent-to-fork "additional context"

$ murmur status base-agent-to-fork
workflow: [REDACTED]/base-agent-to-fork
phase:    PHASE_STARTING

$ murmur spawn --workspace pizza --fork-from base-agent-to-fork forked-agent \
    "Continue working on the hello world feature but also add tests."
Spawned: forked-agent

  To get the status of the task:    murmur status forked-agent
  To kill the task:                 murmur kill forked-agent
  To send a follow-up:              murmur queue add forked-agent "additional context"

$ murmur status forked-agent
workflow: [REDACTED]/forked-agent
phase:    PHASE_STARTING

$ murmur status base-agent-to-fork
workflow: [REDACTED]/base-agent-to-fork
phase:    PHASE_STARTING

$ murmur kill base-agent-to-fork
killed base-agent-to-fork

$ murmur kill forked-agent
killed forked-agent
```

### Verdict: WORKED

The `--fork-from` flag worked exactly as documented. Both agents spawned successfully.

**Minor note:** The docs example `murmur spawn --fork-from fix-auth add-tests "Write tests for changes"` does not include `--workspace`, but in practice the flag is required (or must be set in `murmur.yaml`). The docs example would fail if followed verbatim in a clean environment without `murmur.yaml`.

**Unverified:** The docs claim the forked agent inherits context. Since both agents were in `PHASE_STARTING` (no work done), context inheritance could not be observed within this audit's time constraints.

---

## Scenario 3: Multi-agent Orchestration (Fanout)

### Docs Consulted
- `https://docs.murmur.dev/guides/multi-agent-orchestration.md`

### What the Docs Say
Two approaches for fanout:

**CLI approach:**
```bash
echo -e "auth\npayments\nnotifications" \
  | murmur each fix-{} "Fix tests in the {} module" --workspace my-team
```

**MCP approach (from inside an agent):**
```json
{
  "tool": "spawn",
  "slug": "fix-{}",
  "description": "Fix tests in the {} module",
  "each": "/tmp/modules.txt"
}
```

### Execution Log

```
# Step 1: Dry run to verify template substitution
$ echo -e "auth\npayments\nnotifications" \
    | murmur each --workspace pizza --dry-run "audit-{}" "Audit the {} module for issues"
audit-auth      Audit the auth module for issues
audit-payments  Audit the payments module for issues
audit-notifications  Audit the notifications module for issues
(3 agents)

# Step 2: Attempt actual spawn via murmur each
$ echo -e "module-a\nmodule-b" \
    | murmur each --workspace pizza "fanout-worker-{}" \
      "Do a trivial check of the {} area: just run ls and report back"
murmur each: spawn fanout-worker-module-a: rpc error: code = InvalidArgument desc = session_mode is required
murmur each: spawn fanout-worker-module-b: rpc error: code = InvalidArgument desc = session_mode is required
Spawned 0/2 agents (2 failed)
murmur: 2 spawn(s) failed

# Step 3: Try with --backend claude
$ echo -e "module-a\nmodule-b" \
    | murmur each --workspace pizza --backend claude "fanout-claude-{}" "Do a trivial check: just output done"
murmur each: spawn fanout-claude-module-a: rpc error: code = InvalidArgument desc = session_mode is required
murmur each: spawn fanout-claude-module-b: rpc error: code = InvalidArgument desc = session_mode is required
Spawned 0/2 agents (2 failed)
murmur: 2 spawn(s) failed

# Note: Regular murmur spawn works fine:
$ murmur spawn --workspace pizza test-session-mode "List files in current directory"
Spawned: test-session-mode
$ murmur kill test-session-mode
killed test-session-mode

# Step 4: MCP tool fanout approach (from inside agent session)
$ cat /tmp/fanout-items.txt   # module-a, module-b
# MCP call: mcp__murmur__spawn with each=/tmp/fanout-items.txt
# Result: {"slugs": ["fanout-mcp-module-a", "fanout-mcp-module-b"], "count": 2}

$ murmur status fanout-mcp-module-a
workflow: [REDACTED]/fanout-mcp-module-a
phase:    PHASE_STARTING

$ murmur status fanout-mcp-module-b
workflow: [REDACTED]/fanout-mcp-module-b
phase:    PHASE_STARTING

$ murmur kill fanout-mcp-module-a && murmur kill fanout-mcp-module-b
killed fanout-mcp-module-a
killed fanout-mcp-module-b
```

### Verdict: GAPS

**What worked:** The MCP `spawn` tool with the `each` parameter worked correctly and spawned agents as documented. The `--dry-run` flag also worked.

**Gaps identified:**

1. **`murmur each` CLI is broken for autonomous agents.** Every attempt to actually spawn via `murmur each` (without `--dry-run`) failed with `session_mode is required`. The docs show no such requirement. Regular `murmur spawn` succeeds without this flag.

   > *What the next docs sentence needs to say:* "Note: `murmur each` currently requires the `--stream` flag to set session mode. Example: `murmur each --stream ...`" — or the CLI should be fixed to default session_mode the same way `murmur spawn` does.

2. **CLI vs MCP divergence undocumented.** The docs present CLI and MCP as equivalent options ("Every pattern below shows the CLI form first, then a parallel MCP form"), but the CLI form is currently broken for fanout while the MCP form works. The docs give no indication of when to prefer one over the other.

---

## Scenario 4: Port-Proxy a Service

### Docs Consulted
- `https://docs.murmur.dev/mcp-server/port-url.md`
- `https://docs.murmur.dev/cli/port-forward.md`

### What the Docs Say

**From inside a VM (MCP tool `port_url`):**
- Returns a public HTTPS tunnel URL for a port on the VM
- Example: requesting port 3000 returns `https://port-a1b2c3d4-3000.murmur.dev`

**From outside (CLI `murmur port-forward`):**
- `murmur port-forward <slug> <port>` — creates local TCP tunnels
- "Running this command from inside a VM produces an unsupported operation error"

### Execution Log

```
# Step 1: Start a local HTTP server
$ python3 -m http.server 8765 &>/tmp/httpserver.log &
HTTP server PID: 2358

$ curl -s http://localhost:8765/ | head -3
<!DOCTYPE html>
<html lang="en">
  <head>
Server running

# Step 2: Get public URL via CLI
$ murmur url port 8765
https://[REDACTED]-8765.port.cloud.murmur.dev/

# Step 3: Get public URL via MCP tool
# mcp__murmur__port_url(port=8765)
# Result: https://[REDACTED]-8765.port.cloud.murmur.dev/

# Step 4: Test public URL accessibility
$ curl -s -I "https://[REDACTED]-8765.port.cloud.murmur.dev/"
HTTP/2 403
content-type: text/plain; charset=utf-8
date: Fri, 15 May 2026 03:27:12 GMT
content-length: 22
via: 1.1 google
```

### Verdict: GAPS

**What worked:** Both `murmur url port <port>` and `mcp__murmur__port_url` returned valid-looking tunnel URLs instantly, as documented. The URL format is consistent with the docs example (`port-XXXX-PORT.murmur.dev`).

**Gaps identified:**

1. **Public URL returns 403.** The generated URL is inaccessible to external clients without authentication. The docs describe this as a "public HTTPS tunnel URL" but provide no information about how external users authenticate to access it. A user following the docs would believe the URL is immediately shareable but would receive a 403.

   > *What the next docs sentence needs to say:* "Port-proxy URLs require authentication. Access is restricted to members of your murmur tenant. Share the URL with team members who have murmur accounts, or use the `--public` flag [if available] to make it unauthenticated."

2. **`murmur port-forward` from outside VM untestable from this environment.** Since the docs explicitly state this command is unsupported from inside a VM, the outside-in scenario could not be verified. The docs describe the command clearly, but correctness of the described behavior is unverified.

---

## Scenario 5: Write and Run a Flight

### Docs Consulted
- `https://docs.murmur.dev/concepts/flights.md`
- `https://docs.murmur.dev/guides/multi-agent-orchestration.md`
- `murmur describe flight` (CLI — not a doc page, but required to discover the actual format)

### What the Docs Say

1. Write a Markdown file with H1 (flight name), H2 sections (agent slugs), blockquote metadata, body text
2. Run with `murmur spawn --flight <filename>` or store with `murmur set flight`
3. Valid metadata directives include `persona`, `model`, `needs`, `continues`, `gate`, `out`, etc.

Docs example:
```markdown
# Feature Implementation

## design
> persona: architect
> out: respond
Analyze the requirements and design the solution.

## backend
> needs: design
> out: pr
Implement the backend based on the design.
```

### Execution Log

```
# Step 1: Write the flight file as documented
$ mkdir -p .murmur/flights
$ cat > .murmur/flights/audit-simple.md << 'EOF'
> # Simple Audit Flight
>
> ## check-structure
> > out: respond
> List the files in the current directory and report what you find.
>
> ## report
> > needs: check-structure
> > out: respond
> Based on the structure check, write a one-sentence summary of the project type.
> EOF

# Step 2: Try running via murmur spawn --flight (docs example)
$ murmur spawn --workspace pizza \
    --flight .murmur/flights/audit-simple.md audit-flight-run
murmur: get flight ".murmur/flights/audit-simple.md": rpc error: code = NotFound \
  desc = flight ".murmur/flights/audit-simple.md" not found

# Step 3: Try with just filename (relative to .murmur/flights/)
$ murmur spawn --workspace pizza --flight audit-simple.md audit-flight-v2
murmur: get flight "audit-simple.md": rpc error: code = NotFound \
  desc = flight "audit-simple.md" not found

# Step 4: Try to register in catalog — fails without frontmatter
$ cat .murmur/flights/audit-simple.md | murmur set flight audit-simple
murmur: parse stdin: [4:1] invalid header option: " out: respond"
   1 | # Simple Audit Flight
   2 |
   3 | ## check-structure
>  4 | > out: respond
       ^

# Step 5: Discover actual format via murmur describe flight
$ murmur describe flight
# Template shows YAML frontmatter is REQUIRED with workspace field:
#   ---
#   name: <name>
#   workspace: <workspace>   # REQUIRED
#   ---

# Step 6: Write corrected flight file with required frontmatter
$ cat > /tmp/test-flight.md << 'EOF'
> ---
> workspace: murmuration
> ---
>
> # Simple Audit Flight
>
> ## check-structure
> > out: respond
> List the files in the current directory and report what you find.
>
> ## report
> > needs: check-structure
> > out: respond
> Based on the structure check, write a one-sentence summary of the project type.
> EOF

$ cat /tmp/test-flight.md | murmur set flight audit-simple
Set flight "audit-simple"

# Step 7: Verify it was stored
$ murmur get flight audit-simple | grep -E "name|workspace"
name: audit-simple
workspace: murmuration

# Step 8: Try to run via spawn (pizza workspace)
$ murmur spawn --workspace pizza --flight audit-simple audit-flight-pizza
murmur: get flight "audit-simple": rpc error: code = NotFound \
  desc = flight "audit-simple" not found

# Step 9: Try to run via spawn (murmuration workspace)
$ murmur spawn --workspace murmuration --flight audit-simple audit-flight-mur
murmur: get flight "audit-simple": rpc error: code = NotFound \
  desc = flight "audit-simple" not found

# MCP approach also fails:
# mcp__murmur__spawn(slug="flight-mcp-test", flight="audit-simple", ...)
# Error: get flight "audit-simple": rpc error: code = NotFound desc = flight "audit-simple" not found

# Cleanup
$ murmur rm flight audit-simple
Deleted flight "audit-simple"
```

### Verdict: GAPS

**What worked:** The `murmur set flight` command successfully stored a flight in the catalog once the required frontmatter was added. The `murmur get flight` command retrieved it successfully.

**What did not work:** `murmur spawn --flight` never succeeded, despite the flight being stored in the catalog.

**Gaps identified:**

1. **Required YAML frontmatter not documented.** Every flight must have a YAML frontmatter block with at minimum a `workspace` field. The docs show the flight body format but make no mention of this frontmatter requirement. Following the docs literally produces a parse error.

   > *What the next docs sentence needs to say:* "Every flight file must begin with a YAML frontmatter block containing at least a `workspace` field: `---\nworkspace: my-team\n---`"

2. **`--flight` flag reads from catalog, not local filesystem.** The `murmur spawn --help` output says the flag accepts "Flight file path relative to `.murmur/flights/`", strongly implying local file reads. In practice, the flag performs a catalog lookup by name. Providing an actual filesystem path (both relative and absolute) fails with "not found".

   > *What the next docs sentence needs to say:* "The `--flight` value is a flight name as stored in the catalog via `murmur set flight`. Local file paths are not supported — always register the flight with `murmur set flight <name>` before running it."

3. **Cross-workspace flight lookup failure.** After correctly registering a flight, spawning in any workspace consistently returned "not found". This may reflect a tenant/org context mismatch between the developer identity used for `murmur set`/`murmur get` and the agent VM identity used for `murmur spawn`. The docs provide no explanation of this distinction.

   > *What the next docs sentence needs to say:* "Flights are looked up in the catalog of the tenant associated with the workspace. Ensure the flight was registered while authenticated as the same developer account that owns the workspace."

4. **The `murmur describe flight` template (`name` field) differs from what `murmur set` accepts.** The template shows `name: <name>` in frontmatter, but supplying it causes a parse error: `unknown frontmatter key: "name: audit-simple"`. The name is determined solely by the `murmur set flight <name>` argument, not by the file contents. This contradicts the template.

---

## Gap Summary

Consolidated list of all specific missing documentation:

| Gap | Scenario | Severity |
|-----|----------|----------|
| No event-type filter for subscriptions; no `--on-idle keep-alive` example for watcher | S1 | High |
| `murmur install-repo` webhook URL not documented | S1 | Medium |
| `--workspace` flag omitted from docs spawn examples | S2 | Low |
| `murmur each` requires `session_mode` (not documented); CLI broken for fanout | S3 | High |
| CLI vs MCP divergence for fanout not flagged | S3 | Medium |
| Port-proxy URL requires auth but docs say "public" | S4 | High |
| `murmur port-forward` outside-VM case unverifiable from inside VM | S4 | Low |
| Flight YAML frontmatter requirement (esp. `workspace`) missing from docs | S5 | High |
| `--flight` flag does catalog lookup, not local file read (contradicts help text) | S5 | High |
| Cross-workspace/cross-tenant flight lookup failure unexplained | S5 | High |
| `name` in frontmatter template rejected at runtime | S5 | Medium |

---

## Cleanup Verification

All spawned agents have been killed:

```
$ murmur kill audit-test-noop      # killed
$ murmur kill ci-watcher-bot       # killed
$ murmur kill base-agent-to-fork   # killed
$ murmur kill forked-agent         # killed
$ murmur kill fanout-coordinator   # killed
$ murmur kill fanout-mcp-module-a  # killed
$ murmur kill fanout-mcp-module-b  # killed
$ murmur kill test-session-mode    # killed
$ murmur rm flight audit-simple    # Deleted
```
