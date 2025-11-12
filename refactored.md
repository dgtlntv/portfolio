Site Overview

Mobile performance scores trend 72‑88; home and project index pages drag the
average due to inflated LCP/TTI and blocking assets. A single shared CSS bundle
(_slug_.BvhuzIJG.css) blocks first paint everywhere, and unused chunks linger on
multiple routes. Media dominates payloads: hero/gallery images frequently exceed
150 KiB without responsive variants; videos and 3D assets download eagerly.
JavaScript execution—including lit/ASCII media utilities and interactive hero
scripts—keeps main-thread time high on key landing pages. Cross-Site
Recommendations

Break out a critical CSS layer: inline above-the-fold styles per template, defer
the remainder with rel="preload"→rel="stylesheet" or Astro’s CSS partial
hydration to unblock FCP/LCP globally. Standardize an image pipeline: generate
width-targeted srcsets, set explicit dimensions, default to AVIF/WebP under
~100 KiB, and lazy-load any non-critical artwork/carousels. Defer heavy media:
gate STL, video, and animation resources behind interaction or
IntersectionObserver; set preload="none" and lightweight posters so project
pages don’t ship multi-MiB payloads on initial view. Audit JS hydration: convert
rarely-used interactive modules to on-demand/dynamic imports, prune unused
Astro/lit components, and prefer CSS-driven effects where possible to cut
boot-up time. Adopt compression and caching defaults (Brotli/gzip for text,
long-lived immutable cache headers with versioned filenames) to shrink repeat
visits and meet Lighthouse’s text-compression guidance. Next Steps

Implement the shared CSS splitting + media optimizations, then rerun npm run
pagespeed to confirm mobile LCP <4 s and scores converge into the high 80s
site-wide.
