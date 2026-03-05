# Process Line Component — Architecture Proposal

## The Goal

A visual side element on each project page that communicates the design process at a glance — without forcing every project into an identical template. The line should feel organic and honest: sometimes messy, sometimes looping back, sometimes branching. Each project gets its own shaped line, but they're all built from the same component system.

## Core Idea: Data-Driven SVG Path

Rather than hand-drawing a custom SVG for each project, the component generates an SVG path from a **declarative data structure** defined per project. You describe *what happened* (the stages, their relationships, any loops or branches) and the component renders the line.

The artistic control comes from two layers:
1. **Per-project configuration** — the stages, their order, and structural features (loops, branches, pauses)
2. **Global styling** — the line's visual character (stroke style, animation behavior, squiggle intensity)

## Data Structure (per project, in frontmatter or a config)

Each project defines its process as an array of stages with optional modifiers:

```typescript
interface ProcessStage {
  label: string                           // "Understanding users"
  id: string                              // unique identifier
  type?: "default" | "branch" | "merge"   // structural behavior
  branchFrom?: string                     // id of stage this branches from
  mergesInto?: string                     // id of stage this merges back into
  style?: {
    loop?: boolean                        // does the line loop back here?
    pause?: boolean                       // visual gap (e.g., years-long pause in MLRUG)
    dashed?: boolean                      // dotted/dashed line (ongoing/unfinished)
    intensity?: number                    // how "squiggly" this segment is (0-1)
  }
}
```

### Example: Proto* project

```yaml
process:
  - id: goals
    label: Defining research goals
  - id: align
    label: Aligning with the team
  - id: gap
    label: Discovering a tooling gap
  - id: tool
    label: Building a prototype tool
    type: branch
    branchFrom: gap
  - id: planning
    label: Planning the study
    type: merge
    mergesInto: tool  
  - id: sessions
    label: Running sessions
  - id: analysis
    label: Analyzing findings
  - id: presenting
    label: Presenting to stakeholders
  - id: improving
    label: Improving the product
  - id: opensource
    label: Open-sourcing the tool
    type: branch
    branchFrom: presenting
```

### Example: MLRUG

```yaml
process:
  - id: questioning
    label: Questioning
  - id: gathering
    label: Gathering
  - id: experimenting
    label: Experimenting
  - id: evaluating
    label: Evaluating
    style:
      pause: true          # years-long gap before next stage
  - id: revisiting
    label: Revisiting
  - id: collaborating
    label: Collaborating
    type: branch
    branchFrom: revisiting  # Ida joins
  - id: producing
    label: Producing
  - id: exhibiting
    label: Exhibiting
```

### Example: Design Tokens

```yaml
process:
  - id: noticing
    label: Noticing the gap
  - id: auditing
    label: Auditing what exists
  - id: researching
    label: Researching approaches
  - id: drafting
    label: Drafting the taxonomy
    style:
      loop: true           # iterative spec review
  - id: debating
    label: Debating with the team
  - id: creating
    label: Creating token sets
  - id: prototyping
    label: Prototyping the build system
  - id: feeding-back
    label: Feeding learnings back
    style:
      dashed: true         # ongoing/continuing work
```

## Rendering Approach

### SVG Path Generation

The component takes the stage array and generates an SVG path. The key insight: you don't need a fully custom SVG per project. You need a **path generator** that translates the data structure into an SVG `<path>` element with the right shape.

```
Stages array → Layout algorithm → SVG path coordinates → Rendered line
```

**Layout algorithm behavior:**
- Default stages: the line progresses downward (since the content scrolls vertically)
- `loop: true`: the path curves back on itself before continuing (a small backward loop)
- `pause: true`: a visible gap in the line (broken stroke or increased spacing)
- `branch`: the path forks into two lines
- `merge`: a forked line rejoins the main path
- `dashed: true`: the stroke becomes dashed

### The "Squiggle" Factor

The line should never be perfectly straight. To achieve the hand-drawn quality:

1. **Perlin noise or simplex noise** applied to the path coordinates gives organic wobble
2. A `intensity` parameter per segment (or globally) controls how much wobble
3. The noise seed can be derived from the project slug, so each project gets a consistent but unique wobble pattern

You could use a library like `svg-path-commander` or simply generate cubic bezier curves where control points are offset by noise values.

### Scroll-Linked Animation

As the user scrolls through the project content, the line draws itself using `stroke-dashoffset` animation tied to scroll position. Each stage label appears when the line reaches it.

