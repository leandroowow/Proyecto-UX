/**
 * ReservaVuelos - Datos y Lógica de Vuelos
 * Catálogo dinámico de aeropuertos, rutas y vuelos de demostración.
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
    { iata: 'MIA', ciudad: 'Miami', pais: 'Estados Unidos', aeropuerto: 'Miami International Airport', aliases: ['miami', 'miami international', 'florida', 'usa', 'estados unidos'] },
    { iata: 'NYC', ciudad: 'Nueva York', pais: 'Estados Unidos', aeropuerto: 'New York City', aliases: ['new york', 'nueva york', 'ny', 'new york city'] },
    { iata: 'SCL', ciudad: 'Santiago', pais: 'Chile', aeropuerto: 'Aeropuerto Internacional Arturo Merino Benítez', aliases: ['santiago', 'arturo merino benitez', 'santiago de chile', 'chile'] },
    { iata: 'EZE', ciudad: 'Buenos Aires', pais: 'Argentina', aeropuerto: 'Aeropuerto Internacional Ministro Pistarini', aliases: ['buenos aires', 'ezeiza', 'ministro pistarini', 'argentina'] },
    { iata: 'GRU', ciudad: 'São Paulo', pais: 'Brasil', aeropuerto: 'Aeropuerto Internacional de São Paulo-Guarulhos', aliases: ['sao paulo', 'sao', 'guarulhos', 'brasil'] },
    { iata: 'LIM', ciudad: 'Lima', pais: 'Perú', aeropuerto: 'Aeropuerto Internacional Jorge Chávez', aliases: ['lima', 'jorge chavez', 'peru'] },
    { iata: 'BOG', ciudad: 'Bogotá', pais: 'Colombia', aeropuerto: 'Aeropuerto Internacional El Dorado', aliases: ['bogota', 'el dorado', 'colombia'] },
    { iata: 'MEX', ciudad: 'Ciudad de México', pais: 'México', aeropuerto: 'Aeropuerto Internacional Benito Juárez', aliases: ['ciudad de mexico', 'cdmx', 'benito juarez', 'mexico'] },
    { iata: 'YYZ', ciudad: 'Toronto', pais: 'Canadá', aeropuerto: 'Toronto Pearson International Airport', aliases: ['toronto', 'pearson', 'canada'] },
    { iata: 'MAD', ciudad: 'Madrid', pais: 'España', aeropuerto: 'Aeropuerto Adolfo Suárez Madrid-Barajas', aliases: ['madrid', 'barajas', 'espana'] },
    { iata: 'CDG', ciudad: 'París', pais: 'Francia', aeropuerto: 'Aeropuerto Charles de Gaulle', aliases: ['paris', 'charles de gaulle', 'francia'] },
    { iata: 'FCO', ciudad: 'Roma', pais: 'Italia', aeropuerto: 'Aeropuerto de Fiumicino', aliases: ['roma', 'fiumicino', 'italia'] },
    { iata: 'LHR', ciudad: 'Londres', pais: 'Reino Unido', aeropuerto: 'Heathrow Airport', aliases: ['londres', 'heathrow', 'united kingdom', 'uk'] },
    { iata: 'FRA', ciudad: 'Frankfurt', pais: 'Alemania', aeropuerto: 'Frankfurt Airport', aliases: ['frankfurt', 'alemania', 'germany'] },
    { iata: 'SYD', ciudad: 'Sídney', pais: 'Australia', aeropuerto: 'Sydney Kingsford Smith Airport', aliases: ['sydney', 'sidney', 'australia'] },
    { iata: 'HND', ciudad: 'Tokio', pais: 'Japón', aeropuerto: 'Tokyo Haneda Airport', aliases: ['tokio', 'tokyo', 'haneda', 'japon', 'japan'] },
    { iata: 'CCS', ciudad: 'Caracas', pais: 'Venezuela', aeropuerto: 'Simón Bolívar', aliases: ['caracas', 'venezuela'] }
];

const ciudades = Object.fromEntries(aeropuertos.map(aeropuerto => [aeropuerto.iata, `${aeropuerto.ciudad}, ${aeropuerto.pais}`]));
const horariosBase = ['06:10', '12:45', '20:20'];

function obtenerFechaActualISO() {
    return new Date().toISOString().slice(0, 10);
}

function sumarDiasISO(fechaISO, dias) {
    const fecha = new Date(`${fechaISO}T12:00:00`);
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
}

function normalizarTexto(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function formatearDuracion(minutosTotales) {
    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;
    return `${horas}h ${minutos}m`;
}

function sumarMinutosAHora(hora, minutosExtra) {
    const [horas, minutos] = hora.split(':').map(Number);
    const totalMinutos = horas * 60 + minutos + minutosExtra;
    const horasNormalizadas = Math.floor((totalMinutos % 1440) / 60);
    const minutosNormalizados = totalMinutos % 60;
    return `${String(horasNormalizadas).padStart(2, '0')}:${String(minutosNormalizados).padStart(2, '0')}`;
}

function obtenerAeropuertoPorIata(iata) {
    if (!iata) {
        return null;
    }

    return aeropuertos.find(aeropuerto => aeropuerto.iata === String(iata).trim().toUpperCase()) || null;
}

function formatearAeropuerto(aeropuertoOIata) {
    const aeropuerto = typeof aeropuertoOIata === 'string' ? obtenerAeropuertoPorIata(aeropuertoOIata) : aeropuertoOIata;

    if (!aeropuerto) {
        return String(aeropuertoOIata || '').trim();
    }

    return `${aeropuerto.ciudad}, ${aeropuerto.pais} (${aeropuerto.iata})`;
}

function obtenerDescripcionAeropuerto(aeropuerto) {
    if (!aeropuerto) {
        return '';
    }

    return `${aeropuerto.ciudad}, ${aeropuerto.pais} (${aeropuerto.iata}) - ${aeropuerto.aeropuerto}`;
}

function obtenerNombreCiudad(codigo) {
    const aeropuerto = obtenerAeropuertoPorIata(codigo);
    return aeropuerto ? `${aeropuerto.ciudad}, ${aeropuerto.pais}` : codigo;
}

function buscarAeropuertos(consulta) {
    const texto = normalizarTexto(consulta);

    if (!texto) {
        return aeropuertos.slice(0, 8);
    }

    return aeropuertos
        .map(aeropuerto => {
            const campos = [aeropuerto.iata, aeropuerto.ciudad, aeropuerto.pais, aeropuerto.aeropuerto, ...(aeropuerto.aliases || [])].map(normalizarTexto);
            let puntaje = 0;

            if (aeropuerto.iata.toLowerCase() === texto) puntaje += 100;
            if (normalizarTexto(aeropuerto.ciudad) === texto) puntaje += 95;
            if (normalizarTexto(aeropuerto.aeropuerto) === texto) puntaje += 90;
            if (campos.some(campo => campo.startsWith(texto))) puntaje += 70;
            if (campos.some(campo => campo.includes(texto))) puntaje += 40;

            return { aeropuerto, puntaje };
        })
        .filter(resultado => resultado.puntaje > 0)
        .sort((a, b) => b.puntaje - a.puntaje || a.aeropuerto.ciudad.localeCompare(b.aeropuerto.ciudad))
        .slice(0, 8)
        .map(resultado => resultado.aeropuerto);
}

function resolverAeropuertoEntrada(entrada) {
    const texto = normalizarTexto(entrada);

    if (!texto) {
        return null;
    }

    const coincidenciaCodigo = obtenerAeropuertoPorIata(texto);
    if (coincidenciaCodigo) {
        return coincidenciaCodigo;
    }

    const coincidencias = buscarAeropuertos(texto);
    if (coincidencias.length > 0) {
        return coincidencias[0];
    }

    return aeropuertos.find(aeropuerto => {
        const campos = [aeropuerto.ciudad, aeropuerto.pais, aeropuerto.aeropuerto, ...(aeropuerto.aliases || [])];
        return campos.some(campo => normalizarTexto(campo) === texto);
    }) || null;
}

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

const rutasBase = [
    crearRutaBase('MIA', 'SCL', { aerolinea: 'LA', numeroBase: '701', duracionMinutos: 505, escalas: 0, precioBase: 760, equipaje: 35, horarios: ['06:10', '12:45', '20:20'] }),
    crearRutaBase('MIA', 'EZE', { aerolinea: 'LA', numeroBase: '702', duracionMinutos: 530, escalas: 0, precioBase: 790, equipaje: 35, horarios: ['07:20', '13:50', '21:10'] }),
    crearRutaBase('MIA', 'GRU', { aerolinea: 'AV', numeroBase: '310', duracionMinutos: 485, escalas: 1, precioBase: 740, equipaje: 30, horarios: ['06:45', '12:30', '19:40'] }),
    crearRutaBase('MIA', 'LIM', { aerolinea: 'DH', numeroBase: '420', duracionMinutos: 360, escalas: 0, precioBase: 620, equipaje: 28, horarios: ['05:55', '12:40', '18:30'] }),
    crearRutaBase('MIA', 'BOG', { aerolinea: 'LA', numeroBase: '505', duracionMinutos: 255, escalas: 0, precioBase: 450, equipaje: 30, horarios: ['06:30', '10:20', '17:55'] }),
    crearRutaBase('MIA', 'MEX', { aerolinea: 'AV', numeroBase: '202', duracionMinutos: 235, escalas: 0, precioBase: 390, equipaje: 25, horarios: ['08:15', '13:45', '22:05'] }),
    crearRutaBase('MIA', 'YYZ', { aerolinea: 'VB', numeroBase: '155', duracionMinutos: 205, escalas: 0, precioBase: 420, equipaje: 22, horarios: ['07:00', '15:25', '21:50'] }),
    crearRutaBase('MIA', 'MAD', { aerolinea: 'LA', numeroBase: '506', duracionMinutos: 515, escalas: 0, precioBase: 820, equipaje: 35, horarios: ['09:30', '16:15', '23:10'] }),
    crearRutaBase('MIA', 'CDG', { aerolinea: 'AV', numeroBase: '203', duracionMinutos: 555, escalas: 1, precioBase: 860, equipaje: 35, horarios: ['08:05', '14:55', '22:30'] }),
    crearRutaBase('MIA', 'FCO', { aerolinea: 'Y4', numeroBase: '401', duracionMinutos: 590, escalas: 1, precioBase: 880, equipaje: 35, horarios: ['07:40', '13:30', '21:00'] }),
    crearRutaBase('MIA', 'LHR', { aerolinea: 'LA', numeroBase: '507', duracionMinutos: 535, escalas: 0, precioBase: 840, equipaje: 35, horarios: ['09:15', '15:50', '22:40'] }),
    crearRutaBase('MIA', 'FRA', { aerolinea: 'DH', numeroBase: '321', duracionMinutos: 540, escalas: 1, precioBase: 830, equipaje: 35, horarios: ['06:50', '12:25', '20:35'] }),
    crearRutaBase('MIA', 'SYD', { aerolinea: 'VB', numeroBase: '902', duracionMinutos: 1100, escalas: 2, precioBase: 1490, equipaje: 45, horarios: ['07:15', '12:55', '19:40'] }),
    crearRutaBase('MIA', 'HND', { aerolinea: 'AV', numeroBase: '801', duracionMinutos: 1000, escalas: 1, precioBase: 1380, equipaje: 45, horarios: ['08:25', '14:10', '22:00'] }),
    crearRutaBase('MIA', 'CCS', { aerolinea: 'IB', numeroBase: '612', duracionMinutos: 210, escalas: 0, precioBase: 360, equipaje: 22, horarios: ['06:20', '12:15', '18:50'] })
];

function obtenerRutasActivas() {
    return rutasBase.flatMap(ruta => {
        const regreso = {
            origen: ruta.destino,
            destino: ruta.origen,
            aerolinea: ruta.aerolinea,
            numeroBase: String(Number(ruta.numeroBase) + 300),
            duracionMinutos: ruta.duracionMinutos,
            escalas: ruta.escalas,
            precioBase: Math.round(ruta.precioBase * 0.96),
            impuestos: Math.round(ruta.precioBase * 0.12 * 0.96),
            equipaje: ruta.equipaje,
            horarios: ruta.horarios.map(hora => sumarMinutosAHora(hora, 45))
        };

        return [ruta, regreso];
    });
}

function calcularLlegada(horaSalida, duracionMinutos) {
    return sumarMinutosAHora(horaSalida, duracionMinutos);
}

function generarVuelosParaRuta(ruta, fechaISO) {
    return ruta.horarios.map((horaSalida, indiceHorario) => {
        const ajustePrecio = indiceHorario === 0 ? 0 : indiceHorario === 1 ? 35 : 60;
        const precioBase = ruta.precioBase + ajustePrecio;

        return {
            id: Number(`${fechaISO.replace(/-/g, '')}${ruta.numeroBase}${indiceHorario}`),
            aerolinea: ruta.aerolinea,
            numero: `${ruta.aerolinea}-${ruta.numeroBase}-${String(indiceHorario + 1).padStart(2, '0')}`,
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
    const hoy = obtenerFechaActualISO();
    const manana = sumarDiasISO(hoy, 1);
    return [hoy, manana].flatMap(fechaISO => rutasBase.flatMap(ruta => generarVuelosParaRuta(ruta, fechaISO)));
}

const vuelosData = generarInventarioInicial();

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
        return true;
    });
}

function buscarVuelos(criterios) {
    const origen = resolverAeropuertoEntrada(criterios.origen);
    const destino = resolverAeropuertoEntrada(criterios.destino);
    const fecha = criterios.fecha || obtenerFechaActualISO();

    if (!origen || !destino) {
        return [];
    }

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
            return copia.sort((a, b) => parseInt(a.duracion.split('h')[0], 10) - parseInt(b.duracion.split('h')[0], 10));
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

function obtenerCiudadesDisponibles() {
    return aeropuertos.map(aeropuerto => obtenerDescripcionAeropuerto(aeropuerto));
}

function validarCiudad(valor) {
    return Boolean(resolverAeropuertoEntrada(valor));
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
    return vuelosData.find(vuelo => vuelo.id === id);
}

function formatearFecha(fechaISO) {
    if (!fechaISO) {
        return '';
    }

    const fecha = new Date(`${fechaISO}T12:00:00`);
    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(fecha);
}

function calcularDias(fecha1, fecha2) {
    const date1 = new Date(`${fecha1}T12:00:00`);
    const date2 = new Date(`${fecha2}T12:00:00`);
    return Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24));
}
