# Canonical Design Tokens — Content Analysis & Restructuring Plan

## Current State

This case study has a fundamental narrative problem: it describes a project that wasn't finished when you wrote it. It ends on "engineering had not yet moved to implementation" and "once engineering moves to full implementation..." — which makes everything before it feel provisional. The reader is left wondering: did any of this actually matter?

The process described is solid (inventory → research → collaborative specification → implementation of tokens → prototyping the build system), but the lack of a landed outcome undermines the whole thing.

## What It Currently Communicates

- You understand design systems deeply
- You're self-directed and can push for initiatives
- You research thoroughly before acting
- You write specifications and get team buy-in

## What It Should Also Communicate

- Why design tokens matter *for the people using the design system* (not just abstractly)
- The specific challenges of introducing systematic thinking into an organization that didn't have it
- How you navigated the politics of changing foundational things that affect everyone
- What you learned from the prototype that would have been missed otherwise
- That even though engineering hadn't implemented yet, significant value was already delivered

## Section-by-Section Analysis

### 1. Opening — The Problem (good diagnosis, but too abstract)
You describe the problem well technically: SCSS variables, hard-coded values, multiple platforms (CSS, Flutter, Figma) out of sync, the logo/typeface change revealing infrastructure gaps.

**Content to add:**
- **Make it human.** Who suffered because of this? Was it designers who had to manually check hex codes across platforms? Was it the Flutter team who had to reverse-engineer SCSS variables? Was it the brand team frustrated that the old logo kept appearing? Give one concrete example of the pain. "When Canonical changed its typeface, designers had to manually update values in [X number of] places across [Y] platforms — and months later, the old typeface was still appearing in [specific place]." That's vivid.
- **How did you identify this as a problem worth solving?** You say you "pushed for" design tokens. What prompted that push? Was it your experience building the Figma libraries (where you had to extract all visual information from source code)? If so, make that connection explicit and early — it shows how one project informed the next.

### 2. Inventory and Audit (good, keep)
The approach of inventorying existing variables and their flows is methodologically sound, and citing Nathan Curtis adds credibility. The connection to your Figma library work giving you a head start is good.

**Content to add:**
- **What did the inventory reveal?** Any surprises? Inconsistencies? How many variables were there? Were there duplicates? Values that contradicted each other across platforms? The inventory is a research activity — share a finding. "The audit revealed [X] unique color values across the codebase, many of which were near-duplicates (differing by 1-2 values in RGBA) created by different developers over time." Something like that.

### 3. Research and Specification (decent, but the naming challenge is underexplored)
You correctly identify naming as the hardest part and mention it's "contentious in larger organizations." But then you don't tell the contentious story.

**Content to add:**
- **What was the naming debate?** This is where the stakeholder management story lives. You had designers, front-end developers, Flutter developers, and possibly product managers who all had opinions about how tokens should be named. What were the factions? Did developers want one convention and designers another? How did you resolve it? This is one of the most relatable challenges in design systems work — anyone who's been through it will nod along.
- **What was the most difficult section of the spec to get agreement on?** Was it naming? Was it the tier/layer structure? Was it how to handle theme-specific tokens? Pick one and tell the story.
- **The collaborative process you describe** (initial draft → discussion meetings → iteration until agreement) is your go-to process and it works. But since you also describe it in the Figma libraries project, you should make the tokens version distinct. What was different about getting agreement on tokens vs. libraries? Was it harder? Were different stakeholders involved?

### 4. Implementation — Creating the Tokens (good content, needs reframing)
The color palette work is interesting, especially the APCA-inspired approach based on contrast rather than lightness.

**Content to add:**
- **Why was this a departure?** You say "we previously didn't have a proper UI palette" and "colors were added on an as-needed basis." Give a sense of the scale of the problem. How many ad-hoc colors existed? Were there colors that were visually indistinguishable but had different values?
- **The systematic approach to color is a design decision, not just an implementation detail.** Frame it that way. You chose to optimize for accessible contrast over perceptual lightness — that's a values-driven choice that affects every designer and developer downstream. What trade-offs did that create?
- **The "at the time of writing" inventory** (primitive dimension tokens, typography tokens, color tokens in progress) reads as a status update. Reframe it as a deliberate sequencing decision. Why did you start with these categories? What was the prioritization logic?

### 5. Result / Prototype (the strongest section, currently underplayed)
Your curiosity-driven exploration of Style Dictionary and the W3C Design Tokens format is actually the most interesting part of this case study, and it's currently positioned as an afterthought ("engineering had not yet moved to implementation, but I was curious...").

**Content to add — and this should be significantly expanded:**
- **What implementation limitations did you discover?** You say "I discovered several implementation limitations that I was able to feed back into the token authoring process." This is the punchline of the entire project and it's one vague sentence. What were these limitations? How did they change the token authoring process? This is incredibly valuable — it shows that your prototype saved the team from problems they would have discovered much later at higher cost.
- **Give a specific example.** "When I attempted to build the color tokens through Style Dictionary, I discovered that [specific limitation] meant our planned [specific approach] wouldn't work. I fed this back to the team and we adjusted [specific thing] before engineering began their implementation." That's a concrete story of a prototype proving its value.
- **The GitHub code explorer embed is a nice touch** but it needs context. What should the reader look at? What's notable about the structure? Don't just embed it — guide the reader.

### 6. Ending (needs complete rewrite)
"Once engineering moves to full implementation..." is a hope, not a result. 

**Reframe the ending around what was actually achieved:**
- A comprehensive inventory of Canonical's visual foundations across platforms
- A collaboratively developed and approved specification/taxonomy
- Token sets for dimensions, typography, and color
- A prototype that validated the implementation approach and caught problems early
- A systematic color palette replacing ad-hoc color choices
- A foundation that multiple platform teams (CSS, Flutter, Figma) could align on

That's substantial work with real deliverables. Frame it as such. The fact that engineering hadn't started consuming the tokens yet doesn't erase the value of the design and specification work.

## Process Line Stages for This Project

```
Noticing the gap → Auditing what exists → Researching approaches → Drafting the taxonomy → Debating naming with the team → Creating token sets → Prototyping the build system → Feeding learnings back
```

The line should have a small loop between "Drafting the taxonomy" and "Debating naming" (the iterative spec process), and a feedback arrow from "Prototyping the build system" back to "Creating token sets" (where prototype discoveries changed the authoring approach). The line could end with a dotted/dashed continuation suggesting ongoing work, rather than a clean endpoint.

## Priority Level for Rewrite

**Medium-High.** The content additions needed are mostly about going one level deeper on specifics — the inventory findings, the naming debate, the prototype discoveries. The biggest structural change is reframing the ending from "not yet implemented" to "substantial foundation delivered." The bones are there; they need flesh and a better conclusion.
