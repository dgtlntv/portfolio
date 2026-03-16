# Design Systems Documentation — Content Analysis & Structuring Plan

## What This Project Is

This is a documentation initiative for Canonical's design system. The author spent ~6 months working with 3 other designers to write structured design system documentation. On top of that, the author built two AI tools: an agent skill that lets designers query the docs via structured data (jq), and a meta-prompting framework (built with the content designer) that walks writers through the documentation process, helps with brand voice, readability, completeness checks, and iterative rewrites.

## What It Should Communicate

- **Advocacy and persistence.** The author pushed for this for a long time before management greenlit it. This shows initiative and the ability to identify systemic problems.
- **Understanding of why documentation matters** at an organizational level, not just "we should have docs" but the specific harm caused by not having them (inconsistency, knowledge silos, onboarding friction).
- **Structured thinking.** The decision to write docs as structured data (not just prose in a wiki) was deliberate and enabled the AI tooling downstream.
- **AI fluency that's practical, not performative.** The two AI tools show the author can identify where AI actually helps and build tools that fit real workflows. The meta-prompting framework is particularly interesting because it's opinionated about what AI should and shouldn't do (it doesn't write the docs, you still do the thinking).
- **Collaboration.** Worked with 3 other designers on the docs, and with the content designer on the meta-prompting framework.
- **Going beyond scope.** Rendering/publishing the docs wasn't part of the mandate but the author did it anyway because docs that can't be accessed are useless.

## Narrative Arc

The natural story here is:

1. **The problem** — Design inconsistency across Canonical's portfolio because there's no single source of truth for how components should be used. Knowledge lives in people's heads or scattered across files.
2. **Advocating for the work** — Pushing management to invest in documentation. What finally changed their mind.
3. **The approach** — Writing docs as structured data. Why this format over a wiki or Notion or whatever. The collaborative process with 3 other designers.
4. **Making docs accessible** — Building the rendering/publishing even though it wasn't officially scoped. Because what good is documentation nobody can access.
5. **AI tooling** — The agent skill for querying docs, and the meta-prompting framework for writing them. The framework's philosophy: AI helps with process, voice, and review, but the designer does the thinking and the decisions.

## Tone Considerations

The author explicitly notes: don't make the AI stuff the entire center, but make it a strong point. The balance should be: this is a documentation project that solved a real organizational problem, AND the author built smart AI tooling that made the process better. The AI tools are evidence of how the author thinks, not the entire story.

## Process Line Stages

```
Noticing the gap → Advocating for investment → Structuring the approach → Writing the docs → Building the rendering → Building AI tooling → Shipping to the team
```

A branch from "Structuring the approach" to "Building AI tooling" that merges back at "Shipping to the team" could work, since the AI tools were developed alongside the docs writing.
