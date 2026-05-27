# docs.murmur.dev Link Sweep — Audit Report

**Audit date:** 2026-05-15  
**Auditor:** automated docs-link-sweep agent  
**murmur CLI version checked against:** 80.1 (e1865153), API api.murmur.dev:9090  
**Methodology:** crawled every page in `llms.txt` (≈110 pages), checked every link for HTTP status, scanned page text for version numbers and command names, cross-checked commands and flags against `murmur --help` output.

---

## Summary

| Category | Count |
|---|---|
| BROKEN-LINK (external 4xx) | 3 |
| BROKEN-LINK (internal 4xx) | 0 |
| STALE-SCREENSHOT | 0 |
| VERSION-DRIFT | 7 |
| DATED-LANGUAGE | 0 |
| **Total findings** | **10** |

No screenshots were found on any docs page (the site is fully text-based), so no stale-screenshot findings apply.  
All ~110 internal links return HTTP 200.

---

## BROKEN-LINK Findings

### BL-1 — Terraform module links (double-slash, repo 404)

| Field | Value |
|---|---|
| **Page** | `/guides/customer-placements` |
| **URLs** | `https://github.com/prassoai/murmuration//terraform/gcp/modules/wif-customer` |
| | `https://github.com/prassoai/murmuration//terraform/aws/modules/wif-customer` |
| **HTTP status** | 404 |
| **Root cause** | The `prassoai/murmuration` GitHub repository does not exist (the org/repo itself returns 404), and both URLs also contain a double-slash (`//`) typo in the path. |
| **Suggested fix** | If the Terraform modules are intended to be public, create the repository (or update the links to the correct repo). If internal, replace the links with documentation explaining how customers obtain the modules, or remove them. |

### BL-2 — Fictional example repo link returns 404

| Field | Value |
|---|---|
| **Page** | `/catalog/flight` |
| **URL** | `https://github.com/acme-corp/api` |
| **HTTP status** | 404 |
| **Root cause** | The URL is used as a fictional example in a YAML snippet (`repos: https://github.com/acme-corp/api`). The `acme-corp` GitHub org does not own a repo named `api`. |
| **Suggested fix** | Replace with a clearly non-resolvable placeholder such as `https://github.com/your-org/your-repo` (which GitHub gracefully redirects) or wrap in a code block comment noting it is an example. Low severity — clearly fictional. |

---

## VERSION-DRIFT Findings

### VD-1 — Version number and API endpoint in CLI docs are stale

| Field | Value |
|---|---|
| **Pages** | `/cli/overview`, `/cli/version` |
| **Documented** | `Client: 0.4 (a1b2c3d4)` / `API: api.murmur.sh:443` |
| **Actual (v80.1)** | `Client: 80.1 (e1865153)` / `API: api.murmur.dev:9090` |
| **Problem** | Both the version number (`0.4` → `80.1`) and the API host (`api.murmur.sh:443` → `api.murmur.dev:9090`) are out of date. Users following the docs to verify their installation will see output that doesn't match. |
| **Suggested fix** | Replace the hardcoded example output with the current values, or switch to placeholder text such as `Client: <version>` to avoid future drift. Also update the domain from `api.murmur.sh` to `api.murmur.dev`. |

### VD-2 — `--reasoning-effort` flag documented but not available in CLI

| Field | Value |
|---|---|
| **Page** | `/concepts/agents` |
| **Documented** | "Pass a Codex model or `--backend codex` on `murmur spawn` to use Codex instead. The `--reasoning-effort` flag controls thinking depth." |
| **Actual** | `murmur spawn -reasoning-effort low` → `flag provided but not defined: -reasoning-effort` |
| **Problem** | The flag is described as available on `murmur spawn` but the CLI (v80.1) does not recognize it. |
| **Suggested fix** | Either add the flag to the CLI (if it was planned but not yet shipped) or remove the reference from `/concepts/agents`. The MCP `spawn` tool does expose `reasoning_effort` as a parameter — if the flag was only ever MCP-only, clarify that distinction. |

### VD-3 — `--service-profile` flag documented but not available in CLI

| Field | Value |
|---|---|
| **Page** | `/concepts/service-profiles` |
| **Documented** | "From the CLI — pass `--service-profile` on `murmur spawn`." |
| **Actual** | `murmur spawn -service-profile test` → `flag provided but not defined: -service-profile` |
| **Problem** | The page tells users to pass `--service-profile` to `murmur spawn`, but the flag does not exist in v80.1. |
| **Suggested fix** | Remove the flag reference and explain the correct mechanism (e.g., attaching service profiles via workspace config or flight frontmatter, both of which are documented on `/security/service-profile`). |

### VD-4 — `murmur install` and `murmur attach` referenced as commands but neither exists

