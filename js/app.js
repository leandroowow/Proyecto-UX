/**
 * ReservaVuelos - Módulo Principal (app.js)
 * Orquesta la lógica general, eventos y navegación
 */

// Variable global para almacenar vuelos actuales
let vuelosActuales = [];
let vueloSeleccionado = null;
let paginaActual = 1;
const vuelosPorPagina = 5;

function obtenerFechaActualISO() {
    return new Date().toISOString().split('T')[0];
}

function inicializarElementosGlobales() {
    const anioActual = new Date().getFullYear();
    document.querySelectorAll('[data-current-year]').forEach(elemento => {
        elemento.textContent = anioActual;
    });
}

function configurarFechasMinimas() {
    const hoy = obtenerFechaActualISO();
    const camposFechaSalida = document.querySelectorAll('#fechaSalida, #fecha2');
    const camposFechaRegreso = document.querySelectorAll('#fechaRegreso');

    camposFechaSalida.forEach(campo => {
        campo.min = hoy;
        if (!campo.value) {
            campo.value = hoy;
        }
    });

    camposFechaRegreso.forEach(campo => {
        campo.min = hoy;
        if (!campo.value) {
            campo.value = hoy;
        }
    });
}

function obtenerAeropuertoDesdeFormulario(inputId, codeId) {
    const input = document.getElementById(inputId);
    const hidden = document.getElementById(codeId);
    const valorSeleccionado = hidden?.value?.trim();

    if (valorSeleccionado) {
        const aeropuertoSeleccionado = obtenerAeropuertoPorIata(valorSeleccionado);
        if (aeropuertoSeleccionado) {
            return aeropuertoSeleccionado;
        }
    }

    return resolverAeropuertoEntrada(input?.value || '');
}

function sincronizarCampoAeropuerto(inputId, codeId, aeropuerto) {
    const input = document.getElementById(inputId);
    const hidden = document.getElementById(codeId);

    if (!input || !aeropuerto) {
        return;
    }

    input.value = formatearAeropuerto(aeropuerto);
    if (hidden) {
        hidden.value = aeropuerto.iata;
    }
    input.dataset.selectedIata = aeropuerto.iata;
}

function inicializarAutocompletadoAeropuertos() {
    document.querySelectorAll('[data-airport-autocomplete]').forEach(contenedor => {
        const input = contenedor.querySelector('[data-airport-input]');
        const hidden = contenedor.querySelector('[data-airport-code]');
        const sugerencias = contenedor.querySelector('[data-airport-suggestions]');

        if (!input || !sugerencias) {
            return;
        }

        const limpiarSugerencias = () => {
            sugerencias.innerHTML = '';
            sugerencias.classList.remove('show');
        };

        const renderizarSugerencias = () => {
            const coincidencias = buscarAeropuertos(input.value);

            if (!coincidencias.length) {
                sugerencias.innerHTML = '<div class="airport-suggestion airport-suggestion-empty">No se encontraron coincidencias</div>';
                sugerencias.classList.add('show');
                return;
            }

            sugerencias.innerHTML = coincidencias.map(aeropuerto => `
                <button type="button" class="airport-suggestion" data-iata="${aeropuerto.iata}">
                    <span class="airport-suggestion-title">${aeropuerto.ciudad}, ${aeropuerto.pais}</span>
                    <span class="airport-suggestion-meta">${aeropuerto.iata} · ${aeropuerto.aeropuerto}</span>
                </button>
            `).join('');
            sugerencias.classList.add('show');
        };

        const seleccionarAeropuerto = (iata) => {
            const aeropuerto = obtenerAeropuertoPorIata(iata);
            if (!aeropuerto) {
                return;
            }

            input.value = formatearAeropuerto(aeropuerto);
            if (hidden) {
                hidden.value = aeropuerto.iata;
            }
            input.dataset.selectedIata = aeropuerto.iata;
            limpiarSugerencias();
        };

        input.addEventListener('input', () => {
            if (hidden) {
                hidden.value = '';
            }
            input.dataset.selectedIata = '';
            renderizarSugerencias();
        });

        input.addEventListener('focus', () => {
            renderizarSugerencias();
        });

        input.addEventListener('keydown', evento => {
            if (evento.key === 'Escape') {
                limpiarSugerencias();
            }
        });

        sugerencias.addEventListener('mousedown', evento => {
            const boton = evento.target.closest('[data-iata]');
            if (!boton) {
                return;
            }

            evento.preventDefault();
            seleccionarAeropuerto(boton.dataset.iata);
        });

        input.addEventListener('blur', () => {
            window.setTimeout(limpiarSugerencias, 150);
        });
    });
}

