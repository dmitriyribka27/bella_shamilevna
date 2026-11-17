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

## About page — 2026-11-17
- Replaced /about/ placeholder with semantic Astro page and fixed 1536px desktop three-column composition.
- Shared BaseLayout, Header, Footer and global paper texture unchanged.
- Structured profile, basic education and additional education records are currently in src/pages/about.astro; move into CMS storage after approval.
- Explicitly omitted the mockup's false claim of completed MSU education and unverified honors/hours; profile paragraphs are provisional, not Bella-approved.
- **Asset upload still required:** public/assets/images/about-portrait.png (original 378x460) and public/assets/graphics/halftone-cloud.svg (original 952x321). Current page references these exact paths; until uploaded, images will not display.
- **QA pending:** no local build, Cloudflare deployment confirmation, visual comparison or Safari testing performed.
- **Mobile:** desktop-only as previously approved; tablet/mobile layout not implemented.


## Localization — 2026-11-17
- Russian site: `/`; English static site: `/en/`, `/en/about/`, `/en/publications/`, `/en/publications/[slug]/`.
- Header language switcher uses real page navigation, preserving section/slug; document content is server-rendered (no JS needed to read it). Current interface languages RU/EN; French planned, not yet enabled.
- Never machine-translate article titles or bodies. Existing demo posts have **only Russian** source; on EN pages their Russian titles and bodies remain in Russian and are marked `lang="ru"`. Do not silently replace them with English. Article translations must be explicitly authored/published by Bella.
- Planned CMS data model: a publication is one stable ID, archiveNumber, slug, image, publication date, status; separate per-language records `translations[ru|en|fr] = {title, body, seoDescription, status}`. A translation is available only when explicitly saved and published. Never infer availability from a generated translation.
- User-specified article fallback priority: RU UI: ru > en; EN UI: en > fr; FR UI: fr > en. For future CMS, define explicit final fallback behavior if neither preferred nor secondary language exists; preserve original text rather than translating automatically. Current fixture is Russian only, so English article pages show Russian originals until translated versions exist.
- Adyghe inscriptions stay unchanged, including `Псэр ети напэр къащтэ.` and the decorative hero labels. English rendering of Bella's name: `Rybka Bella Shamilevna`.
- Georgian is to be offered **only on legal-document pages**, not in global site language navigation. Legal English and Georgian versions must use lawyer-supplied text; **not yet supplied/published**. Footer legal links currently lead to Russian documents even from EN pages.
- Caution: the About profile currently includes unverified claims about university education and credentials; obtain Bella's confirmation before final public launch.
- Implementation needs verification: run `npm run build`, check Cloudflare deploy and EN navigation, especially iPhone/Safari. No tests were executed via this GitHub connector.

### French public interface — 2026-11-17
- Added `/fr/`, `/fr/about/`, `/fr/publications/`, `/fr/publications/[slug]/`. Global selector now offers RU/EN/FR and retains the current route/slug.
- French article dates are rendered at build time using `Intl.DateTimeFormat('fr-FR', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})`; English uses `en-GB`, Russian `ru-RU`. Dates are localized regardless of article translation availability.
- Publication titles, article bodies, and article-specific SEO descriptions are not translated automatically. Existing Russian demo articles are shown unchanged on EN and FR article pages, with a localized notice. This is a temporary last-resort original-language display until CMS translation records exist.
- Future CMS fallback contract (after author-supplied published translations exist): RU interface ru > en; EN interface en > fr; FR interface fr > en; if none available, retain explicitly authored original (do not translate). A title/body/SEO translation must be published by Bella, not generated from interface locale.
- Adyghe words stay unchanged. Georgian remains reserved for legal pages only; legal EN/FR/KA translations await user-supplied approved documents. Until then legal links remain Russian originals.
- IMPORTANT: check Cloudflare deployment after latest commits; no build or browser QA performed by connector.

## Demo content removal — 2026-11-17
- Project owner requested removal of ALL demo publications and their texts before CMS development. Removed `src/data/publications.ts`, `src/components/DemoArticle008.astro`, `src/components/PublicationCard.astro` and all three dynamic demo article routes (`ru/en/fr/publications/[slug].astro`).
- Home publication previews now show RU `СКОРО`, EN `COMING SOON`, FR `BIENTÔT`. Publication archives retain their approved heading/decorative graphic and display the same localized empty-state message; no demo cards or article URLs are generated.
- Keep homepage and About portrait/graphics unchanged. Demo cover files must only be deleted after verifying exact repository paths and confirming they are not referenced outside demo content; binary-file inspection via the available GitHub connector is limited.
- NEXT PRIORITY, explicitly requested by owner: remove duplication of RU/EN/FR archive and article template pages. Create shared presentation components and centralized language dictionaries; keep stable localized URLs and never auto-translate author-written article content. Implement this refactor BEFORE starting CMS/admin work, after current demo cleanup is confirmed.
- QA status: source edits committed through GitHub; build and live browser tests not executed.

## Shared multilingual templates — 2026-11-17
- RU/EN/FR homepage, publications archive and About now each use one shared Astro component: `src/components/HomePage.astro`, `PublicationsArchive.astro`, `AboutPage.astro`.
- Language copy/metadata centralized in `src/i18n/site.ts`; original About biography/education copy moved verbatim into `src/i18n/about.ts`. Route entrypoints in `src/pages/{,en/,fr/}` are intentionally tiny wrappers: Astro requires concrete files to generate static localized URLs. They are not duplicated templates.
- Original public paths and visual classes/assets preserved. Legal policy pages are intentionally separate language-specific legal documents, not converted to UI dictionaries. Georgian remains legal-only.
- Article detail templates were previously removed with all demo articles; when CMS is introduced, implement ONE shared article detail component, with static route wrappers or an Astro routing solution preserving localized URLs. Do not auto-translate article bodies.
- QA: GitHub source changes committed; build/browser validation still required. Existing About biography includes an unverified Moscow State University qualification claim inherited from previous content; owner must verify and correct before treating it as fact.

## Multilingual content update contract — 2026-11-17
- Public interface languages: RU (source), EN, FR. Georgian is ONLY for legal documents. Do not add Georgian to global navigation or automatically translate approved legal policies.
- Single shared Astro templates for homepage, About and publication archive are already in place. UI and page metadata: `src/i18n/site.ts`; About biography/education: `src/i18n/about.ts`. Header and Footer currently maintain their own RU/EN/FR labels; these are not yet centralized, but are shared components (not three duplicate page files).
- **Owner workflow:** when Dmitriy supplies new Russian copy for a public page, the developer updates RU AND prepares context-aware EN and FR translations in the same change set. Review names, professional qualifications, dates, tone, URLs and layout. Do not publish partial-language updates. A translation is a separate authored string; editing Russian alone does NOT cause runtime translation.
- If the owner supplies only a Russian change, the developer/assistant translates EN and FR and commits all three variants together, without requiring the owner to manually edit language files. No automatic translation API or paid service is currently configured. Do not claim automatic translation occurs without developer intervention.
- Legal policies are lawyer-reviewed standalone documents; updates require separately approved translations rather than silent machine translation.
- Article bodies are author content, not interface copy. Future CMS must explicitly define per-language draft/publish workflow and must not auto-publish unreviewed article translations.
- When making language updates: check three route wrappers, shared component rendering, dictionary key completeness, localized links, titles/descriptions, and Cloudflare build status. Only claim build/browser tests if actually run.
