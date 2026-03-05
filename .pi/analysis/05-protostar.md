# Proto* — Content Analysis & Restructuring Plan

## Current State

This is your best professional case study in terms of demonstrating a full UX process. It has a clear arc: research need → tooling gap → creative solution → research execution → synthesis → sharing findings → tool becomes its own product. The story naturally demonstrates initiative, resourcefulness, and end-to-end research skills.

The main problem is that it undersells itself at nearly every stage by staying surface-level. You show images of research documents but don't share what's in them. You mention insights but only detail one. You describe the tool but don't dwell on the design decisions within it.

## What It Currently Communicates

- You can plan and execute user research independently
- You're resourceful when tools don't exist
- You can code functional prototypes
- You synthesize research into actionable recommendations
- You share tools with the community

## What It Should Also Communicate

- The depth and rigor of your research methodology
- What you actually *learned* from the research (not just that you did it)
- How research findings translated into specific design recommendations
- How you communicated findings to stakeholders who may not value UX research
- The design thinking behind Protostar itself (not just that you built it)

## Section-by-Section Analysis

### 1. Opening / Context (good, keep mostly as-is)
The setup is clear: MAAS Anvil approaching beta, team wants to identify usability gaps and test feature implementation options. Good context.

**Content to add:**
- **What was the team's attitude toward user research?** Was this a team that regularly did research, or was this new for them? If the latter, how did you convince them it was worth the time investment before a beta launch? That's a stakeholder management story.
- **What were the "several implementation options" for the new features?** You mention them but never say what they were. Even one sentence — "the team was considering whether to implement vault integration as an interactive wizard or as a configuration file approach" — gives the reader something concrete to hold onto.

### 2. The Prototyping Problem (strong section)
The breakdown of why existing tools don't work for CLI testing is well-argued:
- Figma: can't type commands
- Documents: no interaction depth  
- Coded CLI: installation barrier with security-conscious sysadmins

This is good problem analysis. It's clear and logical.

**Content to add:**
- **The sysadmin insight is gold and you should lean into it harder.** "System administrators who are understandably skeptical about installing unknown packages on their systems" — this shows you understand your users deeply. Expand this slightly: what else did you know about these users that informed your approach? Did you know they'd be testing from locked-down environments? That they'd be SSH-ing into remote machines?

### 3. Building the Prototype ("hacked together on a Friday afternoon")
The casual framing works for personality, but it undersells the work.

**Content to add:**
- **What design decisions did you make for the prototyping tool itself?** You used xterm.js, but how did you decide what fidelity the prototype needed? Could users only follow a script, or could they explore freely? How did you handle "wrong" commands? Did you provide error messages? These are interaction design decisions, even in a quick hack.
- **How did you define the prototype scenarios for MAAS Anvil?** You had "different feature implementation options" to test — how did you structure the prototype to let users experience each option? Was it branching paths? Separate sessions? This is test design.

### 4. User Testing Sessions (needs significant expansion — this is the heart of the project)
You show one image of a testing session and say insights were "substantially better than static mockups." But this section should be the richest part of the case study.

**Content to add:**
- **How many sessions did you conduct?** With whom? How did you recruit participants? Were they internal users, external customers, or both?
- **What happened during sessions?** Pick one memorable moment. Did a participant do something unexpected? Did they misunderstand something fundamental that revealed a bigger issue? Did they find a workaround you hadn't considered? One vivid anecdote from a session is worth more than ten summary statements.
- **How did participants react to the CLI prototype tool?** Did the browser-based approach work smoothly? Were there moments where the prototype's limitations affected the research? Being honest about this adds credibility.
- **What were the key findings beyond documentation?** You mention documentation as "one of the biggest insights" but that implies there were others. What were they? The images show a "Key takeaways" table with categories for Learnability, Efficiency, Error Tolerance, and Security — but you don't discuss any of these. Share at least 2-3 specific findings. For example: "Users expected [X] but the tool did [Y]" or "The vault integration workflow had a critical error recovery gap where users could get into a state they couldn't recover from."

### 5. Sharing Insights (thin — needs the stakeholder story)
"I presented all of this to my stakeholders in a meeting. The research and the suggestions were received well."

This is the most undersold moment in your entire portfolio. You took research from planning through execution to synthesis to presentation, and you summarize the stakeholder interaction in two sentences.

**Content to add:**
- **How did you structure the presentation?** UX heuristics matrix is mentioned — why did you choose that framework? Was it because the audience (likely developers and product managers) would respond better to a structured framework than raw qualitative data?
- **What was the team's reaction to specific findings?** Were any findings surprising to them? Were any contentious? Did the team push back on any recommendations? Did anything you proposed get rejected?
- **What actually changed as a result?** "The team looked into how to fix the identified issues" is extremely vague. Which issues were prioritized? Which were deferred? Did any of your recommendations ship before the beta? This is the impact story.

### 6. Documentation Contribution (nice, but brief)
Writing docs and help messages based on research findings is a great example of going beyond your role. Keep this.

**Content to add:**
- **One example of a specific improvement.** "Users consistently misunderstood what the `--manifest` flag did, so I rewrote the help message from [before] to [after]" — something concrete that shows research directly informing a specific change.

### 7. Proto* as Open Source Tool (good closing)
The evolution from research hack to open-source tool is a strong ending. The FOSDEM mention adds credibility.

**Content to add:**
- **What did you change between the "Friday hack" and the public release?** What features did you add? What did you learn from other Canonical designers using it that shaped the tool? This is a mini product development story within the larger case study.
- **Any usage signals?** GitHub stars, forks, issues from external users? Not as vanity metrics, but as evidence that the tool fills a real gap.

## Process Line Stages for This Project

```
Defining research goals → Aligning with the team → Discovering a tooling gap → Building a prototype tool → Planning the study → Running sessions → Analyzing findings → Presenting to stakeholders → Improving the product → Open-sourcing the tool
```

The line should have a notable branch/offshoot at "Discovering a tooling gap" where a side path goes to "Building a prototype tool" and then rejoins the main research flow. This visually represents how the tool creation was a detour-that-became-a-product within the larger research project. At the end, the line could fork: one path going to "Improving the product" (MAAS Anvil) and another to "Open-sourcing the tool" (Protostar).

## Priority Level for Rewrite

**Highest.** This should arguably be your #1 or #2 project. It demonstrates the most complete professional skillset: research planning, methodology design, creative problem-solving, user testing, synthesis, stakeholder communication, and even tool creation. Every section just needs to go one level deeper with specifics. The structure is already right — it just needs flesh on the bones.