function validarYGuardarBusqueda({ origenInputId, origenCodeId, destinoInputId, destinoCodeId, fechaSalidaId, fechaRegresoId, pasajerosId }) {
    const origen = obtenerAeropuertoDesdeFormulario(origenInputId, origenCodeId);
    const destino = obtenerAeropuertoDesdeFormulario(destinoInputId, destinoCodeId);
    const fechaSalida = document.getElementById(fechaSalidaId)?.value || '';
    const fechaRegreso = fechaRegresoId ? document.getElementById(fechaRegresoId)?.value || '' : '';
    const pasajeros = document.getElementById(pasajerosId)?.value || '1';
    const hoy = obtenerFechaActualISO();

    if (!origen) {
        alert('Selecciona un origen válido desde las sugerencias.');
        return false;
    }

    if (!destino) {
        alert('Selecciona un destino válido desde las sugerencias.');
        return false;
    }

    if (origen.iata === destino.iata) {
        alert('El origen y el destino no pueden ser iguales.');
        return false;
    }

    if (!fechaSalida || fechaSalida < hoy) {
        alert('La fecha de salida debe ser hoy o una fecha futura.');
        return false;
    }

    if (fechaRegreso && fechaRegreso < fechaSalida) {
        alert('La fecha de regreso debe ser posterior a la salida.');
        return false;
    }

    const criteriosBusqueda = {
        origen: origen.iata,
        destino: destino.iata,
        origenLabel: formatearAeropuerto(origen),
        destinoLabel: formatearAeropuerto(destino),
        fechaSalida,
        fechaRegreso: fechaRegreso || null,
        pasajeros
    };

    sessionStorage.setItem('criteriosBusqueda', JSON.stringify(criteriosBusqueda));
    return true;
}

/**
 * Inicializa la aplicación según la página
 */
document.addEventListener('DOMContentLoaded', function() {
    inicializarElementosGlobales();
    configurarFechasMinimas();
    inicializarAutocompletadoAeropuertos();

    const pathname = window.location.pathname;
    
    if (pathname.includes('index.html') || pathname.endsWith('/')) {
        inicializarHome();
    } else if (pathname.includes('resultados.html')) {
        inicializarResultados();
    } else if (pathname.includes('reserva.html')) {
        inicializarReserva();
    } else if (pathname.includes('confirmacion.html')) {
        inicializarConfirmacion();
    }
});

/**
 * Inicializa la página de inicio
 */
function inicializarHome() {
    const formBusqueda = document.getElementById('searchForm');
    
    if (formBusqueda) {
        formBusqueda.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validarYGuardarBusqueda({
                origenInputId: 'origen',
                origenCodeId: 'origenCodigo',
                destinoInputId: 'destino',
                destinoCodeId: 'destinoCodigo',
                fechaSalidaId: 'fechaSalida',
                fechaRegresoId: 'fechaRegreso',
                pasajerosId: 'pasajeros'
            })) {
                window.location.href = 'resultados.html';
            }
        });
    }
}

/**
 * Inicializa la página de resultados
 */
