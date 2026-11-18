# BELLA SITE — Hero Redesign Assets (19.11.2026)

The new public homepage hero is staged in this feature branch. Four original transparent PNG assets from the owner-provided `home_update.zip` are required at exactly the paths below:

| GitHub path | Source in home_update.zip | Dimensions |
|---|---|---|
| `public/assets/home-redesign/mountains-light.png` | `home_update/01_mountains_light.png` | 2180×721 |
| `public/assets/home-redesign/rays-left.png` | `home_update/02_rays_left.png` | 1600×1080 |
| `public/assets/home-redesign/river-desktop.png` | `home_update/desktop_river_line.png` | 2400×120 |
| `public/assets/home-redesign/river-mobile.png` | `home_update/mobile_river_line.png` | 900×120 |

**All four original assets have now been added to this branch and their Git blob SHAs match the source ZIP. Do not merge into `main` until the complete Astro build and visual/Safari approval are performed.** The previous source images remain unchanged in `main`. The portrait is reused from `public/assets/images/home-portrait.png`; no generated face or modified photograph is introduced.

The supplied ZIP README mentions separate portrait masks, but they are not present in the ZIP. This iteration implements a sampled polygon `clip-path` on the portrait layer using the supplied desktop river shape. The exact match and Safari quality must be visually confirmed before publication.

The mobile homepage itself remains as previously approved while mobile redesign is on pause.

QA to perform after assets are uploaded: build, visual screenshots 1536 and 1920 plus laptop widths, ensure RU/EN/FR headings fit, verify river overlay and cropped portrait, check desktop nav and public articles, confirm no changes in /admin, D1, R2. Do not claim tests that were not run.
