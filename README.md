# ReservaVuelos 🛫

Aplicación web de búsqueda y reserva de vuelos desarrollada con enfoque en Experiencia de Usuario (UX) y Design Thinking.

## Descripción

ReservaVuelos busca mejorar la experiencia de compra de pasajes mediante:

* Menor cantidad de pasos para reservar.
* Transparencia en los precios.
* Interfaz intuitiva y moderna.
* Diseño responsive.
* Validaciones amigables.
* Persistencia mediante LocalStorage.

## Objetivos

* Mejorar la experiencia de usuario en plataformas de reserva.
* Reducir el abandono durante el proceso de compra.
* Simplificar la navegación y los formularios.
* Mostrar precios claros y sin costos ocultos.

## Estructura del Proyecto

```text
proyecto-vuelos/
│
├── index.html
├── resultados.html
├── reserva.html
├── confirmacion.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── vuelos.js
│   ├── reserva.js
│   └── app.js
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

## Pantallas

### Inicio

* Búsqueda de vuelos.
* Selección de origen y destino.
* Fechas de viaje.
* Número de pasajeros.

### Resultados

* Listado de vuelos disponibles.
* Filtros de búsqueda.
* Precio final visible.
* Selección de vuelo.

### Reserva

* Datos del pasajero.
* Resumen de compra.
* Validaciones de formulario.
* Confirmación de datos.

### Confirmación

* Código de reserva.
* Resumen final.
* Mensaje de éxito.

## Tecnologías Utilizadas

* HTML5
* CSS3
* JavaScript (ES6+)
* Bootstrap 5
* Font Awesome
* LocalStorage

## Instalación

1. Descargar o clonar el proyecto.

```bash
git clone URL_DEL_REPOSITORIO
```

2. Abrir el proyecto en Visual Studio Code.

3. Ejecutar mediante Live Server o abrir `index.html` en un navegador.

## Funcionalidades

* Buscar vuelos.
* Filtrar resultados.
* Seleccionar vuelos.
* Registrar datos del pasajero.
* Generar reserva.
* Guardar información localmente.
* Diseño responsive.

## Validaciones

* Campos obligatorios.
* Correos válidos.
* Teléfonos válidos.
* Fechas posteriores a la fecha actual.
* Retroalimentación visual para errores.

## Mejoras Futuras

* Integración con API de vuelos.
* Base de datos real.
* Historial de reservas.
* Exportación de reservas en PDF.
* Sistema de usuarios.

