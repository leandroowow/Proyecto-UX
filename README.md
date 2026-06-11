# ReservaVuelos 🛫

> Aplicación web moderna de búsqueda y reserva de vuelos con enfoque en **Design Thinking** y **Experiencia de Usuario (UX)**

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/Status-Development-yellow.svg)

## 📋 Descripción

**ReservaVuelos** es una solución integral para mejorar la experiencia de compra de vuelos. La aplicación aborda los principales problemas de usabilidad en plataformas de reserva:

- ✅ **Pocos pasos** - Solo 3 pasos para completar una reserva
- ✅ **Transparencia de precios** - Sin costos ocultos
- ✅ **Interfaz intuitiva** - Diseño moderno y minimalista
- ✅ **Responsive** - Funciona en móvil, tablet y escritorio
- ✅ **Validaciones amigables** - Mensajes de error claros
- ✅ **Persistencia** - Guardado en LocalStorage

---

## 🎯 Objetivos del Proyecto

Este proyecto implementa metodología **Design Thinking** con enfoque en UX/UI:

1. **Investigación**: Análisis de problemas comunes en apps de reservas
2. **Empatía**: Diseño pensado en el usuario
3. **Ideación**: Soluciones minimalistas y efectivas
4. **Prototipado**: HTML5/CSS3/JavaScript funcional
5. **Testing**: Validaciones y retroalimentación visual

---

## 🏗️ Estructura del Proyecto

```
proyecto-vuelos/
│
├── index.html                 # Página de inicio (búsqueda)
├── resultados.html            # Página de resultados
├── reserva.html               # Página de datos del pasajero
├── confirmacion.html          # Página de confirmación
│
├── css/
│   └── style.css              # Estilos globales (profesionales)
│
├── js/
│   ├── vuelos.js              # Datos y lógica de vuelos
│   ├── reserva.js             # Validaciones y gestión de reserva
│   └── app.js                 # Lógica principal y navegación
│
├── assets/
│   ├── images/                # (Preparado para imágenes)
│   └── icons/                 # (Preparado para iconos)
│
└── README.md                  # Este archivo
```

---

## 🎨 Pantallas

### 1. **Inicio (Búsqueda)**
- Hero section atractivo
- Formulario de búsqueda con validación
- Información sobre ventajas
- Diseño tipo aerolínea comercial

### 2. **Resultados**
- Tarjetas de vuelos claras
- Información: horario, duración, escalas
- Precio total visible
- Filtros: precio, escalas, horario
- Paginación

### 3. **Reserva**
- Indicador de progreso (3 pasos)
- Formulario simplificado
- Validaciones en tiempo real
- Resumen del vuelo y precios
- Desglose transparente: tarifa + impuestos + equipaje

### 4. **Confirmación**
- Mensaje de éxito con animación
- Código de reserva generado
- Resumen completo de compra
- Opciones: buscar otro vuelo o descargar

---

## 💻 Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **HTML5** | - | Estructura semántica |
| **CSS3** | - | Estilos responsive |
| **JavaScript** | ES6+ | Lógica e interactividad |
| **Bootstrap** | 5.3.0 | Framework responsive |
| **Font Awesome** | 6.4.0 | Iconografía |
| **LocalStorage** | - | Persistencia de datos |

---

## 🚀 Instalación

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para CDN de Bootstrap y Font Awesome)
- Opcional: Servidor local (Live Server, Python SimpleHTTPServer, npm start, etc.)

### Pasos

1. **Clonar o descargar el repositorio**
   ```bash
   git clone https://github.com/usuario/proyecto-vuelos.git
   cd proyecto-vuelos
   ```

2. **Abrir en navegador**
   - Opción A: Doble clic en `index.html`
   - Opción B: Usar un servidor local
   
   ```bash
   # Con npm
   npm start

   # Con Node directo
   node server.js

   # Con Python 3
   python -m http.server 8000
   
   # Con Python 2
   python -m SimpleHTTPServer 8000
   
   # Con Node.js (http-server)
   npx http-server
   ```

3. **Acceder a la aplicación**
   ```
   http://localhost:3000
   ```

---

## 📖 Uso de la Aplicación

### Flujo de Usuario

1. **Búsqueda** (index.html)
   - Ingresa origen, destino, fechas
   - Click en "Buscar vuelos"

2. **Resultados** (resultados.html)
   - Visualiza vuelos disponibles
   - Usa filtros para refinar
   - Click en "Reservar" en el vuelo deseado

3. **Datos** (reserva.html)
   - Completa formulario
   - Verifica precio transparente
   - Click en "Continuar"

4. **Confirmación** (confirmacion.html)
   - Código de reserva
   - Resumen de compra
   - Opciones siguientes

### Ciudades Disponibles (Demo)
```
MIA → Miami
NYC → Nueva York
BOG → Bogotá
MEX → Ciudad de México
LIM → Lima
SCL → Santiago
SAO → São Paulo
BUE → Buenos Aires
CCS → Caracas
QTO → Quito
```

---

## 🔧 Características Técnicas

### Validaciones
- ✅ Nombres: mínimo 3 caracteres, solo letras
- ✅ Correo: formato válido
- ✅ Teléfono: mínimo 9 dígitos
- ✅ Fechas: no pueden ser en el pasado
- ✅ Campos requeridos: con feedback visual

