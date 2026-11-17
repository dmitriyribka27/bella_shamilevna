/** Shared admin data contract. No credentials or private content here. */
export type Language = 'ru' | 'en' | 'fr';
export type PublicationStatus = 'draft' | 'published';
export interface ArticleTranslation {
  lang: Language;
  title: string;
  excerpt: string;
  bodyJson: string;
  seoTitle: string;
  seoDescription: string;
  status: PublicationStatus;
  publishedAt: string | null;
}
export interface ArticleRecord {
  id: string;
  slug: string;
  coverKey: string | null;
  coverAlt: string;
  createdAt: string;
  updatedAt: string;
  translations: Partial<Record<Language, ArticleTranslation>>;
}
export const ARTICLE_LANGUAGES: readonly Language[] = ['ru','en','fr'] as const;
