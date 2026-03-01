## InSynBio website — asset drop-in guide

The homepage shows **Case Studies** and a **Structure Gallery**.
Both are designed for simple “drop-in replacement” of images.

### Where to put images

Place files in:

- `docs/images/`

### Case study images (homepage)

In `docs/index.html`, each case card uses a `<picture>` element with this priority:

1. `.webp`
2. `.png`
3. fallback `.svg` placeholder

Add any of these files (recommended: `.webp`) to replace the placeholder automatically:

- `docs/images/case-humanization.webp` (or `.png`)
- `docs/images/case-assessment.webp` (or `.png`)
- `docs/images/case-vh2vhh.webp` (or `.png`)
- `docs/images/case-affinity.webp` (or `.png`)
- `docs/images/case-cdr.webp` (or `.png`)

Recommended export:

- **1600×900** (16:9)
- **WebP**, ~150–350 KB each

### Structure gallery images (homepage)

Add any of these files (recommended: `.webp`) to replace placeholders automatically:

- `docs/images/structure-1.webp` (or `.png`)
- `docs/images/structure-2.webp` (or `.png`)
- `docs/images/structure-3.webp` (or `.png`)
- `docs/images/structure-4.webp` (or `.png`)
- `docs/images/structure-5.webp` (or `.png`)
- `docs/images/structure-6.webp` (or `.png`)

Recommended export:

- **1600×1000** (16:10) or **1600×900** (16:9)
- **WebP**, ~150–450 KB each

### Privacy / compliance checklist (recommended)

- Remove PDB IDs if confidential
- Remove any client names and internal project codes
- Use neutral captions (“Humanization”, “Interface”, etc.)

