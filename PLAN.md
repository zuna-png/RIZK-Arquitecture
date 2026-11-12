# Plan de trabajo — Sitio web Rizk · Estudio de Visualización

> Portafolio de Michel Navarro. Basado en `propuesta_1.docx`, la identidad en `marca.jpeg`
> y las referencias OZU Estudio, Raum Visual y MIR.

---

## 1. Qué aprendimos de las referencias

| Referencia | Qué tomar | Qué evitar |
|---|---|---|
| **ozuestudio.com** (Squarespace) | Minimalismo extremo: 3 páginas (Work / About / Contact). Slideshow a pantalla completa en el inicio con pie "Proyecto · Estudio · País". En el grid solo va el título; la imagen manda. About con portada, bio y prensa. | Plantilla genérica, sin filtros y con poca personalidad en las transiciones. |
| **raumvisual.com** (WordPress) | Filtros por tipo (Renders / Recorrido virtual / Video). Tarjetas con "Estudio cliente + Proyecto". Bloque "Let's talk" con formulario por tipo de servicio. GIFs en el hero. | Imágenes pesadas en WordPress, con el CAPTCHA roto visible en producción. Además los GIFs pesan mucho; es mejor usar video MP4 o WebM. |
| **mir.no** | No pude leer el sitio porque bloquea el acceso automatizado (403). Conocido por: imagen a sangre, casi sin texto y orden aleatorio de proyectos (el parámetro `?r=`). | Conviene revisarlo a mano en el navegador. |

**Conclusión:** las tres referencias son de **estudios de visualización** (no despachos de
arquitectura), igual que Rizk. El sitio debe ser *image-first*: tipografía pequeña y
espaciada, mucho aire, la imagen a pantalla completa y transiciones suaves.

---

## 2. Stack tecnológico recomendado

| Necesidad | Tecnología | Por qué |
|---|---|---|
| Framework | **Astro** | Genera HTML estático, rapidísimo y bueno para SEO. Solo manda JS donde hace falta. Encaja con lo que ya plantea la propuesta. |
| Estilos | **Tailwind CSS v4** | Tokens de marca (Carbón, Marfil, Piedra, Oliva) en un solo lugar. Responsive rápido. |
| Contenido de proyectos | **Astro Content Collections** (Markdown + frontmatter tipado con Zod) | Cada proyecto es un archivo `.md` con su ficha técnica. Para agregar un proyecto no hay que tocar código. |
| Imágenes | **`astro:assets` (`<Image>` / `<Picture>`) + sharp** | Hoy los renders pesan **239 MB** (hasta 14 MB cada uno). Astro los convierte a AVIF/WebP, genera `srcset` responsive y aplica lazy-load en la compilación. Es lo más crítico del proyecto. |
| Transiciones entre páginas | **Astro View Transitions** (`<ClientRouter />`) | Transición fluida grid → proyecto (la imagen "crece") sin necesidad de una SPA. |
| Animación y scroll | **GSAP + ScrollTrigger** y **Lenis** (scroll suave) | Es el estándar en sitios de arquitectura y visualización: reveals al hacer scroll, parallax sutil y textos que entran. GSAP ahora es gratuito, incluidos sus plugins. |
| Galería / lightbox | **PhotoSwipe** | Ligero, con gestos táctiles y zoom. Sin dependencia de React. |
| Experiencia 360° | **Photo Sphere Viewer** (con los plugins Virtual Tour y Markers) | Está más mantenido y es más moderno que Pannellum. Trae hotspots entre escenas, zoom, pantalla completa y giroscopio en móvil. |
| Interactividad | **Vanilla JS / Astro islands** (React solo si un componente lo justifica) | Los filtros, el menú y el slider son simples. Evitar React reduce mucho el peso de la página. |
| Tipografía | **Manrope** vía Fontsource (self-hosted) | Es la fuente de la marca. Al alojarla nosotros no se depende de Google Fonts. |
| Formulario de contacto | **Web3Forms** o **Formspree** (+ Cloudflare Turnstile) | No requiere backend y tiene anti-spam. Así evitamos el error de Raum. |
| Hosting | **Vercel**, **Netlify** o **Cloudflare Pages** | El plan gratuito alcanza. Incluye deploy automático con cada push y HTTPS. |
| (Fase futura) CMS | **Keystatic** o **Decap CMS** | Por si Michel quiere subir proyectos desde un panel sin tocar archivos. |