### Persistencia
- LocalStorage para guardar reservas
- SessionStorage para datos temporales
- Generación automática de código de reserva

### Responsividad
- **Mobile**: Optimizado para 320px+
- **Tablet**: 768px+ (layout adaptado)
- **Desktop**: 1200px+ (experiencia completa)

### Accesibilidad
- Etiquetas semánticas HTML5
- Contraste de colores WCAG AA
- Soporte para lectores de pantalla
- Animaciones que respetan `prefers-reduced-motion`

---

## 📊 Datos Simulados

La aplicación usa datos simulados en JavaScript (sin backend):

```javascript
// Ejemplo de vuelo
{
    id: 1,
    aerolinea: 'LA',
    numero: 'LA-505',
    salida: '06:30',
    llegada: '10:45',
    duracion: '4h 15m',
    escalas: 0,
    precioBase: 450,
    impuestos: 45,
    equipaje: 30
}
```

**Nota**: Para una versión real, conectar a una API backend.

---

## 🔐 Seguridad

- Las reservas se almacenan localmente en el navegador
- No se envían datos a servidores externos
- Contraseñas: No se solicitan (demo)
- Para producción, implementar:
  - Backend seguro
  - Encriptación SSL/TLS
  - Autenticación robusta

---

## 🎓 Principios de Design Thinking Aplicados

### 1. **Empatizar**
- Análisis de problemas de UX comunes
- Reducción de pasos en el flujo

### 2. **Definir**
- 3 pasos máximo para reservar
- Precios 100% transparentes
- Navegación clara

### 3. **Idear**
- Tarjetas de vuelos claras
- Filtros intuitivos
- Indicador de progreso

### 4. **Prototipado**
- HTML5 semántico
- CSS3 moderno
- JavaScript vanilla

### 5. **Testing**
- Validaciones en tiempo real
- Mensajes amigables
- Feedback visual

---

## 📈 Estadísticas de Implementación

| Métrica | Valor |
|---------|-------|
| Líneas de código HTML | ~450 |
| Líneas de código CSS | ~550 |
| Líneas de código JavaScript | ~900 |
| Funciones totales | 45+ |
| Validaciones | 8 |
| Animaciones | 6 |
| Breakpoints responsive | 2 |

---

## 🐛 Debugging y Testing

### Consola del Navegador
Abre F12 para acceder a herramientas de desarrollo:

```javascript
// Ver todas las reservas guardadas
JSON.parse(localStorage.getItem('reservasVuelos'))

// Limpiar todas las reservas
localStorage.clear()

// Ver criterios de búsqueda
JSON.parse(sessionStorage.getItem('criteriosBusqueda'))
```

### Estados de Testing
1. Búsqueda válida con vuelos disponibles
2. Búsqueda sin resultados
3. Validación de formulario con errores
4. Completar reserva exitosamente
5. Modificar búsqueda desde resultados

---

## 🚀 Mejoras Futuras

### Corto Plazo
- [ ] Filtro por aerolínea
- [ ] Ordenamiento personalizado
- [ ] Compartir código de reserva
- [ ] Descargar confirmación en PDF

### Mediano Plazo
- [ ] Backend con base de datos real
- [ ] Integración con APIs de vuelos
- [ ] Autenticación de usuarios
- [ ] Historial de reservas
- [ ] Múltiples monedas

### Largo Plazo
- [ ] App móvil nativa
- [ ] Notificaciones push
- [ ] Seguimiento de precios
- [ ] Recomendaciones personalizadas
- [ ] Programa de lealtad

---

## 👨‍💻 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Commits Sugeridos

```bash
# Commit 1: Estructura inicial
git commit -m "feat: crear estructura base del proyecto con 4 pantallas"

# Commit 2: Estilos
git commit -m "style: implementar CSS responsive con Bootstrap 5"

# Commit 3: Datos
git commit -m "feat: agregar datos simulados y funciones de vuelos"

# Commit 4: Validaciones
git commit -m "feat: implementar validaciones de formulario"

# Commit 5: Lógica
git commit -m "feat: completar flujo de búsqueda y reserva"

# Commit 6: Persistencia
git commit -m "feat: integrar LocalStorage para guardar reservas"

# Commit 7: Documentación
git commit -m "docs: agregar README completo"
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Autor

**Tu Nombre**
- GitHub: [@usuario](https://github.com/usuario)
- LinkedIn: [Perfil](https://linkedin.com/in/usuario)
- Email: correo@ejemplo.com

---

## 📞 Soporte

Para reportar issues o sugerencias:

1. Abre un [GitHub Issue](https://github.com/usuario/proyecto-vuelos/issues)
2. Incluye descripción clara
3. Adjunta screenshots si es necesario

---

## 🎉 Agradecimientos

- **Bootstrap Team** - Framework CSS
- **Font Awesome** - Iconografía
- **Comunidad de Desarrollo** - Inspiración y mejores prácticas

---

<div align="center">

**Hecho con ❤️ aplicando Design Thinking y UX/UI moderno**

⭐ Si te fue útil, no olvides dejar una estrella

</div>
