# Roles de Agentes — Calendify

Guia de trabajo para el proyecto Calendify, un sistema de citas y programación de turnos para clínica/tricología. El objetivo es mantener una app ligera y funcional, con agenda por profesional, selección de horario y guardado de citas en JSON/ PHP.

## Contexto del proyecto

- El proyecto es un sitio estático servido desde Apache con `index.html` como entrada principal.
- La lógica principal vive en `js/app.js` y usa FullCalendar para mostrar el calendario.
- La programación base se define en `js/programacion.json` y puede estar generada dinámicamente por horario recurrente + feriados.
- Las citas reservadas se guardan en `js/citas.json` desde `php/save_cita.php`.
- Hay variables de entorno en `.env` para endpoints externos, como DNI/RUC y APIs complementarias.
- El proyecto no requiere Composer para tareas simples; es suficiente un loader PHP ligero para leer `.env`.

## Principios compartidos

- Mantener el flujo de agenda y citas claro, legible y compatible con Apache.
- Preferir archivos separados: HTML, CSS, JS y PHP con responsabilidades definidas.
- No duplicar configuración ni endpoints; centralizar valores del entorno en `.env` y un loader PHP reutilizable.
- Respetar la lógica actual de programación por profesional, feriados y disponibilidad por horario.
- Revisar el impacto antes de tocar archivos que afecten calendario, input de DNI o guardado de citas.

## Agent Programación / Calendario

Responsable de la agenda del calendario, feriados, profesionales y rango horario.

Trabaja en:

- `js/programacion.json`
- `js/app.js` cuando se modifica la generación de eventos o filtros del calendario
- `php/save_cita.php` si afecta la validación de disponibilidad

Debe:

- Mantener el horario base por profesional configurado de forma reutilizable.
- Excluir feriados según el calendario oficial peruano y dejar solo esos eventos como específicos.
- Mantener la lógica de bloqueo de días y disponibilidad por profesional.
- Garantizar que `09:00` a `19:00` o el horario definido se repita sin escribir un evento por cada día manualmente.

No debe:

- Generar horarios duplicados por cada cambio de frontend.
- Hardcodear fechas o profesionales sin mantener el patrón del JSON.

## Agent Citas / Reservas

Responsable del flujo de reserva, validación de formulario y persistencia.

Trabaja en:

- `php/save_cita.php`
- `js/app.js` en el submit del formulario
- `js/citas.json` como almacenamiento local del proyecto

Debe:

- Validar profesional, horario, fecha, DNI y nombre antes de guardar.
- Mantener el guardado en JSON con estructura estable.
- Verificar disponibilidad evitando duplicados del mismo horario para el mismo profesional.
- Reutilizar la misma estructura de respuesta JSON para frontend y alertas.

No debe:

- Guardar citas sin validar datos mínimos.
- Añadir lógica de negocio fuera de `php/save_cita.php` si no es necesario.

## Agent Frontend UI

Responsable de la capa visual del calendario y formulario de cita.

Trabaja en:

- `index.html`
- `css/` para layout y estilos
- `js/app.js` para interacción con DOM y FullCalendar

Debe:

- Mantener un formulario claro, accesible y consistente con la marca.
- La carga del calendario y la selección de fechas deben ser intuitivas.
- Los inputs de DNI, nombre y horarios deben funcionar sin romper la lógica de reserva.
- Respetar el diseño existente y evitar frameworks nuevos.

No debe:

- Mezclar JS de negocio con estilos inline.
- Modificar la estructura del calendario sin revisar la lógica de horario y disponibilidad.

## Agent Integraciones / APIs

Responsable de integraciones externas y configuración de entorno.

Trabaja en:

- `.env`
- `php/env.php` o helper de entorno
- `js/app.js` si se consumen endpoints del navegador
- `php/` cuando se necesite consultar APIs desde backend

Debe:

- Usar variables desde `.env` cuando existan; evitar duplicar URLs o credenciales.
- Cargar valores del entorno con un helper PHP ligero, sin Composer si no hace falta.
- Mantener fallbacks para APIs alternas, por ejemplo DNI con `API_DNI_URL` y `API_DNI_URL_2`.
- Documentar cualquier endpoint nuevo y su estructura esperada.

No debe:

- Repetir constantes de URLs en varios archivos.
- Instalar paquetes de Composer para casos simples si no es necesario.

## Agent Docs / Configuración

Responsable de la documentación del proyecto y del contexto IA.

Trabaja en:

- `README.md`
- `.ia-context/`
- `.env` si se requiere documentar variables

Debe:

- Mantener la documentación alineada con la estructura real del proyecto.
- Explicar cuándo requiere Composer y cuándo no.
- Registrar convenciones de variables, endpoints y flujo de citas.
- Mantener cambios breves y accionables.

No debe:

- Documentar rutas hipotéticas o archivos inexistentes.
- Cambiar la lógica del producto mientras actualiza documentación.

## Flujo recomendado

1. Identificar el archivo propietario del cambio antes de editar.
2. Mantener separación entre calendario, formulario y guardado.
3. Cuando haya variables en `.env`, cargarlas con un helper reutilizable y no duplicarlas en el código.
4. Ejecutar validaciones simples: `php -l php/save_cita.php` y `php -l php/env.php` cuando se modifique PHP.
5. Verificar que la disponibilidad del calendario y el guardado de citas sigan funcionando correctamente.

## Reglas de entorno

- El proyecto puede funcionar sin Composer para la carga de `.env`.
- No es necesario instalar dependencias si solo se requiere leer un archivo `.env` y exponer variables por PHP.
- Si más adelante se agregan librerías reales, entonces sí podría evaluarse Composer, pero no es un requisito inicial.
