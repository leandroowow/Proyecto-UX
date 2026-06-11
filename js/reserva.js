/**
 * ReservaVuelos - Módulo de Reserva
 * Gestiona validación de formularios y creación de reservas
 */

// Objeto para almacenar datos de la reserva actual
let reservaActual = {
    vuelo: null,
    pasajero: {
        nombre: '',
        correo: '',
        telefono: ''
    },
    total: 0,
    codigoReserva: '',
    fecha: new Date().toISOString()
};

/**
 * Valida el nombre completo
 * @param {string} nombre - Nombre a validar
 * @returns {object} { valido: boolean, error: string }
 */
function validarNombre(nombre) {
    nombre = nombre.trim();
    
    if (nombre.length < 3) {
        return { valido: false, error: 'El nombre debe tener al menos 3 caracteres' };
    }
    
    if (nombre.length > 100) {
        return { valido: false, error: 'El nombre no puede exceder 100 caracteres' };
    }
    
    // Valida que contenga al menos nombre y apellido
    if (nombre.split(' ').length < 2) {
        return { valido: false, error: 'Por favor ingresa nombre y apellido' };
    }
    
    // Valida que no contenga números o caracteres especiales inapropiados
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(nombre)) {
        return { valido: false, error: 'El nombre contiene caracteres no válidos' };
    }
    
    return { valido: true, error: '' };
}

/**
 * Valida el correo electrónico
 * @param {string} correo - Correo a validar
 * @returns {object} { valido: boolean, error: string }
 */
function validarCorreo(correo) {
    correo = correo.trim().toLowerCase();
    
    // Expresión regular para validar email
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!regexCorreo.test(correo)) {
        return { valido: false, error: 'Por favor ingresa un correo válido' };
    }
    
    if (correo.length > 100) {
        return { valido: false, error: 'El correo es demasiado largo' };
    }
    
    return { valido: true, error: '' };
}

/**
 * Valida el teléfono
 * @param {string} telefono - Teléfono a validar
 * @returns {object} { valido: boolean, error: string }
 */
function validarTelefono(telefono) {
    telefono = telefono.trim();
    
    // Extrae solo números y símbolos válidos
    const soloNumeros = telefono.replace(/[^\d+\-\s()]/g, '');
    
    // Cuenta solo dígitos
    const digitos = soloNumeros.replace(/\D/g, '');
    
    if (digitos.length < 9) {
        return { valido: false, error: 'El teléfono debe tener al menos 9 dígitos' };
    }
    
    if (digitos.length > 15) {
        return { valido: false, error: 'El teléfono tiene demasiados dígitos' };
    }
    
    // Valida formato básico
    if (!/^[\d+\-\s()]+$/.test(telefono)) {
        return { valido: false, error: 'El teléfono contiene caracteres no válidos' };
    }
    
    return { valido: true, error: '' };
}

/**
 * Valida todo el formulario de reserva
 * @returns {boolean} True si el formulario es válido
 */
function validarFormularioReserva() {
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const terminos = document.getElementById('terminos').checked;
    
    let esValido = true;
    
    // Valida nombre
    const validNombre = validarNombre(nombre);
    if (!validNombre.valido) {
        document.getElementById('nombreError').textContent = validNombre.error;
        document.getElementById('nombre').classList.add('is-invalid');
        esValido = false;
    } else {
        document.getElementById('nombre').classList.remove('is-invalid');
        document.getElementById('nombreError').textContent = '';
    }
    
    // Valida correo
    const validCorreo = validarCorreo(correo);
    if (!validCorreo.valido) {
        document.getElementById('correoError').textContent = validCorreo.error;
        document.getElementById('correo').classList.add('is-invalid');
        esValido = false;
    } else {
        document.getElementById('correo').classList.remove('is-invalid');
        document.getElementById('correoError').textContent = '';
    }
    
    // Valida teléfono
    const validTelefono = validarTelefono(telefono);
    if (!validTelefono.valido) {
        document.getElementById('telefonoError').textContent = validTelefono.error;
        document.getElementById('telefono').classList.add('is-invalid');
        esValido = false;
    } else {
        document.getElementById('telefono').classList.remove('is-invalid');
        document.getElementById('telefonoError').textContent = '';
    }
    
    // Valida términos
    if (!terminos) {
        alert('Debes aceptar los términos y condiciones');
        esValido = false;
    }
    
    return esValido;
}

/**
 * Carga los datos del vuelo seleccionado
 * @param {object} vuelo - Objeto del vuelo
 */
