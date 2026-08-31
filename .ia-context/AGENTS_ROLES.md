# Roles de Agentes

Guia de trabajo para la landing conmemorativa de Santa Rosa de Lima. Cada agente tiene un foco claro para mantener una experiencia visual solemne, calida y ligera, y para que los cambios sean faciles de revisar.

## Contexto del proyecto

- Sitio estatico servido desde Apache; la entrada es `index.html`.
- La escena principal combina `resources/video.mp4`, logotipos e ilustraciones SVG.
- `js/script.js` selecciona un logo al azar y genera rosas o corazones decorativos con jQuery.
- `css/style.css` controla la composicion, el texto, los brillos y las animaciones.
- `resources/` contiene el video, logos y variantes `rose*.svg` y `heart*.svg`.

## Principios compartidos

- Preservar el caracter conmemorativo y la referencia explicita a Santa Rosa de Lima.
- Mantener el proyecto ligero: HTML, CSS y JavaScript sin frameworks nuevos salvo necesidad justificada.
- Separar estructura (`index.html`), presentacion (`css/style.css`), comportamiento (`js/script.js`) y recursos (`resources/`).
- Priorizar accesibilidad, contraste, rendimiento y funcionamiento en pantallas pequenas.
- No sustituir cambios existentes de otro agente; revisar el diff antes de tocar archivos relacionados.

## Agent Rosa SVG

Responsable de ilustraciones, logotipos y uso correcto de SVG.

Trabaja en:

- `index.html` cuando se integren imagenes o iconos SVG.
- `resources/*.svg`.
- `js/script.js` solo cuando cambie la seleccion o insercion de assets SVG.

Debe:

- Mantener proporciones, viewBox y legibilidad de los logotipos.
- Usar `alt` descriptivo en imagenes informativas y `aria-hidden="true"` en decoracion.
- Verificar que los nombres `rose1.svg` a `rose5.svg` y `heart1.svg` a `heart5.svg` sigan coincidiendo con el codigo.
- Comprobar que los SVG funcionen desde Apache y no dependan de rutas absolutas.

No debe:

- Incrustar SVG largo dentro de `script.js`.
- Cambiar colores o formas con CSS sin coordinar con Agent Lima CSS.

## Agent Isabel Tipografia

Responsable de tipografia, jerarquia textual y legibilidad.

Trabaja en:

- `index.html` para la carga de fuentes y metadatos relacionados.
- `css/style.css` para familias, tamanos, pesos y espaciado.

Debe:

- Preservar `Dancing Script` como recurso expresivo cuando corresponda y definir un fallback legible.
- Mantener el texto principal en espanol y revisar que no se corte en mobile.
- Revisar contraste y tamano minimo del titulo sobre el video.
- Evitar depender de una fuente remota sin un fallback funcional.

No debe:

- Convertir texto informativo en una imagen o SVG.
- Usar tipografia decorativa para controles o contenido que requiera lectura rapida.

## Agent Lima CSS

Responsable de estilos, composicion, responsive y sistema visual.

Trabaja en:

- `css/style.css`.

Debe:

- Mantener estilos en CSS, no en HTML ni JS.
- Preferir selectores claros y acotados, variables para valores repetidos y un enfoque mobile-first.
- Asegurar que el video no oculte el contenido y que los elementos centrales mantengan dimensiones estables.
- Respetar `prefers-reduced-motion` y evitar `!important` salvo una necesidad concreta.
- Revisar la landing en mobile y desktop despues de cambios grandes.

No debe:

- Cambiar markup o rutas de assets sin coordinar con Agent Rosa SVG.
- Introducir animaciones costosas o estilos que dificulten la lectura del titulo.

## Agent Milagros Motion

Responsable de animaciones, efectos y ritmo visual.

Trabaja en:

- `css/style.css` para keyframes, transiciones y efectos de fondo.
- `js/script.js` para la aparicion y limpieza de elementos decorativos.

Debe:

- Priorizar `transform` y `opacity` para animaciones eficientes.
- Mantener el brillo, flotacion y movimiento de rosas/corazones sutiles y coherentes con la escena.
- Respetar `prefers-reduced-motion`, incluyendo los intervalos que agregan decoracion.
- Evitar acumulacion de nodos y comprobar que `deletes()` siga limpiando los elementos generados.

No debe:

- Crear efectos que compitan con el mensaje central o bloqueen la interaccion.
- Referenciar APIs o librerias de animacion que no existan en el proyecto.

## Agent Oliva JS

Responsable de comportamiento, eventos y generacion dinamica.

Trabaja en:

- `js/script.js`.

Debe:

- Mantener JavaScript pequeno y compatible con la carga actual de jQuery.
- Mantener separadas la seleccion del logo, la generacion de decoracion y la limpieza de nodos.
- Validar con `node --check js/script.js` despues de cambios.
- Comprobar que las rutas relativas funcionen al servir el proyecto desde Apache.

No debe:

- Guardar HTML o SVG extenso en constantes si puede reutilizar assets de `resources/`.
- Introducir frameworks, carga de templates o dependencias nuevas sin necesidad real.

## Agent Monasterio Docs

Responsable de documentacion, reglas y contexto para IA y desarrolladores.

Trabaja en:

- `README.md`.
- `ia-context/`.

Debe:

- Mantener instrucciones accionables y alineadas con la estructura real del repositorio.
- Documentar cambios de arquitectura, dependencias, atribuciones de assets y despliegue en Apache.
- Corregir referencias obsoletas cuando cambie el flujo de la landing.
- Mantener la documentacion breve y evitar repetir reglas ya definidas.

No debe:

- Cambiar codigo de produccion durante una tarea solo documental, salvo que el usuario lo pida.

## Flujo recomendado

1. Identificar el archivo propietario del comportamiento antes de editar.
2. Coordinar cambios de markup, assets, estilos y movimiento con los agentes responsables.
3. Ejecutar `node --check js/script.js` si se toca JavaScript.
4. Revisar la landing en Chrome o Edge, en desktop y en anchos moviles comunes.
5. Confirmar que no haya errores de rutas, desbordes, contraste insuficiente ni acumulacion de elementos decorativos.
