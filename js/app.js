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

function obtenerFechaFuturaISO(dias) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0];
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
    
    const actualizarVisibilidad = () => {
        button.style.display = input.value.trim() ? 'inline-flex' : 'none';
    };

    button.addEventListener('click', function() {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        actualizarVisibilidad();
        input.focus();
    });

    input.addEventListener('input', actualizarVisibilidad);
    input.addEventListener('change', actualizarVisibilidad);
    
    // Verificación inicial para campos con valores predeterminados
    actualizarVisibilidad();

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
    
    // Sincronizar estados de selección para el autocompletado
    origenInput.dataset.selectedIata = origenCodigo.value;
    destinoInput.dataset.selectedIata = destinoCodigo.value;

    // Disparar eventos para que el sistema reconozca el cambio de texto
    // y no limpie los campos ocultos por error
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
    const claseNombre = reserva.claseNombre || obtenerClaseVuelo(reserva.claseVuelo || 'economica').nombre;

    pdf.setFontSize(18);
    pdf.text('ReservaVuelos - Confirmacion', 14, 20);
    pdf.setFontSize(12);
    pdf.text(`Codigo: ${reserva.codigoReserva || ''}`, 14, 32);
    pdf.text(`Pasajero: ${pasajero.nombre || ''}`, 14, 42);
    if (pasajero.rut) {
        pdf.text(`RUT: ${pasajero.rut}`, 14, 50);
        pdf.text(`Correo: ${pasajero.correo || ''}`, 14, 58);
        pdf.text(`Telefono: ${pasajero.telefono || ''}`, 14, 66);
        pdf.text(`Aerolinea: ${obtenerNombreAerolinea(vuelo.aerolinea)} ${vuelo.numero || ''}`, 14, 78);
        pdf.text(`Ruta: ${formatearAeropuerto(vuelo.origen)} -> ${formatearAeropuerto(vuelo.destino)}`, 14, 86);
        pdf.text(`Horario: ${vuelo.salida || ''} - ${vuelo.llegada || ''}`, 14, 94);
        pdf.text(`Fecha: ${vuelo.fecha ? formatearFecha(vuelo.fecha) : ''}`, 14, 102);
        pdf.text(`Clase: ${claseNombre}`, 14, 110);
        pdf.text(`Precio total: $${reserva.total || calcularPrecioTotal(vuelo) || 0}`, 14, 118);
    } else {
        pdf.text(`Correo: ${pasajero.correo || ''}`, 14, 50);
        pdf.text(`Telefono: ${pasajero.telefono || ''}`, 14, 58);
        pdf.text(`Aerolinea: ${obtenerNombreAerolinea(vuelo.aerolinea)} ${vuelo.numero || ''}`, 14, 70);
        pdf.text(`Ruta: ${formatearAeropuerto(vuelo.origen)} -> ${formatearAeropuerto(vuelo.destino)}`, 14, 78);
        pdf.text(`Horario: ${vuelo.salida || ''} - ${vuelo.llegada || ''}`, 14, 86);
        pdf.text(`Fecha: ${vuelo.fecha ? formatearFecha(vuelo.fecha) : ''}`, 14, 94);
        pdf.text(`Clase: ${claseNombre}`, 14, 102);
        pdf.text(`Precio total: $${reserva.total || calcularPrecioTotal(vuelo) || 0}`, 14, 110);
    }

    pdf.save(`confirmacion-${reserva.codigoReserva || 'reserva'}.pdf`);
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
    input.dispatchEvent(new Event('input', { bubbles: true }));
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

        const renderizarSugerencias = (forceAll = false) => {
            // Si se fuerza (por clic) o si el valor actual es un aeropuerto ya seleccionado (contiene paréntesis),
            // mostramos la lista completa para facilitar el cambio rápido.
            const query = (forceAll || (input.value.includes('(') && input.dataset.selectedIata)) ? '' : input.value;
            const coincidencias = buscarAeropuertos(query);

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
            input.dispatchEvent(new Event('input', { bubbles: true }));
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
            renderizarSugerencias(true);
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
    const origenInput = document.getElementById(origenInputId);
    const destinoInput = document.getElementById(destinoInputId);
    const origen = obtenerAeropuertoDesdeFormulario(origenInputId, origenCodeId);
    const destino = obtenerAeropuertoDesdeFormulario(destinoInputId, destinoCodeId);
    const fechaSalida = document.getElementById(fechaSalidaId)?.value || '';
    const fechaRegreso = fechaRegresoId ? document.getElementById(fechaRegresoId)?.value || '' : '';
    const pasajeros = document.getElementById(pasajerosId)?.value || '1';
    const hoy = obtenerFechaActualISO();

    if (!origenInput?.value.trim()) {
        alert('Seleccione una ciudad de origen.');
        return false;
    }
    if (!origen) {
        alert('El origen ingresado no es válido. Seleccione una opción de la lista.');
        return false;
    }
    if (!destinoInput?.value.trim()) {
        alert('Seleccione una ciudad de destino.');
        return false;
    }
    if (!destino) {
        alert('El destino ingresado no es válido. Seleccione una opción de la lista.');
        return false;
    }

    if (origen.iata === destino.iata) {
        alert('El origen y destino no pueden ser iguales.');
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

    const numPasajeros = parseInt(pasajeros);
    if (isNaN(numPasajeros) || numPasajeros < 1 || numPasajeros > 10) {
        alert('Seleccione una cantidad de pasajeros válida (1-10).');
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
    } else if (pathname.includes('pago.html')) {
        inicializarPago();
    } else if (pathname.includes('confirmacion.html')) {
        inicializarConfirmacion();
    }
});

