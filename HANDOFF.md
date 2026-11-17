# BELLA SITE — HANDOFF

## Status
Cloudflare Pages preview: https://bella-shamilevna.pages.dev/ (user confirmed deployed and browser screenshots). GitHub: dmitriyribka27/bella_shamilevna. Desktop homepage in visual refinement; not approved as final. No CMS/D1/R2. No mobile implementation.

## Source of truth
Approved homepage PNG at 1536×1024 and technical brief dated 2026-11-16. Do not redesign without approval.

## Changes
Adjusted desktop alignment to reference coordinates: hero full-width, title offset, portrait and decorative graphics, header grid. Normal vertical scrolling is intended; no artificial one-screen height constraint.

## Outstanding
Actual post-change browser screenshot needed. Wave crop, paper texture, exact typography, header/footer icons and verified contact links remain incomplete. Publication titles/content are temporary design data. Build/visual test for this commit not independently confirmed.

## Next
Inspect updated Cloudflare deployment at 1536px viewport and compare to approved image; then refine wave, typography and icons. Do not touch mobile or CMS until approved.

## Deployment reconnect check — 2026-11-16
GitHub App repository permission was restored by project owner. This documentation commit triggers a fresh Cloudflare Pages production build from main. Confirm deployment in Cloudflare dashboard before claiming site is updated.


## Publications archive — 2026-11-17
Implemented /publications/ desktop archive layout from approved 1536px reference: four-column grid, 4:3 images, archive numbers, headings, original distressed star SVG, and shared layout/header/footer/paper background. Added design-only fixtures with permanent archiveNumber, publication status and deterministic newest-first ordering. Added temporary /publications/[slug]/ destinations, marked noindex, pending real article content. No CMS, mobile design, or publication workflow implemented.

**Known visual differences:** only three original cover PNGs are currently stored in the repository; fourth cover and lower-row artwork from supplied ZIP have not been imported, so existing cover images are temporarily reused. The four lower-row titles are placeholders because the supplied specification does not establish their actual article titles. These eight cards are mockups, not real published articles.

**QA:** GitHub changes committed. Cloudflare build, browser console, actual 1536px screenshot comparison, and Safari were not executed in this session. Confirm successful deployment before approving the page.
