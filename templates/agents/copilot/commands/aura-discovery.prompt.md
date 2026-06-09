---
name: aura-discovery
description: "Aura-SDD: Route new work into one of five outcomes."
mode: agent
---

Analyze the user's feature idea and route it into the most appropriate next action following Aura-SDD methodology.

1. Load `.aura/constitution.md` and `.aura/steering/*.md`
2. Identify Boundary Candidates
3. Route to: extend spec | direct impl | single spec | multi-spec | mixed
4. Write `brief.md` (and `roadmap.md` for multi-spec to `.aura/discovery/`)
5. Recommend next command

Follow rules in `.aura/settings/rules/boundary-principles.md`.
