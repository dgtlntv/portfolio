# Guide for Rewriting Portfolio Project Content

## Goal

Rewrite the content of project case studies so they better serve hiring managers while keeping the writing authentic and natural. The projects should communicate process, decision-making, collaboration, and outcomes more clearly without becoming formulaic or performative.

## Before You Start

1. Read the **analysis file** for the project in `.pi/analysis/`. It describes what the current version communicates, what it should also communicate, and section-by-section recommendations.
2. Read the **TODO file** for the project in `.pi/todos/`. It contains the author's raw input (bullet points, half-sentences, rough thoughts) that need to be turned into prose.
3. Read the **current MDX file** in `src/content/projects/`. Understand the existing structure, which components are used (FloatContent, image-gallery, AnimatedImage, FanImages, DocumentSkeleton, etc.), and how images/media are placed.

## Tone of Voice

Match the author's existing writing style closely:

- **Conversational but not sloppy.** Direct sentences. Not academic, not casual.
- **Natural "I" usage.** First person throughout.
- **Short sentences mixed with longer ones.** Varies rhythm.
- **Starts sentences with "But", "And", "So" naturally.** Not every sentence, but regularly.
- **Occasional fragments for effect.** ("And it definitely did in this project.")
- **Explains technical things plainly** without being condescending.
- **Parenthetical asides** feel natural. ("based on other people's algorithms, of course")
- **Not flowery or pretentious.** No marketing language. No "leveraging synergies."
- **Honest about limitations.** Doesn't oversell results. Acknowledges what didn't work.

## Formatting Rules

- **No em dashes or en dashes.** Use separate sentences or commas instead.
- **No self-congratulatory closing paragraphs.** ("This project demonstrates how taking initiative...") Let the work speak for itself.
- **No inflated metrics.** Only use numbers that are factual and verifiable. "80% adoption in new projects" is fine if true. "Increased efficiency by 347%" is not.

## Structure

Each project should have:

1. **A TL;DR** in the frontmatter (`tldr` field). One short paragraph that gives a hiring manager the key facts in ~5 seconds. What you did, the scope, the outcome.

2. **A clear opening** that frames what the project is and why it matters. Don't bury the lead. The most interesting thesis or hook should be in the first 1-2 sentences, not the third paragraph.

3. **Sections that follow the actual process** but don't force a rigid template. The headings should reflect what actually happened in that project. Use natural language for headings, not UX jargon ("Understanding the problem" not "Discovery Phase").

4. **Process stages** in the frontmatter (`process` field) that map to content headings via `anchor` fields. These drive the process line component.

Do NOT impose a uniform section template across all projects. Each project had a different process. The structure should reflect that.

## What to Expand

The main weakness of the original content is that process is described but not demonstrated. Fix this by:

- **Showing what research revealed and how it changed the approach.** Not "I did research" but "The research showed X, which led us to change Y."
- **Naming specific decisions and trade-offs.** Not "we debated different approaches" but "some designers wanted baseline alignment baked in, others pointed to the detachment data. The compromise was a Figma mode."
- **Making collaboration and stakeholder management visible.** Who was involved, what was contentious, how disagreements were resolved.
- **Giving concrete outcomes.** Not "strong adoption" but "80% adoption in new projects within six months." Not "the team was happy" but what specifically changed.

## What to Trim

- **Excessive technical detail** that doesn't serve the narrative. GPU specs, specific parameter values, infrastructure details. Keep enough to show technical fluency, cut the rest.
- **Vague summary statements.** Replace them with specifics or cut them entirely.
- **Redundant framing.** If the work is good, you don't need to tell the reader it was good.

## Preserving Existing Elements

When rewriting:

- **Keep all image galleries, FloatContent blocks, and media embeds.** They can be repositioned if the section structure changes, but don't remove them.
- **Keep all existing frontmatter fields** (title, date, slug, excerpt, coverImage, heroAltText, heroLocation, asciiDarken, stats). Only add new fields (tldr, process).
- **Keep external links** (to blog posts, GitHub repos, community profiles, references).
- **Update process stage anchors** if headings change. Check the generated heading IDs match.

## Process for Rewriting

1. Read analysis + TODOs + current file
2. Draft the new prose, integrating the author's raw input from the TODOs
3. Preserve all MDX components and media in their correct positions (or reposition if sections changed)
4. Add/update `tldr` and `process` frontmatter fields
5. Verify the file builds (`npx astro build`)
6. Verify heading IDs match process stage anchors
