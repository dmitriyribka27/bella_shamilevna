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

## Статусы публикации и исправление SEO — 18.11.2026

- В заголовке редактора добавлены независимые состояния для текущей языковой версии: «Опубликовано» / «Черновик» / «Новая статья»; при наличии сохранённой рабочей версии с отличиями от опубликованной отображается «Сохранены неопубликованные изменения»; при редактировании формы появляется «Есть несохранённые изменения».
- После обычного Save показано пояснение, что изменения сохранены в редакторе, но публичная статья не изменилась. После Publish сообщение отдельно подтверждает обновление публикации; после Unpublish — снятие с публикации. Формирование сообщений завязано на параметр `result` в серверном редиректе.
- Публичные статьи продолжают читать только `article_translations` с `status='published'`. Обычное Save меняет `article_working_versions`, не перепубликуя статью.
- Исправлена устаревшая ошибка флагов SEO: непустой автоматически созданный title/description раньше ошибочно считался ручным. Редактор сверяет существующее SEO с автоматически рассчитанными значениями сохранённой и опубликованной версии и корректирует legacy-флаг. Автоматические SEO-поля обновляются от заголовка и текста; настоящие ручные значения остаются ручными.
- На сервере `save.ts` убрана логика сохранения старого SEO при `manual=false`; теперь флаг `manual` из формы определяет автогенерацию или сохранение ручного значения. Рядом с каждым SEO-полем показано «Обновляется автоматически» / «Задано вручную».
- Изменено: `functions/admin/edit.ts`, `functions/admin/save.ts`, `public/admin-editor.js`, `public/admin-editor-enhancements.js`.
- Статическая проверка: текущие GitHub-файлы и синтаксис обоих JS проверены. Cloudflare Deploy, D1 и работа Safari с реальной опубликованной статьёй **не проверены**.
- Ручной QA: открыть опубликованную статью, вставить новый текст, увидеть статус несохранённых изменений; нажать Save и убедиться, что статус сменился на сохранённые неопубликованные изменения, а публичный URL остался прежним; проверить обновление автоматических SEO; изменить SEO вручную и убедиться, что сохраняется; нажать Publish и убедиться в обновлении публичной статьи и исчезновении статуса ожидания.

### Уточнение статусов/SEO: нормализация и дата — 18.11.2026
- При наличии сохранённой рабочей версии редактор сравнивает её с опубликованной и показывает бейдж «Сохранены неопубликованные изменения»; редактирование несохранённых полей отображает отдельный бейдж.
- После `/admin/save` параметр `result=draft|publish|unpublish` позволяет показать точное пояснение, не называя обычное сохранение публикацией.
- Оба режима SEO теперь явно маркируются «Обновляется автоматически» или «Задано вручную»; значения для автоматического описания унифицированы между браузером и сервером по нормализации пробелов и HTML-сущностей.
- Форма даты использует опубликованное значение как резервное, если в рабочей версии нет ручной даты.
- Тестирование: чтение актуальных GitHub-файлов, проверки условий и синтаксиса обоих JS выполнены. Browser Safari, Cloudflare build, реальная запись D1 и сверка публичной статьи после нажатия Publish не выполнялись.

## SEO-описания: семантический выбор предложения (18.11.2026)

