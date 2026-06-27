/**
 * ReservaVuelos - Chatbot
 */

const chatEstados = {
    INICIO: 'inicio',
    ESPERANDO_DESTINO: 'esperando_destino',
    ESPERANDO_FECHA: 'esperando_fecha',
    ESPERANDO_PASAJEROS: 'esperando_pasajeros',
    MOSTRANDO_RESULTADO: 'mostrando_resultado'
};

let chatEstado = chatEstados.INICIO;
let chatDestino = null;
let chatFecha = null;
let chatPasajeros = 1;

// ─── Similitud de texto (distancia Levenshtein) ───────────────────────────────
function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i-1] === b[j-1]
                ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
    }
    return dp[m][n];
}

function similitud(a, b) {
    a = normalizarTexto(a);
    b = normalizarTexto(b);
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - levenshtein(a, b) / maxLen;
}

function resolverDestinoInteligente(texto) {
    const normal = resolverAeropuertoEntrada(texto);
    if (normal) return normal;

    const textoNorm = normalizarTexto(texto);
    let mejorCoincidencia = null;
    let mejorPuntaje = 0;

    aeropuertos.forEach(aeropuerto => {
        const campos = [
            aeropuerto.ciudad,
            aeropuerto.pais,
            aeropuerto.iata,
            ...(aeropuerto.aliases || [])
        ];

        campos.forEach(campo => {
            const s = similitud(textoNorm, normalizarTexto(campo));
            const contiene = normalizarTexto(campo).includes(textoNorm) || textoNorm.includes(normalizarTexto(campo));
            const puntaje = contiene ? Math.max(s, 0.7) : s;

            if (puntaje > mejorPuntaje) {
                mejorPuntaje = puntaje;
                mejorCoincidencia = aeropuerto;
            }
        });
    });

    return mejorPuntaje >= 0.6 ? mejorCoincidencia : null;
}

// ─── Formato de fecha legible ─────────────────────────────────────────────────
function formatearFechaChat(fechaISO) {
    const [anio, mes, dia] = fechaISO.split('-');
    return `${dia}/${mes}/${anio}`;
}

// ─── Resolver fecha desde texto ───────────────────────────────────────────────
function resolverFecha(texto) {
    const hoy = obtenerFechaActualISO();
    const t = normalizarTexto(texto);

    if (t === 'hoy') return hoy;
    if (t === 'manana' || t === 'mañana') return sumarDiasISO(hoy, 1);
    if (t === 'pasado manana' || t === 'pasado mañana') return sumarDiasISO(hoy, 2);

    // "en X dias" o "X dias mas"
    const diasMatch = t.match(/(\d+)\s*d[ií]as?\s*(m[aá]s|después|despues)?|en\s*(\d+)\s*d[ií]as?/);
    if (diasMatch) {
        const dias = parseInt(diasMatch[1] || diasMatch[3]);
        if (dias > 0 && dias <= 365) return sumarDiasISO(hoy, dias);
    }

    // "en X semanas" o "X semanas mas"
    const semanasMatch = t.match(/(\d+)\s*semanas?\s*(m[aá]s|después|despues)?|en\s*(\d+)\s*semanas?/);
    if (semanasMatch) {
        const semanas = parseInt(semanasMatch[1] || semanasMatch[3]);
        if (semanas > 0 && semanas <= 52) return sumarDiasISO(hoy, semanas * 7);
    }

    // "en X meses" o "X meses mas"
    const mesesMatch = t.match(/(\d+)\s*meses?\s*(m[aá]s|después|despues)?|en\s*(\d+)\s*meses?/);
    if (mesesMatch) {
        const meses = parseInt(mesesMatch[1] || mesesMatch[3]);
        if (meses > 0 && meses <= 12) {
            const fecha = new Date(`${hoy}T12:00:00`);
            fecha.setMonth(fecha.getMonth() + meses);
            return fecha.toISOString().slice(0, 10);
        }
    }

    // formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(texto) && texto >= hoy) return texto;

    // formato DD/MM/YYYY o DD-MM-YYYY
    const partes = texto.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (partes) {
        const iso = `${partes[3]}-${partes[2].padStart(2,'0')}-${partes[1].padStart(2,'0')}`;
        return iso >= hoy ? iso : null;
    }

    // formato DD/MM
    const corto = texto.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
    if (corto) {
        const anioActual = new Date().getFullYear();
        let iso = `${anioActual}-${corto[2].padStart(2,'0')}-${corto[1].padStart(2,'0')}`;
        if (iso < hoy) iso = `${anioActual + 1}-${corto[2].padStart(2,'0')}-${corto[1].padStart(2,'0')}`;
        return iso;
    }

    return null;
}

