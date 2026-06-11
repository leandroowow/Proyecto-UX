# 🧪 Guía de Testing - ReservaVuelos

Instrucciones paso a paso para probar todas las funcionalidades de la aplicación.

---

## 📋 Pre-requisitos

✅ Navegador moderno (Chrome, Firefox, Safari, Edge)  
✅ Servidor local corriendo (opcional pero recomendado)  
✅ Consola de desarrollador (F12)

---

## 🚀 Ejecución Rápida

### Opción 1: Abrir en Navegador (Más Fácil)
```
1. Navega a: c:\Users\leand\Desktop\proyecto integracion (3 septiembre)\Proyecto-UX\
2. Haz doble clic en index.html
3. Se abrirá en tu navegador por defecto
```

### Opción 2: Servidor Local (Recomendado)
```powershell
# Abre PowerShell en la carpeta del proyecto
cd "c:\Users\leand\Desktop\proyecto integracion (3 septiembre)\Proyecto-UX\"

# Inicia servidor con Python
python -m http.server 8000

# Luego accede a:
http://localhost:8000
```

---

## ✅ Casos de Prueba

### PRUEBA 1: Página de Inicio
**Objetivo**: Verificar que el formulario funciona correctamente

**Pasos**:
1. Carga `index.html`
2. Verifica que la página carga con:
   - ✅ Logo visible
   - ✅ Hero section con gradiente
   - ✅ Formulario de búsqueda
   - ✅ 4 tarjetas de información

3. Intenta buscar sin llenar campos:
   - Deberían aparecer mensajes "required"

4. Prueba con datos válidos:
   - **Origen**: `MIA` (Miami)
   - **Destino**: `BOG` (Bogotá)
   - **Fecha Salida**: Hoy o futuro
   - **Fecha Regreso**: Posterior a salida
   - **Pasajeros**: 1

5. Click en "Buscar":
   - ✅ Debe redirigir a `resultados.html`

**Validaciones**:
- [ ] Origen no vacío
- [ ] Destino no vacío
- [ ] Fechas válidas
- [ ] Redirección correcta

---

### PRUEBA 2: Página de Resultados
**Objetivo**: Verificar búsqueda, filtros y selección

**Pasos**:
1. Desde la página anterior, llegas a Resultados
2. Verifica que se muestran:
   - ✅ Resumen de búsqueda (Ruta y fecha)
   - ✅ 8 tarjetas de vuelos
   - ✅ Panel de filtros (Precio, Escalas, Horario)

3. Prueba filtros:
   - Baja el rango de precio a $400
   - ✅ Solo deben aparecer vuelos ≤ $400
   - Desmarca "Directos"
   - ✅ Desaparecen vuelos sin escalas
   - Click "Limpiar filtros"
   - ✅ Vuelven todos los vuelos

4. Selecciona un vuelo:
   - Click en botón "Reservar"
   - ✅ Aparece modal con confirmación
   - Verifica datos del vuelo
   - Click "Continuar a Reserva"
   - ✅ Redirige a `reserva.html`

**Validaciones**:
- [ ] Se cargan 8 vuelos
- [ ] Filtro de precio funciona
- [ ] Filtro de escalas funciona
- [ ] Modal aparece correctamente
- [ ] Datos del vuelo son correctos

---

### PRUEBA 3: Página de Reserva
**Objetivo**: Validar formulario y datos

**Pasos**:
1. Llegas a página de Reserva
2. Verifica elementos visibles:
   - ✅ Indicador de progreso (paso 2 de 3 activo)
   - ✅ Formulario con 3 campos
   - ✅ Resumen del vuelo en sidebar
   - ✅ Desglose de precios

3. Intenta enviar sin llenar datos:
   - ✅ Aparecen mensajes de error rojo

4. Prueba validaciones:

   **Campo Nombre - Pruebas Inválidas**:
   - Ingresa: `J` (muy corto)
     - ✅ Error: "mínimo 3 caracteres"
   - Ingresa: `Juan 123` (contiene números)
     - ✅ Error: "caracteres no válidos"
   - Ingresa: `Juan` (falta apellido)
     - ✅ Error: "nombre y apellido"

   **Validación Correcta**:
   - Ingresa: `Juan Pérez García`
     - ✅ Sin error, se ve normal

   **Campo Correo - Pruebas Inválidas**:
   - Ingresa: `juanemail.com` (falta @)
     - ✅ Error: "correo válido"
   - Ingresa: `juan@.com` (falta dominio)
     - ✅ Error: "correo válido"

   **Validación Correcta**:
   - Ingresa: `juan@email.com`
     - ✅ Sin error

   **Campo Teléfono - Pruebas Inválidas**:
   - Ingresa: `123` (muy corto)
     - ✅ Error: "9 dígitos mínimo"
   - Ingresa: `1234567890abcd` (contiene letras)
     - ✅ Error: "caracteres no válidos"

   **Validación Correcta**:
   - Ingresa: `+57 3001234567` o `3001234567`
     - ✅ Sin error

