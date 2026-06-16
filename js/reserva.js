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
    claseVuelo: 'economica',
    claseNombre: 'Económica',
    beneficiosClase: [],
    equipajePermitido: '1 maleta incluida',
    recargoClase: 0,
    impuestos: 0,
    totalPersona: 0,
    total: 0,
    codigoReserva: '',
    fecha: new Date().toISOString()
};

function obtenerCriteriosBusquedaActuales() {
    return JSON.parse(sessionStorage.getItem('criteriosBusqueda') || '{}');
}

function obtenerClaseSeleccionada() {
    const selector = document.getElementById('claseVuelo');
    return selector ? selector.value : 'economica';
}

function renderizarBeneficiosClase(clase, contenedorId = 'beneficiosClase') {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor || !clase) {
        return;
    }

    contenedor.innerHTML = `
        <div class="d-flex flex-wrap gap-2 mb-3">
            <span class="badge bg-primary-subtle text-primary border border-primary-subtle">${clase.nombre}</span>
            <span class="badge bg-light text-dark border">${clase.equipaje}</span>
        </div>
        <ul class="benefits-list mb-0">
            ${clase.beneficios.map(beneficio => `<li><i class="fas fa-check text-success me-2"></i>${beneficio}</li>`).join('')}
        </ul>
    `;
}

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
    
    // Verifica que el número comience con el signo +
    if (!telefono.startsWith('+')) {
        return { valido: false, error: 'El número debe incluir el prefijo internacional con el signo + (ej: +56)' };
    }

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
    if (!/^\+[\d\-\s()]+$/.test(telefono)) {
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

    const claseSeleccionada = obtenerClaseSeleccionada();
    actualizarResumenVuelo(vuelo, claseSeleccionada);
    actualizarDetallesPrecios(vuelo, claseSeleccionada);
}
function actualizarResumenVuelo(vuelo, claseCodigo) {
    const clase = obtenerClaseVuelo(claseCodigo);
    const summary = `
        <div class="mb-3">
            <small class="text-muted">Vuelo</small>
            <p class="fw-bold mb-1">${obtenerNombreAerolinea(vuelo.aerolinea)} ${vuelo.numero}</p>
        </div>
        <div class="mb-3">
            <small class="text-muted">Ruta</small>
            <p class="fw-bold mb-1">${obtenerNombreCiudad(vuelo.origen)} → ${obtenerNombreCiudad(vuelo.destino)}</p>
        </div>
        <div class="mb-3">
            <small class="text-muted">Horario</small>
            <p class="fw-bold mb-1">${vuelo.salida} - ${vuelo.llegada}</p>
        </div>
        <div class="mb-3">
            <small class="text-muted">Duración</small>
            <p class="fw-bold mb-1">${vuelo.duracion} (${vuelo.escalas === 0 ? 'Directo' : vuelo.escalas + ' escalas'})</p>
        </div>
        <div>
            <small class="text-muted">Clase seleccionada</small>
            <p class="fw-bold mb-0">${clase.nombre}</p>
        </div>
    `;

    const summaryElement = document.getElementById('summaryVuelo');
    if (summaryElement) {
        summaryElement.innerHTML = summary;
    }

    const claseNombreResumen = document.getElementById('claseNombreResumen');
    if (claseNombreResumen) {
        claseNombreResumen.textContent = clase.nombre;
    }

    renderizarBeneficiosClase(clase);
}

function actualizarDetallesPrecios(vuelo, claseCodigo) {
    const criterios = obtenerCriteriosBusquedaActuales();
    const pasajeros = parseInt(criterios.pasajeros) || 1;
    const clase = obtenerClaseVuelo(claseCodigo);
    const precioBase = Number(vuelo.precioBase || 0);
    const precioClase = calcularPrecioClaseVuelo(precioBase, claseCodigo);
    const recargoClase = precioClase - precioBase;
    const impuestos = Math.round(precioClase * 0.12);
    const totalPersona = precioClase + impuestos;
    const total = totalPersona * pasajeros;

    const precioBaseElement = document.getElementById('precioBase');
    const recargoClaseElement = document.getElementById('recargoClase');
    const impuestosElement = document.getElementById('impuestos');
    const equipajeElement = document.getElementById('equipaje');
    const totalElement = document.getElementById('totalPrice');
    const pasajerosElement = document.getElementById('filaPasajeros');

    if (precioBaseElement) {
        precioBaseElement.textContent = formatearMoneda(precioBase);
    }

    if (recargoClaseElement) {
        recargoClaseElement.textContent = recargoClase > 0 ? `+ ${formatearMoneda(recargoClase)}` : formatearMoneda(0);
    }

    if (impuestosElement) {
        impuestosElement.textContent = formatearMoneda(impuestos);
    }

    if (equipajeElement) {
        equipajeElement.textContent = clase.equipaje;
    }

    if (totalElement) {
        totalElement.textContent = formatearMoneda(total);
    }

    const breakdown = document.querySelector('.price-breakdown');
    const filaTotal = breakdown ? breakdown.querySelector('.border-top') : null;

    if (breakdown) {
        if (pasajerosElement) {
            pasajerosElement.remove();
        }

        if (pasajeros > 1 && filaTotal) {
            const fila = document.createElement('div');
            fila.id = 'filaPasajeros';
            fila.className = 'd-flex justify-content-between mb-2';
            fila.innerHTML = `
                <span>Pasajeros:</span>
                <span class="fw-bold">${pasajeros} x ${formatearMoneda(totalPersona)}</span>
            `;
            breakdown.insertBefore(fila, filaTotal);
        }
    }

    reservaActual.claseVuelo = claseCodigo;
    reservaActual.claseNombre = clase.nombre;
    reservaActual.beneficiosClase = clase.beneficios.slice();
    reservaActual.equipajePermitido = clase.equipaje;
    reservaActual.recargoClase = recargoClase;
    reservaActual.impuestos = impuestos;
    reservaActual.totalPersona = totalPersona;
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
    reservaActual.codigoReserva = '';
    sessionStorage.setItem('reservaActual', JSON.stringify(reservaActual));
    window.location.href = 'pago.html';
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
        claseVuelo: 'economica',
        claseNombre: 'Económica',
        beneficiosClase: [],
        equipajePermitido: '1 maleta incluida',
        recargoClase: 0,
        impuestos: 0,
        totalPersona: 0,
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