// ─── UI del chatbot ───────────────────────────────────────────────────────────
function inicializarChatbot() {
    const html = `
        <div id="chatbot-widget">
            <button id="chatbot-toggle" title="Asistente de vuelos">
                <i class="fas fa-comment-dots"></i>
            </button>
            <div id="chatbot-box" style="display:none;">
                <div id="chatbot-header">
                    <span><i class="fas fa-robot"></i> Asistente de Vuelos</span>
                    <button id="chatbot-close"><i class="fas fa-times"></i></button>
                </div>
                <div id="chatbot-messages"></div>
                <div id="chatbot-input-area">
                    <input type="text" id="chatbot-input" placeholder="Escribe aquí..." autocomplete="off">
                    <button id="chatbot-send"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

document.getElementById('chatbot-toggle').addEventListener('click', () => {
    const box = document.getElementById('chatbot-box');
    const abierto = box.style.display !== 'none';
    box.style.display = abierto ? 'none' : 'flex';
    if (!abierto && document.getElementById('chatbot-messages').children.length === 0) {
        agregarMensajeBot('👋 ¡Hola! Soy tu asistente de vuelos desde <strong>Santiago, Chile</strong>.<br>¿A dónde quieres viajar?');
        chatEstado = chatEstados.ESPERANDO_DESTINO;
    }
});
    document.getElementById('chatbot-close').addEventListener('click', () => {
        document.getElementById('chatbot-box').style.display = 'none';
    });

    document.getElementById('chatbot-send').addEventListener('click', procesarMensaje);
    document.getElementById('chatbot-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') procesarMensaje();
    });
}

function agregarMensajeBot(texto) {
    const mensajes = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chatbot-msg bot';
    div.innerHTML = texto;
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
}

function agregarMensajeUsuario(texto) {
    const mensajes = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chatbot-msg user';
    div.textContent = texto;
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
}

function procesarMensaje() {
    const input = document.getElementById('chatbot-input');
    const texto = input.value.trim();
    if (!texto) return;
    agregarMensajeUsuario(texto);
    input.value = '';
    setTimeout(() => responderBot(texto), 400);
}

function responderBot(texto) {
    switch (chatEstado) {
        case chatEstados.ESPERANDO_DESTINO:
            const aeropuerto = resolverDestinoInteligente(texto);
            if (aeropuerto && aeropuerto.iata !== 'SCL') {
                chatDestino = aeropuerto;
                chatEstado = chatEstados.ESPERANDO_FECHA;
                agregarMensajeBot(`🗺️ Perfecto, vuelos a <strong>${aeropuerto.ciudad}, ${aeropuerto.pais}</strong>.<br>📅 ¿Para qué fecha? (Ej: hoy, mañana, 2 dias mas, en 3 semanas, 15/07)`);
            } else if (aeropuerto && aeropuerto.iata === 'SCL') {
                agregarMensajeBot('😅 Ese es tu origen. ¿A dónde quieres <strong>viajar</strong>?');
            } else {
                agregarMensajeBot('😔 No reconocí ese destino. Prueba con ciudades como:<br><strong>Buenos Aires, Lima, Madrid, Miami, Roma...</strong>');
            }
            break;

        case chatEstados.ESPERANDO_FECHA:
            const fecha = resolverFecha(texto);
            if (fecha) {
                chatFecha = fecha;
                buscarYMostrarVuelo();
            } else {
                agregarMensajeBot(`📅 No entendí la fecha. Ya tengo guardado tu destino: <strong>${chatDestino.ciudad}</strong>.<br>Dime cuándo quieres viajar:<br><strong>hoy, mañana, 3 dias mas, en 2 semanas, 1 mes mas</strong> o una fecha como <strong>15/07</strong>.`);
            }
            break;

        case chatEstados.ESPERANDO_PASAJEROS:
            const num = parseInt(texto);
            if (!isNaN(num) && num >= 1 && num <= 5) {
                chatPasajeros = num;
                mostrarResultadoFinal();
            } else {
                agregarMensajeBot('👥 Por favor escribe un número entre <strong>1 y 5</strong>.');
            }
            break;

        case chatEstados.MOSTRANDO_RESULTADO:
            const nuevoDest = resolverDestinoInteligente(texto);
            if (nuevoDest && nuevoDest.iata !== 'SCL') {
                chatDestino = nuevoDest;
                chatFecha = null;
                chatPasajeros = 1;
                chatEstado = chatEstados.ESPERANDO_FECHA;
                agregarMensajeBot(`🗺️ Buscando vuelos a <strong>${nuevoDest.ciudad}</strong>.<br>📅 ¿Para qué fecha?`);
            } else {
                chatEstado = chatEstados.ESPERANDO_DESTINO;
                chatDestino = null;
                chatFecha = null;
                chatPasajeros = 1;
                agregarMensajeBot('✈️ ¿A dónde quieres viajar ahora?');
            }
            break;

        default:
            agregarMensajeBot('🤔 No entendí eso. ¿Puedes intentar de nuevo?');
    }
}

function buscarYMostrarVuelo() {
    const vuelos = buscarVuelos({
        origen: 'SCL',
        destino: chatDestino.iata,
        fecha: chatFecha
    });

    if (!vuelos || vuelos.length === 0) {
        const hoy = obtenerFechaActualISO();
        const diasDisponibles = [];

        for (let i = 1; i <= 14; i++) {
            const fechaPrueba = sumarDiasISO(hoy, i);
            const vuelosPrueba = buscarVuelos({
                origen: 'SCL',
                destino: chatDestino.iata,
                fecha: fechaPrueba
            });
            if (vuelosPrueba && vuelosPrueba.length > 0) {
                diasDisponibles.push(fechaPrueba);
                if (diasDisponibles.length === 3) break;
            }
        }

        if (diasDisponibles.length > 0) {
            const opciones = diasDisponibles.map(f => `<strong>${formatearFechaChat(f)}</strong>`).join(', ');
            agregarMensajeBot(`😔 No hay vuelos a <strong>${chatDestino.ciudad}</strong> para el <strong>${formatearFechaChat(chatFecha)}</strong>.<br><br>📅 Fechas disponibles próximas:<br>${opciones}<br><br>¿Cuál te viene mejor?`);
            chatEstado = chatEstados.ESPERANDO_FECHA;
        } else {
            agregarMensajeBot(`😔 No encontré vuelos a <strong>${chatDestino.ciudad}</strong> en los próximos 14 días.<br>¿Quieres buscar otro destino?`);
            chatEstado = chatEstados.ESPERANDO_DESTINO;
            chatDestino = null;
            chatFecha = null;
        }
        return;
    }

    // Hay vuelos, pregunta pasajeros
    chatEstado = chatEstados.ESPERANDO_PASAJEROS;
    agregarMensajeBot('👥 ¿Cuántas personas van a viajar? (1-5)');
}

function mostrarResultadoFinal() {
    const vuelos = buscarVuelos({
        origen: 'SCL',
        destino: chatDestino.iata,
        fecha: chatFecha
    });

    const mejor = vuelos.sort((a, b) => calcularPrecioTotal(a) - calcularPrecioTotal(b))[0];
    const totalPorPersona = calcularPrecioTotal(mejor);
    const totalGeneral = totalPorPersona * chatPasajeros;

    agregarMensajeBot(`
        ✅ <strong>Mejor vuelo encontrado:</strong><br><br>
        ✈️ <strong>${obtenerNombreAerolinea(mejor.aerolinea)}</strong> ${mejor.numero}<br>
        📍 Santiago → ${chatDestino.ciudad}<br>
        📅 Fecha: <strong>${formatearFechaChat(chatFecha)}</strong><br>
        🕐 Salida: <strong>${mejor.salida}</strong> · Llegada: <strong>${mejor.llegada}</strong><br>
        ⏱️ Duración: <strong>${mejor.duracion}</strong><br>
        👥 Pasajeros: <strong>${chatPasajeros}</strong><br>
        💰 Por persona: <strong>${formatearMoneda(totalPorPersona)}</strong><br>
        💳 Total ${chatPasajeros} personas: <strong>${formatearMoneda(totalGeneral)}</strong><br><br>
        <button onclick="irAReservarDesdeChat('${chatDestino.iata}','${chatFecha}','${chatPasajeros}',${mejor.id})"
           class="btn btn-primary btn-sm mt-2">Reservar este vuelo</button>
        <button onclick="verTodosDesdeChat('${chatDestino.iata}','${chatFecha}','${chatPasajeros}')"
           class="btn btn-outline-primary btn-sm mt-2 ms-1">Ver todos los vuelos</button>
    `);

    chatEstado = chatEstados.MOSTRANDO_RESULTADO;
    setTimeout(() => agregarMensajeBot('¿Quieres buscar otro destino? Escríbelo cuando quieras.'), 800);
}

function guardarBusquedaChatbot(destinoIata, fecha, pasajeros) {
    const destino = obtenerAeropuertoPorIata(destinoIata);
    const origen  = obtenerAeropuertoPorIata('SCL');
    sessionStorage.setItem('criteriosBusqueda', JSON.stringify({
        origen: 'SCL',
        destino: destinoIata,
        origenLabel: formatearAeropuerto(origen),
        destinoLabel: formatearAeropuerto(destino),
        fechaSalida: fecha,
        fechaRegreso: null,
        pasajeros: pasajeros || '1'
    }));
}
function irAReservarDesdeChat(destinoIata, fecha, pasajeros, vueloId) {
    const vuelos = buscarVuelos({
        origen: 'SCL',
        destino: destinoIata,
        fecha: fecha
    });
    const vuelo = vuelos.find(v => v.id === vueloId) || vuelos[0];
    if (!vuelo) return;

    sessionStorage.setItem('vueloSeleccionado', JSON.stringify(vuelo));
    guardarBusquedaChatbot(destinoIata, fecha, pasajeros);
    window.location.href = 'reserva.html';
}

function verTodosDesdeChat(destinoIata, fecha, pasajeros) {
    guardarBusquedaChatbot(destinoIata, fecha, pasajeros);
    window.location.href = 'resultados.html';
}
document.addEventListener('DOMContentLoaded', inicializarChatbot);