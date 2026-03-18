---
name: write-a-prd
description: Create a Product Requirements Document from conversation and submit as a GitHub issue
user_invocable: true
---

# Write a PRD

Create a Product Requirements Document following this workflow. You may skip steps if they have already been completed in this conversation.

## Steps

1. **Ask for a detailed description** — Ask the user for a detailed description of the feature or change they want to build.

2. **Explore the repo** — Explore the repository to verify assertions and understand the current codebase structure relevant to the feature.

3. **Interview the user relentlessly** — Interview the user relentlessly about every aspect of this plan until you reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one by one. If a question can be answered by exploring the code base, explore the code base instead.

4. **Sketch out major modules** — Identify and sketch the major modules, components, or systems needed for implementation.

5. **Write the PRD** — Write the PRD using the template below and submit it as a GitHub issue.

## PRD Template

```markdown
# [Feature Name]

## Overview
Brief description of the feature and its purpose.

## Problem Statement
What problem does this solve? Why is it needed?

## User Stories
- As a [user type], I want [action] so that [benefit].
- ...

## Requirements

### Functional Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- ...

### Non-Functional Requirements
- [ ] Performance considerations
- [ ] Security considerations
- ...

## Design Decisions
Key decisions made during the design tree walkthrough and their rationale.

## Scope
### In Scope
- ...

### Out of Scope
- ...

## Dependencies
- ...

## Open Questions
- ...
```
