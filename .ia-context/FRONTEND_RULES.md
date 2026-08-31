# Reglas de Desarrollo Frontend — Calendify

## Contexto
- **Proyecto**: sistema de citas y programación para clínica / consultorio de tricología.
- **Objetivo**: mantener un calendario funcional, un formulario de reserva y una experiencia simple para pacientes.

## Estructura de proyecto
- **Carpetas**:
  - `index.html` — pantalla principal del calendario y formulario de citas.
  - `css/` — estilos del backend y layout visual.
  - `js/` — scripts de calendario, reglas, datos y lógica de interacción.
  - `php/` — backend ligero para guardar citas y cargar configuración.
  - `images/` y `fonts/` — assets estáticos.
- **Regla**: HTML, CSS, JS y PHP deben mantenerse separados por responsabilidad.
- **Datos**: `js/programacion.json` define la programación base y `js/citas.json` guarda las citas generadas.
- **Entorno**: `.env` almacena endpoints y valores reutilizables para APIs externas.

## HTML
- **Idioma**: usar `lang="es"` cuando corresponda.
- **Semántica**: usar formularios y secciones con estructura clara.
- **Inputs**: DNI, nombre, email, teléfono, dirección y comentario deben ser consistentes y requeridos según el flujo.
- **Accesibilidad**: placeholder y labels claros; mantener inputs navegables por teclado.

## CSS
- **Metodología**: CSS modular, clases claras y no mezclar estilos con JS.
- **Variables**: usar variables para colores, radios y espaciado si aplica.
- **Responsive**: adaptar la vista a desktop y mobile; el calendario debe mantener legibilidad.
- **Evitar**: `!important` a menos que sea indispensable.

## JavaScript
- **Vanilla**: preferir JavaScript simple y compatible con jQuery/FullCalendar ya usado.
- **Modularidad**: separar lógica de calendario, validación y reserva de citas.
- **Eventos**: usar delegación para formularios, cambios de horario y selección de fecha.
- **Fallbacks**: si una API falla, usar una alternativa; ejemplo DNI con `API_DNI_URL` y `API_DNI_URL_2`.

## PHP
- **Backend ligero**: `php/save_cita.php` guarda citas usando JSON.
- **Variables de entorno**: no duplicar URLs ni endpoints; cargar valores desde `.env` mediante `php/env.php`.
- **Sin Composer por defecto**: no es necesario para este proyecto mientras solo se requiera leer un `.env` y usarlo en PHP.
- **Persistencia**: mantener `js/citas.json` con formato JSON válido y serialización segura.

## Entorno y configuración
- **Archivo `.env`**: almacenar endpoints y valores compartidos.
- **Loader**: usar `php/env.php` para parsear `.env` con `putenv`, `$_ENV` y `$_SERVER` sin dependencias.
- **Ejemplo**:
  - `API_DNI_URL`
  - `API_DNI_URL_2`
  - `API_RUC_URL`
  - `API_RUC_URL_2`
- **Regla**: si existe una variable en `.env`, debe usarse y no repetirse en el código.

## Accesibilidad (A11y)
- **Contraste**: garantizar legibilidad adecuada entre texto y fondo.
- **Formulario**: cada campo debe ser claro y validado antes de guardar.
- **Navegación**: mantener interacción por teclado y soporte para alertas simples.

## Rendimiento
- **Carga**: mantener assets ligeros y evitar dependencias innecesarias.
- **Calendario**: no saturar con muchos eventos redundantes; usar programación base + feriados excluyentes.
- **Cache**: cuando sea posible, usar cache del navegador para assets estáticos.

## Seguridad y privacidad
- **No exponer secretos**: no subir tokens ni credenciales al repositorio.
- **Datos sensibles**: DNI, nombre y teléfono deben manejarse con cuidado y validación.
- **Límites**: no usar APIs externas sin revisar cumplimiento y respuesta esperada.

## Despliegue
- **Servidor**: Apache / PHP local o servidor web estático + PHP habilitado.
- **Ruta**: servir la aplicación desde la raíz del proyecto y mantener rutas relativas en HTML y JS.
- **Configuración**: si se usa PHP para env, asegurar que `php` esté habilitado en el servidor.

## Testing y QA
- **Validación**: comprobar `php -l php/save_cita.php` y `php -l php/env.php` tras cambios PHP.
- **Checklist**: verificar formulario, selección de nombre por DNI, citas y pantalla del calendario.

## Reglas de contribución
- **Cambios pequeños y específicos**.
- **No introducir frameworks nuevos** sin necesidad real.
- **Documentar** cualquier cambio de configuración o endpoint nuevo.

## Recomendación
- Para este proyecto, Composer no es necesario al inicio.
- Un loader PHP pequeño es suficiente para resolver `.env` y reutilizar variables sin repetir URLs en varios archivos.