| Field | Value |
|---|---|
| **Pages** | `/configuration/local-overlays`, `/security/encryption` |
| **Documented** | `murmur install` (adds .gitignore patterns; generates encrypted profile) |
| | `murmur attach` (connects to agent VM via SSH) |
| **Actual** | `murmur: unknown command "install"` / `murmur: unknown command "attach"` |
| **Problem** | Two pages reference `murmur install` as a command that sets up .gitignore and encrypts the developer profile. `murmur attach` is described as an SSH connection method. Neither exists. The setup functionality is in `murmur setup`; the attach functionality is the `--attach` flag of `murmur ssh`. |
| **Suggested fix** | In `/configuration/local-overlays`: replace `murmur install` with `murmur setup` in both occurrences; replace `murmur attach` with `murmur ssh --attach <slug>`. In `/security/encryption`: replace `murmur install` with `murmur setup`. |

### VD-5 — Go version in image/recipe examples is stale (1.22.x, current is 1.24.x)

| Field | Value |
|---|---|
| **Pages** | `/guides/custom-images`, `/catalog/recipe`, `/configuration/vm-environment` |
| **Documented** | `https://go.dev/dl/go1.22.4.linux-amd64.tar.gz` (custom-images, catalog/recipe), `https://go.dev/dl/go1.22.0.linux-amd64.tar.gz` (vm-environment) |
| **Actual** | Go 1.22.x reached end-of-life; as of May 2026 the current stable release is 1.24.x. The download URLs still resolve (HTTP 200) but point to outdated releases. |
| **Problem** | New users following the example scripts will install an outdated Go version. |
| **Suggested fix** | Update the example download URLs to Go 1.24.x (or use a version-agnostic installer pattern and note users should pick the latest from `https://go.dev/dl/`). Inconsistency between pages (1.22.4 vs 1.22.0) should also be resolved. |

### VD-6 — Python toolchain versions in recipe examples are stale

| Field | Value |
|---|---|
| **Page** | `/catalog/recipe` |
| **Documented** | Poetry `1.8.3`, Ruff `0.4.8` |
| **Actual** | As of May 2026, Poetry 2.x is the current major release; Ruff 0.9.x+ is current (0.4.x dates from mid-2024). |
| **Problem** | Users copying the example recipe will install significantly outdated Python toolchain versions. |
| **Suggested fix** | Update the pinned versions to current releases, or use `pip install ruff poetry` without explicit version pins in examples (noting that users should pin to a specific version in production). |

### VD-7 — Date-versioned model identifier in VM environment example

| Field | Value |
|---|---|
| **Page** | `/configuration/vm-environment` |
| **Documented** | `claude-sonnet-4-20250514` (used as an example model name in a `settings.json` snippet) |
| **Problem** | This is a date-versioned model string that will become stale as newer Claude snapshots are released. While not breaking today, it may confuse users about which model to use. |
| **Suggested fix** | Replace with the undated alias `claude-sonnet-4` or a note that users should use the latest snapshot and refer to Anthropic's model documentation. |

---

## Notes on Methodology

- **Internal links:** All ~110 internal links across the full site returned HTTP 200. No internal 404s detected.
- **External links checked:**
  - `https://app.macroscope.com` — 200 ✓
  - `https://cloud.murmur.dev` — 200 ✓
  - `https://oidc.murmur.dev` — 200 ✓
  - `https://modelcontextprotocol.io/` — 200 ✓
  - `https://get.docker.com` — 200 ✓
  - `https://get.sdkman.io` — 200 ✓
  - `https://go.dev/dl/go1.22.4.linux-amd64.tar.gz` — 200 ✓ (live but outdated)
  - `https://go.dev/dl/go1.22.0.linux-amd64.tar.gz` — 200 ✓ (live but outdated)
  - `https://github.com/prassoai/murmuration//terraform/gcp/modules/wif-customer` — **404 ✗**
  - `https://github.com/prassoai/murmuration//terraform/aws/modules/wif-customer` — **404 ✗**
  - `https://github.com/prassoai/homebrew-tap` — 200 ✓ (active, not archived)
  - `https://github.com/acme-corp/api` — **404 ✗** (fictional example)
- **Screenshots:** No content images (PNG/JPG/GIF/WebP) found on any page. Site is text-only.
- **CLI cross-check commands verified:** `murmur spawn`, `murmur sleep`, `murmur wake`, `murmur rekey`, `murmur describe`, `murmur session`, `murmur queue`, `murmur install-repo`, `murmur ssh`, `murmur report-commit`, `murmur report-pr`, `murmur report-push`
- **Commands confirmed missing:** `murmur install`, `murmur attach`
- **Flags confirmed missing from `murmur spawn`:** `--reasoning-effort`, `--service-profile`
- **Redaction:** No production identifiers, credentials, or user-specific values were included in this report.