function inicializarResultados() {
    const criterios = JSON.parse(sessionStorage.getItem('criteriosBusqueda') || '{}');
    
    if (!criterios.origen) {
        window.location.href = 'index.html';
        return;
    }
    
    // Actualiza información de búsqueda
    const origenSeleccionado = obtenerAeropuertoPorIata(criterios.origen);
    const destinoSeleccionado = obtenerAeropuertoPorIata(criterios.destino);
    const ruta = `${formatearAeropuerto(origenSeleccionado || criterios.origen)} → ${formatearAeropuerto(destinoSeleccionado || criterios.destino)}`;
    document.getElementById('rutaInfo').textContent = ruta;
    
    const fechaFormato = formatearFecha(criterios.fechaSalida);
    const textoPasajeros = criterios.pasajeros + (criterios.pasajeros == 1 ? ' pasajero' : ' pasajeros');
    document.getElementById('fechaInfo').textContent = `${fechaFormato} - ${textoPasajeros}`;

    const formBusqueda = document.getElementById('searchForm');
    const origenInput = document.getElementById('origen');
    const destinoInput = document.getElementById('destino');
    const origenCodigo = document.getElementById('origenCodigo');
    const destinoCodigo = document.getElementById('destinoCodigo');
    const fechaSalidaInput = document.getElementById('fechaSalida');
    const fechaRegresoInput = document.getElementById('fechaRegreso');
    const pasajerosInput = document.getElementById('pasajeros');

    if (origenInput && origenSeleccionado) {
        sincronizarCampoAeropuerto('origen', 'origenCodigo', origenSeleccionado);
    }

    if (destinoInput && destinoSeleccionado) {
        sincronizarCampoAeropuerto('destino', 'destinoCodigo', destinoSeleccionado);
    }

    if (fechaSalidaInput) {
        fechaSalidaInput.value = criterios.fechaSalida || obtenerFechaActualISO();
    }

    if (fechaRegresoInput) {
        fechaRegresoInput.value = criterios.fechaRegreso || obtenerFechaActualISO();
    }

    if (pasajerosInput) {
        pasajerosInput.value = criterios.pasajeros || '1';
    }
    
    // Busca vuelos
    vuelosActuales = buscarVuelos({
        origen: criterios.origen,
        destino: criterios.destino,
        fecha: criterios.fechaSalida
    });
    
    // Si no hay vuelos
    if (vuelosActuales.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('resultsContainer').style.display = 'none';
        return;
    }
    
    // Ordena por precio por defecto
    vuelosActuales = ordenarVuelos(vuelosActuales, 'precio');
    
    // Muestra vuelos
    mostrarVuelos(vuelosActuales);
    
    // Inicializa filtros
    inicializarFiltros();
    
    // Event listeners para búsqueda modificada
    if (formBusqueda) {
        formBusqueda.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validarYGuardarBusqueda({
                origenInputId: 'origen',
                origenCodeId: 'origenCodigo',
                destinoInputId: 'destino',
                destinoCodeId: 'destinoCodigo',
                fechaSalidaId: 'fechaSalida',
                fechaRegresoId: 'fechaRegreso',
                pasajerosId: 'pasajeros'
            })) {
                window.location.href = 'resultados.html';
            }
        });
    }
}

/**
 * Muestra vuelos en el contenedor
 * @param {array} vuelos - Array de vuelos
 */
function mostrarVuelos(vuelos) {
    const container = document.getElementById('resultsContainer');
    
    if (vuelos.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        container.style.display = 'none';
        return;
    }
    
    document.getElementById('emptyState').style.display = 'none';
    container.style.display = 'grid';
    
    // Paginación
    paginaActual = 1;
    mostrarPagina(vuelos, paginaActual);
    
    // Configura paginación
    if (vuelos.length > vuelosPorPagina) {
        document.getElementById('paginationNav').style.display = 'block';
    }
}

/**
 * Muestra una página de vuelos
 * @param {array} vuelos - Array de vuelos
 * @param {number} pagina - Número de página
 */
function mostrarPagina(vuelos, pagina) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    
    const inicio = (pagina - 1) * vuelosPorPagina;
    const fin = inicio + vuelosPorPagina;
    const vuelosPagina = vuelos.slice(inicio, fin);
    
    vuelosPagina.forEach(vuelo => {
        const tarjeta = crearTarjetaVuelo(vuelo);
        container.appendChild(tarjeta);
    });
    
    // Actualiza info de paginación
    const totalPaginas = Math.ceil(vuelos.length / vuelosPorPagina);
    document.getElementById('pageInfo').textContent = `Página ${pagina} de ${totalPaginas}`;
    
    // Actualiza botones de paginación
    document.getElementById('prevPage').classList.toggle('disabled', pagina === 1);
    document.getElementById('nextPage').classList.toggle('disabled', pagina === totalPaginas);
}

/**
 * Crea una tarjeta HTML para un vuelo
 * @param {object} vuelo - Objeto del vuelo
 * @returns {HTMLElement} Elemento DOM
 */
