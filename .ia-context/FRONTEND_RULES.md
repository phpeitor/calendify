# Reglas de Desarrollo Frontend — Flag Day 🇵🇪

## Contexto
- **Proyecto**: Landing conmemorativa por el Día Santa Rosa de Lima
- **Objetivo**: mantener consistencia, accesibilidad y rendimiento en la entrega frontend.

## Estructura de proyecto
- **Carpetas**: Mantener la siguiente estructura mínima:
  - `index.html`
  - `css/` — hojas de estilo (por ejemplo `style.css`)
  - `js/` — scripts (por ejemplo `script.js`)
  - `templates/` — parciales HTML/SVG cargados por JavaScript
  - `resources/` — imágenes, fuentes y assets optimizados
- **Regla**: no mezclar CSS ni JS en archivos HTML; usar archivos dedicados en `css/` y `js/`.
- **Templates**: mantener el SVG principal dividido en `templates/fusion-app/`; no volver a concentrarlo en `script.js` ni en un unico `fusion-app.html` gigante.
- **Orden de carga**: registrar cada parcial nuevo en `templateParts` dentro de `js/script.js`, respetando el orden visual del SVG.

## HTML
- **Idioma**: usar `lang="es"` en la etiqueta `<html>`.
- **Semántica**: usar etiquetas HTML5 (`header`, `main`, `section`, `footer`).
- **Meta**: incluir `viewport`, `charset` y meta description apropiada.
- **Accesibilidad**: todos los botones y controles deben ser accesibles por teclado y tener `aria-*` cuando corresponda.

## CSS
- **Metodología**: seguir una convención clara (BEM, utility-first o CSS modular simple).
- **Variables**: usar CSS variables para colores y espaciados.
- **Especificidad**: evitar selectores muy específicos; preferir clases.
- **Responsive**: mobile-first; usar `min-width` en breakpoints.
- **Prefijo**: evitar `!important` salvo caso extremo.

## JavaScript
- **Vanilla**: preferir JavaScript ligero sin frameworks adicionales a menos que sea necesario.
- **Modularidad**: organizar código en funciones pequeñas y reutilizables.
- **Carga de templates**: `script.js` debe encargarse de cargar y ensamblar parciales, no de almacenar grandes strings de HTML/SVG.
- **Eventos**: delegar eventos cuando aplique para mejorar rendimiento.
- **Degradado**: implementar fallbacks si una API no está disponible.

## Accesibilidad (A11y)
- **Contraste**: asegurar ratio de contraste WCAG AA (mejor AAA) entre texto y fondo.
- **Texto alternativo**: todas las imágenes informativas deben tener `alt` descriptivo.
- **Skip link**: ofrecer un enlace de "saltar al contenido" para navegación con teclado.
- **Animaciones**: respetar `prefers-reduced-motion`.

## Imágenes y assets
- **Optimización**: comprimir y exportar imágenes en WebP/AVIF cuando sea posible.
- **Dimensiones**: especificar `width` y `height` o usar `aspect-ratio` para evitar CLS.
- **Sprites / SVG**: uso preferente de SVG para iconos.
- **Origen**: verificar licencias y añadir atribución en `README.md` si corresponde.

## Rendimiento
- **Carga crítica**: inyectar estilos críticos si aplica y posponer el resto con `media` o carga asíncrona.
- **Minificación**: minificar CSS/JS para producción.
- **Cache**: configurar headers de cache en servidor (Apache) para assets estáticos.
- **Evitar bloqueos**: cargar scripts no críticos con `defer` o `async` según corresponda.

## Animaciones y efectos
- **Eficiencia**: animar transform/opacity para aprovechar GPU.
- **Preferencias usuario**: respetar `prefers-reduced-motion`.
- **Sutileza**: evitar animaciones distractoras en contenido central.

## Herramientas, linters y formato
- **Format**: usar Prettier para formato consistente (opcionalmente como hook `pre-commit`).
- **Lint**: configurar ESLint (si JS moderno) y stylelint para CSS.
- **Validación**: validar HTML con el validador W3C antes de release.

## Control de versiones y commits
- **Branching**: ramas `main` (producción), `dev` (desarrollo) y ramas feature/bugfix.
- **Commits**: mensajes descriptivos; seguir convención `tipo: descripción` (ej. `feat: añadir header responsivo`).

## Testing y QA
- **Cross-browser**: probar en Chrome, Firefox, Edge y móviles (Android/iOS).
- **Responsive**: verificar en anchos comunes (360px, 375px, 768px, 1024px).

## Seguridad y privacidad
- **No exponer**: no subir llaves, contraseñas o tokens al repositorio.
- **Analítica**: avisar sobre cualquier tracker/analytics en el README y respetar la privacidad.

## Despliegue
- **Servidor**: el proyecto es estático — desplegar en Apache (ajustar `DocumentRoot`).
- **Headers**: configurar `Content-Security-Policy` y `X-Content-Type-Options` según sea necesario.

## Contribuciones
- **PRs**: abrir Pull Requests pequeños y descriptivos.
- **Revisiones**: al menos una revisión de código antes del merge a `main`.

## Recursos y referencias
- **Accesibilidad**: https://www.w3.org/WAI/standards-guidelines/wcag/
- **Performance**: https://web.dev/fast/

---

_Footer_: Si quieres, puedo añadir configuraciones base de `prettier`, `eslint` y `stylelint`, o preparar un pequeño flujo de despliegue para Apache.