**Implementation options:**
- **CSS `scroll-timeline`** — modern, performant, no JS needed, but limited browser support
- **Intersection Observer** — trigger animations as sections enter viewport. More compatible.
- **Scroll-driven via JS** (e.g., `scrollY` listener with `requestAnimationFrame`) — most control, slightly more complex

I'd recommend **Intersection Observer for stage labels** (they appear as you scroll to each section) combined with **`stroke-dashoffset` animated via CSS** (the line draws as you scroll). This avoids heavy JS scroll listeners while keeping it smooth.

### Connecting the Line to Content

The line needs to "know" which content section corresponds to which stage. Two approaches:

**Option A: Anchor-based (recommended)**
Each `## Heading` in the MDX content maps to a stage `id`. The component reads the headings from the rendered content and positions stage markers accordingly. This means the line automatically aligns with the actual content sections.

You'd need a convention: stage IDs match heading slugs, or you add an explicit mapping in frontmatter:

```yaml
process:
  - id: understanding
    label: Understanding the problem
    anchor: understanding-the-problem  # matches the ## heading slug
```

**Option B: Proportional positioning**
Stages are evenly distributed along the line's length, independent of content sections. Simpler but less meaningful — the line becomes decorative rather than structural.

I'd go with **Option A**. It means the line genuinely reflects the content structure, and hiring managers scrolling through can use it as navigation.

## Component Architecture (Astro + Lit)

Given your stack (Astro, Lit web components, Tailwind), here's how the component could be structured:

```
src/components/features/process-line/
  ProcessLine.ts          # Lit web component (client-side interactivity)
  pathGenerator.ts        # Pure function: stages[] → SVG path data
  noiseUtils.ts           # Perlin/simplex noise for squiggle effect
  types.ts                # ProcessStage interface
```

### Why a Lit Web Component?

- Consistent with your existing pattern (ThreeScene, AsciiMedia, etc. are all Lit)
- Needs client-side JS for scroll-linked animation and interactive states
- Encapsulated styles via Shadow DOM

### Component API

```html
<process-line
  stages='[...]'          <!-- JSON string of ProcessStage[] -->
  project-slug="protostar" <!-- used as noise seed for consistent wobble -->
  position="right"         <!-- which side of the content -->
/>
```

Or, since the data lives in frontmatter, the Astro wrapper passes it down:

```astro
<!-- In ProjectContent.astro or Article.astro -->
{project.data.process && (
  <process-line
    stages={JSON.stringify(project.data.process)}
    project-slug={project.data.slug}
  />
)}
```

## Visual Design Notes

### Position
Fixed/sticky to the side of the content column as you scroll. On your current layout (`md:col-span-7 md:col-start-2`), there's space in the left gutter on desktop. On mobile, it could collapse to a horizontal bar at the top or be hidden entirely — it's supplementary, not essential.

### Stage Labels
Small, understated text alongside the line. Maybe appearing on hover or as you scroll to that section. They shouldn't compete with the content for attention.

### Active State
The current stage (based on scroll position) could be highlighted — slightly bolder line, brighter label. Previous stages could be slightly faded. This gives a subtle "you are here" quality.

### Line Style
- Thin stroke (~1.5-2px)
- Color: something subtle — a muted version of your accent color, or a warm gray
- Squiggle should be gentle, not chaotic. Think "hand-drawn with a steady hand" not "scribble"
- Loops should be small and elegant, not dramatic
- Branches should diverge at gentle angles, not sharp forks

### What to Avoid
- The line becoming the main visual attraction. It should be peripheral, noticed on second glance.
- Too much animation. A subtle draw-on is enough. No bouncing, pulsing, or particle effects.
- Labels that are too prominent. They're wayfinding, not headlines.

## Why This Architecture Works

1. **No custom component per project.** One `ProcessLine` component, configured per project via data in frontmatter.
2. **Artistic control via the data structure.** Loops, branches, pauses, squiggle intensity — all controllable per stage without touching component code.
3. **Consistent but unique per project.** The noise seed ensures each project's line has its own character while the rendering logic stays shared.
4. **Progressive enhancement.** The line is supplementary. If JS fails or the viewport is too small, the content works perfectly without it. It's an enhancement layer, not a structural dependency.
5. **Content-connected.** By anchoring stages to content headings, the line serves as both a process indicator and a subtle navigation aid.
