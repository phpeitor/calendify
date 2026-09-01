# Calendify 📅

[![forthebadge](http://forthebadge.com/images/badges/made-with-javascript.svg)](https://www.linkedin.com/in/drphp/)
[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

<a href="https://www.instagram.com/amvsoft.tech/">
  <img src="https://cdn.dribbble.com/userupload/12985227/file/original-5a3bf8e49bf410f5e3a847d8ac725fc7.jpg" alt="Instagram" width="600">
</a>

## Descripción

Calendify es una aplicación web ligera para gestionar citas médicas desde un entorno Apache/PHP sin framework backend pesado. La aplicación combina una agenda visual, registro de citas, administración de estados, autenticación por sesión y persistencia simple en archivos JSON.

El proyecto está pensado para despliegues pequeños, demos funcionales o instalaciones internas donde se prioriza simplicidad operativa sobre infraestructura compleja.

## Funcionalidades

- Calendario visual con disponibilidad por profesional.
- Registro de citas desde formulario modal.
- Validación de campos obligatorios, correo, teléfono, fecha y horario.
- Control de horarios ocupados para evitar duplicados por profesional.
- Consulta de DNI usando endpoints configurables desde `.env`.
- Persistencia de citas en `js/citas.json`.
- Tabla administrativa de citas con DataTables.
- Cambio de estado de citas: `Enviado`, `Confirmado`, `Anulado`.
- Confirmación modal para acciones sensibles.
- Comentarios truncados en tabla con tooltip de contenido completo.
- Login con animación Rive integrada.
- Sesión autenticada de 60 minutos para páginas privadas.
- Logout funcional desde el header.
- Layout modular mediante fragmentos HTML reutilizables.

## Arquitectura

Calendify usa una arquitectura simple basada en archivos estáticos, JavaScript modular y endpoints PHP pequeños.

```text
Navegador
  -> HTML estático
  -> JS de página
  -> JSON local para datos operativos
  -> PHP para escritura, autenticación y sesión
```

La aplicación no usa base de datos. Las citas se guardan directamente en `js/citas.json`, por lo que el servidor web debe tener permisos de escritura sobre ese archivo.

## Estructura

```text
calendify/
├── index.html                  # Página pública principal y calendario
├── login.html                  # Login con Rive y reCAPTCHA
├── citas.html                  # Listado privado de citas
├── phones.html                 # Página privada de teléfonos
├── users.html                  # Página privada de usuarios
├── css/
│   ├── backend.css
│   ├── backend-plugin.min.css
│   ├── login-validation.css
│   └── ...
├── js/
│   ├── app.js                  # Lógica principal del calendario y registro
│   ├── auth-guard.js           # Protección de páginas privadas
│   ├── citas-page.js           # Tabla administrativa de citas
│   ├── index-qXMyHo4h.js       # Bundle del login/Rive
│   ├── layout.js               # Carga de header/footer/dialogs y logout
│   ├── login-redirect.js       # Redirección si ya existe sesión
│   ├── citas.json              # Persistencia de citas
│   └── programacion.json       # Programación base del calendario
├── layout/
│   ├── header.html
│   ├── footer.html
│   └── dialog.html
├── php/
│   ├── auth_check.php
│   ├── auth_login.php
│   ├── auth_logout.php
│   ├── env.php
│   ├── save_cita.php
│   └── update_estado_cita.php
├── resources/
│   ├── login.riv
│   └── main.mov
├── images/
├── fonts/
└── README.md
```

## Requisitos

- Apache, Nginx o servidor local equivalente.
- PHP 7.4 o superior.
- Navegador moderno con soporte para módulos JavaScript.
- Permisos de escritura sobre `js/citas.json` si se registran o actualizan citas.

## Configuración

Crear un archivo `.env` en la raíz del proyecto. No versionar credenciales reales.

```env
API_DNI_URL="https://api.apis.net.pe/v1/dni?numero="
API_DNI_URL_2="https://panuts.com/wp-json/pvm/v1"
API_RUC_URL="https://api.apis.net.pe/v1/ruc?numero="
API_RUC_URL_2="https://panuts.com/wp-json/pvm"
IP_API_URL="https://api.ipify.org"

USUARIO_LOGIN="administrador"
PASSWORD_LOGIN="cambiar-en-produccion"

RECAPTCHA_SITE_KEY="site-key-publica"
RECAPTCHA_SECRET="secret-key-privada"
```

## Ejecución Local

Con Apache, ubicar el proyecto dentro del `DocumentRoot`, por ejemplo:

```text
C:\Apache24\htdocs\calendify
```

Abrir:

```text
http://127.0.0.1/calendify/index.html
```

Alternativamente, para pruebas rápidas con PHP embebido:

```bash
php -S 127.0.0.1:8000
```

Abrir:

```text
http://127.0.0.1:8000/index.html
```

## Autenticación

Las credenciales se leen desde `.env` mediante `php/env.php`.

- `login.html` valida contra `php/auth_login.php`.
- `auth_login.php` crea una sesión PHP con duración de 60 minutos.
- `auth_check.php` verifica si la sesión sigue activa.
- `auth_logout.php` destruye la sesión.
- `js/auth-guard.js` redirige a `login.html` si la sesión no existe o expiró.

Páginas privadas:

- `citas.html`
- `phones.html`
- `users.html`

Página pública:

- `index.html`

Si el usuario ya tiene sesión activa y visita `login.html`, se redirige automáticamente a `citas.html`.

## reCAPTCHA

El login carga reCAPTCHA v3 usando el site key configurado en el DOM o en `.env`. Al enviar el formulario, el frontend genera un token con `grecaptcha.execute(...)` y lo envía a `auth_login.php`.

La validación real ocurre en servidor solo si existe `RECAPTCHA_SECRET` o `RECAPTCHA_SECRET_KEY` en `.env`. Si no hay secret configurado, el login queda operativo sin validación server-side de reCAPTCHA.

## Rive

El login usa `resources/login.riv` con:

- Artboard: `Harold`
- State machine: `State Machine 1`
- Inputs booleanos: `Happy`, `Angry`

Estados esperados:

- Login correcto: `Happy=true`, `Angry=false`
- Login incorrecto: `Happy=false`, `Angry=true`
- Interacción con password: `Happy=false`, `Angry=false`

## Datos

### Programación

La programación base se define en `js/programacion.json`. Desde ahí se generan rangos de disponibilidad por profesional y se excluyen fechas bloqueadas o feriados configurados.

### Citas

Las citas se persisten en `js/citas.json` bajo la clave `events`.

Campos principales:

- `id`
- `profesional`
- `nombre`
- `correo`
- `dni`
- `telefono`
- `direccion`
- `comentario`
- `fecha_cita`
- `start`
- `end`
- `estado`
- `createdAt`

## Endpoints PHP

```text
POST php/save_cita.php
POST php/update_estado_cita.php
POST php/auth_login.php
GET  php/auth_check.php
POST php/auth_logout.php
```

Los endpoints responden JSON y usan códigos HTTP convencionales para errores de validación, autenticación o escritura.

## Seguridad

- No exponer `.env` públicamente en producción.
- Cambiar `PASSWORD_LOGIN` antes de desplegar.
- Usar HTTPS si se despliega fuera de un entorno local.
- Migrar persistencia JSON a base de datos si habrá múltiples usuarios concurrentes.
- Validar permisos de escritura de forma explícita en el servidor.
- Evitar servir backups o archivos temporales dentro del `DocumentRoot`.

## Mantenimiento

- Mantener `js/citas.json` respaldado si se usa como fuente de datos real.
- Revisar que `resources/login.riv` conserve los nombres de artboard, state machine e inputs si se reemplaza el asset.
- Si se modifica el bundle del login, actualizar el query string en `login.html` para evitar caché del navegador.
- Validar sintaxis PHP con `php -l archivo.php` después de tocar endpoints.
- Validar sintaxis JS con `node --check archivo.js` cuando se editen scripts manualmente.