function crearTarjetaVuelo(vuelo) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'flight-card fade-in';
    
    const precioTotal = calcularPrecioTotal(vuelo);
    const escalasTexto = vuelo.escalas === 0 ? 'Directo' : `${vuelo.escalas} ${vuelo.escalas === 1 ? 'escala' : 'escalas'}`;
    
    const classEscalas = vuelo.escalas === 0 ? 'flight-scales direct' : 'flight-scales';
    
    tarjeta.innerHTML = `
        <div class="flight-details">
            <div>
                <div class="flight-airline">${obtenerNombreAerolinea(vuelo.aerolinea)}</div>
                <div class="flight-time">${vuelo.salida}</div>
                <div class="flight-duration">
                    <i class="fas fa-clock"></i>
                    ${vuelo.duracion}
                </div>
            </div>
            <div>
                <div class="text-muted small">Llegada</div>
                <div style="font-weight: 700; font-size: 1.2rem;">${vuelo.llegada}</div>
            </div>
            <div>
                <div class="text-muted small">Escalas</div>
                <div class="${classEscalas}">
                    <i class="fas fa-${vuelo.escalas === 0 ? 'straight' : 'exchange-alt'}"></i>
                    ${escalasTexto}
                </div>
            </div>
            <div class="flight-price">
                <div class="price-label">desde</div>
                <div class="price">$${precioTotal}</div>
                <button class="btn btn-primary btn-sm fw-bold" data-vuelo-id="${vuelo.id}">
                    Reservar
                </button>
            </div>
        </div>
    `;
    
    // Event listener para botón reservar
    tarjeta.querySelector('button').addEventListener('click', function() {
        vueloSeleccionado = vuelo;
        mostrarModalReserva(vuelo);
    });
    
    return tarjeta;
}

/**
 * Muestra modal de confirmación de vuelo
 * @param {object} vuelo - Objeto del vuelo
 */
function mostrarModalReserva(vuelo) {
    const criterios = JSON.parse(sessionStorage.getItem('criteriosBusqueda') || '{}');
    
    const info = `
        <div class="mb-3">
            <p class="text-muted mb-1">Vuelo seleccionado</p>
            <p class="fw-bold mb-2">${obtenerNombreAerolinea(vuelo.aerolinea)} ${vuelo.numero}</p>
        </div>
        <div class="row mb-3">
            <div class="col-6">
                <p class="text-muted small mb-1">Salida</p>
                <p class="fw-bold">${vuelo.salida}</p>
            </div>
            <div class="col-6">
                <p class="text-muted small mb-1">Llegada</p>
                <p class="fw-bold">${vuelo.llegada}</p>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-6">
                <p class="text-muted small mb-1">Ruta</p>
                <p class="fw-bold">${criterios.origen} → ${criterios.destino}</p>
            </div>
            <div class="col-6">
                <p class="text-muted small mb-1">Duración</p>
                <p class="fw-bold">${vuelo.duracion}</p>
            </div>
        </div>
        <hr>
        <div class="alert alert-info">
            <strong>Precio total: $${calcularPrecioTotal(vuelo)}</strong>
            <p class="text-muted small mb-0 mt-2">Incluye: Tarifa + Impuestos + Equipaje</p>
        </div>
    `;
    
    document.getElementById('vueloSeleccionadoInfo').innerHTML = info;
    
    const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
    modal.show();
    
    // Event listener para confirmar
    document.getElementById('confirmarVuelo').onclick = function() {
        modal.hide();
        sessionStorage.setItem('vueloSeleccionado', JSON.stringify(vuelo));
        window.location.href = 'reserva.html';
    };
}

/**
 * Inicializa filtros en página de resultados
 */
function inicializarFiltros() {
    const priceRange = document.getElementById('priceRange');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const clearFilters = document.getElementById('clearFilters');
    
    // Event listener para rango de precio
    priceRange.addEventListener('input', function() {
        priceMax.textContent = '$' + this.value;
        aplicarFiltros();
    });
    
    // Event listeners para checkboxes
    document.querySelectorAll('.escalasFilter, .horarioFilter').forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });
    
    // Botón limpiar filtros
    clearFilters.addEventListener('click', function() {
        priceRange.value = 1000;
        priceMax.textContent = '$1000';
        document.querySelectorAll('.escalasFilter, .horarioFilter').forEach(checkbox => {
            checkbox.checked = true;
        });
        aplicarFiltros();
    });
    
    // Establece rango máximo de precio
    const precioMaximo = Math.max(...vuelosActuales.map(v => calcularPrecioTotal(v)));
    priceRange.max = precioMaximo;
    priceMax.textContent = '$' + precioMaximo;
}

