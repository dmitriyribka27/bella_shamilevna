# BELLA SITE — Admin infrastructure (not yet activated)

Public site: Astro static / Cloudflare Pages. The future editor will live at `/admin/`. No admin authentication or database is live yet.

## Proposed Cloudflare bindings

- D1 binding: `DB` — database `bella_site`
- R2 binding: `MEDIA` — private bucket `bella-site-media` (requires checking R2 billing/availability with the owner)
- Worker/Pages secret: `ADMIN_PASSWORD_HASH` (derive using a documented password hashing procedure; never commit password or hash to public code)
- Worker/Pages secret: `SESSION_SECRET` (cryptographically random value, never commit)
- Optional secret: `GITHUB_TOKEN` only if GitHub-based publication is approved; **not** needed for initial schema

## Schema

Apply `infra/d1/001_admin_schema.sql` using Cloudflare D1 Console after DB creation. Article translations are independent per language, including draft/published status. Do not publish missing translations.

## Static article delivery decision pending

Astro is currently built with `output: 'static'`. Cloudflare D1 is only accessible at request time via Functions/Workers, **not** directly in Astro's GitHub build. A database write does not automatically update the existing static article pages. Before CMS launch, implement a reviewed publish pipeline that produces prerendered article HTML and rebuilds the site (e.g. secure server-side GitHub commits with Cloudflare deploy hooks), or approve a different server-side rendering architecture. Do not claim publishing works before that pipeline is tested.

## Images

Source files from iPhone may be JPEG, PNG, HEIC/HEIF. Browser HEIC decoding is inconsistent: never assume all browsers can decode HEIC. Server-side conversion or explicit conversion fallback is required. Target 4:3 landscape, compressed WebP/JPEG, bounded pixel dimensions and file size, with EXIF stripped. Keep R2 bucket private and serve only approved published images.

## Security

Hidden admin URL is not security. Require verified server-side password hash, short-lived HttpOnly Secure SameSite cookies, CSRF protection, throttled login, and authorization on **every** write and upload endpoint. Never expose secrets in Astro/client code. Backup D1 and R2 before launch.

## Status

Only schema and planning are committed at this stage. No database, R2 bucket, secrets, auth or CMS are provisioned. No deployment/build tests have run.
