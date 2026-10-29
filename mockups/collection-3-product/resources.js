// Sample data for the Resources screens (3.2, 3.3). Harness order: Claude Code, Codex, Cursor, Gemini CLI, OpenCode.
// Status codes: n = native, c = converted, p = partial, x = not supported.
window.R0 = (function () {
  const HARNESSES = ["Claude Code", "Codex", "Cursor", "Gemini CLI", "OpenCode"];
  const STATUS = { n: ["s-native", "Native"], c: ["s-conv", "Converted"], p: ["s-part", "Partial"], x: ["s-na", "Not supported"] };

  const resources = [
    { name: "pr-reviewer", type: "Skill", v: 4, h: "nccc c", shared: true, owner: "Raja", runs: 118, updated: "Mon", src: "~/.claude/skills/pr-reviewer", needs: "github MCP", users: "RHKPS",
      desc: "Reviews the current PR against Appian's conventions. Uses the diff from the github MCP once, flags risky migrations, and writes comments as suggestions instead of edits." },
    { name: "github", type: "MCP server", v: 1, h: "ncccc", shared: true, owner: "Raja", runs: 431, updated: "Oct 9", src: "~/.claude.json", users: "RHKPSL",
      desc: "GitHub's MCP server with 29 tools for PRs, issues and files. The token is stored as ${GITHUB_TOKEN}, so each person uses their own." },
    { name: "db-migrator", type: "Subagent", v: 2, h: "npccc", shared: true, owner: "Raja", runs: 37, updated: "Tue", src: "~/.claude/agents/db-migrator.md", review: true, users: "RP",
      desc: "Writes and checks Postgres migrations. Proposes a plan first and refuses migrations without a down step." },
    { name: "pre-commit-lint", type: "Hook", v: 3, h: "ncpxc", shared: false, owner: "Raja", runs: 64, updated: "Oct 21", src: "~/.claude/settings.json → hooks",
      desc: "Runs eslint and ruff on changed files before the agent commits, and blocks the commit if either fails." },
    { name: "release-notes", type: "Prompt", v: 2, h: "cnccc", shared: true, owner: "Raja", runs: 6, updated: "Oct 24", src: "~/.codex/prompts/release-notes.md", users: "H",
      desc: "Turns merged PRs since the last tag into customer-facing release notes, grouped by area." },
    { name: "react-conventions", type: "Rule", v: 5, h: "ccncc", shared: true, owner: "Raja", runs: 92, updated: "Oct 18", src: ".cursor/rules/react-conventions.mdc", users: "RKL",
      desc: "Appian's React rules: server components by default, no default exports, colocated tests." },
    { name: "api-docs-writer", type: "Skill", v: 1, h: "ncccc", shared: false, owner: "Raja", runs: 0, updated: "Oct 9", src: "~/.claude/skills/api-docs-writer",
      desc: "Writes OpenAPI descriptions and examples for new endpoints from the handler code." },
    { name: "k8s-debug", type: "Subagent", v: 1, h: "ncccc", shared: false, owner: "Raja", runs: 0, updated: "Sep 11", src: "~/.claude/agents/k8s-debug.md",
      desc: "Reads pod logs and events with kubectl and suggests a likely cause. Read-only." },
    { name: "test-writer", type: "Skill", v: 2, h: "ncccc", shared: false, owner: "Raja", runs: 41, updated: "Oct 20", src: "~/.claude/skills/test-writer",
      desc: "Adds missing unit tests for the files in the current diff, matching the existing test style." },
    { name: "refactor-planner", type: "Skill", v: 1, h: "ncccc", shared: false, owner: "Raja", runs: 9, updated: "Oct 12", src: "~/.claude/skills/refactor-planner",
      desc: "Breaks a large refactor into small PRs and writes a checklist for each." },
    { name: "incident-summary", type: "Skill", v: 1, h: "ncccc", shared: false, owner: "Raja", runs: 2, updated: "Oct 3", src: "~/.claude/skills/incident-summary", needs: "sentry MCP",
      desc: "Pulls the Sentry issue and recent deploys and drafts a short incident summary." },
    { name: "perf-profiler", type: "Skill", v: 2, h: "ncpcc", shared: false, owner: "Raja", runs: 4, updated: "Oct 15", src: "~/.claude/skills/perf-profiler",
      desc: "Runs the benchmark suite, compares against main and explains the biggest regressions." },
    { name: "sentry", type: "MCP server", v: 1, h: "ncccc", shared: false, owner: "Raja", runs: 0, updated: "Oct 9", src: "~/.claude.json",
      desc: "Sentry's MCP server for issues, events and releases." },
    { name: "postgres", type: "MCP server", v: 2, h: "ncccc", shared: false, owner: "Raja", runs: 73, updated: "Oct 17", src: "~/.claude.json",
      desc: "Read-only Postgres access to the staging database. Connection string stored as ${STAGING_DB_URL}." },
    { name: "linear", type: "MCP server", v: 1, h: "ncccc", shared: false, owner: "Raja", runs: 22, updated: "Oct 11", src: "~/.codex/config.toml",
      desc: "Linear's MCP server for reading and updating issues." },
    { name: "block-secrets", type: "Hook", v: 1, h: "ncpxc", shared: false, owner: "Raja", runs: 188, updated: "Oct 9", src: "~/.claude/settings.json → hooks",
      desc: "Stops any file write that contains something shaped like an API key or private key." },
    { name: "security-auditor", type: "Subagent", v: 2, h: "nccc c", shared: false, owner: "Raja", runs: 11, updated: "Oct 19", src: "~/.claude/agents/security-auditor.md",
      desc: "Reviews a diff for injection, auth and secrets issues and rates each finding." },
    { name: "frontend-tester", type: "Subagent", v: 1, h: "ncccc", shared: false, owner: "Raja", runs: 7, updated: "Oct 13", src: "~/.claude/agents/frontend-tester.md",
      desc: "Runs Playwright against the local dev server and reports broken flows with screenshots." },
    { name: "standup-summary", type: "Prompt", v: 1, h: "cnccc", shared: false, owner: "Raja", runs: 5, updated: "Oct 10", src: "~/.codex/prompts/standup-summary.md",
      desc: "Summarizes yesterday's commits and PR activity into three standup lines." },
    { name: "api-style", type: "Rule", v: 2, h: "ccncc", shared: false, owner: "Raja", runs: 51, updated: "Oct 16", src: ".cursor/rules/api-style.mdc",
      desc: "Naming, pagination and error-shape rules for Appian's public REST API." },
    { name: "commit-message", type: "Prompt", v: 3, h: "ncccc", shared: false, owner: "Raja", runs: 96, updated: "Oct 22", src: "~/.claude/commands/commit-message.md",
      desc: "Writes a conventional-commit message from the staged diff." },
    // Shared by teammates (appear only under "Shared in Appian")
    { name: "codex-test-runner", type: "Prompt", v: 1, h: "cnccc", shared: true, owner: "Hema", runs: 57, updated: "Tue", src: "~/.codex/prompts/codex-test-runner.md", users: "HS", teammate: true,
      desc: "Runs the affected test suites for the current change and summarizes failures." },
    { name: "sql-style", type: "Rule", v: 1, h: "ncccc", shared: true, owner: "Priya", runs: 19, updated: "Oct 23", src: "~/.claude/rules/sql-style.md", users: "P", teammate: true,
      desc: "Appian's SQL conventions: snake_case, explicit column lists, no SELECT *." },
    { name: "sentry-triage", type: "Skill", v: 1, h: "ncccc", shared: true, owner: "Sam", runs: 0, updated: "Oct 27", src: "~/.claude/skills/sentry-triage", needs: "sentry MCP", teammate: true,
      desc: "Groups new Sentry issues by likely cause and assigns an owner from CODEOWNERS." },
  ];
  resources.forEach(r => { r.h = r.h.replace(/\s/g, ""); });

  const GROUP = { "Skill": "Skills", "MCP server": "MCP servers", "Hook": "Hooks", "Subagent": "Subagents", "Prompt": "Prompts & rules", "Rule": "Prompts & rules" };
  const href = r => "03-resource.html?r=" + encodeURIComponent(r.name);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const dots = r => [...r.h].map((c, i) => `<span class="${STATUS[c][0]}" title="${HARNESSES[i]}: ${STATUS[c][1]}"><span class="dot"></span></span>`).join("");
  const find = name => resources.find(r => r.name === name);

  return { HARNESSES, STATUS, GROUP, resources, href, esc, dots, find };
})();
