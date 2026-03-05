# Canonical Design Tokens — Content TODOs

---

## TODO 1: Make the problem human

The current opening is accurate but abstract. Who actually suffered because of the lack of design tokens?

**Answer these:**

Can you give a concrete example of the pain? (e.g., "When Canonical changed its typeface, the update had to be made in X places across Y platforms, and Z months later the old typeface was still showing up in [specific product/page]")

```
[Your answer]
```

Who were the people affected? Designers manually checking values? Developers on the Flutter team reverse-engineering SCSS? Brand team frustrated by inconsistency?

```
[Your answer]
```

---

## TODO 2: What prompted you to push for this?

You say you "pushed for and led this effort." That's initiative — tell the story.

**Answer these:**

What was the moment or experience that made you think "we need design tokens"? Was it directly from your Figma library work (where you had to extract visual info from source code)? Something else?

```
[Your answer]
```

Did you have to convince anyone? Was there resistance or was the team receptive? Who did you need buy-in from?

```
[Your answer]
```

---

## TODO 3: What did the inventory/audit reveal?

You did an audit of existing variables and their flows. What did you find?

**Answer these:**

Roughly how many unique variables/values existed? Were there duplicates or near-duplicates?

```
[Your answer]
```

What was the most surprising or problematic finding? (e.g., "We found X color values in the codebase, many of which differed by only 1-2 RGBA points" or "Some variables were defined in three different places with slightly different values")

```
[Your answer]
```

Were there values that contradicted each other across platforms (CSS vs. Flutter vs. Figma)?

```
[Your answer]
```

---

## TODO 4: The naming debate

You correctly identify naming as the hardest part but then don't tell the story. This is where stakeholder management lives.

**Answer these:**

What were the different opinions/factions? Did developers want one naming convention and designers another? Did different platform teams have different needs?

```
[Your answer]
```

What was the most contentious naming decision? How was it resolved?

```
[Your answer]
```

How was the design tokens spec process different from the Figma libraries spec process? (Since you describe a similar collaborative format — what was different about this one? Harder? Different stakeholders? Different dynamics?)

```
[Your answer]
```

---

## TODO 5: The color palette — why this approach?

You mention moving from ad-hoc colors to a systematic palette based on contrast rather than lightness. This is a real design decision with trade-offs.

**Answer these:**

How many ad-hoc colors existed before? Were there colors that were visually indistinguishable but had different values?

```
[Your answer]
```

What trade-offs did the contrast-based approach create? Was anything harder? Did any existing color usage break?

```
[Your answer]
```

---

## TODO 6: The prototype discoveries — THIS IS THE CLIMAX

"I discovered several implementation limitations that I was able to feed back into the token authoring process before engineering began their full implementation." This is currently one vague sentence. It should be the most detailed part of the case study because it proves the prototype was valuable.

**Answer these — be as specific as possible:**

What implementation limitations did you discover in Style Dictionary? (e.g., limitations with composite tokens? Reference resolution? Theme handling? Output format constraints?)

```
[Your answer]
```

How did these discoveries change the token authoring process? What did the team adjust before engineering started?

```
[Your answer]
```

Can you give one specific example? ("When I tried to build [X] through Style Dictionary, I found that [Y] didn't work as expected, which meant our planned [Z] approach needed to change to [W]")

```
[Your answer]
```

---

## TODO 7: Reframe the ending

The current ending ("Once engineering moves to full implementation...") is a hope, not a result. You need to reframe around what was actually delivered.

**Write a new closing here that focuses on concrete deliverables:**

```
[List what was actually completed and delivered: the inventory, the approved spec, the token sets (which categories?), the prototype, the systematic color palette, the implementation learnings fed back. Frame these as the foundation, not as incomplete work.]
```

---

## TODO 8: Sequencing decisions

You mention creating primitive dimension tokens first, then typography, then color. This implies a prioritization logic.

**Answer:**

Why this order? What was the reasoning for which token categories to tackle first?

```
[Your answer]
```