/**
 * Aplica filtros a los vuelos
 */
function aplicarFiltros() {
    const precioMaximo = parseInt(document.getElementById('priceRange').value);
    
    const escalasSeleccionadas = [];
    document.querySelectorAll('.escalasFilter:checked').forEach(checkbox => {
        escalasSeleccionadas.push(parseInt(checkbox.value));
    });
    
    const horariosSeleccionados = [];
    document.querySelectorAll('.horarioFilter:checked').forEach(checkbox => {
        horariosSeleccionados.push(checkbox.value);
    });
    
    const filtros = {
        precioMaximo,
        escalas: escalasSeleccionadas,
        horarios: horariosSeleccionados
    };
    
    const vuelosFiltrados = filtrarVuelos(vuelosActuales, filtros);
    mostrarVuelos(vuelosFiltrados);
}

/**
 * Inicializa la página de reserva
 */
function inicializarReserva() {
    const vueloSelec = JSON.parse(sessionStorage.getItem('vueloSeleccionado') || 'null');
    
    if (!vueloSelec) {
        window.location.href = 'index.html';
        return;
    }
    
    cargarVueloSeleccionado(vueloSelec);
    
    // Event listener para formulario
    const formulario = document.getElementById('reservaForm');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarFormularioReserva()) {
                completarReserva();
            }
        });
    }
}

/**
 * Inicializa la página de confirmación
 */
function inicializarConfirmacion() {
    const reserva = JSON.parse(sessionStorage.getItem('reservaActual') || 'null');
    
    if (!reserva || !reserva.vuelo) {
        window.location.href = 'index.html';
        return;
    }
    
    const vuelo = reserva.vuelo;
    const pasajero = reserva.pasajero;
    
    // Código de reserva
    document.getElementById('codigoReserva').textContent = reserva.codigoReserva || generarCodigoReserva();
    
    // Resumen del vuelo
    const summaryVuelo = `
        <div class="row">
            <div class="col-md-6 mb-3">
                <small class="text-muted">Aerolínea</small>
                <p class="fw-bold">${obtenerNombreAerolinea(vuelo.aerolinea)} ${vuelo.numero}</p>
            </div>
            <div class="col-md-6 mb-3">
                <small class="text-muted">Ruta</small>
                <p class="fw-bold">${formatearAeropuerto(vuelo.origen)} → ${formatearAeropuerto(vuelo.destino)}</p>
            </div>
            <div class="col-md-6 mb-3">
                <small class="text-muted">Horario</small>
                <p class="fw-bold">${vuelo.salida} - ${vuelo.llegada}</p>
            </div>
            <div class="col-md-6 mb-3">
                <small class="text-muted">Duración</small>
                <p class="fw-bold">${vuelo.duracion}</p>
            </div>
        </div>
    `;
    
    document.getElementById('summaryConfirm').innerHTML = summaryVuelo;
    
    // Datos del pasajero
    document.getElementById('confirmNombre').textContent = pasajero.nombre;
    document.getElementById('confirmCorreo').textContent = pasajero.correo;
    document.getElementById('confirmTelefono').textContent = formatearTelefono(pasajero.telefono);
    
    // Desglose de precios
    document.getElementById('confirmTarifa').textContent = `$${vuelo.precioBase}`;
    document.getElementById('confirmImpuestos').textContent = `$${vuelo.impuestos}`;
    document.getElementById('confirmEquipaje').textContent = `$${vuelo.equipaje}`;
    document.getElementById('confirmTotal').textContent = `$${reserva.total}`;
}

/**
 * Maneja paginación
 */
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        // Botón página anterior
        if (e.target.closest('#prevPage:not(.disabled)')) {
            paginaActual--;
            mostrarPagina(vuelosActuales, paginaActual);
            window.scrollTo(0, 0);
        }
        
        // Botón página siguiente
        if (e.target.closest('#nextPage:not(.disabled)')) {
            paginaActual++;
            mostrarPagina(vuelosActuales, paginaActual);
            window.scrollTo(0, 0);
        }
    });
});
