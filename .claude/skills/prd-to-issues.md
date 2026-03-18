---
name: prd-to-issues
description: Break a PRD into vertical-slice GitHub issues with blocking relationships
user_invocable: true
---

# PRD to Issues

Take a Product Requirements Document and turn it into a Kanban board of independently grabbable GitHub issues.

## Steps

1. **Locate the PRD** — Find the PRD in the current conversation, or ask the user to provide it. If it's a GitHub issue, fetch it.

2. **Explore the code base** — Understand the current architecture, existing modules, and integration points relevant to the PRD.

3. **Draft vertical slices** — Break the PRD into issues that are thin vertical slices cutting through all integration layers. Each issue should be a tracer bullet that flushes out unknown unknowns quickly. Avoid horizontal slices that only touch one layer.

   Each issue should:
   - Be independently implementable where possible
   - Include clear acceptance criteria
   - Reference the relevant section of the PRD
   - Have a clear scope that avoids overlap with other issues

4. **Establish blocking relationships** — Identify which issues block others. Mark issues that have no blockers so they can be picked up immediately for parallel work.

5. **Create the issues** — Create each issue on GitHub using `gh issue create`, including:
   - A descriptive title
   - The acceptance criteria and scope in the body
   - Labels if appropriate
   - A note about which issues it blocks or is blocked by
