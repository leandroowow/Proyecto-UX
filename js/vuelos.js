/**
 * ReservaVuelos - Datos y Lógica de Vuelos
 * Módulo que contiene los datos simulados y funciones de búsqueda
 */

const aerolineas = [
    { codigo: 'LA', nombre: 'LATAM Airlines' },
    { codigo: 'AV', nombre: 'Avianca' },
    { codigo: 'AM', nombre: 'Aeroméxico' },
    { codigo: 'UA', nombre: 'United Airlines' },
    { codigo: 'IB', nombre: 'Iberia' },
    { codigo: 'AF', nombre: 'Air France' },
    { codigo: 'AZ', nombre: 'ITA Airways' },
    { codigo: 'BA', nombre: 'British Airways' },
    { codigo: 'LH', nombre: 'Lufthansa' },
    { codigo: 'QF', nombre: 'Qantas' },
    { codigo: 'NH', nombre: 'ANA' }
];

const aeropuertos = [
    { iata: 'MIA', ciudad: 'Miami',          pais: 'Estados Unidos', aeropuerto: 'Miami International Airport',                    aliases: ['miami', 'miami international', 'florida', 'usa', 'estados unidos'] },
    { iata: 'NYC', ciudad: 'Nueva York',      pais: 'Estados Unidos', aeropuerto: 'New York City',                                  aliases: ['new york', 'nueva york', 'ny', 'new york city'] },
    { iata: 'SCL', ciudad: 'Santiago',        pais: 'Chile',          aeropuerto: 'Aeropuerto Internacional Arturo Merino Benítez', aliases: ['santiago', 'arturo merino benitez', 'santiago de chile', 'chile'] },
    { iata: 'EZE', ciudad: 'Buenos Aires',    pais: 'Argentina',      aeropuerto: 'Aeropuerto Internacional Ministro Pistarini',    aliases: ['buenos aires', 'ezeiza', 'ministro pistarini', 'argentina'] },
    { iata: 'GRU', ciudad: 'São Paulo',       pais: 'Brasil',         aeropuerto: 'Aeropuerto Internacional de São Paulo-Guarulhos',aliases: ['sao paulo', 'sao', 'guarulhos', 'brasil'] },
    { iata: 'LIM', ciudad: 'Lima',            pais: 'Perú',           aeropuerto: 'Aeropuerto Internacional Jorge Chávez',          aliases: ['lima', 'jorge chavez', 'peru'] },
    { iata: 'BOG', ciudad: 'Bogotá',          pais: 'Colombia',       aeropuerto: 'Aeropuerto Internacional El Dorado',             aliases: ['bogota', 'el dorado', 'colombia'] },
    { iata: 'MEX', ciudad: 'Ciudad de México',pais: 'México',         aeropuerto: 'Aeropuerto Internacional Benito Juárez',         aliases: ['ciudad de mexico', 'cdmx', 'benito juarez', 'mexico'] },
    { iata: 'YYZ', ciudad: 'Toronto',         pais: 'Canadá',         aeropuerto: 'Toronto Pearson International Airport',          aliases: ['toronto', 'pearson', 'canada'] },
    { iata: 'MAD', ciudad: 'Madrid',          pais: 'España',         aeropuerto: 'Aeropuerto Adolfo Suárez Madrid-Barajas',        aliases: ['madrid', 'barajas', 'espana'] },
    { iata: 'CUN', ciudad: 'Cancún',          pais: 'México',         aeropuerto: 'Aeropuerto Internacional de Cancún',             aliases: ['cancun', 'riviera maya', 'quintana roo', 'mexico'] },
    { iata: 'CDG', ciudad: 'París',           pais: 'Francia',        aeropuerto: 'Aeropuerto Charles de Gaulle',                   aliases: ['paris', 'charles de gaulle', 'francia'] },
    { iata: 'FCO', ciudad: 'Roma',            pais: 'Italia',         aeropuerto: 'Aeropuerto de Fiumicino',                        aliases: ['roma', 'fiumicino', 'italia'] },
    { iata: 'LHR', ciudad: 'Londres',         pais: 'Reino Unido',    aeropuerto: 'Heathrow Airport',                               aliases: ['londres', 'heathrow', 'united kingdom', 'uk'] },
    { iata: 'FRA', ciudad: 'Frankfurt',       pais: 'Alemania',       aeropuerto: 'Frankfurt Airport',                              aliases: ['frankfurt', 'alemania', 'germany'] },
    { iata: 'GIG', ciudad: 'Río de Janeiro',  pais: 'Brasil',         aeropuerto: 'Aeropuerto Internacional Galeão',                aliases: ['rio de janeiro', 'rio', 'galeao', 'brasil'] },
    { iata: 'SYD', ciudad: 'Sídney',          pais: 'Australia',      aeropuerto: 'Sydney Kingsford Smith Airport',                 aliases: ['sydney', 'sidney', 'australia'] },
    { iata: 'HND', ciudad: 'Tokio',           pais: 'Japón',          aeropuerto: 'Tokyo Haneda Airport',                           aliases: ['tokio', 'tokyo', 'haneda', 'japon', 'japan'] },
    { iata: 'CCS', ciudad: 'Caracas',         pais: 'Venezuela',      aeropuerto: 'Simón Bolívar',                                  aliases: ['caracas', 'venezuela'] }
];