---

## 3. Identidad visual (de `marca.jpeg`)

- **Colores:** Carbón `#20211F` · Marfil `#F3F0E9` (fondo) · Piedra `#B9B4AA` · Oliva `#70765B` (acento)
- **Tipografía:** Manrope. Titulares grandes de peso ligero y etiquetas en MAYÚSCULAS con mucho tracking (como "ESTUDIO DE VISUALIZACIÓN").
- **Tono:** "Espacios que se sienten." · "Visualizar lo que viene."
- **Layout:** líneas finas divisorias, numeración editorial (01., 02.…) y mucho blanco.

---

## 4. Mapa del sitio

```
/                     Inicio = ÁLBUM de proyectos a pantalla completa (estilo OZU), cada uno con
                      descripción del espacio; debajo, frase e intro del estudio
/360                  Experiencia 360° (nombre por definir): visor + selector de escenas
/estudio              Michel / Rizk: filosofía, servicios, proceso, clientes/prensa
/contacto             Formulario por tipo de servicio, email, redes
```

Estructura de carpetas prevista en `web/`:

```
web/
├─ src/
│  ├─ content/proyectos/*.md      ← un archivo por proyecto
│  ├─ assets/proyectos/<slug>/    ← renders originales (Astro los optimiza)
│  ├─ components/                 ← Header, Footer, ProjectCard, Gallery, Viewer360…
│  ├─ layouts/BaseLayout.astro
│  ├─ pages/                      ← index, proyectos, 360, estudio, contacto
│  └─ styles/global.css           ← tokens de marca (Tailwind @theme)
├─ public/panoramas/              ← imágenes equirectangulares 360°
└─ astro.config.mjs
```

---

## 5. Fases de trabajo

### Fase 0: Contenido (en paralelo y bloqueante para el lanzamiento)
- [ ] Agrupar los renders de `RENDERS FINALES OAT/` **por proyecto**: nombre, cliente o estudio, ubicación, año, categoría y descripción.
- [ ] Elegir de 1 a 3 imágenes hero para el inicio.
- [ ] Textos para Estudio (bio, filosofía, servicios) y una foto de Michel.
- [ ] Panoramas 360° en formato equirectangular 2:1 (por ejemplo 8000×4000), si ya existen.
- [ ] El logo "Rizk" en vector (SVG).

### Fase 1: Base del proyecto
- Inicializar Astro + Tailwind en `web/`, configurar tokens de marca, Manrope y layout base.
- Header (logo + navegación + menú móvil) y footer.
- **Entregable:** sitio vacío navegable con la identidad aplicada.

### Fase 2: Proyectos (el corazón del sitio)
- Content Collection con esquema tipado (título, cliente, ubicación, año, categoría, portada, galería, ficha técnica).
- `/proyectos`: grid editorial con filtros por categoría y hover sutil.
- `/proyectos/[slug]`: portada a sangre, ficha técnica, galería con PhotoSwipe y enlace al proyecto siguiente.
- Pipeline de imágenes optimizadas (AVIF/WebP, srcset, lazy).
- **Entregable:** portafolio funcional con 3 o 4 proyectos reales.

### Fase 3: Inicio + Estudio + Contacto
- Hero a pantalla completa (slideshow con crossfade o video loop corto).
- Página Estudio y formulario de contacto con anti-spam.
- **Entregable:** sitio completo sin 360°.

