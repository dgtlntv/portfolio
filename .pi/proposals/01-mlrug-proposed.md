# MLRUG — Proposed New Version

> This is a prose proposal. Once approved, it will be integrated back into the MDX file with all the existing image galleries, FloatContent components, and frontmatter intact.

---

## Changes Summary

- **Opening:** Completely rewritten. Leads with the designer-as-curator thesis and signals AI fluency + versatility without being heavy-handed.
- **Data Collection:** Tightened. Same content, fewer words, crisper decision logic.
- **Algorithm and Computing:** Collapsed from two paragraphs to one short paragraph. Cuts GPU specs, Paperspace details, parameter talk.
- **Initial Results:** Reframed from "not perfect" to what the outputs revealed — the diamond motif discovery, the uncanny valley quality, and the nuanced conclusion about AI as inspiration vs. replacement.
- **From Digital to Physical:** Restructured. Leads with the collaboration with Ida, explains what her expertise changed, and frames the conceptual parallel honestly (central to the framing, not to the technical process). StyleGAN2-ada section sharpened around the data quality lesson.
- **Production and Collaboration:** Significantly expanded. The communication process (printing A4 pages, eyeballing), why Morocco was the obvious and only right choice, the charm of low-fidelity interpretation, and the "another layer of pattern migration" insight.
- **Exhibition:** Added honest reflection on reception (surprise at no AI backlash, the "done tastefully" quality). Cover magazine section kept as-is.

---

## Proposed Text

### Opening (no heading — the intro paragraph)

In 2019, well before Stable Diffusion, ChatGPT, or any of the generative AI tools that are now commonplace, a recurring discussion in my university's design theory lectures caught my attention: the idea that generative algorithms would increasingly play a role in the design process, potentially shifting the designer's role from creator to curator. These conversations were always theoretical. I wanted to find out what that shift actually felt like in practice.

This led to a project that stretched across six years, from my time at university to an exhibition at Design Month Graz in 2025. Along the way it became a collaboration with my sister and my father, moved from digital generation to physical production in Morocco, and gave me a hands-on understanding of machine learning that goes well beyond using off-the-shelf AI tools. I've come to understand how these systems work on a technical level — what it takes to train them, how data quality shapes output quality, and where their capabilities end. That understanding informs how I work with AI today, whether in an artistic context like this one or in my professional design work.

### Data Collection

I started this project years before many of the impressive AI tools we have today existed. The only realistic way for me to conduct this experiment was to train my own algorithm.

The most important decision was what data to train on. I needed a design object I understood well, for which I could obtain enough images, and that could be represented in two dimensions. Moroccan carpets were the natural choice: my father trades with them, giving me access to a high-quality photo archive. I supplemented his collection with images gathered using a web crawler, arriving at roughly 3,000 images. Not a huge dataset in machine learning terms, but enough for a first experiment.

### Algorithm and Computing

After evaluating several architectures, I chose HyperGAN — a framework specifically designed to lower the barrier to entry for artists and designers. When local hardware proved insufficient, I moved to cloud-based GPU computing and ran a series of training experiments at different resolutions and parameters.

### Initial Results

Even with a limited dataset and a relatively simple architecture, the results were instructive. The algorithm had already picked up on the diamond motif — one of the most characteristic and recurring elements in Moroccan carpet design. But the outputs had the uncanny valley quality typical of early image generators: shapes that looked plausible at a distance but fell apart under closer inspection.

This taught me something nuanced about AI as a design tool. Even at this early stage, the algorithm was identifying the most dominant visual patterns in the data. But it couldn't yet combine them in ways that were compositionally interesting or usable. It was clear that generative AI at this scale wasn't going to replace a designer's judgment — but it could serve as a source of raw material. Something to curate from, not to use directly. That distinction — designer as curator rather than creator — became the operating principle for the rest of the project.

### From Digital to Physical

I set the project aside after these first experiments. Several years later, I returned to it together with my sister Ida, who was working on her master's thesis on the historical development of patterns in Moroccan carpets.

