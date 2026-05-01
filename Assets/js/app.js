// app.js - Configuración global y DB simulada en LocalStorage

const DB_KEYS = {
    USUARIOS: 'cc_usuarios',
    SOLICITUDES: 'cc_solicitudes',
    SESION: 'cc_sesion',
    MIGRATED_ESTADOS: 'cc_migrated_estados_v2',
    /** Valor almacenado debe coincidir con CC_SOLICITUDES_PURGE_VERSION; si no, se vacían solicitudes una vez. */
    SOLICITUDES_PURGE_MARKER: 'cc_solicitudes_purge_version'
};

/**
 * Incrementar (p. ej. '2' → '3') para forzar vaciado global de solicitudes en la próxima carga.
 */
const CC_SOLICITUDES_PURGE_VERSION = '2';

// Datos por defecto (si la DB está vacía)
const initialData = {
    usuarios: [
        { id: 1, email: 'admin@cookandchill.com.mx', password: 'admin', rol: 'ADMIN', nombre: 'Admin Principal' },
        { id: 2, email: 'tec@cookandchill.com.mx', password: 'tec', rol: 'TECNICO', nombre: 'Técnico Roberto' },
        { id: 3, email: 'cliente@cookandchill.com.mx', password: 'cliente', rol: 'CLIENTE', nombre: 'Cliente demo' }
    ],
    solicitudes: []
};

/** Solo datos públicos de sesión (sin contraseña). */
function sessionFromUser(user) {
    return {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol
    };
}

/** Vacía solicitudes, sesión y caches de folio (local + session). No toca usuarios. */
function purgeSolicitudesStorage() {
    try {
        localStorage.setItem(DB_KEYS.SOLICITUDES, JSON.stringify([]));
        localStorage.removeItem(DB_KEYS.SESION);
        localStorage.removeItem(DB_KEYS.MIGRATED_ESTADOS);
        localStorage.removeItem('cc_ultimo_folio');
    } catch {
        /* ignore */
    }
    try {
        sessionStorage.removeItem('cc_ultimo_folio');
    } catch {
        /* ignore */
    }
}

/** Una vez por versión: borra todas las solicitudes en este navegador (todos los perfiles). */
function applySolicitudesPurgeVersion() {
    try {
        if (localStorage.getItem(DB_KEYS.SOLICITUDES_PURGE_MARKER) === CC_SOLICITUDES_PURGE_VERSION) {
            return;
        }
        purgeSolicitudesStorage();
        localStorage.setItem(DB_KEYS.SOLICITUDES_PURGE_MARKER, CC_SOLICITUDES_PURGE_VERSION);
    } catch {
        /* ignore */
    }
}

/** Migra estados legacy a ENVIADA / EN_REVISION / ASIGNADA / EN_PROCESO / CERRADA */
function migrateSolicitudesEstados() {
    if (localStorage.getItem(DB_KEYS.MIGRATED_ESTADOS) === '1') return;
    let raw;
    try {
        raw = localStorage.getItem(DB_KEYS.SOLICITUDES);
    } catch {
        return;
    }
    if (!raw) {
        localStorage.setItem(DB_KEYS.MIGRATED_ESTADOS, '1');
        return;
    }
    let list;
    try {
        list = JSON.parse(raw);
    } catch {
        return;
    }
    if (!Array.isArray(list)) return;
    const map = (s) => {
        const next = { ...s };
        if (next.cliente_usuario_id === undefined) next.cliente_usuario_id = null;
        const e = next.estado;
        if (e === 'PENDIENTE') {
            next.estado = next.tecnico_id ? 'ASIGNADA' : 'EN_REVISION';
        } else if (e === 'ASIGNADO') {
            next.estado = 'ASIGNADA';
        } else if (e === 'FINALIZADO') {
            next.estado = 'CERRADA';
        }
        return next;
    };
    try {
        localStorage.setItem(DB_KEYS.SOLICITUDES, JSON.stringify(list.map(map)));
        localStorage.setItem(DB_KEYS.MIGRATED_ESTADOS, '1');
    } catch {
        /* ignore */
    }
}

/** Garantiza cuenta demo de cliente en instalaciones que ya tenían solo admin/técnico. */
function ensureDemoClienteUsuario() {
    const demoEmail = 'cliente@cookandchill.com.mx';
    try {
        const raw = localStorage.getItem(DB_KEYS.USUARIOS);
        if (!raw) return;
        const list = JSON.parse(raw);
        if (!Array.isArray(list) || list.some((u) => u.email === demoEmail)) return;
        const maxId = list.reduce((m, u) => Math.max(m, Number(u.id) || 0), 0);
        list.push({
            id: maxId + 1,
            email: demoEmail,
            password: 'cliente',
            rol: 'CLIENTE',
            nombre: 'Cliente demo'
        });
        localStorage.setItem(DB_KEYS.USUARIOS, JSON.stringify(list));
    } catch {
        /* ignore */
    }
}

// Inicializar DB
function initDB() {
    if (!localStorage.getItem(DB_KEYS.USUARIOS)) {
        localStorage.setItem(DB_KEYS.USUARIOS, JSON.stringify(initialData.usuarios));
    }
    if (!localStorage.getItem(DB_KEYS.SOLICITUDES)) {
        localStorage.setItem(DB_KEYS.SOLICITUDES, JSON.stringify(initialData.solicitudes));
    }
    applySolicitudesPurgeVersion();
    ensureDemoClienteUsuario();
    migrateSolicitudesEstados();
}

// Helpers para interactuar con la DB
const db = {
    get: (key) => {
        try {
            const raw = localStorage.getItem(key);
            if (raw == null || raw === '') return [];
            const parsed = JSON.parse(raw);
            return parsed == null ? [] : parsed;
        } catch {
            return [];
        }
    },

    set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),

    getSession: () => {
        const raw = localStorage.getItem(DB_KEYS.SESION);
        if (!raw) return null;
        try {
            const p = JSON.parse(raw);
            if (!p || typeof p !== 'object') return null;
            return sessionFromUser(p);
        } catch {
            return null;
        }
    },

    setSession: (user) => {
        localStorage.setItem(DB_KEYS.SESION, JSON.stringify(sessionFromUser(user)));
    },

    logout: () => {
        localStorage.removeItem(DB_KEYS.SESION);
        window.location.href = 'index.html';
    },

    /**
     * Borra todas las solicitudes, cierra sesión y quita datos auxiliares del navegador.
     * No modifica la tabla de usuarios.
     */
    resetSolicitudesYLimpiarSesion: () => {
        purgeSolicitudesStorage();
    },

    /**
     * @param {string} [rol] - ADMIN | TECNICO | CLIENTE
     * @returns {object|null}
     */
    requireAuth: (rol) => {
        const session = db.getSession();
        if (!session) {
            window.location.href = rol === 'CLIENTE' ? 'cliente-auth.html?error=nosesion' : 'auth.html?error=nosesion';
            return null;
        }
        if (rol && session.rol !== rol) {
            if (rol === 'CLIENTE') {
                window.location.href = session.rol === 'ADMIN' || session.rol === 'TECNICO'
                    ? 'auth.html?error=sinpermiso'
                    : 'cliente-auth.html?error=sinpermiso';
            } else {
                window.location.href = session.rol === 'CLIENTE'
                    ? 'cliente-auth.html?error=sinpermiso'
                    : 'auth.html?error=sinpermiso';
            }
            return null;
        }
        return session;
    }
};

// Auto-inicializar al cargar
initDB();