/**
 * Inicializa la página de inicio
 */
function inicializarHome() {
    // Limpiar estados previos para garantizar estabilidad en nuevas búsquedas
    sessionStorage.removeItem('vueloSeleccionado');
    inicializarBotonesLimpiezaRapida();

    const formBusqueda = document.getElementById('searchForm');
    const swapButton = document.getElementById('swapRouteBtn');
    
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

    inicializarPromociones();
}

function inicializarPromociones() {
    document.querySelectorAll('[data-promo-route]').forEach(boton => {
        boton.addEventListener('click', function() {
            const origenIata = this.dataset.promoOrigin || 'SCL';
            const destinoIata = this.dataset.promoDestination || '';
            const origen = obtenerAeropuertoPorIata(origenIata);
            const destino = obtenerAeropuertoPorIata(destinoIata);

            if (!destino) {
                return;
            }

            const fechaSalida = obtenerFechaFuturaISO(30);
            const fechaRegreso = obtenerFechaFuturaISO(37);

            sessionStorage.setItem('criteriosBusqueda', JSON.stringify({
                origen: origenIata,
                destino: destinoIata,
                origenLabel: formatearAeropuerto(origen || origenIata),
                destinoLabel: formatearAeropuerto(destino),
                fechaSalida,
                fechaRegreso,
                pasajeros: '1'
            }));

            window.location.href = 'resultados.html';
        });
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
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 class="fw-bold">No se encontraron resultados para esta búsqueda</h4>
                    <p class="text-muted">Prueba con otras fechas o destinos cercanos.</p>
                </div>
            `;
        }
        document.getElementById('resultsContainer').style.display = 'none';
        return;
    }
    
    // Ordena por precio por defecto
    vuelosActuales = ordenarVuelosAvanzado(vuelosActuales, 'precioAsc');
    
    // Muestra vuelos
    mostrarVuelos(vuelosActuales);
    
    // Inicializa filtros
    inicializarFiltros();
    
    inicializarPanelFiltros();

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
 * Gestiona el panel de filtros plegable (sidebar) para Escritorio y Móvil
 */
function inicializarPanelFiltros() {
    const btnToggle = document.getElementById('toggleFilters');
    const btnClose = document.getElementById('closeFilters');
    const sidebar = document.getElementById('filtersSidebar');

    if (!btnToggle || !sidebar) return;

    const toggle = () => sidebar.classList.toggle('active');

    btnToggle.addEventListener('click', toggle);
    if (btnClose) btnClose.addEventListener('click', toggle);

    document.addEventListener('click', (e) => {
        if (window.innerWidth < 992 && sidebar.classList.contains('active') && !sidebar.contains(e.target) && !btnToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
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

    const criterios = JSON.parse(sessionStorage.getItem('criteriosBusqueda') || '{}');
    const pasajeros = parseInt(criterios.pasajeros) || 1;

    const precioPersona = calcularPrecioTotal(vuelo);
    const precioTotal   = precioPersona * pasajeros;
    const escalasTexto  = vuelo.escalas === 0 ? 'Directo' : `${vuelo.escalas} ${vuelo.escalas === 1 ? 'escala' : 'escalas'}`;
    const classEscalas  = vuelo.escalas === 0 ? 'flight-scales direct' : 'flight-scales';

    const textoPasajeros = pasajeros > 1
        ? `<div class="text-muted small mt-1">$${precioPersona} x ${pasajeros} personas</div>`
        : `<div class="text-muted small mt-1">precio por persona</div>`;

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
                    <i class="fas fa-${vuelo.escalas === 0 ? 'check' : 'exchange-alt'}"></i>
                    ${escalasTexto}
                </div>
            </div>
            <div class="flight-price">
                <div class="price-label">total</div>
                <div class="price">$${precioTotal}</div>
                ${textoPasajeros}
                <button class="btn btn-primary btn-sm fw-bold mt-2" data-vuelo-id="${vuelo.id}">
                    Reservar
                </button>
            </div>
        </div>
    `;

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
    const pasajeros = parseInt(criterios.pasajeros) || 1;
    const precioPersona = calcularPrecioTotal(vuelo);
    const precioTotal = precioPersona * pasajeros;

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
            <div class="d-flex justify-content-between mb-1">
                <span>Precio por persona:</span>
                <strong>$${precioPersona}</strong>
            </div>
            <div class="d-flex justify-content-between mb-1">
                <span>Pasajeros:</span>
                <strong>${pasajeros}</strong>
            </div>
            <div class="d-flex justify-content-between border-top pt-2 mt-1">
                <span class="fw-bold">Total:</span>
                <strong>$${precioTotal}</strong>
            </div>
            <p class="text-muted small mb-0 mt-2">Incluye: Tarifa + Impuestos + Equipaje</p>
        </div>
    `;

    document.getElementById('vueloSeleccionadoInfo').innerHTML = info;

    const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
    modal.show();

    document.getElementById('confirmarVuelo').onclick = function() {
        modal.hide();
        sessionStorage.setItem('vueloSeleccionado', JSON.stringify(vuelo));
        window.location.href = 'reserva.html';
    };
}
function inicializarFiltros() {
    const priceRange = document.getElementById('priceRange');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const clearFilters = document.getElementById('clearFilters');
    const sortSelect = document.getElementById('sortSelect');

    if (!vuelosActuales || vuelosActuales.length === 0) return;

    const criterios = JSON.parse(sessionStorage.getItem('criteriosBusqueda') || '{}');
    const pasajeros = parseInt(criterios.pasajeros) || 1;

    priceRange.addEventListener('input', function() {
        priceMax.textContent = formatearMoneda(this.value);
        aplicarFiltros();
    });

    document.querySelectorAll('.escalasFilter, .horarioFilter').forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });

    document.querySelectorAll('.airlineFilter').forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', aplicarFiltros);
    }

    clearFilters.addEventListener('click', function() {
        const precios = vuelosActuales.map(v => calcularPrecioTotal(v));
        const precioMaximo = Math.max(...precios) * pasajeros;
        
        priceRange.value = precioMaximo;
        priceRange.max = precioMaximo;
        priceMax.textContent = formatearMoneda(precioMaximo);
        
        document.querySelectorAll('.escalasFilter, .horarioFilter').forEach(cb => cb.checked = true);
        document.querySelectorAll('.airlineFilter').forEach(cb => cb.checked = true);
        if (sortSelect) sortSelect.value = 'precioAsc';
        aplicarFiltros();
    });

    // Inicializar rango de precios dinámicamente según los resultados reales
    const precios = vuelosActuales.map(v => calcularPrecioTotal(v));
    const precioMaximo = Math.max(...precios) * pasajeros;
    
    priceRange.max = precioMaximo;
    priceRange.min = Math.min(...precios) * pasajeros;
    priceRange.value = precioMaximo;
    priceMax.textContent = formatearMoneda(precioMaximo);
    priceMin.textContent = formatearMoneda(priceRange.min);
}

function aplicarFiltros() {
    if (!vuelosActuales || vuelosActuales.length === 0) return;

    const criterios = JSON.parse(sessionStorage.getItem('criteriosBusqueda') || '{}');
    const pasajeros = parseInt(criterios.pasajeros) || 1;
    const precioMaximoTotal = parseInt(document.getElementById('priceRange').value);

    const escalasSeleccionadas = [];
    document.querySelectorAll('.escalasFilter:checked').forEach(cb => {
        escalasSeleccionadas.push(parseInt(cb.value));
    });

    const horariosSeleccionados = [];
    document.querySelectorAll('.horarioFilter:checked').forEach(cb => {
        horariosSeleccionados.push(cb.value);
    });

    const aerolineasSeleccionadas = obtenerAerolineasSeleccionadas();
    const ordenSeleccionado = document.getElementById('sortSelect')?.value || 'precioAsc';

    // Si el usuario desmarca todas las escalas u horarios, por UX mostramos todos en lugar de nada
    // o podemos mantener la lógica estricta. Aquí la hacemos flexible:
    const escalasFinal = escalasSeleccionadas.length === 0 ? [0, 1, 2] : escalasSeleccionadas;
    const horariosFinal = horariosSeleccionados.length === 0 ? ['mañana', 'tarde', 'noche'] : horariosSeleccionados;

    // Filtra por precio por persona (divide el máximo entre pasajeros)
    const filtros = {
        precioMaximo: Math.ceil(precioMaximoTotal / pasajeros),
        escalas: escalasFinal,
        horarios: horariosFinal,
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

    const claseVueloSelect = document.getElementById('claseVuelo');
    if (claseVueloSelect) {
        claseVueloSelect.addEventListener('change', function() {
            actualizarResumenVuelo(vueloSelec, this.value);
            actualizarDetallesPrecios(vueloSelec, this.value);
        });
    }

    // Event listener para autocompletar
    const autocompletarBtn = document.getElementById('autocompletarBtn');
    if (autocompletarBtn) {
        autocompletarBtn.addEventListener('click', autocompletarDatosDePrueba);
    }

    // Formatear RUT al perder el foco
    const rutInput = document.getElementById('rut');
    if (rutInput) {
        rutInput.addEventListener('blur', function() {
            const val = this.value;
            const valid = validarRutChileno(val);
            if (valid.valido) {
                this.value = formatearRutChileno(val);
                this.classList.remove('is-invalid');
                document.getElementById('rutError').textContent = '';
            }
        });
    }
    
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

function inicializarPago() {
    inicializarBotonesLimpiezaRapida();

    const reserva = JSON.parse(sessionStorage.getItem('reservaActual') || 'null');
    if (!reserva || !reserva.vuelo) {
        window.location.href = 'index.html';
        return;
    }

    const vuelo = reserva.vuelo;
    const clase = obtenerClaseVuelo(reserva.claseVuelo || 'economica');
    const precioClase = reserva.totalPersona ? reserva.totalPersona - (reserva.impuestos || 0) : calcularPrecioClaseVuelo(vuelo.precioBase, reserva.claseVuelo || 'economica');
    const total = reserva.total || 0;

    const resumenPago = document.getElementById('resumenPago');
    if (resumenPago) {
        resumenPago.innerHTML = `
            <div class="mb-3">
                <small class="text-muted">Vuelo</small>
                <p class="fw-bold mb-1">${obtenerNombreAerolinea(vuelo.aerolinea)} ${vuelo.numero}</p>
            </div>
            <div class="mb-3">
                <small class="text-muted">Ruta</small>
                <p class="fw-bold mb-1">${formatearAeropuerto(vuelo.origen)} → ${formatearAeropuerto(vuelo.destino)}</p>
            </div>
            <div class="mb-3">
                <small class="text-muted">Clase</small>
                <p class="fw-bold mb-1">${clase.nombre}</p>
            </div>
            <div class="mb-0">
                <small class="text-muted">Total a pagar</small>
                <p class="fw-bold text-primary mb-0 fs-4">${formatearMoneda(total)}</p>
            </div>
        `;
    }

    const resumenMetodo = document.getElementById('metodoSeleccionado');
    const radiosMetodo = document.querySelectorAll('input[name="metodoPago"]');
    const actualizarMetodo = () => {
        const seleccionado = document.querySelector('input[name="metodoPago"]:checked');
        if (resumenMetodo) {
            resumenMetodo.textContent = seleccionado ? seleccionado.dataset.label || seleccionado.value : 'Selecciona una opción';
        }
    };

    radiosMetodo.forEach(radio => radio.addEventListener('change', actualizarMetodo));
    actualizarMetodo();

    const detallesPago = document.getElementById('detallesPago');
    if (detallesPago) {
        detallesPago.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <span>Tarifa base</span>
                <strong>${formatearMoneda(vuelo.precioBase)}</strong>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Recargo por clase</span>
                <strong>${formatearMoneda(precioClase - vuelo.precioBase)}</strong>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Impuestos</span>
                <strong>${formatearMoneda(reserva.impuestos || 0)}</strong>
            </div>
            <div class="d-flex justify-content-between mb-0 pt-3 border-top border-2">
                <span class="fw-bold">Total</span>
                <strong class="text-primary">${formatearMoneda(total)}</strong>
            </div>
        `;
    }

    const beneficiosPago = document.getElementById('beneficiosPago');
    if (beneficiosPago) {
        beneficiosPago.innerHTML = clase.beneficios.map(beneficio => `<li>${beneficio}</li>`).join('');
    }

    const estadoPago = document.getElementById('estadoPago');
    const formPago = document.getElementById('pagoForm');
    const botonPago = document.getElementById('pagarBtn');

    if (formPago) {
        formPago.addEventListener('submit', function(evento) {
            evento.preventDefault();

            const metodoSeleccionado = document.querySelector('input[name="metodoPago"]:checked');
            if (!metodoSeleccionado) {
                if (estadoPago) {
                    estadoPago.className = 'alert alert-warning';
                    estadoPago.textContent = 'Selecciona un método de pago para continuar.';
                }
                return;
            }

            if (botonPago) {
                botonPago.disabled = true;
                botonPago.dataset.originalText = botonPago.innerHTML;
                botonPago.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';
            }

            const exito = Math.random() < 0.8;

            if (exito) {
                reserva.codigoReserva = reserva.codigoReserva || generarCodigoReserva();
                reserva.pagado = true;
                sessionStorage.setItem('reservaActual', JSON.stringify(reserva));

                if (estadoPago) {
                    estadoPago.className = 'alert alert-success';
                    estadoPago.textContent = 'Pago realizado con éxito';
                }

                window.setTimeout(() => {
                    window.location.href = 'confirmacion.html';
                }, 1200);
                return;
            }

            if (estadoPago) {
                estadoPago.className = 'alert alert-danger';
                estadoPago.textContent = 'Error en la transacción. Intente nuevamente.';
            }

            if (botonPago) {
                botonPago.disabled = false;
                botonPago.innerHTML = botonPago.dataset.originalText || 'Pagar';
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
    const clase = obtenerClaseVuelo(reserva.claseVuelo || 'economica');
    
    // Código de reserva
    if (!reserva.codigoReserva) {
        reserva.codigoReserva = generarCodigoReserva();
        sessionStorage.setItem('reservaActual', JSON.stringify(reserva));
    }
    document.getElementById('codigoReserva').textContent = reserva.codigoReserva;
    
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
            <div class="col-md-6 mb-3">
                <small class="text-muted">Clase</small>
                <p class="fw-bold">${reserva.claseNombre || clase.nombre}</p>
            </div>
            <div class="col-md-6 mb-3">
                <small class="text-muted">Equipaje</small>
                <p class="fw-bold">${reserva.equipajePermitido || clase.equipaje}</p>
            </div>
        </div>
    `;
    
    document.getElementById('summaryConfirm').innerHTML = summaryVuelo;
    
    // Datos del pasajero
    document.getElementById('confirmNombre').textContent = pasajero.nombre;
    if (document.getElementById('confirmRut')) {
        document.getElementById('confirmRut').textContent = pasajero.rut || 'No proporcionado';
    }
    document.getElementById('confirmCorreo').textContent = pasajero.correo;
    document.getElementById('confirmTelefono').textContent = formatearTelefono(pasajero.telefono);

    const beneficiosClase = document.getElementById('beneficiosClaseConfirm');
    if (beneficiosClase) {
        beneficiosClase.innerHTML = (reserva.beneficiosClase || clase.beneficios).map(beneficio => `<li>${beneficio}</li>`).join('');
    }

    // Desglose de precios
    const precioBase = document.getElementById('precioBaseConfirm');
    const recargoClase = document.getElementById('recargoClaseConfirm');
    const impuestos = document.getElementById('impuestosConfirm');
    const equipaje = document.getElementById('equipajeConfirm');
    const totalPrice = document.getElementById('totalPrice');

    if (precioBase) {
        precioBase.textContent = formatearMoneda(vuelo.precioBase);
    }

    if (recargoClase) {
        recargoClase.textContent = formatearMoneda(reserva.recargoClase || 0);
    }

    if (impuestos) {
        impuestos.textContent = formatearMoneda(reserva.impuestos || vuelo.impuestos || 0);
    }

    if (equipaje) {
        equipaje.textContent = reserva.equipajePermitido || clase.equipaje;
    }

    if (totalPrice) {
        totalPrice.textContent = formatearMoneda(reserva.total || 0);
    }

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

    // Cargar recomendaciones de destinos
    renderizarRecomendaciones(vuelo.destino, vuelo.fecha);
}

/**
 * Obtiene destinos recomendados de la misma región (o cercanos en precio si faltan)
 * @param {string} destinoReserva - Código IATA del destino reservado
 * @param {string} fechaVuelo - Fecha de salida
 * @returns {Array<string>} Array de códigos IATA recomendados
 */
function obtenerDestinosRecomendados(destinoReserva, fechaVuelo) {
    const regionesAeropuertos = {
        'MIA': 'Norteamérica', 'NYC': 'Norteamérica', 'YYZ': 'Norteamérica', 'MEX': 'Norteamérica', 'CUN': 'Norteamérica',
        'SCL': 'Sudamérica', 'EZE': 'Sudamérica', 'GRU': 'Sudamérica', 'LIM': 'Sudamérica', 'BOG': 'Sudamérica', 'GIG': 'Sudamérica', 'CCS': 'Sudamérica',
        'MAD': 'Europa', 'CDG': 'Europa', 'FCO': 'Europa', 'LHR': 'Europa', 'FRA': 'Europa',
        'SYD': 'Asia-Pacífico', 'HND': 'Asia-Pacífico'
    };

    const regionDestino = regionesAeropuertos[destinoReserva] || 'Sudamérica';

    // 1. Obtener candidatos de la misma región
    let candidatosMismaRegion = Object.keys(regionesAeropuertos).filter(iata => 
        regionesAeropuertos[iata] === regionDestino && 
        iata !== destinoReserva && 
        iata !== 'SCL'
    );

    // Si queremos 3, y hay suficientes candidatos en la misma región, los tomamos
    let recomendados = candidatosMismaRegion.slice(0, 3);

    // 2. Si faltan para llegar a 3, completamos con los más cercanos en precio
    if (recomendados.length < 3) {
        const reserva = JSON.parse(sessionStorage.getItem('reservaActual') || '{}');
        const precioReservado = reserva.vuelo ? reserva.vuelo.precioBase : 500;

        let otrosCandidatos = Object.keys(regionesAeropuertos).filter(iata => 
            iata !== destinoReserva && 
            iata !== 'SCL' && 
            !recomendados.includes(iata)
        );

        // Buscar el precio de cada destino destacado
        const obtenerPrecioBaseDestino = (iata) => {
            const dest = destinosDestacados.find(d => d.iata === iata);
            return dest ? Math.round(dest.precioBase * 0.95) : 500;
        };

        // Ordenar otros candidatos por diferencia absoluta de precio base
        otrosCandidatos.sort((a, b) => {
            const difA = Math.abs(obtenerPrecioBaseDestino(a) - precioReservado);
            const difB = Math.abs(obtenerPrecioBaseDestino(b) - precioReservado);
            return difA - difB;
        });

        // Completar hasta 3
        while (recomendados.length < 3 && otrosCandidatos.length > 0) {
            recomendados.push(otrosCandidatos.shift());
        }
    }

    return recomendados;
}

/**
 * Renderiza dinámicamente las tarjetas de recomendación
 */
function renderizarRecomendaciones(destinoReserva, fechaVuelo) {
    const contenedorSection = document.getElementById('recomendacionesVuelosContainer');
    const contenedorCards = document.getElementById('recomendacionesCardsRow');
    if (!contenedorSection || !contenedorCards) return;

    const recomendados = obtenerDestinosRecomendados(destinoReserva, fechaVuelo);
    if (recomendados.length === 0) return;

    contenedorCards.innerHTML = '';

    recomendados.forEach(iata => {
        const aeropuerto = obtenerAeropuertoPorIata(iata);
        if (!aeropuerto) return;

        // Buscar el vuelo más barato de SCL a iata
        const vuelos = buscarVuelos({ origen: 'SCL', destino: iata, fecha: fechaVuelo });
        let precioMasBarato = 0;
        let vueloCheapest = null;

        if (vuelos && vuelos.length > 0) {
            const vuelosOrdenados = ordenarVuelosAvanzado(vuelos, 'precioAsc');
            vueloCheapest = vuelosOrdenados[0];
            precioMasBarato = calcularPrecioTotal(vueloCheapest);
        } else {
            // Fallback con fecha alternativa
            const hoy = obtenerFechaActualISO();
            const manana = sumarDiasISO(hoy, 1);
            const fechaAlt = fechaVuelo === hoy ? manana : hoy;
            const vuelosAlt = buscarVuelos({ origen: 'SCL', destino: iata, fecha: fechaAlt });
            if (vuelosAlt && vuelosAlt.length > 0) {
                const vuelosOrdenados = ordenarVuelosAvanzado(vuelosAlt, 'precioAsc');
                vueloCheapest = vuelosOrdenados[0];
                precioMasBarato = calcularPrecioTotal(vueloCheapest);
            }
        }

        // Si no hay vuelos en ninguna de las fechas, estimamos el precio
        if (!precioMasBarato) {
            const dest = destinosDestacados.find(d => d.iata === iata);
            const precioBase = dest ? Math.round(dest.precioBase * 0.95) : 500;
            precioMasBarato = Math.round(precioBase * 1.12) + (dest ? dest.equipaje : 30);
        }

        const precioFormateado = formatearMoneda(precioMasBarato);

        const cardHtml = `
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm info-card p-3 d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex align-items-center mb-3">
                            <div class="payment-icon bg-primary-subtle text-primary me-2 flex-shrink-0" style="width: 2.5rem; height: 2.5rem; font-size: 0.9rem;">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0 text-truncate" style="max-width: 150px;">${aeropuerto.ciudad}</h6>
                                <small class="text-muted mb-0">${aeropuerto.pais}</small>
                            </div>
                        </div>
                        <p class="text-muted small mb-2">Vuelo desde Santiago (SCL)</p>
                    </div>
                    <div class="mt-auto pt-3 border-top">
                        <div class="d-flex justify-content-between align-items-baseline mb-3">
                            <span class="text-muted small">Desde</span>
                            <strong class="fs-5 text-primary">${precioFormateado}</strong>
                        </div>
                        <button class="btn btn-outline-primary btn-sm w-100 fw-bold" onclick="irARecomendacion('${iata}', '${fechaVuelo}')">
                            <i class="fas fa-search me-1"></i> Buscar Vuelo
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedorCards.insertAdjacentHTML('beforeend', cardHtml);
    });

    contenedorSection.style.display = 'block';
}

/**
 * Guarda criterios de recomendación y redirige a la página de resultados
 */
function irARecomendacion(iata, fechaVuelo) {
    const criteriosBusqueda = {
        origen: 'SCL',
        destino: iata,
        origenLabel: formatearAeropuerto('SCL'),
        destinoLabel: formatearAeropuerto(iata),
        fechaSalida: fechaVuelo,
        fechaRegreso: null,
        pasajeros: '1'
    };
    sessionStorage.setItem('criteriosBusqueda', JSON.stringify(criteriosBusqueda));
    window.location.href = 'resultados.html';
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
