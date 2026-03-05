# MLRUG — Content Analysis & Restructuring Plan

## Current State

The project reads as a chronological personal narrative. It's well-written and genuinely interesting, but it doesn't help a hiring manager understand what you're capable of professionally. The structure is: "I had a thought → I collected data → I ran an algorithm → results were okay → I revisited it → we made physical rugs → we exhibited them."

There's no framing of *why* this matters to someone hiring a designer.

## What It Currently Communicates

- You're curious and self-motivated
- You can work on long-term projects
- You have technical chops (ML, cloud computing)
- You collaborate with family

## What It Should Also Communicate

- You can work within constraints and make deliberate decisions
- You can collaborate across disciplines with people who have very different expertise
- You understand the tension between digital tools and physical craft
- You can curate and make editorial decisions (the "designer as curator" thesis)
- You can manage a project from concept through production to public presentation

## Proposed Structure

### 1. Opening — The Question (keep, but sharpen)
Your current opening about the design theory lecture is good, but it buries the lead. The interesting thesis — "the role of the designer shifts from creator to curator" — should be the hook, not the third sentence. And you should briefly signal that this project will show you working across disciplines, managing production, and exhibiting publicly. Give the reader a reason to keep going.

**Content to add:** A brief framing sentence that positions this as relevant beyond a personal experiment. Something that connects the "designer as curator" idea to how you think about design more broadly.

### 2. Data Collection (keep, tighten)
This section is fine but could be more concise. The key decisions are:
- Why Moroccan carpets (familiarity + data access + image-representable)
- How you sourced data (father's archive + web crawler)
- The constraint of only ~3,000 images

**Content to add:** Nothing major. Just tighten. The decision-making logic here is good — make it crisper.

### 3. Algorithm and Computing (trim significantly)
This section is too technical for what it needs to communicate. A hiring manager doesn't need to know about GTX1050 vs cloud GPUs or that Paperspace runs on DigitalOcean. 

**What to keep:** You chose HyperGAN because it was designed for artists/designers (that's a deliberate tool choice), and you had to figure out cloud computing because local hardware wasn't sufficient (that's resourcefulness).

**What to cut:** The specific GPU model, Paperspace details, parameter specifics. Two sentences max.

### 4. Initial Results (keep, reframe)
Currently reads as "the results weren't great." Reframe around what you *learned*: that small-scale generative AI at this point wasn't a replacement for design but could serve as inspiration. That's actually an interesting and nuanced finding.

**Content to add:** What specifically about these outputs was useful as inspiration? What did you notice about what the algorithm captured vs. missed about Moroccan carpet design? This is where "designer as curator" becomes concrete — you were evaluating outputs against your understanding of the craft. Talk about that curatorial judgment.

### 5. From Digital to Physical — The Collaboration (expand significantly)
This is currently your richest section but it's underwritten. The collaboration with your sister Ida and the conceptual parallel between historical pattern migration and AI pattern generation is genuinely compelling.

**Content to add:**
- How did the collaboration with Ida work in practice? How did her art-historical expertise influence which outputs you selected or how you evaluated them? This is a cross-disciplinary collaboration story — tell it.
- The move to StyleGAN2-ada and better data: you mention it briefly but the lesson here — that data quality matters enormously — is worth a beat more. What did "more carefully selected" mean? What was your curation criteria?
- The conceptual framework (trade route pattern evolution vs. AI pattern evolution) is fascinating but currently feels dropped in. Either develop it into a real point or simplify it to a sentence.

### 6. Production and Collaboration (expand — this is the stakeholder/collaboration gold)
This is where the project gets truly interesting from a professional perspective and it's currently rushed. You made a deliberate decision about *where* and *how* to produce these rugs. That's a values-driven design decision with real trade-offs.

**Content to add:**
- Why Morocco over India/Nepal specifically? You mention "precision technology" vs. "character and vitality" but this deserves more. What was the trade-off? What did you lose by choosing Morocco? What did you gain? This is a design decision with constraints.
- How did working with the producer actually work? You mention your father's existing relationship, but what was the communication process? How did you convey algorithmic outputs to a traditional craftsperson? Were there misunderstandings? Adaptations? This is the most interesting part of the entire project and it gets one paragraph.
- "A living interpretation that preserved the improvisational qualities" — this is a great line but it's doing heavy lifting with no support. Show an example. How did the produced rug differ from the digital output? Was that difference a problem or a feature?

### 7. Exhibition & Press (keep, slight reframe)
This section is fine. The press coverage is legitimate validation.

**Content to add:** One sentence about what it was like to present this work publicly. What questions did people ask? What surprised you about the reception? This humanizes the ending.

## Process Line Stages for This Project

```
Questioning → Gathering → Experimenting → Evaluating → Revisiting → Collaborating → Producing → Exhibiting
```

The line for this project should be long and winding with a visible gap/pause between "Evaluating" (2019 results) and "Revisiting" (the collaboration with Ida years later). The line should branch when Ida joins. This reflects the actual non-linear, years-long nature of the project.

## Priority Level for Rewrite

**Medium.** This project will never be the one that convinces a hiring manager of your professional UX skills. Its job is to show personality, curiosity, and range. The restructuring should make it easier to follow and bring out the collaboration/decision-making angles, but don't over-professionalize it — that would kill what makes it interesting.
