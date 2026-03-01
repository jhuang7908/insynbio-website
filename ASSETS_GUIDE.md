## InSynBio website — asset drop-in guide

The homepage shows **Case Studies**.
It’s designed for simple “drop-in replacement” of images.

### Where to put images

Place files in:

- `docs/images/`

### Case study images (homepage)

In `docs/index.html`, each case card uses a `<picture>` element with this priority:

1. `.webp`
2. `.jpg`
3. fallback `.svg` placeholder

Add any of these files (recommended: `.webp`) to replace the placeholder automatically:

- `docs/images/case-humanization.webp` (or `.jpg`)
- `docs/images/case-assessment.webp` (or `.jpg`)
- `docs/images/case-vh2vhh.webp` (or `.jpg`)
- `docs/images/case-pd1pdl1.webp` (or `.jpg`)
- `docs/images/case-bispecific.webp` (or `.jpg`)
- `docs/images/case-cart.webp` (or `.jpg`)

Recommended export:

- **1600×900** (16:9)
- **WebP**, ~150–350 KB each

### Privacy / compliance checklist (recommended)

- Remove PDB IDs if confidential
- Remove any client names and internal project codes
- Use neutral captions (“Humanization”, “Interface”, etc.)

