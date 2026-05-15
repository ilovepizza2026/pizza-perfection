# Newbie Onboarding Audit: docs.murmur.dev → "Spawn Your First Agent"

**Audit date:** 2026-05-15  
**Auditor role:** Simulated brand-new user with zero prior Murmur knowledge  
**Methodology:** Follow docs.murmur.dev exactly as written; log every step, every confusion, every dead-end  
**Result:** ❌ Could not complete — blocked before first agent spawn (admin prerequisite gate)

---

## Biggest Gaps (Top 5)

These are the issues that would most hurt a real newbie, ranked by severity:

### 1. 🔴 The Developer Path is Secretly Admin-Gated — And the Docs Bury This

The landing page presents **two parallel paths**: "Admin quickstart" and "Developer quickstart." A solo developer naturally clicks the developer path. Only at the **bottom of a prerequisite callout inside the developer quickstart** does the docs reveal:

> "Your admin must finish Admin Quickstart before developers can use Murmur."

The Admin Quickstart requires: (a) being an admin of a GitHub org, (b) installing a GitHub App called "Macroscope" from `app.macroscope.com`, and (c) creating a workspace in `cloud.murmur.dev`. A solo developer, contractor, or anyone without org-admin access is **completely blocked** — not at the end of setup, but before they can run a single command. This should be the **first sentence on the landing page**, not a footnote.

### 2. 🔴 "Macroscope" Is Never Explained

The product is called **Murmur**. The docs are at **docs.murmur.dev**. The dashboard is at **cloud.murmur.dev**. But the GitHub App you must install is called **"Macroscope"** and lives at **`app.macroscope.com`**. This name appears without any explanation, alias, or context — not even a parenthetical "(this is Murmur's GitHub App)." A new user who googles "Macroscope" may not realize it's the same product. The relationship between the two names is never stated anywhere in the docs.

### 3. 🟠 Install Is Brew-Only; Linux/Windows Users Get Nothing

Every CLI install instruction in the docs is:

```bash
brew tap prassoai/tap
brew install prassoai/tap/murmur
```

There are no Linux instructions (`apt`, `curl | sh`, direct binary), no Windows instructions, and no note that this is macOS-only. The brew tap uses the organization name `prassoai` — another undeclared brand relationship. A developer on Ubuntu or Windows is abandoned at step 1.

### 4. 🟠 "Tenant" Is Used on the Landing Page Without Ever Being Defined There

The landing page says: "Install the Macroscope GitHub App to establish your **tenant**." The word "tenant" appears without definition. The Concepts page eventually defines it (a GitHub org), but there's no link from the landing page to that definition. New users are left to guess. Same problem for "workspace," "persona," and "placement" — all used in the onboarding flow before any definition appears.

### 5. 🟡 `murmur setup` vs `murmur init` Are Easily Confused

The admin quickstart has developers run `murmur setup` and then commit `.murmur/murmur.yaml`. The `murmur init` command is also mentioned (in the five-step overview on the landing page). The difference is non-obvious:
- `murmur setup` = per-developer credential/profile setup
- `murmur init` = workspace/recipe creation for a repo (requires completed `murmur setup` first)

There is no clear "run these in this order" explanation. A developer who runs `murmur init` before `murmur setup` will hit an error about a missing `murmur.yaml` — but the error docs don't link back to "you need to run setup first."

---

## Chronological Friction Log

### Step 1: Landing at docs.murmur.dev

**URL:** `https://docs.murmur.dev`  
**What the page says:** "Orchestrate flocks of autonomous AI coding agents." Two entry points: **Admin quickstart** and **Developer quickstart**. A five-step overview, list of features (Agents, Flights, Events), and links to concepts/dashboard/CLI/MCP docs.

**What I did:** Read the page as a new user. Decided to click **Developer quickstart** since I'm a developer, not an admin.

**What happened:** Page loads at `https://docs.murmur.dev/quickstart`.

**Friction:**  
- ⚠️ **The landing page uses "tenant" in the five-step overview without defining it.** Step 1 says "Install the Macroscope GitHub App to establish your tenant" — what is a tenant? What is Macroscope? The page doesn't say.  
- ⚠️ **"Macroscope" vs "Murmur":** The GitHub App has a completely different name from the product. No explanation is given anywhere on the landing page.  
- ⚠️ **"Flights," "Workspaces," "Events," "Agents," "Pools," "Personas"** are all mentioned in the feature list with no definitions. Links to concepts exist but are buried — a new user scanning the page doesn't know what any of these mean.  
- ⚠️ **The two-column layout implies the paths are alternatives.** There's no indication that the developer path *requires* the admin path to have been completed first.

