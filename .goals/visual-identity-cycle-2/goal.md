# Goal: Raise Supply Chain Dictionary UX quality

## User Request

Using the newly installed plugins, tools, skills, and MCP servers, repeat the
full high-standard improvement process for the Supply Chain Dictionary.

## Refined Goal

Run a second end-to-end improvement cycle for the Supply Chain Dictionary.
Audit the current Quartz-native implementation, improve the most valuable
remaining visual, navigation, accessibility, and content-presentation issues,
and verify the result through three independent critical review cycles. Preserve
Quartz v5, Obsidian as the source of truth, existing plugins, browser-local
flashcards, and the no-database/no-auth architecture.

## Acceptance Criteria

- [ ] The repository receives a meaningful, user-visible improvement pass based
  on current inspection rather than speculative changes.
- [ ] Search, navigation, homepage identity, glossary readability, flashcards,
  responsive behavior, and accessibility are reviewed as a coherent experience.
- [ ] No external search service, database, authentication system, AI feature,
  major dependency, or custom React application is introduced.
- [ ] Three independent critical review cycles are completed, each scoring the
  experience across eight topics on a 10-point scale and addressing findings.
- [ ] TypeScript, formatting, tests, and the Quartz production build pass.
- [ ] Changes are committed and pushed to origin/v5, with the branch synchronized.

## Scope Boundaries

**In scope:**
- Quartz configuration, existing custom SCSS, Obsidian markdown content,
  existing flashcard UX, navigation, accessibility, and responsive behavior.
- Existing repository tools, skills, MCP servers, and quality gates.

**Out of scope:**
- New external services, databases, authentication, AI, major dependencies,
  custom React applications, or replacement of the Quartz architecture.
- Rewriting unrelated content or reverting existing user work.

## Applicable Project Conventions

**Quality gate command:**
- `npm run check`
- `npm test`
- `npx quartz build --bundleInfo -d docs`

**Commit convention:**
- Conventional commits, with the goal workflow role marker when applicable.
- Assisted-by trailer required by the goal workflow.

**Guidelines:**
- [.github/pull_request_template.md](../.github/pull_request_template.md)

**Rules:**
- Preserve user changes and use surgical edits.
- Do not add secrets or unrelated tooling.
