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

## Admin phase 1 — Cloudflare data foundation (2026-11-17)
- Added `infra/d1/001_admin_schema.sql`, `src/admin/article-model.ts`, `infra/README.md`.
- Article record is shared across RU/EN/FR; each translation has independent title, body JSON, SEO fields, draft/published status and publication timestamp. RU is the primary authoring language, EN/FR are manually entered by Bella; no automatic translation.
- Planned cover: landscape 4:3, iPhone gallery JPEG/PNG/HEIC/HEIF support via explicit conversion; optimized and EXIF-stripped before storage. Do not silently accept unsupported HEIC decoding.
- Cloudflare D1 and private R2 are PROPOSED; nothing provisioned yet. Need owner's Cloudflare dashboard action for D1 and R2 when approved. No auth is live and no public /admin route created.
- Critical architectural issue: existing Astro output is static; publishing D1 records alone does not create public article HTML. Resolve and test static publishing pipeline before claiming CMS works.
- Next: obtain D1 binding and verify Cloudflare Pages Functions availability, implement secure server-side authentication/session management, then editor + image pipeline + publish flow. No secrets in repository.


## Editor working revisions — 2026-11-18
- New article buttons POST to /admin/create, creating an untitled draft and redirecting to the same /admin/edit editor. Existing draft edit uses the same editor.
- /admin/save writes working content to article_working_versions. For already published translations, Save does not overwrite article_translations; Publish promotes the saved content. This working-version table is created lazily by the server.
- Editor loads the working version first. Automatic SEO title derives from the title and author name; description derives from plain editor text. Explicit edits are marked by hidden manual flags and stored separately for each language.
- Added unsaved-change warning on language navigation and page unload. No autosave.
- **Not yet implemented:** public pages reading D1; cover upload/storage and publish validation for cover; public preview with approved site layout; archive numbering in editor; Word paste integration tests; robust cross-device concurrency/version conflict handling. Current preview is in-editor only.
- **QA not executed:** no local TypeScript build, Cloudflare deployment validation, D1 migration inspection, or iPhone Safari tests. Test first on a disposable draft and an existing published article before relying on the workflow. The schema and runtime must be checked in production.


## D1 publications and shared covers — 2026-11-18

- Public RU/EN/FR archives and individual publication URLs are now handled server-side by `functions/[[path]].ts`. It reads only `article_translations.status='published'` and excludes articles in `admin_archived_articles`. The three latest localized articles are inserted into each homepage on the server. Public content is present in HTML without JavaScript.
- Stable article URLs: `/publications/<slug>/`, `/en/publications/<slug>/`, `/fr/publications/<slug>/`. Slugs are created once at initial save and remain stable after title changes.
- `functions/admin/save.ts`: separate working and published versions, optional manual date on publication, SEO defaults. A draft save does not replace the published translation.
- Shared image: `articles.cover_key` and `articles.cover_alt`, not language-specific. The editor GET creates `cover_key TEXT` via `ALTER TABLE` when missing. `/admin/cover` uploads up to 5 MB of JPEG/PNG/WebP to R2; `/admin/cover-preview` requires an authenticated session; `/publication-images/[key]` serves images only for non-archived articles with at least one published translation.
- **Cloudflare configuration required:** create an R2 bucket and bind it to the Pages project as `BELLA_IMAGES` (exact spelling), in addition to the existing D1 binding `DB`. Ensure both Preview and Production environments are configured as intended. Never expose R2 secrets in frontend code. Confirm R2 availability and any costs before enabling.
- **QA NOT PERFORMED:** no local Astro build, TypeScript compile, Cloudflare deployment verification, D1 migration test, image upload test, browser test or iPhone/Safari test has been run. Treat this as an implementation requiring integration QA, not a verified release.
- Known limitations: cover upload requires a saved article; image optimization/resizing not yet implemented; orphan R2 objects from replaced covers are retained; homepage/archives use HTML substitution from existing Astro-generated static pages; dynamic publication URLs and SEO/sitemap need end-to-end verification. The public article template is provisional and must be approved against design.
- Check: new draft must not appear publicly; publish RU and confirm archive/home/article URL; save changes to published RU without publishing and verify unchanged public HTML; publish again and verify new HTML; hide RU and verify 404; publish EN independently; upload shared cover and verify on RU and EN; manually change date; archive/restore; check missing/unsafe markup and image handling; test Safari/iPhone.


## Редактор: утверждённая компоновка (18.11.2026)