- Причина исправления: прежняя автоматическая генерация брала первые 160 символов HTML-представления статьи, включая заголовки H2/H3, и обрывала фразы посреди слова. Это не соответствует задаче краткого осмысленного описания.
- Новая автогенерация **не создаёт новых фактов и не обращается к AI/API**. Она анализирует существующие абзацы, законченные предложения и их близость к теме заголовка статьи и H2/H3. Заголовки используются только для определения тематической релевантности; сами заголовки не включаются в описание. Выбирается цельное информативное предложение; для очень короткого подходящего предложения может добавляться следующее предложение из того же абзаца. Описание не режется посреди слова.
- Блоки: p, li, blockquote (приоритет p); заголовки H1–H6 исключаются. HTML-сущности и лишние пробелы нормализуются; нежелательные общие вступления и вопросы получают меньший вес. При отсутствии достаточно содержательного законченного предложения автоматическое значение остаётся пустым и редактор предлагает заполнить поле вручную.
- Генерация детерминирована и не использует дополнительные платные сервисы. Используются две одинаковые реализации: `public/seo-description.js` и `functions/_lib/seo-description.ts`. Изменения алгоритма в дальнейшем нужно синхронизировать в обеих версиях.
- Визуальный редактор подключает `/seo-description.js` до `/admin-editor.js`; только когда SEO-поле не задано вручную, оно автоматически обновляется от актуального текста и заголовка. На сервере `/admin/save` выполняется тот же алгоритм. Ручные SEO-значения сохраняются без перезаписи.
- Для уже существующих автоматически заполненных описаний редактор распознаёт **старый 160-символьный алгоритм**, чтобы не считать legacy-значения ручными; новое описание пересчитывается в редакторе и сохраняется в рабочую версию по кнопке «Сохранить». На публичный сайт оно переносится только по кнопке «Опубликовать изменения».
- Google Search Central рекомендует создавать краткие уникальные описания страниц, но **не гарантирует**, что поисковая выдача покажет именно meta description: поисковик может выбрать другой сниппет из текста страницы.
- Изменено: `public/seo-description.js` (новый), `functions/_lib/seo-description.ts` (новый), `functions/admin/edit.ts`, `functions/admin/save.ts`, `public/admin-editor.js`.
- Проверены одинаковые результаты браузерной и серверной функций в V8 на тестовых примерах RU/EN, богатом HTML с жирным/курсивом, короткой статье и пунктуации. Cloudflare сборка, реальный Safari, D1 и публичный сайт после публикации **не проверялись**.

## Отложенная публикация обложек — 18.11.2026

**Решение руководителя:** обычная загрузка обложки в редакторе не должна менять публичный сайт. Изображения внутри статей не добавляются, платные сервисы и фоновые задания не подключаются. Резервные копии D1/R2 планируются вручную примерно раз в неделю; SEO-индексация и замеры производительности — после подключения домена.

- В таблицу `articles` добавлено необязательное поле `pending_cover_key`. Для существующей Production D1 используется безопасная ленивая проверка/миграция `functions/_lib/pending-cover.ts`; отдельно добавлен документирующий `infra/d1/002_pending_cover.sql` (не выполнять повторно, если поле уже создано автоматически).
- `functions/admin/cover.ts`: загруженный подготовленный JPEG/PNG/WebP 4:3 (до 2 MB) сохраняется **только в pending_cover_key**, существующий `cover_key` остаётся прежним. Повторная загрузка до публикации удаляет предыдущий pending-объект из R2. Если D1 не удалось обновить, новая загрузка удаляется. Обложки архивированных статей не принимаются.
- `functions/admin/cover-preview.ts`: авторизованный редактор показывает pending обложку, если она есть, иначе текущую опубликованную. Публичные страницы и `/publication-images/[key]` по-прежнему читают **только cover_key**, без доступа к pending.
- `functions/admin/save.ts`: **только action=publish** переводит pending_cover_key в cover_key. После успешного обновления записи старая публичная обложка удаляется из R2 (при неуспехе удаления ошибка журналируется). action=draft / unpublish не продвигают обложку. При недоступном R2 публикация с ожидающей обложкой отклоняется до записи изменений.
- `functions/admin/edit.ts`: состояние ожидающей обложки явно отмечается в карточке/статусе, после загрузки показывается отдельное сообщение; в `public/admin-editor.js` сохраняется выбранный язык при возврате.
- `functions/admin/article-action.ts`: при окончательном удалении статьи удаляются связанные публичная и ожидающая обложки из R2 после успешного удаления статьи из D1. Перенос в корзину изображения не удаляет — они нужны при восстановлении.
- **Ограничение хранения:** на статью хранится не более одной ожидающей обложки, плюс текущая опубликованная. Это временно занимает два R2-объекта до публикации; без временного хранения нельзя обеспечить независимость черновика и публичной версии. Никаких периодических запросов к R2 или фонового копирования не добавлено.
- **QA выполнен статически**: прочитаны изменённые файлы GitHub и сопоставлены связи pending/public, ручной Publish и очистка R2. **Не подтверждены** Astro/Cloudflare сборка, реальная миграция Production D1, загрузка/публикация в Safari, наличие R2-объектов. Приёмочный тест — открыть опубликованную статью, загрузить другую обложку и проверить неизменность публичной, нажать Save и проверить ещё раз, затем Publish и убедиться в смене обложки; повторить замену pending без Publish. Для теста использовать отдельную статью.
- Следующий этап: **мобильная версия публичного сайта** — сначала согласование адаптивной композиции (iPhone/Safari, RU/EN/FR), затем CSS и практический QA. Не переносить на мобильные устройства визуальный текстовый редактор MacBook без отдельного решения.

