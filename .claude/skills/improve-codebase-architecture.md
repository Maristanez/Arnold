---
name: improve-codebase-architecture
description: Explore the codebase for architectural improvements, identifying shallow modules to deepen and unclear boundaries to clarify
user_invocable: true
---

# Improve Codebase Architecture

Explore the codebase and identify opportunities to improve its architecture, making it clearer for both humans and AI agents to work with.

## What to Look For

- **Shallow modules** — Where many small files each do very little, requiring you to bounce between them to understand a single concept. These are candidates for deepening into fewer, more powerful modules with simpler interfaces.

- **Extracted-for-testing functions** — Where pure functions have been extracted solely for testability, but the real bugs hide in how they're called. Consider whether the design could be restructured so the integration is testable directly.

- **Tight coupling** — Where modules that appear separate are actually tightly coupled, creating integration risk. Consider whether they should be merged or given a clearer contract between them.

- **Unclear boundaries** — Where it's not obvious at which layer to test, where to add new functionality, or how data flows through the system.

- **Scattered concerns** — Where a single feature's logic is spread across many files or directories without clear organization.

## Workflow

1. **Explore naturally** — Read through the codebase, following the dependency chains and data flow. Don't just look at file names — read the code.

2. **Identify candidates** — Find areas that match the patterns above. For each candidate, note:
   - What the current structure is
   - Why it's problematic
   - What a deeper/cleaner design would look like

3. **Present options** — Show the user the candidates and proposed improvements side by side. Let them choose which to pursue.

4. **Implement** — Make the agreed-upon changes, running tests after each change to ensure nothing breaks.

## When to Use

- Once a week during active development
- After a surge of feature work
- When AI agents are producing low-quality output in a particular area of the codebase
- Before starting a major new feature in an area with unclear architecture