function cargarVueloSeleccionado(vuelo) {
    reservaActual.vuelo = vuelo;
    
    // Actualiza el resumen del vuelo en la página
    const summary = `
        <div class="mb-2">
            <small class="text-muted">Vuelo</small>
            <p class="fw-bold mb-1">${obtenerNombreAerolinea(vuelo.aerolinea)} ${vuelo.numero}</p>
        </div>
        <div class="mb-2">
            <small class="text-muted">Ruta</small>
            <p class="fw-bold mb-1">${obtenerNombreCiudad(vuelo.origen)} → ${obtenerNombreCiudad(vuelo.destino)}</p>
        </div>
        <div class="mb-2">
            <small class="text-muted">Horario</small>
            <p class="fw-bold mb-1">${vuelo.salida} - ${vuelo.llegada}</p>
        </div>
        <div>
            <small class="text-muted">Duración</small>
            <p class="fw-bold">${vuelo.duracion} (${vuelo.escalas === 0 ? 'Directo' : vuelo.escalas + ' escalas'})</p>
        </div>
    `;
    
    if (document.getElementById('summaryVuelo')) {
        document.getElementById('summaryVuelo').innerHTML = summary;
    }
    
    // Actualiza detalles de precios
    actualizarDetallesPrecios(vuelo);
}

/**
 * Actualiza los detalles de precios
 * @param {object} vuelo - Objeto del vuelo
 */
function actualizarDetallesPrecios(vuelo) {
    const precioBase = vuelo.precioBase;
    const impuestos = vuelo.impuestos;
    const equipaje = vuelo.equipaje;
    const total = calcularPrecioTotal(vuelo);
    
    // Actualiza en la página de reserva
    document.getElementById('precioBse').textContent = `$${precioBase}`;
    document.getElementById('impuestos').textContent = `$${impuestos}`;
    document.getElementById('equipaje').textContent = `$${equipaje}`;
    document.getElementById('totalPrice').textContent = `$${total}`;
    
    reservaActual.total = total;
}

/**
 * Guarda los datos del pasajero en la reserva
 */
function guardarDatosPasajero() {
    reservaActual.pasajero.nombre = document.getElementById('nombre').value.trim();
    reservaActual.pasajero.correo = document.getElementById('correo').value.trim().toLowerCase();
    reservaActual.pasajero.telefono = document.getElementById('telefono').value.trim();
}

/**
 * Completa la reserva y la guarda
 */
function completarReserva() {
    guardarDatosPasajero();
    
    // Genera código de reserva
    reservaActual.codigoReserva = generarCodigoReserva();
    
    // Guarda en LocalStorage
    const reservas = obtenerReservas();
    reservas.push(reservaActual);
    localStorage.setItem('reservasVuelos', JSON.stringify(reservas));
    
    // Guarda la reserva actual en sesión para la página de confirmación
    sessionStorage.setItem('reservaActual', JSON.stringify(reservaActual));
    
    // Redirige a confirmación
    window.location.href = 'confirmacion.html';
}

/**
 * Obtiene todas las reservas del usuario
 * @returns {array} Array de reservas
 */
function obtenerReservas() {
    const reservas = localStorage.getItem('reservasVuelos');
    return reservas ? JSON.parse(reservas) : [];
}

/**
 * Obtiene una reserva específica por código
 * @param {string} codigo - Código de reserva
 * @returns {object|null} La reserva o null si no existe
 */
function obtenerReserva(codigo) {
    const reservas = obtenerReservas();
    return reservas.find(r => r.codigoReserva === codigo) || null;
}

/**
 * Cancela una reserva
 * @param {string} codigo - Código de reserva
 * @returns {boolean} True si se canceló exitosamente
 */
function cancelarReserva(codigo) {
    let reservas = obtenerReservas();
    const indice = reservas.findIndex(r => r.codigoReserva === codigo);
    
    if (indice !== -1) {
        reservas.splice(indice, 1);
        localStorage.setItem('reservasVuelos', JSON.stringify(reservas));
        return true;
    }
    
    return false;
}

/**
 * Obtiene el número de reservas activas
 * @returns {number} Total de reservas
 */
function obtenerTotalReservas() {
    return obtenerReservas().length;
}

/**
 * Limpia los datos de la reserva actual
 */
function limpiarReservaActual() {
    reservaActual = {
        vuelo: null,
        pasajero: {
            nombre: '',
            correo: '',
            telefono: ''
        },
        total: 0,
        codigoReserva: '',
        fecha: new Date().toISOString()
    };
    sessionStorage.removeItem('reservaActual');
}

/**
 * Formatea un teléfono para mostrar
 * @param {string} telefono - Teléfono
 * @returns {string} Teléfono formateado
 */
function formatearTelefono(telefono) {
    // Extrae solo números
    const numeros = telefono.replace(/\D/g, '');
    
    // Formatea según cantidad de dígitos
    if (numeros.length >= 10) {
        return numeros.slice(0, -4) + '-' + numeros.slice(-4);
    }
    
    return telefono;
}
