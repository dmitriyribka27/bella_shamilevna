// Design-only fixtures. These are NOT published articles.
// Archive numbers are persistent metadata, never derived from array positions.
export type Publication = {
  archiveNumber: number;
  slug: string;
  title: string;
  image: string;
  publishedAt: string;
  status: 'published' | 'draft' | 'hidden';
  demo?: boolean;
};
export const demoPublications: Publication[] = [
  { archiveNumber: 9, slug: 'testovaya-statya', title: 'Тестовая статья', image: '/assets/images/cover-01.png', publishedAt: '2026-11-09', status: 'published', demo: true },
  { archiveNumber: 8, slug: 'odinochestvo-resurs-ili-defitsit', title: 'Одиночество: ресурс или дефицит?', image: '/assets/images/cover-01.png', publishedAt: '2026-11-08', status: 'published', demo: true },
  { archiveNumber: 7, slug: 'kak-formiruetsya-blizost', title: 'Как формируется близость', image: '/assets/images/cover-02.png', publishedAt: '2026-11-07', status: 'published', demo: true },
  { archiveNumber: 6, slug: 'telo-i-perezhivanie', title: 'Тело и переживание', image: '/assets/images/cover-03.png', publishedAt: '2026-11-06', status: 'published', demo: true },
  { archiveNumber: 5, slug: 'granitsy-i-otnosheniya', title: 'Границы и отношения', image: '/assets/images/cover-02.png', publishedAt: '2026-11-05', status: 'published', demo: true },
  { archiveNumber: 4, slug: 'demo-004', title: 'Память и переживания', image: '/assets/images/cover-03.png', publishedAt: '2026-11-04', status: 'published', demo: true },
  { archiveNumber: 3, slug: 'demo-003', title: 'Одиночество среди людей', image: '/assets/images/cover-01.png', publishedAt: '2026-11-03', status: 'published', demo: true },
  { archiveNumber: 2, slug: 'demo-002', title: 'Взгляд внутрь себя', image: '/assets/images/cover-02.png', publishedAt: '2026-11-02', status: 'published', demo: true },
  { archiveNumber: 1, slug: 'demo-001', title: 'Уязвимость как сила', image: '/assets/images/cover-03.png', publishedAt: '2026-11-01', status: 'published', demo: true },
];
// Later replace this fixture with approved content from the CMS.
export const allPublications: Publication[] = demoPublications;
export const publishedPublications = allPublications.filter(p => p.status === 'published')
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.archiveNumber - a.archiveNumber);
export const previewPublications = publishedPublications.slice(0, 3);