### Fase 4: Experiencia 360°
- Integrar Photo Sphere Viewer como island (carga diferida, solo en `/360`).
- Selector de escenas, hotspots entre espacios, pantalla completa y giroscopio en móvil.
- **Entregable:** recorrido virtual navegable.

### Fase 5: Movimiento y pulido
- Lenis + GSAP: reveals, transiciones de página con View Transitions y microinteracciones.
- Respetar `prefers-reduced-motion`.
- Revisión responsive (móvil, tablet, escritorio).

### Fase 6: SEO, rendimiento y lanzamiento
- Metadatos, Open Graph por proyecto, `sitemap.xml`, datos estructurados (schema.org).
- Lighthouse ≥ 90 en todas las métricas y LCP < 2.5 s.
- Dominio, deploy en Vercel o Netlify y analítica ligera (Plausible o Umami).

---

## 6. Decisiones

### Tomadas
1. **Idioma:** español por defecto (`/`) e inglés (`/en/`). El selector de idioma va en el footer.
   Se usará el i18n routing nativo de Astro, con textos en archivos de traducción y cada proyecto con su versión `es` / `en`.
2. **Video y recorridos animados:** sí, en el futuro. Desde la Fase 2 el modelo de contenido acepta
   un `tipo` por pieza (render / video / 360°). Los videos irán en Vimeo o YouTube (embed ligero que
   se carga al hacer clic) o en Cloudflare Stream. Los loops cortos del hero irán en MP4/WebM
   self-hosted, nunca en GIF.
3. **Dominio:** ya existe (falta saber cuál y dónde está registrado para configurar el DNS).

4. **Enfoque:** híbrido. La visualización va primero y la arquitectura como segunda línea. Los proyectos
   llevan `tipo` (visualización / arquitectura) y las categorías de ambos mundos.
5. **Sección 360°:** "Recorridos / Walkthroughs" (`/recorridos/`, `/en/walkthroughs/`), nombre provisional.

### Pendientes
- Dominio (el cliente lo está enviando). Hoy `site` en `astro.config.mjs` es un placeholder.
- Logo en SVG, email real y enlaces a redes (marcados con `TODO` en el código).

---

## 7. Estado

- [x] **Fase 1: Base del proyecto** (completada el 2026-11-03)
  - Astro 7 + Tailwind 4 + Manrope (self-hosted), tokens de marca en `src/styles/global.css`.
  - i18n ES (default) / EN con slugs traducidos (`src/i18n/ui.ts`) y selector en el footer.
  - Header con menú móvil accesible, footer, View Transitions, SEO base (canonical, hreflang, OG).
  - Inicio con hero optimizado (1.9 MB → 24–450 KB en AVIF) y placeholders para las demás secciones.
- [x] **Álbum de proyectos en el inicio** (2026-11-04). Sustituye a la pestaña "Proyectos".
  - 14 proyectos en `src/content/proyectos/*.yaml` (ES/EN), portadas en `src/content/proyectos/img/`.
  - Crossfade automático (12 s), pausa, flechas, teclado y swipe. Composición *full* (horizontal)
    o *split* (vertical/cuadrada) automática. Solo carga la imagen activa y la siguiente.
  - ⚠️ Nombres y descripciones son PROVISIONALES (inferidos de las imágenes); falta cliente, ubicación y año.
- [x] **Mejoras al álbum** (2026-11-11)
  - Color de cada proyecto: paleta de 5 tonos extraída al compilar (`src/lib/imageTones.ts`), panel
    *split* teñido, línea de acento y sombra del texto con los tonos de la imagen.
  - Carga fina: color promedio + miniatura borrosa mientras carga; la imagen aparece con fundido.
  - (Se probó un cursor "Anterior / Siguiente"; descartado, se prefiere el cursor normal.)
- [ ] Siguientes ideas priorizadas: modelo→render (#2), render vs construido (#3), página por
      proyecto (#11), WhatsApp (#15), efecto "renderizando" (#1)
- [ ] Fase 3: Estudio + Contacto
- [ ] Fase 4: Recorridos (360° + video)
