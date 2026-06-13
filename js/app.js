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

function obtenerHoraEnMinutos(hora) {
    const [horas, minutos] = String(hora || '00:00').split(':').map(Number);
    return horas * 60 + minutos;
}

function obtenerDuracionEnMinutos(duracion) {
    const texto = String(duracion || '').toLowerCase();
    const horas = parseInt((texto.match(/(\d+)h/) || [0, 0])[1], 10) || 0;
    const minutos = parseInt((texto.match(/(\d+)m/) || [0, 0])[1], 10) || 0;
    return horas * 60 + minutos;
}

function obtenerReservasGuardadas() {
    return JSON.parse(localStorage.getItem('reservasVuelos') || '[]');
}

function crearBotonLimpiarCampo(wrapper, input) {
    if (!wrapper || !input || wrapper.querySelector('.clear-input-btn')) {
        return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'clear-input-btn';
    button.setAttribute('aria-label', `Limpiar ${input.id || 'campo'}`);
    button.innerHTML = '<i class="fas fa-times"></i>';
    button.style.display = input.value ? 'inline-flex' : 'none';

    button.addEventListener('click', function() {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.focus();
    });

    input.addEventListener('input', function() {
        button.style.display = this.value.trim() ? 'inline-flex' : 'none';
    });

    wrapper.appendChild(button);
}

function inicializarBotonesLimpiezaRapida() {
    document.querySelectorAll('[data-clearable]').forEach(wrapper => {
        const input = wrapper.querySelector('input, textarea');
        if (input) {
            crearBotonLimpiarCampo(wrapper, input);
        }
    });
}

function intercambiarAeropuertos(origenInputId, origenCodeId, destinoInputId, destinoCodeId) {
    const origenInput = document.getElementById(origenInputId);
    const origenCodigo = document.getElementById(origenCodeId);
    const destinoInput = document.getElementById(destinoInputId);
    const destinoCodigo = document.getElementById(destinoCodeId);

    if (!origenInput || !origenCodigo || !destinoInput || !destinoCodigo) {
        return;
    }

    const origenValor = origenInput.value;
    const origenCodigoValor = origenCodigo.value;

    origenInput.value = destinoInput.value;
    origenCodigo.value = destinoCodigo.value;
    destinoInput.value = origenValor;
    destinoCodigo.value = origenCodigoValor;

    origenInput.dispatchEvent(new Event('input', { bubbles: true }));
    destinoInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function ordenarVuelosAvanzado(vuelos, criterio) {
    const copia = vuelos.slice();
    const comparadores = {
        precioAsc: (a, b) => calcularPrecioTotal(a) - calcularPrecioTotal(b),
        precioDesc: (a, b) => calcularPrecioTotal(b) - calcularPrecioTotal(a),
        duracionAsc: (a, b) => obtenerDuracionEnMinutos(a.duracion) - obtenerDuracionEnMinutos(b.duracion),
        escalasAsc: (a, b) => a.escalas - b.escalas || calcularPrecioTotal(a) - calcularPrecioTotal(b),
        salidaAsc: (a, b) => obtenerHoraEnMinutos(a.salida) - obtenerHoraEnMinutos(b.salida),
        salidaDesc: (a, b) => obtenerHoraEnMinutos(b.salida) - obtenerHoraEnMinutos(a.salida)
    };

    copia.sort(comparadores[criterio] || comparadores.precioAsc);
    return copia;
}

function obtenerAerolineasSeleccionadas() {
    const seleccionadas = [];
    document.querySelectorAll('.airlineFilter:checked').forEach(checkbox => {
        seleccionadas.push(checkbox.value);
    });
    return seleccionadas;
}

function renderizarMisReservas(filtroCodigo = '') {
    const contenedor = document.getElementById('reservasHistoryBody');

    if (!contenedor) {
        return;
    }

    const reservas = obtenerReservasGuardadas();
    const filtro = filtroCodigo.trim().toLowerCase();
    const reservasFiltradas = filtro ? reservas.filter(reserva => String(reserva.codigoReserva || '').toLowerCase().includes(filtro)) : reservas;

    if (!reservasFiltradas.length) {
        contenedor.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">${filtro ? 'No hay reservas que coincidan con la búsqueda.' : 'No hay reservas guardadas todavía.'}</td></tr>`;
        return;
    }

    contenedor.innerHTML = reservasFiltradas.map(reserva => {
        const vuelo = reserva.vuelo || {};
        const fechaVuelo = vuelo.fecha ? formatearFecha(vuelo.fecha) : 'Sin fecha';

        return `
            <tr>
                <td class="fw-bold">${reserva.codigoReserva || 'N/A'}</td>
                <td>${fechaVuelo}</td>
                <td>${formatearAeropuerto(vuelo.origen)} → ${formatearAeropuerto(vuelo.destino)}</td>
                <td>${obtenerNombreAerolinea(vuelo.aerolinea)} ${vuelo.numero || ''}</td>
                <td class="text-end">$${reserva.total || calcularPrecioTotal(vuelo) || 0}</td>
                <td class="text-end"><button class="btn btn-outline-primary btn-sm" type="button" data-reserva-codigo="${reserva.codigoReserva}">Ver</button></td>
            </tr>
        `;
    }).join('');
}

function abrirReservaHistorica(codigoReserva) {
    const reserva = obtenerReservasGuardadas().find(item => item.codigoReserva === codigoReserva);

    if (!reserva) {
        return;
    }

    sessionStorage.setItem('reservaActual', JSON.stringify(reserva));
    window.location.href = 'confirmacion.html';
}

function descargarPDFConfirmacion() {
    const reserva = JSON.parse(sessionStorage.getItem('reservaActual') || 'null');

    if (!reserva || !reserva.vuelo || !window.jspdf || !window.jspdf.jsPDF) {
        alert('No se pudo generar el PDF en este momento.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const vuelo = reserva.vuelo;
    const pasajero = reserva.pasajero || {};

    pdf.setFontSize(18);
    pdf.text('ReservaVuelos - Confirmacion', 14, 20);
    pdf.setFontSize(12);
    pdf.text(`Codigo: ${reserva.codigoReserva || ''}`, 14, 32);
    pdf.text(`Pasajero: ${pasajero.nombre || ''}`, 14, 42);
    pdf.text(`Correo: ${pasajero.correo || ''}`, 14, 50);
    pdf.text(`Telefono: ${pasajero.telefono || ''}`, 14, 58);
    pdf.text(`Aerolinea: ${obtenerNombreAerolinea(vuelo.aerolinea)} ${vuelo.numero || ''}`, 14, 70);
    pdf.text(`Ruta: ${formatearAeropuerto(vuelo.origen)} -> ${formatearAeropuerto(vuelo.destino)}`, 14, 78);
    pdf.text(`Horario: ${vuelo.salida || ''} - ${vuelo.llegada || ''}`, 14, 86);
    pdf.text(`Fecha: ${vuelo.fecha ? formatearFecha(vuelo.fecha) : ''}`, 14, 94);
    pdf.text(`Precio total: $${reserva.total || calcularPrecioTotal(vuelo) || 0}`, 14, 106);

    pdf.save(`confirmacion-${reserva.codigoReserva || 'reserva'}.pdf`);
}

function inicializarElementosGlobales() {
    const anioActual = new Date().getFullYear();
    document.querySelectorAll('[current-data-year]').forEach(elemento => {
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
    inicializarBotonesLimpiezaRapida();

    const formBusqueda = document.getElementById('searchForm');
    const swapButton = document.getElementById('swapRouteBtn');
    const searchReservas = document.getElementById('buscarReservaCodigo');
    const limpiarBusquedaReservas = document.getElementById('limpiarBusquedaReservas');
    
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

    if (swapButton) {
        swapButton.addEventListener('click', function() {
            intercambiarAeropuertos('origen', 'origenCodigo', 'destino', 'destinoCodigo');
        });
    }

    if (searchReservas) {
        renderizarMisReservas(searchReservas.value);
        searchReservas.addEventListener('input', function() {
            renderizarMisReservas(this.value);
        });
    }

    if (limpiarBusquedaReservas && searchReservas) {
        limpiarBusquedaReservas.addEventListener('click', function() {
            searchReservas.value = '';
            renderizarMisReservas('');
            searchReservas.focus();
        });
    }

    document.addEventListener('click', function(e) {
        const botonReserva = e.target.closest('[data-reserva-codigo]');
        if (botonReserva) {
            abrirReservaHistorica(botonReserva.getAttribute('data-reserva-codigo'));
        }
    });
}

/**
 * Inicializa la página de resultados
 */
function inicializarResultados() {
    inicializarBotonesLimpiezaRapida();

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
    vuelosActuales = ordenarVuelosAvanzado(vuelosActuales, 'precioAsc');
    
    // Muestra vuelos
    mostrarVuelos(vuelosActuales);
    
    // Inicializa filtros
    inicializarFiltros();

    const swapButton = document.getElementById('swapRouteBtnResults');
    if (swapButton) {
        swapButton.addEventListener('click', function() {
            intercambiarAeropuertos('origen', 'origenCodigo', 'destino', 'destinoCodigo');
        });
    }
    
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
    const sortSelect = document.getElementById('sortSelect');
    
    // Event listener para rango de precio
    priceRange.addEventListener('input', function() {
        priceMax.textContent = '$' + this.value;
        aplicarFiltros();
    });
    
    // Event listeners para checkboxes
    document.querySelectorAll('.escalasFilter, .horarioFilter').forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });

    document.querySelectorAll('.airlineFilter').forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', aplicarFiltros);
    }
    
    // Botón limpiar filtros
    clearFilters.addEventListener('click', function() {
        priceRange.value = 1000;
        priceMax.textContent = '$1000';
        document.querySelectorAll('.escalasFilter, .horarioFilter').forEach(checkbox => {
            checkbox.checked = true;
        });
        document.querySelectorAll('.airlineFilter').forEach(checkbox => {
            checkbox.checked = true;
        });
        if (sortSelect) {
            sortSelect.value = 'precioAsc';
        }
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

    const aerolineasSeleccionadas = obtenerAerolineasSeleccionadas();
    const ordenSeleccionado = document.getElementById('sortSelect') ? document.getElementById('sortSelect').value : 'precioAsc';
    
    const filtros = {
        precioMaximo,
        escalas: escalasSeleccionadas,
        horarios: horariosSeleccionados,
        aerolineas: aerolineasSeleccionadas
    };
    
    const vuelosFiltrados = filtrarVuelos(vuelosActuales, filtros);
    const vuelosOrdenados = ordenarVuelosAvanzado(vuelosFiltrados, ordenSeleccionado);
    mostrarVuelos(vuelosOrdenados);
}

/**
 * Inicializa la página de reserva
 */
function inicializarReserva() {
    inicializarBotonesLimpiezaRapida();

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
// Dark Mode
function inicializarDarkMode() {
    const btn = document.getElementById('darkModeBtn');
    if (!btn) return;

    const guardado = localStorage.getItem('darkMode') === 'true';
    if (guardado) {
        document.body.classList.add('dark-mode');
        btn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    btn.addEventListener('click', function () {
        const activo = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', activo);
        btn.innerHTML = activo
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    });
}
// Aplica dark mode guardado en todas las páginas
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});
document.addEventListener('DOMContentLoaded', inicializarDarkMode);
/**
 * Inicializa la página de confirmación
 */
function inicializarConfirmacion() {
    inicializarBotonesLimpiezaRapida();

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
    document.getElementById('precioBse').textContent  = `$${vuelo.precioBase}`;
    document.getElementById('impuestos').textContent  = `$${vuelo.impuestos}`;
    document.getElementById('equipaje').textContent   = `$${vuelo.equipaje}`;
    document.getElementById('totalPrice').textContent = `$${reserva.total}`;

    const copyCodeBtn = document.getElementById('copyCodeBtn');
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(reserva.codigoReserva || '').then(() => {
                alert('Código copiado al portapapeles');
            });
        });
    }

    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', descargarPDFConfirmacion);
    }
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