## Мобильный этап — Desktop baseline (2026-11-18)
- Руководитель утвердил две независимые визуальные композиции в едином сайте: desktop сохраняется, mobile строится от эталона 402px из `bella-mobile(1).zip`; D1/R2, контент, URL, переводы общие.
- **Этап 1 выполнен:** исходники Desktop исследованы; SHA ключевых файлов, описание мобильного ZIP, защита широкого экрана и контрольный QA зафиксированы в `docs/MOBILE_DESKTOP_BASELINE_2026-11-18.md`.
- Desktop в `global.css` имеет `body{min-width:1080px}` и фиксированную композицию hero; при мобильной реализации отменять это только внутри изолированного mobile media query. Существующий CSS и Desktop-компоненты на этапе 1 не изменялись.
- Главная мобильная — первый реализуемый экран; макеты мобильного архива/«Обо мне» пока не трогать. Нельзя делать отдельный сайт, отдельные URL и отдельные публикации.
- Не выполнено: независимые актуальные скриншоты Desktop в реальном браузере, подключение mobile CSS, сборка и iPhone/Safari QA. Следующий этап — отдельный мобильный слой и реализация главной по Figma с проверкой на 375/393/402/420/440 CSS px и широких экранах.

## Мобильная главная — этап 2: изолированный код (18.11.2026)

- Создан `src/components/MobileHeader.astro`: отдельная мобильная шапка главной страницы с семантической навигацией, активным пунктом и компактным выбором RU/EN/FR, работающим через существующие маршруты. Оба меню взаимно исключают друг друга, закрываются Escape / повторным нажатием / нажатием снаружи; состояние `aria-expanded` синхронизировано, предусмотрено возвращение фокуса.
- Создан `src/styles/mobile-home.css`: строго изолированные стили под `.bm-mobile-home`, мобильная граница 700 CSS px, мобильное снятие `body min-width:1080px` только при наличии будущего смонтированного мобильного представления. Десктопный `global.css` и существующий Desktop DOM не изменялись.
- **Безопасный промежуточный статус:** новый компонент и CSS пока намеренно **не импортированы** в публичные страницы. Поэтому этот коммит не меняет ни Desktop, ни текущую мобильную публичную страницу. Их включение производится одним согласованным интеграционным шагом вместе с мобильным hero и оригинальной графикой, чтобы не публиковать частично собранную композицию.
- Графические исходники из `bella-mobile(1).zip` просмотрены локально, размеры и файлы подтверждены; **в GitHub они ещё не загружены**. Нельзя выдавать старые Desktop-ресурсы за оригинальные мобильные изображения. Следующий шаг: поместить пять исходных файлов в `public/assets/mobile/home/` без редизайна, закончить мобильную главную и только потом подключить компонент и CSS.
- Сделана статическая сверка исходных GitHub-файлов. Сборка Astro, рендер браузера, фактическое открытие меню на iPhone/Safari и визуальный QA пока не проводились.
- Следующий этап: мобильная главная 402 px целиком (header/hero/wave/about/latest-3/footer), затем тест ширин 375/393/402/420/440 и 1536/1920, RU/EN/FR.

## Мобильная главная — интеграция 18.11.2026
- Защищённый desktop baseline сохранён: `global.css`, Desktop `Header.astro`, `Footer.astro`, `AboutPage.astro` и Desktop-hero не изменялись.
- Добавлен `src/components/MobileHome.astro` с мобильными блоками по утверждённому эталону 402 px; `src/components/MobileHeader.astro` адаптирован к компактному меню и выбору RU/EN/FR; `src/styles/mobile-home.css` активирован исключительно на ширинах до 700 CSS px.
- Все пять оригинальных ресурсов `bella-mobile(1).zip` записаны в `public/assets/mobile/home/` без изменения исходных байтов: `bella_pirtrait_mobile.png`, `green_oval_mobile.svg`, `linii_mobile.svg`, `river_mobile.png`, `tochki_mobile.svg`.
- Desktop-страница остаётся прежней; мобильная разметка находится внутри того же `HomePage.astro` и становится видимой только в мобильном диапазоне. Дубликаты desktop-блоков скрываются CSS; URL и D1 общие.
- Динамическая главная в `functions/[[path]].ts` формирует мобильные карточки из тех же трёх реально опубликованных записей D1, включая архивный номер из `admin_article_numbers`, дату, обложку. Тестовые заголовки/номера из макета не попадают в Production.
- Локальный статический прототип проверен в Chromium на 375, 393, 402, 420 и 440 px: все пять оригинальных ресурсов загрузились, document scrollWidth равен viewport width. В этом тесте подставлялись только примерные данные карточек ради проверки геометрии — Production использует D1.
- НЕ проверены: настоящая сборка Astro/Cloudflare, мобильная страница на Production, клики меню на iPhone Safari, интеграционный D1 вывод, визуальная неизменность Desktop после публикации. Провести эти проверки при приёмке.