5. Rellena todo correctamente:
   - Nombre: `Juan Pérez García`
   - Correo: `juan@email.com`
   - Teléfono: `+57 3001234567`
   - ✅ Sin checkbox → Error: "Debes aceptar términos"
   - Marca checkbox
   - Click "Continuar"
   - ✅ Redirige a `confirmacion.html`

**Validaciones**:
- [ ] Errores aparecen correctamente
- [ ] Errores desaparecen al corregir
- [ ] Validación de términos funciona
- [ ] Datos son guardados

---

### PRUEBA 4: Página de Confirmación
**Objetivo**: Verificar que la reserva fue completada

**Pasos**:
1. Llegas a Confirmación
2. Verifica elementos:
   - ✅ Indicador de progreso (todos los pasos completos)
   - ✅ Mensaje de éxito verde
   - ✅ Código de reserva (ej: RV-2024-ABC123)
   - ✅ Resumen completo del vuelo
   - ✅ Datos del pasajero ingresados
   - ✅ Desglose de precios

3. Prueba botones:
   - Botón "Copiar código"
     - ✅ Código se copia al portapapeles
   - Botón "Descargar PDF"
     - ✅ Muestra alerta (en demo)
   - Botón "Buscar otro vuelo"
     - ✅ Redirige a `index.html`

**Validaciones**:
- [ ] Todos los datos son correctos
- [ ] Código de reserva es único
- [ ] Botones funcionan
- [ ] Redirección a inicio funciona

---

## 🔍 Pruebas de Consola

Abre la consola (F12 → Console) y prueba:

```javascript
// VER TODAS LAS RESERVAS GUARDADAS
JSON.parse(localStorage.getItem('reservasVuelos'))

// RESULTADO ESPERADO
[
  {
    vuelo: {...},
    pasajero: {nombre, correo, telefono},
    total: 525,
    codigoReserva: "RV-2024-ABCDEF",
    fecha: "2024-..."
  }
]

// LIMPIAR TODAS LAS RESERVAS
localStorage.clear()

// VER CRITERIOS DE BÚSQUEDA ACTUAL
JSON.parse(sessionStorage.getItem('criteriosBusqueda'))

// OBTENER VUELO ESPECÍFICO POR ID
obtenerVueloPorId(1)

// BUSCAR VUELOS DESDE CONSOLA
buscarVuelos({origen: 'MIA', destino: 'BOG', fecha: '2024-07-15'})
```

---

## 📱 Pruebas Responsivas

### Móvil (320px)
1. Abre DevTools (F12)
2. Click "Toggle device toolbar" o Ctrl+Shift+M
3. Selecciona "iPhone SE" (375px)
4. Verifica:
   - ✅ Texto legible
   - ✅ Botones clickeables
   - ✅ Formulario funciona
   - ✅ Tarjetas se apilan

### Tablet (768px)
1. Selecciona "iPad" en DevTools
2. Verifica:
   - ✅ Layout adaptado
   - ✅ Sidebar para filtros
   - ✅ Dos columnas para contenido

### Desktop (1200px)
1. Selecciona "Responsive" y ajusta a 1200px
2. Verifica:
   - ✅ Experiencia completa
   - ✅ Todos los elementos visibles

---

## 🐛 Debugging

Si encuentras errores:

1. **Abre DevTools** (F12)
2. **Pestaña Console** - Busca mensajes rojos
3. **Network** - Verifica que Bootstrap y FA cargan (Status 200)
4. **Application → LocalStorage** - Revisa datos guardados

### Errores Comunes

| Error | Solución |
|-------|----------|
| "Cannot read property 'getElementById'" | La página aún no ha cargado |
| CDN de Bootstrap no carga | Verifica conexión a internet |
| Validación no funciona | Limpia cache (Ctrl+Shift+Del) |
| Datos no se guardan | Verifica LocalStorage habilitado |

---

## 📊 Checklist Final

- [ ] Index: Búsqueda funciona
- [ ] Resultados: Se cargan 8 vuelos
- [ ] Filtros: Precio, Escalas, Horario funcionan
- [ ] Modal: Aparece al seleccionar vuelo
- [ ] Reserva: Validaciones funcionan
- [ ] Confirmación: Código generado y guardado
- [ ] LocalStorage: Datos persisten
- [ ] Responsive: Funciona en móvil/tablet
- [ ] Redirecciones: Todas correctas
- [ ] Estilos: Cargan correctamente

---

## 🎯 Flujo Completo Recomendado

1. **Búsqueda válida**
   - MIA → BOG, Hoy, 1 pasajero
   
2. **Filtrar resultados**
   - Precio ≤ $400, Solo directos

3. **Seleccionar LATAM (LA-505)**
   - $525 total

4. **Llenar formulario**
   - Juan Pérez García
   - juan@email.com
   - +57 3001234567

5. **Confirmar reserva**
   - Copiar código
   - Verificar datos
   - Volver al inicio

6. **Buscar otro vuelo**
   - Verificar que se reinicia

---

## 📞 Soporte

Si encuentras bugs o tienes sugerencias, contacta:
- Email: soporte@reservavuelos.com
- GitHub Issues: [Link]
- Chat: [Link]

---

<div align="center">

✅ **¡Gracias por testear ReservaVuelos!**

</div>
