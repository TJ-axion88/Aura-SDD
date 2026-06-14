---
description: "Aura-SDD: Route new work into one of five outcomes. Entry point for all Aura-SDD workflows."
---

{{SKILL_CONTENT}}

<!-- This file mirrors the Claude Code skill content for Cursor compatibility -->
<!-- See .aura/settings/rules/ for AI generation rules -->
<!-- See .aura/settings/templates/ for document templates -->

# aura-discovery

Analyze the user's idea and route it into the most appropriate next action.

1. Load `.aura/constitution.md` and `.aura/steering/*.md`
2. Check if Constitution exists — warn if missing
3. Identify Boundary Candidates
4. Route to: extend existing spec | no spec needed | single spec | multi-spec | mixed
5. Write `brief.md` (and `roadmap.md` for multi-spec)
6. Recommend next command

Read `.aura/settings/rules/boundary-principles.md` for routing guidance.