---

### Step 2: Developer Quickstart

**URL:** `https://docs.murmur.dev/quickstart`  
*(Note: the landing page links to "Developer quickstart," but the URL is `/quickstart` — no `/developer-` prefix. The URL `/developer-quickstart` returns 404. Minor but worth noting.)*

**What the page says:**
> **Prerequisites:** "a GitHub account, the `gh` CLI (authenticated via `gh auth login`), and a Claude API key or Anthropic subscription."

> **Install:**
> ```bash
> brew tap prassoai/tap
> brew install prassoai/tap/murmur
> ```

> **Setup:** Navigate to your repository and run `murmur setup`.

> **Critical note:** "Your admin must finish Admin Quickstart before developers can use Murmur."

**What I did:** Checked if `brew` is available on my machine. (In a clean Linux VM: `brew: command not found`.)

**What happened:** Blocked immediately. No Linux install path.

**Friction:**  
- 🔴 **Brew-only install.** No apt, no curl-to-sh, no binary download link. Linux and Windows developers cannot install the CLI from these instructions.  
- 🔴 **The admin gate is revealed too late.** The note about "Your admin must finish Admin Quickstart" appears *after* the install command — after a developer has already committed to the path. It should be the first thing on the page: "⚠️ Before you start: your GitHub org admin must complete the Admin Quickstart first."  
- 🟠 **`gh` CLI prerequisite is called out, but no link to install it.** First-time users don't know where to get the `gh` CLI.  
- 🟠 **"Claude API key or Anthropic subscription"** — the `murmur setup` command docs also ask for an OpenAI API key. The quickstart says only Claude credentials are needed. Contradiction not resolved.  
- ⚠️ **`prassoai` tap namespace.** Who is `prassoai`? Is this Murmur's company? Never explained.

---

### Step 3: Admin Quickstart (Required Before Developer Can Proceed)

**URL:** `https://docs.murmur.dev/admin-quickstart`  
**Why I'm here:** The developer quickstart told me my admin must complete this first. I'm trying to understand what's required.

**What the page says:**

> **Prerequisites:** Install Macroscope GitHub App at `app.macroscope.com` on your GitHub organization.

> **Workspace creation:** Log into `cloud.murmur.dev` → Organization Settings → Workspaces → fill in form:
> - Workspace name (lowercase alphanumerics and hyphens)
> - Placement: `murmur-gcp-us-east1`
> - Environment: `murmur-gcp-medium`
> - Repositories
> - Image Reference: `murmur-debian12-gce`

> **CLI commands:**
> ```bash
> brew tap prassoai/tap
> brew install prassoai/tap/murmur
> murmur setup
> git add .murmur/murmur.yaml .murmur/.gitignore
> git commit -m "Add Murmur config"
> git push
> ```

**What I did:** Attempted to navigate to `app.macroscope.com`.

**What happened:** I can reach the site, but proceeding requires GitHub org admin permissions to install a GitHub App.

**Friction:**  
- 🔴 **GitHub org admin is required.** A solo developer without an org, or a developer who doesn't have admin rights to their company's GitHub org, is completely blocked here. This is never stated as a prerequisite on the landing page.  
- 🔴 **"Macroscope" is still unexplained.** The admin quickstart jumps straight to "install the Macroscope GitHub App" without once saying "Macroscope is Murmur's GitHub integration." A user who only knows the product as "Murmur" may not recognize this app in GitHub's marketplace.  
- 🟠 **Workspace form fields contain unexplained jargon:**
  - `Placement: murmur-gcp-us-east1` — what is a "placement"? Why does it say "gcp"? Can I choose a different one?
  - `Environment: murmur-gcp-medium` — what does "medium" mean? What are the options?
  - `Image Reference: murmur-debian12-gce` — "gce"? "debian12"? Can I use Ubuntu?
  - None of these fields are defined on the admin quickstart page itself, and there's no link to definitions.  
- 🟠 **The CLI commands on the admin quickstart are identical to the developer quickstart.** It's unclear whether the admin runs `murmur setup` *and* then each developer also runs it, or whether the admin's run covers everyone.  
- ⚠️ **`murmur init` is mentioned in the landing page's five-step overview but does NOT appear in either quickstart.** A user following the quickstart literally will never run `murmur init`, but will encounter it in other docs. When should they run it?

