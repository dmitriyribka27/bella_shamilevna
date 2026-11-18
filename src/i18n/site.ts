export type SiteLanguage = 'ru' | 'en' | 'fr';
export const siteText = {
  ru: {
    homeTitle: 'Белла Шамилевна Рыбка — психология, исследования, авторство',
    homeDescription: 'Психология, исследования и авторство',
    heroFirst: 'РЫБКА БЕЛЛА', heroSecond: 'ШАМИЛЕВНА',
    heroTagline: 'ПСИХОЛОГИЯ · ИССЛЕДОВАНИЯ · АВТОРСТВО',
    portraitAlt: 'Чёрно-белый портрет Беллы', soul: 'ДУША', river: 'р. Четук',
    aboutHeading: 'ОБО МНЕ',
    homeAbout: 'О психологии, человеческой природе и противоречиях, которые делают нас людьми. Здесь собраны мои исследования, публикации, профессиональные интересы и личные наблюдения.',
    readMore: 'ПОДРОБНЕЕ', publications: 'ПУБЛИКАЦИИ', viewAll: 'СМОТРЕТЬ ВСЕ',
    soon: 'СКОРО', archive: 'АРХИВ',
    archiveTitle: 'Публикации — Белла Шамилевна Рыбка',
    archiveDescription: 'Публикации Беллы Шамилевны Рыбка о психологии и исследованиях'
  },
  en: {
    homeTitle: 'Bella Shamilevna Rybka — Psychology, Research, Writing',
    homeDescription: 'Psychology, research and writing by Bella Shamilevna Rybka.',
    heroFirst: 'RYBKA BELLA', heroSecond: 'SHAMILEVNA',
    heroTagline: 'PSYCHOLOGY · RESEARCH · WRITING',
    portraitAlt: 'Black-and-white portrait of Bella', soul: 'SOUL', river: 'Chetuk River',
    aboutHeading: 'ABOUT ME',
    homeAbout: 'On psychology, human nature and the contradictions that make us human. Here you can find my research, publications, professional interests and personal reflections.',
    readMore: 'READ MORE', publications: 'PUBLICATIONS', viewAll: 'VIEW ALL',
    soon: 'COMING SOON', archive: 'ARCHIVE',
    archiveTitle: 'Publications — Bella Shamilevna Rybka',
    archiveDescription: 'Publications by Bella Shamilevna Rybka on psychology and research.'
  },
  fr: {
    homeTitle: 'Bella Shamilevna Rybka — Psychologie, recherche, écriture',
    homeDescription: 'Psychologie, recherche et publications de Bella Shamilevna Rybka.',
    heroFirst: 'RYBKA BELLA', heroSecond: 'SHAMILEVNA',
    heroTagline: 'PSYCHOLOGIE · RECHERCHE · ÉCRITURE',
    portraitAlt: 'Portrait en noir et blanc de Bella', soul: 'ÂME', river: 'Rivière Tchetouk',
    aboutHeading: 'À PROPOS',
    homeAbout: 'À propos de la psychologie, de la nature humaine et des contradictions qui font de nous des êtres humains. Vous trouverez ici mes recherches, mes publications, mes centres d’intérêt professionnels et mes réflexions personnelles.',
    readMore: 'EN SAVOIR PLUS', publications: 'PUBLICATIONS', viewAll: 'TOUT VOIR',
    soon: 'BIENTÔT', archive: 'ARCHIVES',
    archiveTitle: 'Publications — Bella Shamilevna Rybka',
    archiveDescription: 'Publications de Bella Shamilevna Rybka sur la psychologie et la recherche.'
  }
} as const;
export function sitePrefix(lang: SiteLanguage): string {
  return lang === 'ru' ? '' : `/${lang}`;
}
