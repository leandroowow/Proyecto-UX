# 📑 Índice Completo del Proyecto

Guía rápida de navegación por todos los archivos

---

## 🎯 COMIENZA AQUÍ

### Si tienes **2 minutos**
→ Lee: [QUICK_START.md](./QUICK_START.md)

### Si tienes **5 minutos**
→ Lee: [RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md)

### Si tienes **30 minutos**
→ Lee: [README.md](./README.md)

---

## 📁 Estructura del Proyecto

```
proyecto-vuelos/
│
├── 📄 ARCHIVOS DE DOCUMENTACIÓN
│   ├── README.md                    ← Documentación técnica completa
│   ├── QUICK_START.md              ← Inicio rápido (2 minutos)
│   ├── TESTING.md                  ← Guía de pruebas detallada
│   ├── COMMITS.md                  ← Historial de desarrollo
│   ├── RESUMEN_EJECUTIVO.md        ← Resumen para presentación
│   └── INDICE.md                   ← Este archivo
│
├── 🌐 ARCHIVOS HTML (Pantallas)
│   ├── index.html                  ← Página de inicio/búsqueda
│   ├── resultados.html             ← Página de resultados
│   ├── reserva.html                ← Página de datos pasajero
│   └── confirmacion.html           ← Página de confirmación
│
├── 🎨 CARPETA CSS
│   └── style.css                   ← Estilos globales (550 líneas)
│
├── ⚙️ CARPETA JS
│   ├── vuelos.js                   ← Datos y funciones de vuelos (350 líneas)
│   ├── reserva.js                  ← Validaciones y gestión (300 líneas)
│   └── app.js                      ← Lógica principal (550 líneas)
│
└── 🎁 CARPETA ASSETS
    ├── images/                     ← (Preparado para imágenes)
    └── icons/                      ← (Preparado para iconos)
```

---

## 📖 Guía de Documentación

### 1. **README.md** (Documentación Técnica)
**Contenido**:
- Descripción del proyecto
- Objetivos y características
- Stack tecnológico
- Estructura de archivos
- Instrucciones de instalación
- Guía de uso
- Características técnicas
- Principios de Design Thinking

**Leer si quieres**: Entender todo sobre el proyecto

---

### 2. **QUICK_START.md** (Inicio Rápido)
**Contenido**:
- 2 opciones para ejecutar
- Flujo de prueba (5 minutos)
- Ciudades disponibles
- Validaciones rápidas
- Verificación de datos
- Prueba en móvil
- Troubleshooting

**Leer si quieres**: Empezar rápido sin detalles

---

### 3. **TESTING.md** (Guía de Pruebas)
**Contenido**:
- Casos de prueba detallados
- Pruebas por pantalla
- Validaciones a probar
- Pruebas de consola
- Pruebas responsivas
- Debugging
- Checklist final

**Leer si quieres**: Hacer pruebas completas de la app

---

### 4. **COMMITS.md** (Historial de Desarrollo)
**Contenido**:
- 13 commits sugeridos
- Descripción de cada fase
- Convenciones de commits
- Estadísticas de commits
- Buenas prácticas

**Leer si quieres**: Comprender el desarrollo paso a paso

---

### 5. **RESUMEN_EJECUTIVO.md** (Para Presentación)
**Contenido**:
- Objetivo del proyecto
- Problemas identificados
- Soluciones implementadas
- Características clave
- Tecnologías usadas
- Validaciones
- Metodología Design Thinking
- ROI esperado

**Leer si quieres**: Presentar a directivos/clientes

---

### 6. **INDICE.md** (Este Archivo)
**Contenido**:
- Guía de navegación
- Descripción de archivos
- Rutas de navegación

**Leer si quieres**: Orientarte en el proyecto

---

## 🌐 Archivos HTML

### index.html (Página de Inicio)
```
Ruta: c:\Users\leand\Desktop\...\Proyecto-UX\index.html

Componentes:
- Navbar con logo
- Hero section
- Formulario de búsqueda
- Sección de ventajas (4 tarjetas)
- Footer

Funcionalidad:
- Búsqueda de vuelos
- Validación de inputs
- Redirección a resultados
```

**Abre aquí para empezar →** [index.html](./index.html)

---

### resultados.html (Página de Resultados)
```
Ruta: c:\Users\leand\Desktop\...\Proyecto-UX\resultados.html

Componentes:
- Resumen de búsqueda
- Panel de filtros (sidebar)
- Grid de vuelos (tarjetas)
- Paginación
- Modal de confirmación

Funcionalidad:
- Muestra 8 vuelos
- Filtra por precio, escalas, horario
- Selecciona vuelo → Modal
- Redirección a reserva
```

---

### reserva.html (Página de Reserva)
```
Ruta: c:\Users\leand\Desktop\...\Proyecto-UX\reserva.html

Componentes:
- Indicador de progreso (paso 2/3)
- Formulario (nombre, correo, teléfono)
- Resumen del vuelo (sidebar)
- Desglose de precios

Funcionalidad:
- Validaciones en tiempo real
- Resumen actualizado
- Redirección a confirmación
```

---

### confirmacion.html (Página de Confirmación)
```
Ruta: c:\Users\leand\Desktop\...\Proyecto-UX\confirmacion.html

Componentes:
- Indicador de progreso (paso 3/3 completo)
- Mensaje de éxito
- Código de reserva
- Resumen completo
- Botones de acción

Funcionalidad:
- Muestra código único
- Resumen de compra
- Datos guardados en LocalStorage
- Opción para buscar otro vuelo
```