---

### Step 4: Attempting `murmur setup` (Blocked — Prerequisites Not Met)

**URL:** `https://docs.murmur.dev/cli/setup`  
**What the docs say:**
> "Interactive mode walks through 9 steps: GitHub authentication, tenant selection, workspace selection, Claude credentials, OpenAI credentials, murmur.yaml creation, profile encryption, profile upload, MCP server registration."

> Non-interactive mode requires env vars: `CLAUDE_CODE_OAUTH_TOKEN`, `CLAUDE_CODE_OAUTH_REFRESH_TOKEN`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`.

**What I did:** Attempted to run `murmur setup` in the project directory.

**What happened:** Could not run — `murmur` CLI not installed (Linux, no brew). Hypothetically, even if installed: step 2 (tenant selection) would fail because the Macroscope GitHub App has not been installed on any org.

**Friction:**  
- 🔴 **Order-of-operations failure:** CLI can't be installed (Linux). Even if it could, `murmur setup` asks to select a tenant at step 2 — but tenants only exist after the admin has installed the Macroscope app. The error user would see (from the error codes docs) is `TENANT_NOT_FOUND` — but the error doc says "make sure Macroscope is installed on your GitHub org," not "ask your admin to do the Admin Quickstart." Mismatch in language.  
- 🟠 **Why does `murmur setup` ask for OpenAI credentials?** The developer quickstart says prerequisites are "a Claude API key or Anthropic subscription" — OpenAI is not mentioned. Yet the setup wizard collects OpenAI credentials. New users won't have this ready and won't know whether it's required or optional.  
- ⚠️ **The 9-step interactive wizard is described in prose but never shown.** What does each prompt look like? What do I type? Where do I get a "Claude Code OAuth token" vs an "Anthropic API key"? These are different things and the docs don't explain the difference.  
- ⚠️ **`CLAUDE_CODE_OAUTH_TOKEN` is referenced in non-interactive mode** but there's no link to how to obtain one. A developer using the non-interactive path (CI, Docker) has no idea where this comes from.

---

### Step 5: Attempting "Spawn Your First Agent" (Reached Page — Cannot Execute)

**URL:** `https://docs.murmur.dev/spawn-your-first-agent`  
**What the docs say:**

#### Method 1: Dashboard
> 1. Go to `cloud.murmur.dev`
> 2. Click the **+** icon
> 3. Enter task slug: `my-first-task`
> 4. Enter prompt: "Create a file called `hello.txt` that says 'hi' and open a PR."
> 5. Pick: Workspace, Persona (e.g. `programmer`), Mode: **Autonomous**
> 6. Click **Spawn**

#### Method 2: CLI
> ```bash
> murmur spawn my-first-task "Create a file called hello.txt that says 'hi' and open a PR" --out pr
> ```

#### Method 3: Director
> ```bash
> murmur director
> ```
> Then describe work in plain English.

**What I did:** Attempted to navigate to `cloud.murmur.dev` (dashboard) and attempted to run `murmur spawn` (CLI).

**What happened:**  
- Dashboard: Requires GitHub login; once logged in, workspace dropdown is empty because no admin has set up a workspace yet.  
- CLI: `murmur` not installed (Linux, no brew). Even if installed and setup complete, `murmur spawn` docs include a critical note: **"The current branch must be pushed to `origin` before spawning"** — this is buried in the CLI reference, not in the Spawn Your First Agent guide.

**Friction:**  
- 🔴 **The "Spawn Your First Agent" page doesn't mention any prerequisites.** There's no "before you can do this, you need:" section. A user reading this in isolation would try all three methods and fail without understanding why.  
- 🟠 **"Workspace" dropdown in the dashboard is empty if admin hasn't set one up.** There's no fallback, no "create a workspace" button visible from the spawn dialog, and no error message that guides the user back to the admin quickstart.  
- 🟠 **The critical requirement from `murmur spawn` docs ("current branch must be pushed to origin") is not mentioned on the Spawn Your First Agent page.** A user who tries the CLI method and has unpushed commits will get a confusing error.  
- ⚠️ **"Persona" is mentioned in the spawn UI (step 5) but not defined.** A new user sees a dropdown with options like `programmer`, `architect`, `researcher` — what do these mean? The spawn page links to the personas concept page, but only via a text hyperlink that's easy to miss.  
- ⚠️ **"Mode: Autonomous"** is listed as an option but the other mode ("Streaming") is never explained here. Why is Autonomous the right choice? What's wrong with Streaming for a first run?