- Перестроен desktop UI: RU/EN/FR, заголовок (50 символов), общая обложка 4:3 и дата — в верхней карточке слева; редактор текста ниже; раскрываемый предпросмотр под ним.
- Правая колонка: управление и удаление, отдельная SEO-карточка. Кнопка предпросмотра из управления удалена; предпросмотр строится в браузере из текущих полей, без дополнительных запросов к R2 при открытии.
- Дата публикации сохраняется в `article_working_versions.published_at` при обычном сохранении и применяется к публичной версии только при публикации. Колонка добавляется при первом обращении к редактору/сохранению.
- На узких экранах редактор скрыт с сообщением о доступности с MacBook; другие разделы админки не блокируются.
- Защита от потери изменений остаётся активной при отправке формы (не снимается преждевременно).
- Файлы: `functions/admin/edit.ts`, `functions/admin/save.ts`, `public/admin-editor.js`.
- Проверка: изменения записаны в GitHub; локальная сборка и реальное тестирование в Safari/iPhone в этой итерации **не выполнялись**. После деплоя проверить сохранение даты, предпросмотр, обложку, языки, SEO и действия управления.

## Расширенный текстовый редактор для MacBook — 18.11.2026

- Полная панель форматирования: жирный, курсив, подчёркнутый, зачёркнутый, H2/H3, обычный абзац, цитата, маркированный и нумерованный списки, вставка/удаление гиперссылки на выделенном тексте, отмена и повтор действий.
- macOS: подсказки горячих клавиш, Cmd+K для ссылки; выбранный текст сохраняется при нажатии на кнопки панели. Для остальных команд используются нативные механизмы contenteditable/execCommand. Совместимость с Safari требует практического тестирования.
- Вставка Word/ChatGPT/Заметок: обработка text/html с разрешённым набором семантических HTML-тегов и распознаванием распространённых inline CSS (bold, italic, underline, strike); текст без HTML вставляется обычным текстом с переносами строк. Внешние классы, CSS, скрипты, iframe, формы и изображения из буфера не сохраняются. Это не полный импорт Word: сложные таблицы, стили, примечания и картинки из буфера не поддерживаются.
- Публичный серверный рендерер обновлён для HTML-тегов u и s, кликабельные a[href] работают с http/https/mailto и безопасными rel. HTML проходит отдельную серверную фильтрацию; публичные страницы продолжают рендериться без JS.
- Изменены: `functions/admin/edit.ts`, `public/admin-editor.js`, `functions/[[path]].ts`.
- Важно: загрузка изображений внутрь текста НЕ реализована этим этапом; есть существующая отдельная функция обложки. Не заявлять о полноценном импорте произвольных Word-элементов.
- QA: изменения закоммичены в GitHub. Реальное тестирование Word, ChatGPT, Notes, сохранения/публикации, Safari, клавиатуры Mac и Cloudflare Deploy **не проводилось**; требуется проверка с черновиком, прежде чем считать релиз завершённым.

## Стабилизация MacBook-редактора — 18.11.2026 (этап после форматирования)

Утверждено: **не добавлять изображения внутрь статей**; R2 используется для отдельных обложек.
- Создан `public/admin-editor-enhancements.js`, подключён после основного `public/admin-editor.js`.
- Аварийные локальные копии unsaved текста, заголовка, даты и SEO в localStorage на текущем устройстве (ключ по article ID + lang; срок 7 дней). Восстановление только после подтверждения пользователя, без автоматической подмены серверной версии; копия удаляется после успешного перехода с `saved=1`. Это не серверное автосохранение и не межустройственная синхронизация.
- В DOM-редакторе добавлены счётчик слов/знаков, примерное время чтения, раскрываемая навигация по H2/H3, индикатор несохранённых изменений и локальной копии, подсветка активного форматирования.
- Встроенное окно создания и изменения гиперссылок для выделенного текста / курсора в ссылке: адрес, подпись, удаление с сохранением текста, Cmd+K, проверка схемы http(s)/mailto, target-безопасность через rel. Совместимость с Mac Safari требует тестирования.
- Предпросмотр использует общий с публичной статьёй набор семантических тегов и относительные пропорции типографики, но намеренно более компактный масштаб, утверждённый ранее; дата берётся также из исходной опубликованной версии.
- Публичный `functions/[[path]].ts` сохраняет серверную фильтрацию HTML; черновики по-прежнему не отображаются на публичном сайте без публикации.
- Добавлен диалог на native `dialog` (без inline JS из-за CSP); код editor enhancements не использует сторонних CDN.
- Изменены `functions/admin/edit.ts`, `public/admin-editor-enhancements.js`, дополнен `HANDOFF.md`. Ранее улучшены `public/admin-editor.js` и `functions/[[path]].ts`.
- Контроль: синтаксис обоих клиентских JS проверен средствами V8, файлы коммитов подтверждены GitHub. **Не проводились** реальная сборка Astro/Functions на текущем HEAD, проверка Cloudflare Deploy, Safari/MacBook, Word/ChatGPT/Notes paste, сценарии localStorage, D1 Publish/Save и визуальные сравнения с публичной статьёй.
- Ограничения: localStorage может быть очищено браузером или недоступно; не заменяет явное сохранение на сервер. Текущий движок contenteditable/execCommand остаётся устаревшим браузерным API; стабильность в Safari требуется подтвердить перед финальным релизом. Вставка специфических Word-таблиц/сложной структуры не гарантирована, изображений внутри текста нет.

