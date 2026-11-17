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


## Universal article detail — 2026-11-17
- Added `src/components/DemoArticle008.astro`: complete demonstration text for archive #008, with semantic headings, paragraphs, emphasis, lists, and quote. This is a demo fixture, not an authenticated Bella publication.
- Replaced `src/pages/publications/[slug].astro` placeholder with a shared Astro static article template. All currently published demo fixtures receive a generated route. Other demo posts show "Материал готовится" rather than fabricated articles.
- Article template uses the same `post.image` source as archive and homepage previews, includes date, 4:3 cover, SEO, copy-link, previous/next navigation in chronological order (draft/hidden excluded), and shared header/footer.
- Extended `src/data/publications.ts` with demo 008 content selector, SEO description and stable chronological ordering. Demo #008 date set to 2026-11-17 as provided; #009 set to 2026-11-16. Fixture changes are temporary.
- Added desktop article CSS to `src/styles/global.css` at fixed 1536px composition; existing pages' styles intentionally unchanged.
- Set Astro `site` to production pages.dev URL for canonical/OG.
- **Incomplete:** user-provided transparent PNG star has NOT been uploaded to GitHub; the template temporarily references the already-present distressed-star SVG. Replace with supplied `bella_article_star_transparent(1).png` at `public/assets/graphics/article-end-star.png` and update src when binary upload is possible.
- **CMS not implemented:** no editor, Word paste sanitation, database, upload endpoint, draft management, or automatic rebuild/SSR publishing. The single cover reference is shared in code now; future CMS must persist it in one publication record.
- **QA not completed:** no local Astro build, browser screenshot comparison, Cloudflare deployment verification, iPhone/Safari test, or copy-to-clipboard interaction test performed in this session. New commits on main should trigger Cloudflare Pages build, subject to project configuration.
- **Security:** demo article content is authored trusted Astro markup. Do not render future CMS HTML with `set:html` until server-side sanitization/allowlist is implemented.
- **Mobile:** not implemented; 1536px desktop composition is intentionally locked pending a separately approved mobile stage.