## Новый hero-essay — интеграционная ветка, ожидает изображения и QA (18.11.2026)

- По утверждённому хендову дизайнера добавлен `src/components/HeroEssay.astro` с пятью точными абзацами для RU Desktop и двумя согласованными частями первого абзаца для RU Mobile. На EN/FR компонент ничего не выводит до утверждённых переводов.
- Добавлен `src/styles/hero-essay.css`: отдельные Desktop/Mobile правила, CSS Grid + float + shape-outside и центральный прозрачный портрет. Существующий hero не изменялся: новый компонент помещён в `HomePage.astro` сразу после MobileHome и до старого hero; на MobileHome — сразу после MobileHeader.
- Текущий вариант намеренно находится **в ветке `feature/hero-essay-2026-11-18`**, а не Production main. Не объединять в main, пока отсутствует WebP по адресу `public/assets/hero-essay/bella-essay-portrait.webp`.
- Оптимизированный WebP 800×1199, прозрачный, 50 606 байт находится в пользовательском пакете `BELLA_SITE_HERO_ESSAY_PREVIEW.zip` (путь внутри архива `bella-essay-portrait.webp`). Оригинал PNG также приложен; дизайнер запретил ретушировать изображение и менять пропорции.
- В этой интеграции доступна запись текстовых файлов через GitHub, но передача бинарного изображения напрямую не поддерживается. После ручной загрузки WebP в целевую ветку нужно выполнить локальную/Cloudflare preview сборку и QA 1536px/402px, затем 375/393/420/440px и EN/FR, убедиться, что текст не наезжает на волосы и руки, не обрезается и нет горизонтального скролла.
- Важно: при возможном переполнении мобильного текста не скрывать его и не усекать произвольно. Проблему нужно показать Дмитрию на скриншоте и согласовать корректировку. До тестов не утверждать, что мобильная композиция завершена.
- После визуального согласования и успешной Cloudflare preview сборки объединить ветку в `main`. После деплоя отдельно проверить, что старый первый экран и публикации не повреждены. Админка, D1 и R2 в рамках изменения не затрагиваются.

## Редакционное эссе — перенос в низ главной и полный текст (18.11.2026)

- По решению руководителя блок с прозрачным портретом удалён из верхней части Desktop и Mobile и размещён **последним содержательным блоком главной перед футером**. На Desktop `HomePage.astro` — после `home-lower`, перед закрытием `BaseLayout` (футер в нём). На Mobile `MobileHome.astro` — после списка публикаций и перед `bm-mobile-footer`.
- В `HeroEssay.astro` вставлены без сокращений все **10 абзацев** утверждённого текста. На Desktop первые четыре абзаца слева и оставшиеся шесть справа для естественного порядка чтения и близкого объёма колонок. Мобильная версия показывает тот же полный текст после портрета одной удобочитаемой колонкой.
- `hero-essay.css` обновлён: более мягкие контуры `shape-outside` с промежуточными точками, отступ от силуэта, размеры текста и вертикальная композиция. Исходный WebP уже находился в `public/assets/hero-essay/` и не заменялся; Desktop `global.css`, Header, Footer, CMS/D1/R2 не изменены.
- EN/FR по-прежнему не выводят это эссе, пока нет утверждённых переводов.
- GitHub-проверки: вызовы HeroEssay по одному на Desktop/Mobile; оба стоят непосредственно перед футером после основного контента; текст всех 10 абзацев обнаружен; исходный Desktop `global.css` совпадает с контрольным SHA.
- **Не подтверждено:** Cloudflare Production build и визуальное обтекание в Safari/Chromium. После деплоя проверить 1536/1920 CSS px, MacBook, iPhone 375/393/402/440, что текст не пересекает волосы/руки, заканчивается не выше низа изображения, футер на месте и отсутствует горизонтальная прокрутка. Если нужные визуальные коррекции появятся — менять только локальный `hero-essay.css`, не общий десктопный CSS.