Ida brought an art-historical framework that grounded the project in a way my original experiment lacked. Traditional Moroccan carpet patterns evolved through geographical migration across the Mediterranean, absorbing influences from Berber, Arab, Moorish Andalusian, and Ottoman cultures. Motifs spread and transformed as they moved between urban manufactories and rural communities. Ida and my father — whose knowledge of Moroccan carpet history and culture runs deep — helped us see a parallel between this centuries-old analog pattern evolution and what a machine learning algorithm does when it processes a dataset: absorbing, blending, and recombining visual influences into something new.

This conceptual framework didn't fundamentally change how we trained the algorithm, but it transformed how we thought about the project. It shaped what we were looking for when curating outputs, and it became central to how we presented the work.

For this second iteration, I switched to StyleGAN2-ada, a variant specifically designed for training with smaller datasets. Combined with a more carefully curated training set — my father's high-quality archive supplemented by internet images that Ida and I selected for their design, historical, and artistic relevance — the results improved dramatically. The leap in quality demonstrated two things: how rapidly machine learning had evolved in a few short years, and how much difference thoughtful data curation makes. Good data isn't just more data; it's data selected with understanding and intent.

### Production and Collaboration

Producing the carpets in Morocco was the obvious choice. We had trained on Moroccan carpets, so bringing them to life through traditional Moroccan production wasn't just appropriate — it was the only approach that made sense.

The alternative would have been Indian or Nepalese manufactories, where machine-assisted production can reproduce a design nearly pixel-for-pixel, or rather knot-for-knot. The result is a faithful reproduction, but it lacks the character of the traditional Moroccan approach. In the workshops of the western Middle Atlas, where my father has collaborated with a producer for several years, things work differently. The process is low-tech. We sent our generated designs as image files, which the workshop printed on a local printer on A4 pages. The weavers work from these printouts by eye, interpreting the design rather than mechanically reproducing it.

This means every rug is a unicate — a one-off piece shaped by the weaver's interpretation. What gets "lost" in translation is exactly what makes the result interesting. The weaver's hand introduces the same kind of improvisational quality that has always characterized Moroccan carpets. And there's something conceptually satisfying about it: the pattern has now been transformed yet again. It migrated from historical carpets into a training dataset, was recombined by an algorithm, curated by us, and then reinterpreted by a human weaver. Each step is another layer in an ongoing process of pattern transformation — not unlike the centuries of cultural migration that created the source material in the first place.

### Exhibition & Trade Magazine Features

These algorithmically generated, curated, and handcrafted rugs were presented as part of Design Month Graz 2025.

The reception was more positive than I had expected. There is no shortage of AI-generated work in the world right now, and much of it provokes skepticism — particularly when it encroaches on traditional craft and art. But the response to this project was genuinely warm. I'd like to think that's because the work was done with enough care and intention to avoid feeling like AI slop: a purpose-built dataset, traditional production, and a clear conceptual framework.

The project was featured in two articles in Cover, a leading publication in handmade carpets and textiles for interiors. Lucy Upward's feature explored the project's conceptual framework, examining how AI's pattern-learning process mirrors the historical migration of motifs along ancient trade routes. Denna Jones's analysis used MLRug as a case study for ethical AI implementation in design — keeping production in the country that inspired the work and building a purpose-built dataset to avoid copyright concerns.

---

## What Stayed the Same
- All image galleries (data collection, initial results, generated designs, production, exhibition)
- All FloatContent positioning
- The references section
- The frontmatter (stats, process stages, cover image)

## What Changed
| Section | Before | After |
|---|---|---|
| Opening | Buries the thesis in paragraph 3 | Leads with designer-as-curator + AI fluency signal |
| Algorithm & Computing | 2 paragraphs of technical detail | 1 short paragraph, keeps deliberate tool choice + resourcefulness |
| Initial Results | "Not perfect but reasonable" | Diamond motif discovery, uncanny valley observation, nuanced AI-as-tool conclusion |
| From Digital to Physical | Dense academic paragraph about pattern migration, then brief StyleGAN mention | Ida's contribution clearly explained, conceptual framework positioned honestly, data quality lesson emphasized |
| Production | 3 short paragraphs, abstract | Expanded with concrete process (A4 printouts, eyeballing), why Morocco was the only right choice, pattern-migration-cake insight |
| Exhibition | No personal reflection | Added honest note on positive reception and the "done tastefully" quality |
