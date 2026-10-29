# Resource0

A cloud registry for agent resources (skills, MCP servers, hooks, subagents, prompts). Sync them once with the Observal CLI and use them in any harness.

## Mockups

Static HTML, no build step. Open `mockups/index.html` in a browser, or serve it:

```sh
python3 -m http.server -d mockups 8000
```

| Collection | Folder | Branch |
|---|---|---|
| 1. Landing & ads | `mockups/collection-1-landing/` | `collection/1-landing` |
| 2. Onboarding | `mockups/collection-2-onboarding/` | `collection/2-onboarding` |
| 3. Product | `mockups/collection-3-product/` | `collection/3-product` |
| 4. Analytics panel | `mockups/collection-4-analytics/` | `collection/4-analytics` |

Each collection gets its own worktree and its own Claude Code instance. Stay inside your own collection folder. Shared styles live in `mockups/shared/r0.css`; add new styles there instead of copying them, and keep those changes small so merges stay clean.