## Коррекция обтекания эссе по реальному WebP (18.11.2026)
- Исправлено обтекание портрета в `src/styles/hero-essay.css`: прежний float высотой 1000px начинал резервировать место задолго до реального изображения и давал огромные пустоты. Теперь и портрет, и float-маски начинаются сверху композиции; высота масок равна отображаемой высоте WebP (1199/800). Полигон каждой половины рассчитан по альфа-каналу изображения с вертикальными срезами и небольшим `shape-margin`, а не нарисован наугад.
- Прежний десятиабзацный текст, порядок (4 слева / 6 справа), позиция эссе непосредственно перед футером и отдельная мобильная одноколоночная компоновка сохранены.
- Браузерный визуальный тест: локальный Chromium, 1080, 1280, 1536, 1920 CSS px, без горизонтальной прокрутки в изолированном макете; на 1536 изображение и блок доходят до одной нижней линии, текст обтекает волосы/плечи и руки. Для 701–1200 ширина шрифта адаптирована, чтобы не растягивать абзацы ниже портрета.
- Production Cloudflare Deploy и реальный Safari/MacBook после коммита не проверены. После деплоя проверить реальную главную и корректность масок при Safari.

## Масштабирование фиксированной Desktop-композиции на ноутбуках (18.11.2026)

- Причина: в `src/styles/global.css` Desktop использует фиксированные `body{min-width:1536px}`, `main{width:1536px}` и широкие элементы. На MacBook с меньшим CSS viewport часть сайта обрезалась справа из-за `overflow-x:clip`.
- Исправлено **только для desktop-ширин от 701 до 1535 CSS px**: в конце `global.css` правило `body{zoom:var(--bella-desktop-fit,1)}`; в `src/layouts/BaseLayout.astro` ранний inline-скрипт вычисляет `min(1,innerWidth/1536)` и обновляет его при resize. 1536px и шире сохраняют исходную геометрию и масштаб 1. Mobile (700px и меньше) не затронут.
- Это пропорциональное уменьшение **всего** Desktop, а не изменение внутренних координат: тексты и элементы становятся меньше на узких ноутбуках. Отдельная полноценная адаптивная компоновка остаётся будущей задачей, если понадобится.
- Проверено в локальном Chromium на минимальном документе с теми же `body`/`main`/header CSS: 701, 900, 1080, 1280, 1366, 1440, 1536 и 1920 px. Для 701–1536 правый край main совпал с шириной viewport, `documentElement.scrollWidth` не превышает её; при 1920 масштаб 1. **Полную текущую сборку Astro/Cloudflare и реальный Safari в этой итерации не проверяли**.
- Файлы: `src/styles/global.css`, `src/layouts/BaseLayout.astro`. Не менялись mobile-home.css, MobileHome, Header/Footer, D1/R2 и редактор.

## Desktop-шапка без имени, языки в строку (18.11.2026)
- Из `src/components/Header.astro` удалена надпись «БЕЛЛА ШАМИЛЬЕВНА» в левом углу. Остались навигация Главная / Публикации / Обо мне, иконки Telegram / Instagram / Email и три открытых переключателя RU / EN / FR.
- Активный язык отмечен тонкой зелёной линией `#147b45` снизу, как действующий акцент доступности сайта; используются семантические ссылки с `aria-current="page"` и сохранением маршрута при переключении языка.
- Отдельный JS раскрывающегося переключателя удалён из Desktop Header — это обычные HTML-ссылки, работающие без JS. Позиционирование Desktop задано только в `global.css` внутри `@media(min-width:701px)` с классом `.site-header--nav-only`. 
- **Mobile не изменялся**: `src/components/MobileHeader.astro`, `src/styles/mobile-home.css` и мобильные меню остались прежними.
- Статически подтверждены новые ссылки, класс CSS, зелёная линия, удаление Desktop выпадающего меню и неизменность SHA мобильного CSS. Сборка Cloudflare / Safari визуально не подтверждены.

