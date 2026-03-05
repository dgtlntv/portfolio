# MAAS Site Manager — Content Analysis & Restructuring Plan

## Current State

This case study has a real problem: it's a project where you designed an entire MVP from concept to delivery, but the write-up spends ~80% of its words on one feature (the map). The map story is good — it shows technical initiative and creative problem-solving — but it completely overshadows the broader UX work you did. A reader finishes this thinking "he solved a map tile problem" instead of "he designed a complex enterprise product for technical users."

## What It Currently Communicates

- You can solve technical constraints creatively
- You prototype and prove feasibility
- You work with developers to navigate trade-offs

## What It Should Also Communicate

- You can design for deeply technical users (a valuable and relatively rare skill)
- You can take a product from concept to MVP
- You conducted or participated in user research that shaped product direction
- You designed complex workflows, not just a map feature
- You made information architecture decisions for a multi-faceted application
- You collaborated with product management, engineering, and other designers throughout

## The Core Problem: Scope vs. Detail

You have two options here:

**Option A:** Keep it focused on the map feature but properly frame it as one part of a larger effort. Add a brief section at the start covering the broader MVP work, then zoom into the map as a deep-dive.

**Option B:** Expand it to cover the full MVP design work, with the map as one (important) section among others.

I'd recommend **Option A** because the map story is genuinely strong and trying to cover an entire MVP in one case study often becomes shallow everywhere. But the framing needs to change so readers understand this was part of much larger work.

## Section-by-Section Analysis

### 1. Opening / Context (needs significant expansion)
The current opening gives good context about what MAAS is and why Site Manager exists. But it moves too quickly to the map.

**Content to add:**
- **Your role, clearly stated.** "I contributed to this project from its inception" — what does that mean specifically? Were you the sole designer? One of two? Did you own the UX end-to-end? Were you embedded in the engineering team? Hiring managers need to understand your scope of responsibility.
- **The broader MVP scope.** Before diving into the map, give readers a sense of what the full product included. What were the key workflows you designed? Site registration? Configuration management? User permissions? Infrastructure overview? List them, even briefly. This prevents the reader from thinking the map *was* the product.
- **The users.** You say "deeply technical IT professionals" — this is good but thin. What did you learn about these users? What makes designing for them different? You were doing something hard and specialised here (enterprise UX for sysadmins). Show that you understand the unique challenges of designing for expert users. How do they think? What do they value? What do they not tolerate?

### 2. Geographic Visualization Challenge (good, but research is hand-waved)

**"Prior user research revealed that users needed geographic awareness"** — this is the biggest missed opportunity in this case study. This sentence is doing enormous work and you give it nothing.

**Content to add:**
- **Who did this research?** Did you conduct it? Participate in it? Inherit findings from a researcher? Be honest about your role.
- **What did the research actually look like?** Interviews? Contextual inquiry? Analysis of support tickets? Survey?
- **What specifically did users say or do that pointed to geographic awareness?** A quote, a scenario, an observed behavior. "During interviews, we found that when a deployment error occurred, the first question users asked was 'which site is affected?' — and they thought about this geographically, not by hostname" — something like that (obviously use what's actually true).
- **Were there competing interpretations of the research?** Did product management want something different from what users said they needed?

### 3. Design Process and Constraints (needs more iteration story)
You show wireframes, which is good, but they're presented as static artifacts rather than evidence of thinking.

**Content to add:**
- **What alternatives did you explore before these wireframes?** Were there non-map solutions considered? A table-based approach? A tree/hierarchy view? Showing what you rejected and why demonstrates design judgment.
- **The scaling problem (30,000 sites) is mentioned but not resolved in the narrative.** How did you solve it? Clustering? Progressive disclosure? Filtering? This is an interesting UX problem — tell the story.
- **"Frequent feedback sessions with other designers and developers"** — pick one session where feedback changed your direction. What did someone point out that you hadn't considered? This shows you're collaborative and responsive to input.

### 4. Technical Roadblock and Alternative Solution (strongest section, minor tweaks)
This is the heart of the case study and it's well-told. The story arc is clear: off-the-shelf solutions don't work → team wants to compromise → you know a better way → you build a proof of concept → you convince the team.

**Content to add:**
- **The persuasion moment needs more texture.** "I convinced the development team that this approach was feasible" — how? Did you present the PoC in a meeting? Did you pair with a developer? Was there initial skepticism? This is a stakeholder management story hiding in a technical story.
- **Concrete numbers.** This is one place where a real metric is naturally compelling and not LinkedIn-y: "Standard map tiles require ~80GB of storage. The optimized tiles I built came in at ~25MB." (Use the real numbers.) That's a factual, dramatic contrast that proves the approach worked.
- **The personal project connection.** You mention rock climbing area detection — this is a nice touch showing how cross-pollination works, but it's one throwaway sentence. One more sentence on what specifically you learned from that project that applied here would make the connection more credible.

### 5. Results and Validation (too thin)
"User testing with internal users validated the approach" — this is the weakest ending for what's otherwise a strong story.

**Content to add:**
- **How was the user testing structured?** Who were the participants? What tasks did they perform? How many sessions?
- **What specifically validated?** "Participants successfully completed tasks without requiring additional map detail" — which tasks? Were there any issues found? Was anything iterated on after testing?
- **What happened after the MVP shipped?** Did usage data confirm the approach? Did users request more map detail? Or did the simplified approach prove sufficient? Any post-launch signal at all.
- **The last paragraph** ("This project demonstrates how taking initiative...") is too self-congratulatory and reads like a cover letter. Cut it. Let the work speak for itself.

## Process Line Stages for This Project

```
Understanding users → Scoping the MVP → Exploring solutions → Wireframing → Developer feedback → Hitting a wall → Prototyping an alternative → Convincing the team → Building → Testing with users
```

The line should have a notable disruption/loop at "Hitting a wall" where it doubles back before moving forward again with the alternative approach. This visually represents the pivot moment that defines the project. A small branch could show the "personal project knowledge" feeding into the prototyping stage from outside.

## Priority Level for Rewrite

**High.** This project has the potential to be your strongest enterprise UX case study if you expand the opening to show full MVP scope, give the user research real substance, and flesh out the validation. The map story is already good — it just needs to be properly contextualized within a larger design effort.
