# 🛫 ReservaVuelos - UX Flight Booking Experience

ReservaVuelos es una plataforma moderna diseñada bajo principios de **Design Thinking** y **UX/UI**, con el objetivo de simplificar el proceso de reserva de vuelos y reducir la tasa de abandono mediante una interfaz intuitiva y transparente.

---

## 💡 Propuesta de Valor
*   **Flujo Simplificado:** Proceso de reserva completable en solo 3 pasos (menos de 2 minutos).
*   **Transparencia Total:** Desglose de precios dinámico sin costos ocultos desde el inicio.
*   **Asistencia Inteligente:** Chatbot integrado con lógica de similitud de texto (Levenshtein) para búsquedas naturales.
*   **Validaciones Robustas:** Sistema de feedback en tiempo real para evitar errores de usuario.
*   **Diseño Adaptable:** Experiencia 100% responsive y soporte para **Dark Mode**.

---

## 🛠️ Stack Tecnológico
*   **Frontend:** HTML5 semántico, CSS3 (Animaciones, Flexbox, Grid), JavaScript ES6+.
*   **Frameworks:** Bootstrap 5 (Layout y componentes).
*   **Iconografía:** Font Awesome 6.
*   **Librerías:** jsPDF (Generación de comprobantes).
*   **Persistencia:** LocalStorage y SessionStorage (Simulación de base de datos local).

---

## 📋 Estructura del Proceso (UX Flow)
1.  **Búsqueda (index.html):** Buscador avanzado con autocompletado y selección de destinos destacados.
2.  **Resultados (resultados.html):** Listado dinámico con filtros por precio, escalas, aerolíneas y horarios.
3.  **Datos (reserva.html):** Formulario optimizado con selección de clase (Economy, Business, etc.) y beneficios.
4.  **Pago (pago.html):** Simulación de checkout con múltiples métodos de pago.
5.  **Éxito (confirmacion.html):** Generación de código de reserva único y descarga de ticket en PDF.

---

## 🤖 Funcionalidades Destacadas
*   **Chatbot Conversacional:** Permite buscar vuelos y realizar reservas mediante lenguaje natural.
*   **Buscador Inteligente:** Reconoce ciudades, países y códigos IATA, permitiendo además el intercambio rápido de rutas.
*   **Filtros Colapsables:** Panel de filtrado optimizado para visualización clara en dispositivos móviles.

---

## 🚀 Instalación y Uso Rápido
1.  Clona el repositorio o descarga los archivos.
2.  Abre `index.html` directamente en tu navegador (no requiere servidor para funciones básicas).
3.  **Ruta de prueba recomendada:**
    *   **Origen:** MIA (Miami)
    *   **Destino:** BOG (Bogotá)
    *   **Pasajeros:** 1
    *   **Acción:** Probar los filtros de precio y escalas antes de reservar.

---

## 📂 Organización de Archivos
*   `/css/style.css`: Estilos globales, variables y soporte de Dark Mode.
*   `/js/vuelos.js`: Base de datos simulada y lógica de búsqueda/filtrado.
*   `/js/reserva.js`: Gestión de validaciones y lógica del carrito de reserva.
*   `/js/app.js`: Orquestador principal de la interfaz y eventos globales.
*   `/js/chatbot.js`: Lógica de asistencia y resolución de lenguaje natural.

---

## ✅ Validaciones de Negocio
| Campo | Requerimiento |
|-------|--------------|
| **Nombre** | Mínimo 3 caracteres, debe incluir apellido. |
| **Correo** | Formato de email válido y longitud controlada. |
| **Teléfono** | Mínimo 9 dígitos, debe iniciar con `+`. |
| **Fechas** | No permite fechas pasadas; regreso posterior a la salida. |
| **Origen/Destino** | No pueden ser iguales. |

---

## 📈 Futuras Implementaciones
*   Conexión con APIs reales de aerolíneas (Amadeus/Sabre).
*   Sistema de autenticación y perfiles de usuario.
*   Pasarela de pago real (Stripe/PayPal).
*   Historial de reservas persistente en la nube (Firebase/Node.js).

---


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
