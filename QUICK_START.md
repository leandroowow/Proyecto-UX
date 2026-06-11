# ⚡ Quick Start - ReservaVuelos

Comienza en **2 minutos**

---

## 🚀 Opción 1: Más Fácil (Recomendado)

### Windows

1. **Abre File Explorer**
   ```
   Ruta: c:\Users\leand\Desktop\proyecto integracion (3 septiembre)\Proyecto-UX\
   ```

2. **Haz doble clic en `index.html`**
   - Se abrirá en tu navegador por defecto
   - ¡Listo! Ya puedes empezar

3. **Probar la app:**
   - Origen: `MIA`
   - Destino: `BOG`
   - Fechas: Hoy y mañana
   - Pasajeros: 1
   - Click "Buscar"

---

## 🚀 Opción 2: Con Servidor Local

### Windows PowerShell

```powershell
# 1. Abre PowerShell en la carpeta del proyecto
cd "c:\Users\leand\Desktop\proyecto integracion (3 septiembre)\Proyecto-UX\"

# 2. Inicia servidor
npm start

# O si prefieres el servidor directo
node server.js

# 3. Abre en navegador
http://localhost:4000

# 4. Para detener: Ctrl + C
```

---

## 🎯 Flujo de Prueba Rápido (5 minutos)

### Paso 1: Búsqueda
```
Origen:      MIA
Destino:     BOG
Salida:      Hoy
Regreso:     +1 día
Pasajeros:   1
Click:       "Buscar"
```

### Paso 2: Resultados
```
Espera: Se cargan 8 vuelos
Filtro: Precio ≤ $400 (opcional)
Click:  "Reservar" en cualquier vuelo
```

### Paso 3: Reserva
```
Nombre:    Juan Pérez García
Correo:    juan@email.com
Teléfono:  +57 3001234567
Términos:  ✓ Acepto
Click:     "Continuar"
```

### Paso 4: Confirmación
```
✅ Aparecerá:
   - Código de reserva (ej: RV-2024-ABC123)
   - Resumen de vuelo
   - Desglose de precios
   - Botones: Copiar código, Nuevo vuelo
```

---

## 📋 Ciudades Disponibles

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

**Ejemplo**: MIA → NYC también funciona

---

## 🔍 Validaciones Rápidas

### Campo: Nombre
- ✅ `Juan Pérez García` - Correcto
- ❌ `Juan` - Falta apellido
- ❌ `J` - Muy corto

### Campo: Correo
- ✅ `juan@email.com` - Correcto
- ❌ `juanemail.com` - Falta @
- ❌ `juan@` - Falta dominio

### Campo: Teléfono
- ✅ `+57 3001234567` - Correcto
- ✅ `3001234567` - Correcto
- ❌ `123` - Muy corto

---

## 💾 Verificar Datos Guardados

**Abre Consola**: F12 → Console

```javascript
// Ver TODAS las reservas
JSON.parse(localStorage.getItem('reservasVuelos'))

// Limpiar (si necesitas empezar de nuevo)
localStorage.clear()

// Ver búsqueda actual
JSON.parse(sessionStorage.getItem('criteriosBusqueda'))
```

---

## 📱 Probar en Móvil

**En Chrome/Firefox/Safari**:

1. Abre DevTools: F12
2. Click en icono móvil (Ctrl+Shift+M)
3. Selecciona dispositivo: iPhone SE
4. La app es completamente responsive

---

## 🐛 Si Algo No Funciona

### 1. Bootstrap no carga
```
→ Verifica conexión a internet
→ Bootstrap se carga desde CDN
```

### 2. Estilos no se ven
```
→ Presiona: Ctrl+Shift+R (reload hard)
→ Limpia cache: Ctrl+Shift+Del
```

### 3. Validación no funciona
```
→ Abre consola (F12)
→ Busca mensajes de error rojo
→ Revisa que los IDs coincidan
```

### 4. Datos no se guardan
```
→ Verifica que LocalStorage esté habilitado
→ En DevTools → Application → Local Storage
```

---

## 📊 Árbol de Archivos

```
proyecto-vuelos/
├── index.html              ← Abre aquí
├── resultados.html
├── reserva.html
├── confirmacion.html
├── css/style.css
├── js/vuelos.js
├── js/reserva.js
├── js/app.js
├── assets/images/
├── assets/icons/
├── README.md               ← Lee después
├── TESTING.md              ← Pruebas completas
├── COMMITS.md              ← Historial
├── QUICK_START.md          ← Este archivo
└── RESUMEN_EJECUTIVO.md    ← Para presentación
```

---

## ⏱️ Casos de Uso Rápidos

### Caso 1: Flujo Exitoso (3 min)
- MIA → BOG ✓
- Completa formulario ✓
- Ver confirmación ✓

### Caso 2: Probar Filtros (2 min)
- Ver resultados
- Filtrar por precio
- Filtrar por escalas
- Limpiar filtros

### Caso 3: Validaciones (2 min)
- Intenta nombre corto → Error
- Intenta correo inválido → Error
- Intenta teléfono corto → Error
- Todo correcto → Éxito

---

## 🎯 Checklist de Prueba

- [ ] Búsqueda funciona
- [ ] Se cargan 8 vuelos
- [ ] Filtros funcionan
- [ ] Modal aparece
- [ ] Validaciones funcionan
- [ ] Confirmación genera código
- [ ] LocalStorage guarda datos
- [ ] Botones redireccionan
- [ ] Responsive en móvil
- [ ] Sin errores en consola

---

## 📞 Problemas Frecuentes

| Problema | Solución |
|----------|----------|
| Pantalla en blanco | F5 (refresh) |
| Estilos raros | Ctrl+Shift+R |
| CDN no carga | Revisa internet |
| Validación no funciona | F12 → Console |
| Datos no guardan | Limpia LocalStorage |

---

## 🎨 Personalización Rápida

### Cambiar color principal (azul)

En `css/style.css`:
```css
:root {
    --primary-color: #1e3a8a;      ← Cambiar aquí
    --primary-light: #3b82f6;      ← Y aquí
}
```

### Cambiar nombre de empresa

En `index.html`, busca:
```html
<span>ReservaVuelos</span>  ← Cambiar aquí
```

### Cambiar cantidad de vuelos

En `js/vuelos.js`:
```javascript
// Agregar más vuelos al array 'vuelosData'
const vuelosData = [
    { ... },  ← Agregar más vuelos aquí
]
```

---

## 📚 Documentación Completa

- 📖 **README.md** - Documentación técnica
- 🧪 **TESTING.md** - Guía de pruebas
- 📝 **COMMITS.md** - Historial de desarrollo
- 📊 **RESUMEN_EJECUTIVO.md** - Para presentación

---

## ✅ Listo para Empezar

```
1. Abre: index.html
2. Busca: MIA → BOG
3. Completa: Formulario
4. Confirma: Reserva
5. ¡Éxito! 🎉
```

---

<div align="center">

**¡Ya puedes empezar! Haz doble clic en `index.html`**

Si necesitas ayuda → Lee TESTING.md

</div>
