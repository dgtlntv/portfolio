# Canonical's Figma Libraries — Content TODOs

> How to use: Dump bullet points, half-sentences, rough thoughts under each TODO. Don't worry about grammar, flow, or repetition. I'll turn it into proper prose afterwards.

---

## TODO 1: Scale and context

How big was the team? How many product teams? Roughly how many components in the old library? How many unofficial local libraries had popped up?

```
30 designers in the team.
I think around 12 product teams
56 components had to be build
maybe like 5 unofficial libraries
```

---

## TODO 2: What did the survey and feedback reveal?

The 2-3 most important or surprising findings. What was the #1 frustration? Was there a gap between what designers said they wanted vs what they actually needed?

```
- people did not like the baked in spacing to align text to a global baseline (mentioned more below). It was the biggest reason for high detachment rates
- we found that people sometimes have trouble finding the component they are looking for because they could not remember the right name anymore. they then usually try to use other synonynoumus names usually used for this sort of component. Thats why we added keywords to the description of the components. when searching figma also uses description for search.
- they most often use the assets panel. further making keywords nice (cus if they xplored otherwise in the file itself keywords would be usels)
```

---

## TODO 3: What was debated in the spec?

### Spec summary

A 20-page specification covering how to set up, manage, structure and update the Figma libraries. Went through 5 collaborative writing sessions with the team before approval.

**Major sections and decisions:**
- **Library architecture:** Split into four library types (Assets, Core Components, Domain Components, Utilities) rather than one monolithic library. Foundational elements (color, type, spacing) co-located with core components for now, with the option to separate later if scaling demands it.
- **UX of components vs. source of truth:** Established that component usability takes precedence over strict code parity. A 99% accurate component that everyone uses is better than a 100% accurate component that everyone detaches from.
- **Component building guidelines:** Performance-focused rules around layer counts, a soft limit of 7 properties per component to avoid "property soup," strategies for reducing layers (instance swapping over hiding, component splitting, lite local versions as a last resort).
- **Contribution process:** Libraries made read-only for the team. A PR-like workflow: work in a separate file, get reviewed against a checklist, then a library manager merges and publishes. Modeled on how engineering handles version control.
- **Variables and naming:** Variables preferred over styles. Naming follows sentence case with natural language (e.g. "has Icon"). A shared spreadsheet tracks common property names across libraries for consistency.
- **Component lifecycle:** Status/risk system per component, deprecation process with timeline and communication, changelog per component.
- **Tracking pixel for detachment metrics:** An invisible pixel with a specific naming scheme baked into each component, allowing custom detachment statistics to be generated via the Figma REST API.

### What was contentious

**UX vs. source of truth, specifically baseline alignment:** This was the biggest debate. Vanilla (the CSS framework) implements a baseline alignment mechanism that adds spacing nudges to align text to a baseline grid. Some designers were adamant about maintaining this in Figma. Others preferred not to design with it. The old library had it baked in, and it turned out to be one of the biggest drivers of component detachment, designers would detach just to remove the baseline spacing. The compromise: the new library uses a Figma mode where baseline alignment is off by default but can be enabled. This satisfied both camps while reducing detachment.

**Library architecture, how many libraries:** There was concern about creating too many separate libraries. The compromise was to combine foundational elements (color, type, spacing) with core components in a single library rather than splitting them out, keeping the number of libraries manageable while leaving the door open to separate later if needed.

**What wasn't contentious:** The PR-like contribution process and read-only libraries were accepted without much pushback. Everyone wanted less messy libraries, and nobody has complained since (probably because the libraries were maintained well). The 7-property limit and the tracking pixel were also non-controversial.

---

## TODO 4: Leading junior designers

How many juniors? How did you divide work? How did you keep things consistent (guidelines, reviews, pairing)?

```
1 other junior designer
worked with them so they could work on what they found interesting and they felt like they could learn something
we did regular reviews for stuff they implemented.
guidelines were just the spec we wrote. we both followed it
```

---

## TODO 5: What the metrics tool revealed

What was the tool technically? One specific example of a metrics insight that led to action (e.g. a component with high detachment that revealed a missing feature).

```
the tool is a typescript script that runs in a github action. which creates a json file of the data which is then commited to the repo. this data is then read by a website to display the data in a data viz. most helpful was that we were able to understand the adoption rates of the new library. which allowed us to confidently deprecate the old library without disrupting work flows
```

---

## TODO 6: The transition — concrete details

How long was it? Were teams slow to adopt? How did you handle that? What was the actual adoption state at the end — not "strong adoption" but what specifically?

```
the transition period were 6 months (the timeframe we also plan roadmaps in). during this time we tracked adoption rates and talked with designers to understand why some adoptions were slower than others. by the end of thetransition period for new projects was around 80%. We had several files that which e.g. were updates to prebiously designed features stuff like that. of course for those the designers would not completely rebuild those files. Because of these types of files we would have components of the old library hold on longer. But we were not too concerened by those. adoption in new files was good. so long term these older stragglers would die out and we would have full adoption
```

---

## TODO 7: How you went from "we should fix this" to leading the effort

Did you pitch it? Just start doing it? Was there resistance to rebuilding from scratch vs iterating? What kicked it off?

```
what kicked it off - old library not working properly for most designers. including me.
i started building my own library so i could move fast enough to keep up with design work required to keep up with pace of design work requried for the product i was working on.
Was proposing to update the old library which was not accepted initially the need was not seen by the maintainer of the old library. at some point management in the design team understood though what a detrement the old library had on team efficiency and I was allowed to lead creating a new fully properly working library. based on actual needs from team
```

---

## TODO 8: The public release

Was it always planned or did confidence from internal metrics lead to it? What motivated making it public?

```
was always planned. we are an open source company. so sharing comes naturally to us. as design department we want to be open too
```
