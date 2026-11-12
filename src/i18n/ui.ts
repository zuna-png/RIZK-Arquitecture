export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

/** Rutas traducidas: cada página existe en ambos idiomas con su propio slug. */
export const routes = {
  home: { es: '/', en: '/en/' },
  walkthroughs: { es: '/recorridos/', en: '/en/walkthroughs/' },
  studio: { es: '/estudio/', en: '/en/studio/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
} as const;
export type RouteKey = keyof typeof routes;

export const navOrder: RouteKey[] = ['walkthroughs', 'studio', 'contact'];

export const ui = {
  es: {
    'site.tagline': 'Estudio de visualización y arquitectura',
    'site.description':
      'Rizk es un estudio de visualización y arquitectura. Imágenes que comunican arquitectura: renders, recorridos y diseño de espacios que se sienten.',
    'nav.home': 'Inicio',
    'nav.walkthroughs': 'Recorridos',
    'nav.studio': 'Estudio',
    'nav.contact': 'Contacto',
    'nav.menu': 'Menú',
    'nav.close': 'Cerrar',
    'nav.skip': 'Saltar al contenido',
    'footer.language': 'Idioma',
    'footer.rights': 'Todos los derechos reservados',
    'footer.talk': 'Hablemos.',
    'home.hero.title': 'Visualizar\nlo que viene.',
    'home.hero.caption': 'Visualización arquitectónica',
    'home.intro':
      'Imágenes que comunican arquitectura. Visualización para ideas, espacios y futuros posibles, y diseño arquitectónico para llevarlos a la realidad.',
    'album.label': 'Proyectos',
    'album.prev': 'Proyecto anterior',
    'album.next': 'Siguiente proyecto',
    'album.pause': 'Pausar',
    'album.play': 'Reproducir',
    'album.slide': 'de',
    'album.palette': 'Paleta de color del proyecto',
    'cat.residencial': 'Residencial',
    'cat.vivienda-vertical': 'Vivienda vertical',
    'cat.comercial': 'Comercial',
    'cat.interiorismo': 'Interiorismo',
    'cat.rehabilitacion': 'Rehabilitación',
    'vista.exterior': 'Exterior',
    'vista.interior': 'Interior',
    'vista.aerea': 'Vista aérea',
    'tipo.visualizacion': 'Visualización',
    'tipo.arquitectura': 'Arquitectura',
    'home.cta.walkthroughs': 'Ver recorridos',
    'home.cta.contact': 'Iniciar un proyecto',
    'soon': 'Próximamente',
    'page.walkthroughs.intro':
      'Recorre los espacios antes de que existan. Experiencias 360° y recorridos animados.',
    'page.studio.intro':
      'Rizk es un estudio que une la visualización y la arquitectura para dar forma a espacios que se sienten.',
    'page.contact.intro':
      'Cuéntanos sobre tu proyecto: visualización, recorrido virtual o diseño arquitectónico.',
  },
  en: {
    'site.tagline': 'Visualization & architecture studio',
    'site.description':
      'Rizk is a visualization and architecture studio. Images that communicate architecture: renders, walkthroughs and the design of spaces you can feel.',
    'nav.home': 'Home',
    'nav.walkthroughs': 'Walkthroughs',
    'nav.studio': 'Studio',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.skip': 'Skip to content',
    'footer.language': 'Language',
    'footer.rights': 'All rights reserved',
    'footer.talk': "Let's talk.",
    'home.hero.title': 'Visualizing\nwhat comes next.',
    'home.hero.caption': 'Architectural visualization',
    'home.intro':
      'Images that communicate architecture. Visualization for ideas, spaces and possible futures, and architectural design to make them real.',
    'album.label': 'Projects',
    'album.prev': 'Previous project',
    'album.next': 'Next project',
    'album.pause': 'Pause',
    'album.play': 'Play',
    'album.slide': 'of',
    'album.palette': 'Project colour palette',
    'cat.residencial': 'Residential',
    'cat.vivienda-vertical': 'Multi-family housing',
    'cat.comercial': 'Commercial',
    'cat.interiorismo': 'Interior design',
    'cat.rehabilitacion': 'Restoration',
    'vista.exterior': 'Exterior',
    'vista.interior': 'Interior',
    'vista.aerea': 'Aerial view',
    'tipo.visualizacion': 'Visualization',
    'tipo.arquitectura': 'Architecture',
    'home.cta.walkthroughs': 'View walkthroughs',
    'home.cta.contact': 'Start a project',
    'soon': 'Coming soon',
    'page.walkthroughs.intro':
      'Walk through spaces before they exist. 360° experiences and animated walkthroughs.',
    'page.studio.intro':
      'Rizk is a studio bringing together visualization and architecture to shape spaces you can feel.',
    'page.contact.intro':
      'Tell us about your project: visualization, virtual walkthrough or architectural design.',
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first in languages ? (first as Lang) : defaultLang;
}

export function path(route: RouteKey, lang: Lang): string {
  return routes[route][lang];
}
