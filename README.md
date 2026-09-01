# Calendify 📅

[![forthebadge](http://forthebadge.com/images/badges/made-with-javascript.svg)](https://www.linkedin.com/in/drphp/)
[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](https://www.linkedin.com/in/drphp/)

<a href="https://www.instagram.com/amvsoft.tech/">
  <img src="https://cdn.dribbble.com/userupload/12985227/file/original-5a3bf8e49bf410f5e3a847d8ac725fc7.jpg" alt="Instagram" width="600">
</a>

## Funcionalidades

- Agenda visual mensual con eventos y horarios
- Configuración de programación por profesional y rango horario
- Validaciones de citas por fecha, horario y disponibilidad
- Consulta de DNI para autocompletar datos del paciente
- Persistencia de citas en archivos JSON
- Listeado de citas con DataTables
- Layout modular cargado dinámicamente mediante fragmentos HTML

## Estructura del proyecto

```text
calendify/
├── index.html
├── citas.html
├── css/
│   ├── backend.css
│   ├── backend-plugin.min.css
│   ├── main.css
│   └── ...
├── js/
│   ├── app.js
│   ├── citas-page.js
│   ├── layout.js
│   ├── programacion.json
│   ├── citas.json
│   └── ...
├── layout/
│   ├── header.html
│   ├── footer.html
│   └── dialog.html
├── php/
│   ├── save_cita.php
│   └── env.php
├── images/
├── fonts/
└── README.md
```

## Requisitos

- Servidor web local con Apache o equivalente
- PHP habilitado
- Navegador moderno

## Inicio rápido

1. Clona el repositorio:

```bash
git clone https://github.com/phpeitor/calendify.git
cd calendify
```

2. Levanta el proyecto en un servidor local, por ejemplo con Apache:

```bash
php -S localhost:8000
```

3. Abre en el navegador:

```text
http://localhost:8000/index.html
```

## Configuración de programación

La programación base se define en `js/programacion.json` y se expande de forma dinámica en el calendario. Este archivo permite establecer rangos por profesional, fechas de inicio/fin y feriados nacionales.

## Guardado de citas

Las citas se manejan en `js/citas.json` y se guardan desde `php/save_cita.php`. La lógica valida:

- horarios disponibles
- duplicados por profesional y rango de tiempo
- datos requeridos del formulario
- restricciones por horario mínimo y feriados

## Consideraciones

- Este proyecto está pensado como una solución ligera, sin framework, para ambientes de hosting simple o Apache local.
- Para producción se recomienda reforzar validaciones del lado del servidor, auditoría de datos y almacenamiento persistente robusto.
- La parte visual usa estilos y componentes predefinidos dentro del proyecto, con modularización progresiva del frontend.