---

## 🎨 Archivo CSS

### style.css (Estilos Globales)
```
Ruta: c:\Users\leand\Desktop\...\Proyecto-UX\css\style.css

Secciones:
- Variables CSS (colores, sombras)
- Reset y globales
- Navbar
- Hero section
- Search section
- Buttons
- Forms
- Cards
- Progress indicator
- Animations
- Responsive design
- Accessibility

Tamaño: ~550 líneas
```

---

## ⚙️ Archivos JavaScript

### vuelos.js (Datos y Lógica)
```
Ruta: c:\Users\leand\Desktop\...\Proyecto-UX\js\vuelos.js

Contiene:
- Array de datos de 8 vuelos
- Ciudades disponibles
- Aerolíneas
- Funciones de búsqueda
- Funciones de filtrado
- Funciones de ordenamiento
- Validaciones
- Generación de códigos

Funciones principales: 20+
Líneas: ~350
```

---

### reserva.js (Validaciones)
```
Ruta: c:\Users\leand\Desktop\...\Proyecto-UX\js\reserva.js

Contiene:
- Objeto de reserva actual
- Validaciones de nombre
- Validaciones de correo
- Validaciones de teléfono
- Validación de formulario
- Guardar datos
- Completar reserva
- LocalStorage (guardar/obtener)

Funciones principales: 15+
Líneas: ~300
```

---

### app.js (Lógica Principal)
```
Ruta: c:\Users\leand\Desktop\...\Proyecto-UX\js\app.js

Contiene:
- Inicialización por página
- Manejo de búsqueda
- Carga de resultados
- Creación de tarjetas
- Gestión de filtros
- Paginación
- Modal de confirmación
- Flujo de reserva
- Confirmación y guardado

Funciones principales: 25+
Líneas: ~550
```

---

## 🚀 Rutas de Navegación

### Flujo Principal
```
1. index.html (Inicio)
   ↓ [Buscar]
2. resultados.html (Resultados)
   ↓ [Reservar]
3. reserva.html (Datos)
   ↓ [Continuar]
4. confirmacion.html (Éxito)
   ↓ [Nuevo vuelo]
5. index.html (Vuelta al inicio)
```

### Navegación Libre
- Logo → index.html (siempre)
- Botón "Nueva búsqueda" → index.html
- Botón "Atrás" → página anterior
- "Buscar otro vuelo" → index.html

---

## 💡 Cómo Usar Este Índice

### Para Desarrolladores
1. Busca el archivo que necesitas
2. Ve a su sección en este índice
3. Haz clic en el enlace o ruta

### Para Usuarios
1. Lee QUICK_START.md primero
2. Abre index.html
3. Sigue el flujo

### Para Presentaciones
1. Lee RESUMEN_EJECUTIVO.md
2. Ejecuta la app
3. Muestra TESTING.md para validar

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Archivos HTML | 4 |
| Archivos CSS | 1 |
| Archivos JS | 3 |
| Archivos Markdown | 6 |
| **Total de archivos** | **14** |
| Líneas de código | ~1,900 |
| Líneas de documentación | ~2,500 |
| **Total de líneas** | **~4,400** |

---

## 🎯 Accesos Rápidos

### Para Empezar
- [QUICK_START.md](./QUICK_START.md) - 2 minutos
- [index.html](./index.html) - Abrir app

### Para Entender
- [README.md](./README.md) - Documentación
- [RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md) - Para jefes

### Para Probar
- [TESTING.md](./TESTING.md) - Pruebas
- [QUICK_START.md](./QUICK_START.md) - Flujo rápido

### Para Desarrollar
- [COMMITS.md](./COMMITS.md) - Historial
- [js/](./js/) - Código fuente
- [css/style.css](./css/style.css) - Estilos

---

## ✅ Checklist de Lectura

- [ ] QUICK_START.md (2 min)
- [ ] Abrir index.html (5 min)
- [ ] Hacer una búsqueda (5 min)
- [ ] Completar una reserva (5 min)
- [ ] Leer README.md (10 min)
- [ ] Revisar TESTING.md (10 min)
- [ ] Verificar COMMITS.md (5 min)

**Tiempo total**: ~42 minutos para entender todo

---

## 🎓 Aprendizajes

Este proyecto demuestra:
- ✅ Design Thinking aplicado
- ✅ UX/UI moderno
- ✅ HTML5 semántico
- ✅ CSS3 responsive
- ✅ JavaScript ES6+
- ✅ LocalStorage
- ✅ Validaciones
- ✅ Documentación profesional

---

## 📞 Dudas Frecuentes

**P: ¿Dónde empiezo?**  
R: Abre [QUICK_START.md](./QUICK_START.md)

**P: ¿Cómo ejecuto la app?**  
R: Doble clic en [index.html](./index.html)

**P: ¿Cómo hago pruebas?**  
R: Lee [TESTING.md](./TESTING.md)

**P: ¿Para qué sirven todos estos archivos?**  
R: Este es el [INDICE.md](./INDICE.md) que estás leyendo

---

<div align="center">

**🎉 ¡Bienvenido a ReservaVuelos!**

Elige tu ruta:

[Inicio Rápido (2 min)](./QUICK_START.md) | [Documentación Completa](./README.md) | [Abrir App](./index.html)

</div>