---

### Step 6: ❌ Dead End — Could Not Spawn First Agent

**Blocked by:**
1. No Linux install path for the CLI
2. No GitHub org admin access to install Macroscope app
3. No workspace created (requires admin completion)
4. No `murmur setup` completion (requires workspace to exist)

**Result:** A brand-new developer on Linux following the documentation exactly cannot spawn their first agent.

---

## Additional Issues Found (Not on Critical Path)

### URL Discrepancy
- Landing page links to "Developer quickstart" but URL is `/quickstart`, not `/developer-quickstart`
- `/developer-quickstart` returns a 404 error

### Term Used Before Definition: "Tenant"
- Used on landing page, admin quickstart, and developer quickstart
- Defined only in Concepts → Overview, which is not linked from any quickstart page
- A user must already know to look in "Core Concepts" to find this

### Term Used Before Definition: "Flight"
- Mentioned in the landing page feature list
- Defined in Concepts → Flights, but first encounters on landing page give no indication of what it is
- The DAG/Markdown connection is genuinely non-obvious from the name alone

### `murmur init` Orphaned
- Listed in the landing page five-step workflow as step 4 ("Execute `murmur init`")
- Does NOT appear in the Admin Quickstart CLI commands
- Does NOT appear in the Developer Quickstart
- Only covered in `cli/init` reference docs and `customize-your-workspace`
- New users see it mentioned but don't know when to run it relative to other commands

### No "Personal Tenant" Fast Path Documented
- The authentication docs note: "Personal tenant (`github_oauth/{username}`) — automatically created for authenticated users"
- This implies a solo developer might be able to spawn agents on a personal tenant without an org admin
- This is NEVER mentioned in the quickstart or spawn-first-agent guides
- If personal tenants can be used for solo development, documenting this path would unblock the entire admin-gated flow for individual developers

### Dashboard Login Error Message Incomplete
- Dashboard docs say: "If you cannot sign in, check that the Macroscope GitHub App is installed on your GitHub organization and that your account is an org member."
- No mention of personal tenants as a fallback

---

## Summary Table

| Step | URL | Blocker? | Friction Type |
|------|-----|----------|---------------|
| Landing page | `docs.murmur.dev` | No | Undefined terms (tenant, flight, persona); Macroscope name disconnect |
| Developer Quickstart | `/quickstart` | **YES** | Brew-only install; admin gate revealed too late |
| Admin Quickstart | `/admin-quickstart` | **YES** | Requires GitHub org admin; Macroscope still unexplained; workspace fields undefined |
| `murmur setup` | `/cli/setup` | **YES** | Cannot run without CLI; CLI requires brew; setup requires existing tenant |
| Spawn Your First Agent | `/spawn-your-first-agent` | **YES** | No prerequisites listed; empty workspace dropdown; branch-must-be-pushed not mentioned |

**Final verdict:** A solo developer on Linux, reading the docs linearly, cannot spawn their first agent. Multiple blockers compound: install requires Mac (brew), progress requires org admin, and each page assumes the prior page's steps completed successfully without re-stating what those steps were.

---

## Recommended Fixes (Priority Order)

1. **Add a solo-developer path.** Document the personal tenant (`github_oauth/{username}`) flow that bypasses org admin requirements for individual testing. Pin this to the top of the landing page as "Just me, no team."

2. **Add a Linux/Windows install section.** At minimum, a note with a `curl`-based binary install or a Docker image. Flag `brew tap prassoai/tap` as macOS-only.

3. **Move the admin gate warning to the top of the developer quickstart** (and the landing page). Make it impossible to miss.

4. **Define "Macroscope" once, clearly.** Add a sentence like: "Murmur uses a GitHub App called Macroscope to access your repositories. Macroscope is Murmur's GitHub integration — install it at app.macroscope.com." Then never mention it again without the parenthetical on first use.

5. **Add a prerequisite checklist to "Spawn Your First Agent."** Something like:
   ```
   Before you spawn:
   ✅ Admin has completed Admin Quickstart
   ✅ You have run `murmur setup` in this repo
   ✅ Your current branch is pushed to origin
   ✅ You have at least one workspace configured
   ```