## Уточнение Desktop-шапки: центральная навигация и Manrope Light (18.11.2026)
- «Главная / Публикации / Обо мне» снова находятся по горизонтальному центру всей шапки, а не слева. Компоновка `1fr max-content 1fr`, пункты в центральной колонке, иконки и RU/EN/FR справа.
- Навигация: Manrope (Google Fonts, веса 300/400), используется **300 Light**, 20 px, без жирного начертания; остальные тексты и типографика сайта не менялись.
- Прежняя зелёная линия `#147b45` под активным языком сохранена.
- Изменены `src/styles/global.css`, `src/layouts/BaseLayout.astro`; MobileHeader и mobile-home.css не менялись.
- Статическая проверка GitHub прошла. Cloudflare Deploy, реальный MacBook/Safari и межъязыковое визуальное сравнение не подтверждены.

## Исправление центрирования навигации при масштабе браузера (19.11.2026)
- По скриншотам 100/110/150% выявлен риск смещения навигации из-за одновременных Desktop Grid `1fr max-content 1fr`, фиксированной ширины 1536px и переменного `body zoom`. Исправлено только для Desktop `>700px` в конце `src/styles/global.css`.
- Шапка теперь flex, а центральное меню имеет абсолютную привязку `left:50%;top:50%;transform:translate(-50%,-50%)` непосредственно к `.site-header`. Соцсети и RU/EN/FR независимо выровнены по правому краю. Manrope Light и зелёное подчёркивание активного языка сохранены.
- Пропорциональное уменьшение `body zoom` для небольших Desktop viewport оставлено: иначе вновь появится обрезание справа. CSS MobileHome/MobileHeader не менялся.
- Проверено в изолированной Chromium-модели на ширинах 1840,1673,1536,1366,1227,1080,900,701 CSS px: центр меню совпал с центром viewport (погрешность менее 0.02 px), пересечений между меню и правыми ссылками нет, горизонтального скролла нет. Параметры 1840/1673/1227 иллюстрируют приблизительные эффективные viewport при browser zoom 100/110/150% на одном физическом экране.
- **Ограничение проверки:** не выполнялись полноценный Astro build, проверка Cloudflare Production и тест настоящего Safari с масштабом 100/110/150%; приёмка визуально остаётся за руководителем.

## Почтовые ссылки Safari / Apple Mail / Gmail — 19.11.2026
- Ссылки на отправку писем в Desktop Header, Desktop Footer и MobileHome переведены с `https://mail.google.com/mail/?view=cm&fs=1&to=skot4os%40bk.ru` на универсальную `mailto:skot4os@bk.ru`.
- Для `mailto:` не используются `target="_blank"` и `rel="noopener noreferrer"`; на остальных внешних ссылках они сохранены. Это позволяет Safari передавать действие почтовой программе, выбранной по умолчанию (Apple Mail или Gmail при поддержке/настройке системы). Адресат заполняется автоматически, отправка остаётся за пользователем.
- Обновлены ARIA-подписи: без обещания открытия Gmail; применены RU/EN/FR переводы. Никакие серверные/API изменения не нужны.
- Проверено статически: все три компонента теперь используют `mailto:`, старый Gmail URL отсутствует. Реальный Safari на macOS/iOS и деплой Cloudflare не проверены. Если пользователь увидит системное окно выбора приложения или отсутствие почтового клиента, это определяется настройками OS.