const ciudades = Object.fromEntries(
    aeropuertos.map(a => [a.iata, `${a.ciudad}, ${a.pais}`])
);

const clasesVuelo = {
    economica: {
        codigo: 'economica',
        nombre: 'Económica',
        incremento: 0,
        equipaje: '1 maleta incluida',
        beneficios: ['Precio base', 'Asiento estándar']
    },
    premiumEconomy: {
        codigo: 'premiumEconomy',
        nombre: 'Premium Economy',
        incremento: 0.2,
        equipaje: '2 maletas incluidas',
        beneficios: ['+20% sobre el precio base', 'Mayor espacio para piernas']
    },
    business: {
        codigo: 'business',
        nombre: 'Ejecutiva / Business',
        incremento: 0.5,
        equipaje: '2 maletas incluidas',
        beneficios: ['+50% sobre el precio base', 'Acceso a Sala VIP', 'Embarque prioritario']
    },
    primeraClase: {
        codigo: 'primeraClase',
        nombre: 'Primera Clase',
        incremento: 1,
        equipaje: '3 maletas incluidas',
        beneficios: ['+100% sobre el precio base', 'Sala VIP', 'Embarque prioritario', 'Servicio premium']
    }
};

function obtenerClaseVuelo(codigo = 'economica') {
    return clasesVuelo[codigo] || clasesVuelo.economica;
}

function calcularPrecioClaseVuelo(precioBase, codigoClase = 'economica') {
    const clase = obtenerClaseVuelo(codigoClase);
    return Math.round(Number(precioBase || 0) * (1 + clase.incremento));
}

function obtenerBeneficiosClaseVuelo(codigoClase = 'economica') {
    return obtenerClaseVuelo(codigoClase).beneficios.slice();
}

function formatearMoneda(valor) {
    return `$${Number(valor || 0).toLocaleString('es-CL')}`;
}

// ─── Utilidades de fecha y hora ───────────────────────────────────────────────

function obtenerFechaActualISO() {
    return new Date().toISOString().slice(0, 10);
}

function sumarDiasISO(fechaISO, dias) {
    const fecha = new Date(`${fechaISO}T12:00:00`);
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
}

function sumarMinutosAHora(hora, minutosExtra) {
    const [horas, minutos] = hora.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + minutosExtra;
    const horasNorm = Math.floor((totalMinutos % 1440) / 60);
    const minutosNorm = totalMinutos % 60;
    return `${String(horasNorm).padStart(2, '0')}:${String(minutosNorm).padStart(2, '0')}`;
}

function formatearDuracion(minutosTotales) {
    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;
    return `${horas}h ${minutos}m`;
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(`${fechaISO}T12:00:00`);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}


function calcularDias(fecha1, fecha2) {
    const d1 = new Date(`${fecha1}T12:00:00`);
    const d2 = new Date(`${fecha2}T12:00:00`);
    return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}

// ─── Utilidades de aeropuertos ────────────────────────────────────────────────