## Архивные номера в редакторе — 18.11.2026

- Удалён блок «Структура статьи» из интерфейса редактора. Заголовки H2/H3 остаются в редакторе и в публичном тексте, без отдельной навигации.
- Номера хранятся в существующей D1-таблице `admin_article_numbers(number INTEGER PRIMARY KEY AUTOINCREMENT, article_id UNIQUE)`, не в языковых переводах. Один номер общий для RU/EN/FR.
- В `/admin/edit` добавлено поле «Архивный номер», автоматически предлагающее наименьшее положительное свободное число, с ручным изменением. Отображение `№ 001`, `№ 002` и так далее — форматирование, в БД хранятся числа.
- `/admin/save` валидирует 1–999999 и гарантирует уникальность через PK БД; сохранение/публикация существующих статей могут поменять номер, включая переупорядочивание. Повтор номера отклоняется с HTTP 409. Новая статья и её номер вставляются через единый D1 batch.
- Корзина: при переносе статьи в корзину её номер освобождается; восстановленная статья получает следующий свободный номер и остаётся черновиком. Окончательно удалённые записи не резервируют номера. Номера активных статей не меняются при обычном удалении другой статьи. Освободившийся номер может быть использован повторно.
- `functions/_lib/archive-number.ts` — общий helper для создания таблиц, зачистки заброшенных записей, выбора следующего числа и backfill ранее существовавших активных статей. Старое автоматическое проставление через `AUTOINCREMENT` при открытии каталога удалено.
- Каталог отображает номер в каждой активной записи; публичный архив уже использует существующий `n.number` и трёхзначный формат.
- Локальная аварийная копия на Mac включает ручной номер и восстанавливает его после подтверждения пользователя.
- Изменено: `functions/_lib/archive-number.ts`, `functions/admin/edit.ts`, `functions/admin/save.ts`, `functions/admin/index.ts`, `functions/admin/article-action.ts`, `public/admin-editor-enhancements.js`.
- QA: статическое чтение кода и проверка JS. Production D1, Safari и Cloudflare Deploy в этой итерации **не проверены**. Перед релизной приёмкой проверить новый номер, ручной занятый номер (409), редактирование номера, удаление/восстановление, RU/EN/FR, отображение в архиве, а также сохранность уже существующих статей.

## Компактные метаданные и формат архивного номера — 18.11.2026

- В верхней карточке редактора уменьшены вертикальные интервалы между заголовком, архивным номером и датой публикации; удалено пояснение под номером.
- Номер в поле отображается без символа № и с ведущими нулями минимум до трёх разрядов (`001`, `002`, `010`, `123`; для больших значений дополнительные цифры сохраняются).
- Поле использует `type=text`, `inputmode=numeric` и цифровую проверку: это позволяет видеть `001`, в отличие от `type=number`. При потере фокуса номер форматируется до 3 разрядов; сервер принимает цифровую строку с ведущими нулями, проверяет 1–999999, сохраняет число в D1 и проверяет уникальность.
- Убран символ `№` из подписей в каталоге админки и публичном архиве; общая система номеров сохранена.
- Изменено: `functions/admin/edit.ts`, `functions/admin/save.ts`, `functions/admin/index.ts`, `functions/[[path]].ts`, `public/admin-editor-enhancements.js`.
- Проверено статически: присутствие правок в GitHub и синтаксис клиентского JS. Cloudflare, реальный D1 и Safari не тестировались.

## Компактная строка архивного номера и даты — 18.11.2026

- Под заголовком в desktop-редакторе архивный номер и дата публикации объединены в горизонтальную двухколоночную строку с подписями сверху. Ширина номера 150 px, ширина даты до 220 px; поля высотой 45 px. На узком desktop предусмотрено уменьшение колонок.
- Обложка осталась в правой колонке, данные, серверное сохранение и схема D1 не затронуты.
- Изменён `functions/admin/edit.ts`. Проверка GitHub-разметки проведена; реальный рендеринг браузера и Cloudflare build не подтверждены.