## Homepage Hero redesign + public typography — branch feature/home-hero-editorial-2026-11-19 (19.11.2026)
- Основание: загруженный руководителем `home_update.zip`, `README_HERO_REDESIGN.txt` и `README_RIVER.txt`. Приоритет текущего запроса — первый экран + все публичные шрифты/цвет. Действующие публикации, D1/R2, админка и нижнее эссе не удаляются и не меняют данные.
- В новой отдельной ветке создан `src/components/BellaHero.astro`, подключён к главной через `HomePage.astro`, вместо старой Desktop секции `.hero` и `.wave-wrap`. Слои: лучи, горы, HTML H1 «БЕЛЛА / ШАМИЛЬЕВНА», строка фамилии «РЫБКА», дескриптор, исходный портрет из `/assets/images/home-portrait.png`, ПСЭ/ДУША, волна Четук и подпись. EN/FR получают локализованную графическую подпись, имя BELLA/SHAMILEVNA и RYBKA; содержимое блога не затронуто.
- `src/styles/bella-hero.css` управляет только Desktop (ширина >700 CSS px), мобильная главная `MobileHome.astro` в рамках данной итерации не изменена в соответствии с паузой мобильного редизайна. Desktop hero — отдельные слои с пропорциями, `clamp()`, `container-type:inline-size`, ограничением max-width, без единого фонового PNG. Портрет обрезается внизу `clip-path` с точками, вычисленными по линии Четук; исходная линия поверх изображения.
- Для всего публичного сайта введены токены `--ink:#172C25`, `--font-sans:Manrope`, `--font-display:Forum`, `--font-editorial:Oranienbaum` в `src/styles/public-typography.css`. Стили импортируются только из `BaseLayout.astro`, админка не затрагивается. Google Fonts загружаются с весами Manrope 300/400/700 (700 только для авторского жирного текста); Forum/Oranienbaum Regular. Существующее зелёное hover-состояние и золотистое выделение текста сохранены.
- **Блокер перед merge:** файлы изображений из ZIP являются бинарными и не загружены через имеющийся текстовый GitHub MCP. Требуются оригинальные PNG в `public/assets/home-redesign/`: `mountains-light.png` (2180×721), `rays-left.png` (1600×1080), `river-desktop.png` (2400×120), `river-mobile.png` (900×120). Они собраны в `BELLA_HOME_REDESIGN_ASSETS.zip`. Пока отсутствуют — PR не объединять.
- README дизайнера упоминает `desktop_portrait_cut_mask.png` и `mobile_portrait_cut_mask.png`, но в загруженном `home_update.zip` их **нет**. Позиция маски рассчитана из данных линии; соответствие видимого штриха и обрезки по пикселям в реальном Safari **не подтверждено**.
- Статический аудит ветки: код hero заменён, нижнее эссе и секции сохранены, исходный портрет проекта переиспользован, мобильная верстка не изменена, 4 ассета отсутствуют. Cloudflare/Astro сборка, Lighthouse, Safari и скриншоты 1536/402 ещё не проведены.
- Следующее действие: загрузить PNG в ветку, выполнить сборку на preview, показать скриншоты 1536 и 402, проверить ширины RU/EN/FR и сохранить мобильный дизайн, затем согласовать визуально и только после merge в main. Для полноценного мобильного редизайна требуется отдельный шаг после утверждения.

### Обновление: оригинальные ассеты перенесены в GitHub (19.11.2026)
- Все четыре PNG теперь физически присутствуют в `feature/home-hero-editorial-2026-11-19`, включая `mountains-light.png`, `rays-left.png`, `river-desktop.png`, `river-mobile.png`. Их blob SHA побайтно совпадают с исходниками архива `home_update.zip`. Ручная загрузка больше не требуется.
- Кодовый аудит на ветке: `BellaHero` подключён вместо старого Desktop первого экрана; `MobileHome`, нижнее эссе, CMS/D1/R2 и URL не изменены. Общий файл типографики импортирован в публичный `BaseLayout`, админка не использует его.
- **Текущий статус: draft Pull Request #3**. Реальная Astro-сборка и визуальный тест Safari не выполнены: локальный Chromium блокирует `file://` и loopback и не смог отрисовать статический предпросмотр. Нельзя заявлять, что композиция окончательно проверена. Основная ветка `main` не затронута. После получения рабочего браузерного предпросмотра/визуального утверждения выполнить merge.