function normalizarTexto(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function obtenerAeropuertoPorIata(iata) {
    if (!iata) return null;
    return aeropuertos.find(a => a.iata === String(iata).trim().toUpperCase()) || null;
}

function formatearAeropuerto(aeropuertoOIata) {
    const aeropuerto = typeof aeropuertoOIata === 'string'
        ? obtenerAeropuertoPorIata(aeropuertoOIata)
        : aeropuertoOIata;
    if (!aeropuerto) return String(aeropuertoOIata || '').trim();
    return `${aeropuerto.ciudad}, ${aeropuerto.pais} (${aeropuerto.iata})`;
}

function obtenerDescripcionAeropuerto(aeropuerto) {
    if (!aeropuerto) return '';
    return `${aeropuerto.ciudad}, ${aeropuerto.pais} (${aeropuerto.iata}) - ${aeropuerto.aeropuerto}`;
}

function obtenerNombreCiudad(codigo) {
    const aeropuerto = obtenerAeropuertoPorIata(codigo);
    return aeropuerto ? `${aeropuerto.ciudad}, ${aeropuerto.pais}` : codigo;
}

function buscarAeropuertos(consulta) {
    const texto = normalizarTexto(consulta);
    if (!texto) return aeropuertos.slice(0, 8);

    return aeropuertos
        .map(aeropuerto => {
            const campos = [
                aeropuerto.iata, aeropuerto.ciudad, aeropuerto.pais,
                aeropuerto.aeropuerto, ...(aeropuerto.aliases || [])
            ].map(normalizarTexto);

            let puntaje = 0;
            if (aeropuerto.iata.toLowerCase() === texto) puntaje += 100;
            if (normalizarTexto(aeropuerto.ciudad) === texto) puntaje += 95;
            if (normalizarTexto(aeropuerto.aeropuerto) === texto) puntaje += 90;
            if (campos.some(c => c.startsWith(texto))) puntaje += 70;
            if (campos.some(c => c.includes(texto))) puntaje += 40;

            return { aeropuerto, puntaje };
        })
        .filter(r => r.puntaje > 0)
        .sort((a, b) => b.puntaje - a.puntaje || a.aeropuerto.ciudad.localeCompare(b.aeropuerto.ciudad))
        .slice(0, 8)
        .map(r => r.aeropuerto);
}

function resolverAeropuertoEntrada(entrada) {
    const texto = normalizarTexto(entrada);
    if (!texto) return null;

    const porIata = obtenerAeropuertoPorIata(texto);
    if (porIata) return porIata;

    const coincidencias = buscarAeropuertos(texto);
    if (coincidencias.length > 0) return coincidencias[0];

    return aeropuertos.find(a => {
        const campos = [a.ciudad, a.pais, a.aeropuerto, ...(a.aliases || [])];
        return campos.some(c => normalizarTexto(c) === texto);
    }) || null;
}

function obtenerCiudadesDisponibles() {
    return aeropuertos.map(a => obtenerDescripcionAeropuerto(a));
}

function validarCiudad(valor) {
    return Boolean(resolverAeropuertoEntrada(valor));
}

// ─── Rutas y vuelos ───────────────────────────────────────────────────────────

function crearRutaBase(origen, destino, config) {
    return {
        origen,
        destino,
        aerolinea: config.aerolinea,
        numeroBase: config.numeroBase,
        duracionMinutos: config.duracionMinutos,
        escalas: config.escalas,
        precioBase: config.precioBase,
        impuestos: Math.round(config.precioBase * 0.12),
        equipaje: config.equipaje,
        horarios: config.horarios
    };
}

const destinosDestacados = [
    { iata: 'EZE', duracionMinutos: 560,  precioBase: 650,  escalas: 0, equipaje: 30, horarios: ['07:20', '13:10', '20:25'] },
    { iata: 'GRU', duracionMinutos: 510,  precioBase: 620,  escalas: 1, equipaje: 28, horarios: ['06:45', '14:00', '21:10'] },
    { iata: 'LIM', duracionMinutos: 375,  precioBase: 540,  escalas: 0, equipaje: 25, horarios: ['05:55', '12:40', '18:30'] },
    { iata: 'BOG', duracionMinutos: 255,  precioBase: 420,  escalas: 0, equipaje: 25, horarios: ['06:30', '10:20', '17:55'] },
    { iata: 'MEX', duracionMinutos: 185,  precioBase: 390,  escalas: 0, equipaje: 23, horarios: ['08:15', '13:45', '22:05'] },
    { iata: 'YYZ', duracionMinutos: 210,  precioBase: 430,  escalas: 0, equipaje: 24, horarios: ['07:00', '15:25', '21:50'] },
    { iata: 'MAD', duracionMinutos: 515,  precioBase: 760,  escalas: 0, equipaje: 30, horarios: ['09:30', '16:15', '23:10'] },
    { iata: 'CUN', duracionMinutos: 470,  precioBase: 880,  escalas: 1, equipaje: 32, horarios: ['08:50', '15:05', '22:20'] },
    { iata: 'CDG', duracionMinutos: 575,  precioBase: 820,  escalas: 0, equipaje: 32, horarios: ['08:05', '14:55', '22:30'] },
    { iata: 'FCO', duracionMinutos: 590,  precioBase: 800,  escalas: 0, equipaje: 31, horarios: ['07:40', '13:30', '21:00'] },
    { iata: 'LHR', duracionMinutos: 580,  precioBase: 830,  escalas: 0, equipaje: 32, horarios: ['09:15', '15:50', '22:40'] },
    { iata: 'FRA', duracionMinutos: 560,  precioBase: 810,  escalas: 0, equipaje: 32, horarios: ['06:50', '12:25', '20:35'] },
    { iata: 'GIG', duracionMinutos: 315,  precioBase: 560,  escalas: 0, equipaje: 24, horarios: ['07:25', '13:45', '19:20'] },
    { iata: 'SYD', duracionMinutos: 1035, precioBase: 1450, escalas: 1, equipaje: 35, horarios: ['07:15', '12:55', '19:40'] },
    { iata: 'HND', duracionMinutos: 870,  precioBase: 1320, escalas: 1, equipaje: 34, horarios: ['08:25', '14:10', '22:00'] },
    { iata: 'CCS', duracionMinutos: 210,  precioBase: 360,  escalas: 0, equipaje: 22, horarios: ['06:20', '12:15', '18:50'] },
    { iata: 'MIA', duracionMinutos: 615,  precioBase: 690,  escalas: 0, equipaje: 32, horarios: ['06:10', '11:35', '19:45'] },
    { iata: 'NYC', duracionMinutos: 720,  precioBase: 750,  escalas: 1, equipaje: 30, horarios: ['07:30', '14:20', '21:00'] },
];

const rutasDesdeMIA = destinosDestacados
    .filter(d => d.iata !== 'MIA')
    .map((destino, indice) => {
        const aerolineaIda    = aerolineas[indice % aerolineas.length].codigo;
        const aerolineaVuelta = aerolineas[(indice + 3) % aerolineas.length].codigo;
        return [
            crearRutaBase('MIA', destino.iata, {
                aerolinea: aerolineaIda,
                numeroBase: `${aerolineaIda}${String(300 + indice).padStart(3, '0')}`,
                duracionMinutos: destino.duracionMinutos,
                escalas: destino.escalas,
                precioBase: destino.precioBase,
                equipaje: destino.equipaje,
                horarios: destino.horarios
            }),
            crearRutaBase(destino.iata, 'MIA', {
                aerolinea: aerolineaVuelta,
                numeroBase: `${aerolineaVuelta}${String(600 + indice).padStart(3, '0')}`,
                duracionMinutos: Math.max(90, Math.round(destino.duracionMinutos * 0.96)),
                escalas: destino.escalas,
                precioBase: Math.round(destino.precioBase * 0.92),
                equipaje: destino.equipaje,
                horarios: destino.horarios.map(hora => sumarMinutosAHora(hora, 45))
            })
        ];
    });

const rutasDesdeSCL = destinosDestacados
    .filter(d => d.iata !== 'SCL')
    .map((destino, indice) => {
        const aerolineaIda    = aerolineas[(indice + 2) % aerolineas.length].codigo;
        const aerolineaVuelta = aerolineas[(indice + 5) % aerolineas.length].codigo;
        const duracionSCL = Math.round(destino.duracionMinutos * 1.1);
        const precioSCL   = Math.round(destino.precioBase * 0.95);
        return [
            crearRutaBase('SCL', destino.iata, {
                aerolinea: aerolineaIda,
                numeroBase: `${aerolineaIda}${String(800 + indice).padStart(3, '0')}`,
                duracionMinutos: duracionSCL,
                escalas: destino.escalas,
                precioBase: precioSCL,
                equipaje: destino.equipaje,
                horarios: destino.horarios
            }),
            crearRutaBase(destino.iata, 'SCL', {
                aerolinea: aerolineaVuelta,
                numeroBase: `${aerolineaVuelta}${String(900 + indice).padStart(3, '0')}`,
                duracionMinutos: Math.max(90, Math.round(duracionSCL * 0.96)),
                escalas: destino.escalas,
                precioBase: Math.round(precioSCL * 0.92),
                equipaje: destino.equipaje,
                horarios: destino.horarios.map(hora => sumarMinutosAHora(hora, 30))
            })
        ];
    });

const rutasBase = [...rutasDesdeMIA, ...rutasDesdeSCL].flat();
function calcularLlegada(horaSalida, duracionMinutos) {
    return sumarMinutosAHora(horaSalida, duracionMinutos);
}

function generarVuelosParaRuta(ruta, fechaISO) {
    return ruta.horarios.map((horaSalida, indiceHorario) => {
        const ajustePrecio = indiceHorario === 0 ? 0 : indiceHorario === 1 ? 35 : 60;
        const precioBase = ruta.precioBase + ajustePrecio;

        return {
            id: Number(`${fechaISO.replace(/-/g, '')}${ruta.numeroBase.replace(/\D/g, '')}${indiceHorario}`),
            aerolinea: ruta.aerolinea,
            numero: `${ruta.aerolinea}-${ruta.numeroBase}`,
            salida: horaSalida,
            llegada: calcularLlegada(horaSalida, ruta.duracionMinutos),
            duracion: formatearDuracion(ruta.duracionMinutos),
            escalas: ruta.escalas,
            origen: ruta.origen,
            destino: ruta.destino,
            fecha: fechaISO,
            precioBase,
            impuestos: Math.round(precioBase * 0.12),
            equipaje: ruta.equipaje,
            disponibilidad: 25 - indiceHorario * 4
        };
    });
}

function generarInventarioInicial() {
    const hoy    = obtenerFechaActualISO();
    const manana = sumarDiasISO(hoy, 1);
    return [hoy, manana].flatMap(fechaISO =>
        rutasBase.flatMap(ruta => generarVuelosParaRuta(ruta, fechaISO))
    );
}

const vuelosData = generarInventarioInicial();

function obtenerRutasActivas() {
    return rutasBase;
}

// ─── Utilidades de vuelos ─────────────────────────────────────────────────────

function obtenerNombreAerolinea(codigo) {
    const aerolinea = aerolineas.find(a => a.codigo === codigo);
    return aerolinea ? aerolinea.nombre : 'Desconocida';
}

function calcularPrecioTotal(vuelo) {
    return vuelo.precioBase + vuelo.impuestos + vuelo.equipaje;
}

function obtenerParteDia(hora) {
    const [horas] = hora.split(':').map(Number);
    if (horas >= 6 && horas < 12) return 'mañana';
    if (horas >= 12 && horas < 18) return 'tarde';
    return 'noche';
}

function filtrarVuelos(vuelos, filtros) {
    return vuelos.filter(vuelo => {
        const precioTotal = calcularPrecioTotal(vuelo);
        if (precioTotal > filtros.precioMaximo) return false;
        if (!filtros.escalas.includes(vuelo.escalas)) return false;
        const parteDia = obtenerParteDia(vuelo.salida);
        if (!filtros.horarios.includes(parteDia)) return false;
        const aerolineaValida = !filtros.aerolineas || filtros.aerolineas.length === 0 ||
            filtros.aerolineas.includes(vuelo.aerolinea);
        return aerolineaValida;
    });
}

function buscarVuelos(criterios) {
    const origen  = resolverAeropuertoEntrada(criterios.origen);
    const destino = resolverAeropuertoEntrada(criterios.destino);
    const fecha   = criterios.fecha || obtenerFechaActualISO();

    if (!origen || !destino) return [];

    return obtenerRutasActivas()
        .filter(ruta => ruta.origen === origen.iata && ruta.destino === destino.iata)
        .flatMap(ruta => generarVuelosParaRuta(ruta, fecha));
}

function ordenarVuelos(vuelos, ordenar = 'precio') {
    const copia = [...vuelos];

    switch (ordenar) {
        case 'precio':
            return copia.sort((a, b) => calcularPrecioTotal(a) - calcularPrecioTotal(b));
        case 'duracion':
            return copia.sort((a, b) =>
                parseInt(a.duracion.split('h')[0], 10) - parseInt(b.duracion.split('h')[0], 10)
            );
        case 'horario':
            return copia.sort((a, b) => {
                const [hA, mA] = a.salida.split(':').map(Number);
                const [hB, mB] = b.salida.split(':').map(Number);
                return (hA * 60 + mA) - (hB * 60 + mB);
            });
        default:
            return copia;
    }
}

function generarCodigoReserva() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = 'RV-' + new Date().getFullYear() + '-';
    for (let i = 0; i < 6; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

function obtenerVueloPorId(id) {
    return vuelosData.find(v => v.id === id);
}