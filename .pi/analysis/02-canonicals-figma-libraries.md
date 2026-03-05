# Canonical's Figma Libraries — Content Analysis & Restructuring Plan

## Current State

This is your most structured case study and already has a reasonable problem → research → implementation → adoption arc. But it still reads more as a *summary of what happened* than a story about *decisions you made and why*. The process is described at a surface level — you mention research, surveys, review sessions, metrics — but never go deep enough for a hiring manager to understand your thinking.

## What It Currently Communicates

- You can lead a design systems initiative
- You do research before building
- You think about team buy-in
- You built custom tooling for metrics

## What It Should Also Communicate

- What your research actually revealed and how it changed your approach
- How you navigated disagreements and competing priorities in a team
- What specific trade-offs you made and why
- Concrete, honest outcomes (not inflated metrics, but real results)

## Section-by-Section Analysis

### 1. Opening — "The shoemaker's children" (good hook, keep)
The proverb opening works well. It frames the problem concisely. The description of the existing state (outdated, incomplete, designers detaching components) paints a clear picture.

**Content to add:** One thing that's missing is *scale*. How many designers were affected? How many products? How many components were in the old library? These aren't vanity metrics — they're context. "A team of 5 designers" is a very different story than "a team of 25 designers across 8 product teams." Give the reader the scope.

### 2. Understanding the Problem (expand significantly)
This section currently does the most damage by being too thin. You mention a survey, gathering feedback, and organizing meetings — but this is exactly where hiring managers want depth.

**Content to add:**
- **What did the survey reveal?** Not every finding, but the 2-3 most important or surprising ones. For example: Did most designers not even know certain components existed? Were people building the same custom components independently? Was there a split between what designers said they wanted vs. what they actually used? Share something specific.
- **What were the key needs you identified?** You mention "understanding their needs" but never say what those needs were. Were designers primarily frustrated by performance? By not finding things? By components not matching code? The answer to this shapes everything that follows.
- **How did you go from "we should fix this" to "I'm leading this"?** You say "I took the initiative to lead the rebuilding effort" — how? Was there resistance? Did you pitch this to a manager? Was it a gradual thing? The initiative-taking story matters.

### 3. Research and Specification (good structure, needs specifics)
The references to Doctolib, Nathan Curtis, and design system tiers show you did real research. The collaborative specification process with review sessions is good.

**Content to add:**
- **What was the hardest decision in the specification?** Every spec has contentious points. Was it how to organize libraries (one mega-library vs. multiple)? Was it naming conventions? Was it how to handle product-specific components vs. shared ones? Pick the most interesting debate and tell that story. This demonstrates stakeholder management far better than "we had meetings."
- **What did you change based on team feedback?** You say you organized review sessions where team members could "discuss, modify, and ultimately approve each section." What got modified? If everything you proposed was accepted without change, that's suspicious. If things changed, that shows you actually listened. Either way, there's a story here.
- **The 20-page spec** — this is mentioned almost as an aside but it's a significant deliverable. What were the major sections? Even a brief outline would help readers understand the scope.

### 4. Implementation (fine, but connect decisions to earlier research)
The implementation section is adequate. The blog post link is a nice touch for people who want technical depth.

**Content to add:**
- **Connect back to the research.** Were there moments during implementation where you had to revisit the spec because something didn't work as planned? Did building components reveal problems with your specification? This kind of honesty — "we planned X but discovered Y during implementation" — is incredibly credible.
- **How did leading junior designers work?** You mention building with support from junior designers. How did you divide work? How did you ensure consistency? Did you create contribution guidelines? This is leadership evidence.

### 5. Custom Metrics Tool (strong, needs concrete outcomes)
This is genuinely impressive — building custom tooling because native analytics weren't sufficient. The Pinterest and Uber references show you researched existing approaches.

**Content to add:**
- **What did the metrics actually show?** You mention detachment rates as particularly valuable — give an example. "We discovered that the Modal component had a 40% detachment rate, which led us to investigate and find that designers needed [specific feature] that wasn't supported." That's a concrete story that proves the tool was useful, without being a fake LinkedIn metric.
- **What was the tool technically?** One sentence is enough. Was it a Figma plugin? A script that parsed Figma API data? A dashboard? Readers (especially technical hiring managers) will be curious.

### 6. Transition and Adoption (too thin)
This reads as an afterthought. The transition strategy is actually an important part of any systems work.

**Content to add:**
- **How long was the transition period?** Weeks? Months?
- **Were there teams that resisted the change?** How did you handle that?
- **What does "strong adoption" actually mean?** You don't need a fake percentage. But "by the end of the 3-month transition, all product teams had migrated their active projects to the new library" is concrete and believable. Or "two teams were slower to adopt because [reason], and we addressed this by [action]."

### 7. Public Release (keep as a brief closing)
The Figma community release with view/duplication stats is a nice concrete ending. Keep it brief.

**Content to add:** Was the public release always planned, or did it come from the confidence gained through the internal metrics? That's a nice narrative arc if true.

## Process Line Stages for This Project

```
Identifying the problem → Surveying the team → Researching approaches → Drafting the spec → Debating with the team → Building components → Building metrics tooling → Transitioning the team → Public release
```

The line for this project should be relatively structured/linear since the process was methodical, but with a small loop between "Drafting the spec" and "Debating with the team" (to show the iterative review process), and a branch at "Building metrics tooling" (since that was a parallel effort you initiated alongside component building).

## Priority Level for Rewrite

**High.** This is one of your strongest professional projects and closest to being great. The bones are solid. It mainly needs *depth* — going one level deeper on research findings, specification decisions, and concrete outcomes. The content additions I've outlined above are where you should invest writing time.