## Первый экран — правки по BELLA_HERO_CORRECTIONS_MAIN(1).zip (19.11.2026)
- На прямое распоряжение Дмитрия исправления внесены **непосредственно в `main`**. Источник решений: `README_HERO_CORRECTIONS_MAIN.txt`, `01_CURRENT.png`, `02_TARGET_REFERENCE.png`, `rays_reference_corrected.svg`.
- Правильное написание в hero: **«БЕЛЛА ШАМИЛЕВНА РЫБКА»**, без мягкого знака в отчестве. Семантически единый `h1`; первые две строки крупным Forum Regular, «РЫБКА» — Forum Regular меньшего размера с разрядкой и тонкой чертой справа.
- `src/components/BellaHero.astro`: заменены старые лучи на `/assets/home-redesign/rays-reference-corrected.svg` из ZIP; в hero поддерживается оригинальный портрет. **Единый массив `riverY`** получен по альфе исходного `desktop_river_line.png` (81 отсчёт). Один и тот же массив формирует clip-path портретного слоя и полилинию зелёной реки. Это устраняет независимые и несовпадающие нижние края старого PNG/clip.
- `src/styles/bella-hero.css`: имя опущено, фамилия оформлена Forum и чертой, дескриптор расположен ниже, горы подняты и ослаблены с fade-mask, лучи ограничены левым краем с единой точкой схождения, портрет сдвинут влево, ПСЭ/ДУША сохранены. Цвет `#172C25`; смартфонная независимая верстка не изменена.
- **Проверено:** Github main содержит компонент, CSS, SVG, Forum и корректное написание имени; общий контур в обоих местах, мобильный компонент не менялся. **Не проверено:** фактический новый Production deploy, визуальный скриншот браузера Safari на MacBook, совпадение контура в пикселях после отрисовки; полноценная Astro сборка в этой итерации не запускалась. Возможны коррекции размещения после пользовательского сравнения с референсом.
- Изменения: `src/components/BellaHero.astro`, `src/styles/bella-hero.css`, `public/assets/home-redesign/rays-reference-corrected.svg`, `HANDOFF.md`. Данные/админка/D1/R2 не изменялись.

## Hero — точные лучи и финальная визуальная корректировка (19.11.2026)

По новому пакету `BELLA_HERO_FIXES_MAIN_AND_RAYS(1).zip` изменения внесены **прямо в main**, без Preview-ветки:

- `public/assets/home-redesign/rays-use-this-exact.svg` — **точный исходный SVG из ZIP без модификаций**, Git blob SHA `33723d536f16f9b27f67af1f93a938bf1c4541b3`, совпадает с контрольным SHA локального оригинала. В `BellaHero.astro` ссылка на новый SVG; прежний ассет не удалён для истории.
- В `bella-hero.css` лучи ограничены левым сектором, точка схождения ближе к верхнему левому краю, сохранилась естественная разная длина лучей.
- Горы немного подняты, уменьшены по габаритной ширине, усилен контраст при сохранённом плавном fade снизу. Размер ФИО Forum уменьшен, межстрочность собрана; фамилия Forum сохранена с чуть удлинённой чертой. Подзаголовок Manrope с аккуратным отступом.
- Портрет уменьшен и немного сдвинут вправо, без изменения файла или лица. Маска портрета и линия реки по-прежнему построены по **одному** массиву `riverY`.
- Блок «ПСЭ / ДУША» выровнен немного выше. После реки добавлен **desktop-only** нижний отступ `clamp(120px, 14vh, 175px)`, чтобы на стартовом экране при 100% и 110% не выглядывали «Обо мне» и «Публикации».
- Область применения: только `@media(min-width:701px)`; MobileHome и её стили не менялись, публичная типографика Manrope / Forum / Oranienbaum сохранена, D1/R2/админка не затронуты.
- Проверка: статический аудит итоговых файлов GitHub в `main`, соответствие SHA точного SVG, наличие элементов и раздельной мобильной компоновки. **Production Cloudflare, Safari на Mac и визуальный QA 100%/110% в этой итерации не подтверждены**. Следующий шаг — проверить реальную композицию и первый экран после деплоя.

## Лучи поверх шапки, фиксированные при прокрутке (19.11.2026)
- По скриншоту MacBook лучи в Desktop Hero уменьшены примерно вдвое и вынесены из ограниченного `overflow:hidden` hero в самостоятельный фиксированный слой `body:has(.bella-hero)::after`. Это применяется только на главной и только на Desktop `min-width:701px`.
- Фоновый оригинальный `rays-use-this-exact.svg` не менялся. Его новое отображение: `width:clamp(250px,25vw,390px)`, `top:-48px`, `left:-19px`, `opacity:.76`, `position:fixed`, `z-index:120` — выше липкой шапки `z-index:100`. Оригинальный тег изображения внутри Hero остаётся, но скрыт через `display:none` для предотвращения двойных лучей.
- `pointer-events:none` гарантирует, что ссылки шапки и страницы остаются кликабельными. Мобильная версия/админка/публикации/сервер не менялись.
- Проведена статическая проверка GitHub main, что фиксированный overlay существует, а старый луч скрыт; конфликтующих `body::after` в global.css нет. Визуальная проверка на Safari, при реальном скролле и при browser zoom ещё не выполнена.
