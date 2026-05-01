// solicitudes.js - Lógica de negocio para las solicitudes de servicio

function solicitudClearNode(el) {
    if (!el) return;
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

function solicitudSetFeedback(message, isError) {
    const box = document.getElementById('solicitud-feedback');
    if (!box) return;
    box.textContent = message;
    box.style.display = message ? 'block' : 'none';
    box.style.padding = message ? 'var(--space-3)' : '0';
    box.style.borderRadius = 'var(--radius-md)';
    box.style.fontSize = '1.4rem';
    box.style.background = isError ? 'rgba(220, 38, 38, 0.12)' : 'rgba(22, 101, 52, 0.12)';
    box.style.color = isError ? 'var(--color-error)' : '#166534';
    box.style.borderColor = isError ? 'rgba(220, 38, 38, 0.35)' : 'rgba(22, 101, 52, 0.25)';
    box.setAttribute('role', 'alert');
    if (message && isError && typeof box.scrollIntoView === 'function') {
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function solicitudResetPdfButton(btn) {
    if (!btn) return;
    solicitudClearNode(btn);
    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = 'picture_as_pdf';
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(' Generar Documento PDF (Obligatorio)'));
}

function solicitudSetPdfButtonLoading(btn) {
    if (!btn) return;
    solicitudClearNode(btn);
    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.style.verticalAlign = 'middle';
    icon.textContent = 'sync';
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(' Generando...'));
}

function renderMapInContainer(mapContainer, lat, lng) {
    if (!mapContainer) return;
    solicitudClearNode(mapContainer);
    mapContainer.style.display = 'block';
    mapContainer.style.padding = '0';
    mapContainer.style.minHeight = '20rem';
    const iframe = document.createElement('iframe');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '100%');
    iframe.style.minHeight = '20rem';
    iframe.setAttribute('frameborder', '0');
    iframe.style.border = '0';
    iframe.setAttribute('src', `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`);
    iframe.setAttribute('allowfullscreen', 'true');
    mapContainer.appendChild(iframe);
}

function setGpsCoordsDiv(coordsDiv, lat, lng) {
    if (!coordsDiv) return;
    coordsDiv.style.display = 'block';
    solicitudClearNode(coordsDiv);
    const strong = document.createElement('span');
    strong.style.fontWeight = '700';
    strong.style.color = 'var(--color-primary)';
    strong.style.marginRight = '0.5rem';
    strong.textContent = 'GPS:';
    coordsDiv.appendChild(strong);
    const numLat = typeof lat === 'number' ? lat : parseFloat(lat);
    const numLng = typeof lng === 'number' ? lng : parseFloat(lng);
    const latStr = Number.isFinite(numLat) ? numLat.toFixed(5) : String(lat);
    const lngStr = Number.isFinite(numLng) ? numLng.toFixed(5) : String(lng);
    coordsDiv.appendChild(document.createTextNode(`${latStr}, ${lngStr}`));
    coordsDiv.setAttribute('data-lat', String(numLat));
    coordsDiv.setAttribute('data-lng', String(numLng));
}

/** Solicitudes persistidas solo en localStorage (sin fusionar demo). */
function ccGetLocalSolicitudes() {
    const raw = db.get(DB_KEYS.SOLICITUDES);
    return Array.isArray(raw) ? raw : [];
}

/** Demo en memoria + locales; las SOL-DEMO-* del JSON no se guardan en localStorage. */
function ccMergeDemoYLocal() {
    const demo = Array.isArray(window.__CC_DEMO_SOLICITUDES) ? window.__CC_DEMO_SOLICITUDES : [];
    const local = ccGetLocalSolicitudes();
    if (demo.length === 0) return local;
    const demoIds = new Set(demo.map((s) => s.id));
    const rest = local.filter((s) => !demoIds.has(s.id));
    return [...demo, ...rest];
}

const SolicitudesManager = {
    /** Folio de ejemplo (archivo JSON): no editable ni guardable. */
    esSolicitudDemoArchivo: (id) => id != null && String(id).startsWith('SOL-DEMO-'),

    /** Hay registro de carga de demo (tras fetch puede estar vacío si falló la red). */
    esDemoArchivoCargado: () => Array.isArray(window.__CC_DEMO_SOLICITUDES) && window.__CC_DEMO_SOLICITUDES.length > 0,

    /** @deprecated usar esDemoArchivoCargado */
    esModoDemoJson: () => SolicitudesManager.esDemoArchivoCargado(),

    getAll: () => ccMergeDemoYLocal(),

    saveAll: (data) => {
        const toStore = Array.isArray(data)
            ? data.filter((s) => !SolicitudesManager.esSolicitudDemoArchivo(s.id))
            : [];
        try {
            localStorage.setItem(DB_KEYS.SOLICITUDES, JSON.stringify(toStore));
        } catch (e) {
            if (e && e.name === 'QuotaExceededError') {
                throw new Error('QUOTA_EXCEEDED');
            }
            throw e;
        }
    },

    getById: (id) => {
        const all = SolicitudesManager.getAll();
        return all.find((s) => s.id === id);
    },

    create: (solicitudData) => {
        const local = ccGetLocalSolicitudes();
        const id = 'SOL-' + String(Date.now()).slice(-6);
        const clienteUid = solicitudData.cliente_usuario_id != null ? solicitudData.cliente_usuario_id : null;
        const newSolicitud = {
            ...solicitudData,
            fecha: solicitudData.fecha || new Date().toISOString().split('T')[0],
            estado: 'ENVIADA',
            tecnico_id: null,
            comentarios: [],
            diagnostico: '',
            cliente_usuario_id: clienteUid,
            id
        };
        local.push(newSolicitud);
        try {
            SolicitudesManager.saveAll(local);
        } catch (e) {
            local.pop();
            if (e && e.message === 'QUOTA_EXCEEDED') throw e;
            if (e && e.name === 'QuotaExceededError') throw new Error('QUOTA_EXCEEDED');
            throw e;
        }
        return newSolicitud;
    },

    update: (id, updateData) => {
        if (SolicitudesManager.esSolicitudDemoArchivo(id)) {
            return null;
        }
        const local = ccGetLocalSolicitudes();
        const index = local.findIndex((s) => s.id === id);
        if (index !== -1) {
            local[index] = { ...local[index], ...updateData };
            SolicitudesManager.saveAll(local);
            return local[index];
        }
        return null;
    },

    addComentario: (id, texto, autorNombre) => {
        if (SolicitudesManager.esSolicitudDemoArchivo(id)) {
            return false;
        }
        const sol = SolicitudesManager.getById(id);
        if (!sol) return false;
        const comentarios = [...(sol.comentarios || [])];
        comentarios.push({
            fecha: new Date().toLocaleString(),
            autor: autorNombre,
            texto: texto
        });
        try {
            SolicitudesManager.update(id, { comentarios });
            return true;
        } catch (e) {
            return false;
        }
    },

    getByEstado: (estado) => SolicitudesManager.getAll().filter((s) => s.estado === estado),

    getByTecnico: (tecnicoId) => SolicitudesManager.getAll().filter((s) => String(s.tecnico_id) === String(tecnicoId)),

    getByClienteUsuario: (usuarioId) => SolicitudesManager.getAll().filter((s) => String(s.cliente_usuario_id) === String(usuarioId)),

    /** Al entrar al panel admin: solicitudes recién enviadas pasan a “en revisión”. */
    promoteEnviasARevision: () => {
        const local = ccGetLocalSolicitudes();
        let changed = false;
        const next = local.map((s) => {
            if (!s.tecnico_id && s.estado === 'ENVIADA') {
                changed = true;
                return { ...s, estado: 'EN_REVISION' };
            }
            return s;
        });
        if (changed) SolicitudesManager.saveAll(next);
    },

    getMetrics: () => {
        const all = SolicitudesManager.getAll();
        return {
            total: all.length,
            enviadas: all.filter((s) => s.estado === 'ENVIADA').length,
            en_revision: all.filter((s) => s.estado === 'EN_REVISION').length,
            asignadas_proceso: all.filter((s) => s.estado === 'ASIGNADA' || s.estado === 'EN_PROCESO' || s.estado === 'ASIGNADO').length,
            cerradas: all.filter((s) => s.estado === 'CERRADA' || s.estado === 'FINALIZADO').length
        };
    },

    getTecnicoMetrics: (tecnicoId) => {
        const all = SolicitudesManager.getByTecnico(tecnicoId);
        return {
            asignadas: all.filter((s) => s.estado !== 'CERRADA' && s.estado !== 'FINALIZADO').length,
            completadas: all.filter((s) => s.estado === 'CERRADA' || s.estado === 'FINALIZADO').length
        };
    }
};

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('FILE_READ'));
        reader.readAsDataURL(file);
    });
}

function readGpsFromSolicitudForm() {
    const manualLat = document.getElementById('gps-lat-manual');
    const manualLng = document.getElementById('gps-lng-manual');
    if (manualLat && manualLng && manualLat.value.trim() && manualLng.value.trim()) {
        const lat = parseFloat(manualLat.value.replace(',', '.'));
        const lng = parseFloat(manualLng.value.replace(',', '.'));
        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            return { lat: String(lat), lng: String(lng) };
        }
    }
    const gpsDiv = document.getElementById('gps-coordinates');
    if (gpsDiv && gpsDiv.getAttribute('data-lat')) {
        return {
            lat: gpsDiv.getAttribute('data-lat'),
            lng: gpsDiv.getAttribute('data-lng')
        };
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    const solicitudForm = document.getElementById('client-solicitud-form');

    const sesBar = document.getElementById('cliente-sesion-bar');
    const sesInvite = document.getElementById('cliente-sesion-invite');
    const sessCliente = typeof db !== 'undefined' ? db.getSession() : null;
    if (sessCliente && sessCliente.rol === 'CLIENTE') {
        if (sesBar) sesBar.style.display = 'block';
        const nm = document.getElementById('cliente-sesion-nombre');
        if (nm) nm.textContent = sessCliente.nombre;
        if (sesInvite) sesInvite.style.display = 'none';
        const cerrar = document.getElementById('cliente-sesion-cerrar');
        if (cerrar) {
            cerrar.addEventListener('click', (e) => {
                e.preventDefault();
                db.logout();
            });
        }
    } else {
        if (sesBar) sesBar.style.display = 'none';
        if (sesInvite) sesInvite.style.display = 'block';
    }

    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
    }

    const fotoEq1 = document.getElementById('foto_equipo_1');
    const fotoEq2 = document.getElementById('foto_equipo_2');
    const fotoEq3 = document.getElementById('foto_equipo_3');
    const fotoPlaca = document.getElementById('foto_placa');
    const base64Fotos = { eq1: null, eq2: null, eq3: null, placa: null };

    function handleFilePreview(input, previewContainerId, labelId) {
        if (!input) return;
        input.addEventListener('change', function () {
            const container = document.getElementById(previewContainerId);
            const label = document.getElementById(labelId);
            solicitudClearNode(container);
            if (this.files && this.files.length > 0) {
                if (label) label.textContent = '1 imagen';
                const file = this.files[0];
                const reader = new FileReader();
                reader.onload = function (ev) {
                    const result = ev.target.result;
                    const img = document.createElement('img');
                    img.src = result;
                    img.style.width = '60px';
                    img.style.height = '60px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '4px';
                    container.appendChild(img);

                    if (input.id === 'foto_equipo_1') base64Fotos.eq1 = result;
                    if (input.id === 'foto_equipo_2') base64Fotos.eq2 = result;
                    if (input.id === 'foto_equipo_3') base64Fotos.eq3 = result;
                    if (input.id === 'foto_placa') base64Fotos.placa = result;
                };
                reader.readAsDataURL(file);
            } else if (label) {
                label.textContent = 'Tomar Foto';
            }
        });
    }

    handleFilePreview(fotoEq1, 'preview-equipo-1', 'lbl-foto-equipo-1');
    handleFilePreview(fotoEq2, 'preview-equipo-2', 'lbl-foto-equipo-2');
    handleFilePreview(fotoEq3, 'preview-equipo-3', 'lbl-foto-equipo-3');
    handleFilePreview(fotoPlaca, 'preview-placa', 'lbl-foto-placa');

    let pdfDocumentBase64 = null;
    const btnGeneratePdf = document.getElementById('btn-generate-pdf');
    const btnSubmit = document.getElementById('btn-submit-solicitud');
    const pdfStatus = document.getElementById('pdf-status');

    const mapContainer = document.getElementById('map-container');
    const btnGetLocation = document.getElementById('btn-get-location');
    const btnManualGps = document.getElementById('btn-gps-manual-apply');

    function resetLocationButton(btn) {
        if (!btn) return;
        solicitudClearNode(btn);
        const icon = document.createElement('span');
        icon.className = 'material-symbols-outlined';
        icon.style.fontSize = '1.6rem';
        icon.textContent = 'my_location';
        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(' Obtener'));
    }

    if (btnGetLocation && mapContainer) {
        btnGetLocation.addEventListener('click', () => {
            solicitudSetFeedback('', false);
            if (!navigator.geolocation) {
                solicitudSetFeedback('Tu navegador no soporta geolocalización. Puedes ingresar coordenadas manualmente abajo.', true);
                return;
            }

            solicitudClearNode(btnGetLocation);
            const loadIcon = document.createElement('span');
            loadIcon.className = 'material-symbols-outlined';
            loadIcon.style.fontSize = '1.6rem';
            loadIcon.textContent = 'hourglass_empty';
            btnGetLocation.appendChild(loadIcon);
            btnGetLocation.appendChild(document.createTextNode(' Buscando...'));
            btnGetLocation.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    renderMapInContainer(mapContainer, lat, lng);
                    const coordsDiv = document.getElementById('gps-coordinates');
                    setGpsCoordsDiv(coordsDiv, lat, lng);
                    solicitudClearNode(btnGetLocation);
                    const okIcon = document.createElement('span');
                    okIcon.className = 'material-symbols-outlined';
                    okIcon.style.fontSize = '1.6rem';
                    okIcon.textContent = 'check_circle';
                    btnGetLocation.appendChild(okIcon);
                    btnGetLocation.appendChild(document.createTextNode(' Listo'));
                    btnGetLocation.disabled = false;
                },
                () => {
                    solicitudSetFeedback('No se pudo obtener el GPS. Verifica permisos o usa coordenadas manuales.', true);
                    resetLocationButton(btnGetLocation);
                    btnGetLocation.disabled = false;
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }

    if (btnManualGps && mapContainer) {
        btnManualGps.addEventListener('click', () => {
            solicitudSetFeedback('', false);
            const latIn = document.getElementById('gps-lat-manual');
            const lngIn = document.getElementById('gps-lng-manual');
            if (!latIn || !lngIn) return;
            const lat = parseFloat(latIn.value.replace(',', '.'));
            const lng = parseFloat(lngIn.value.replace(',', '.'));
            if (Number.isNaN(lat) || Number.isNaN(lng)) {
                solicitudSetFeedback('Ingresa latitud y longitud numéricas válidas.', true);
                return;
            }
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                solicitudSetFeedback('Coordenadas fuera de rango.', true);
                return;
            }
            renderMapInContainer(mapContainer, lat, lng);
            setGpsCoordsDiv(document.getElementById('gps-coordinates'), lat, lng);
        });
    }

    if (btnGeneratePdf) {
        btnGeneratePdf.addEventListener('click', async () => {
            solicitudSetFeedback('', false);
            if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
                solicitudSetFeedback('No se cargó la librería PDF. Revisa tu conexión e intenta de nuevo.', true);
                return;
            }
            const requiredFields = ['cliente', 'distribuidor', 'fecha', 'ubicacion', 'marca', 'modelo', 'serie'];
            const isComplete = requiredFields.every((id) => document.getElementById(id) && document.getElementById(id).value.trim() !== '');
            if (!isComplete) {
                solicitudSetFeedback('Completa la información del cliente y del equipo antes de generar el PDF.', true);
                return;
            }

            solicitudSetPdfButtonLoading(btnGeneratePdf);
            btnGeneratePdf.disabled = true;

            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

                const img = new Image();
                img.src = './assets/Machote 2023.png';

                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = () => {
                        console.warn('No se pudo cargar la imagen Machote.');
                        resolve();
                    };
                });

                if (img.width) {
                    doc.addImage(img, 'PNG', 0, 0, 210, 297);
                }

                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                const getVal = (id) => (document.getElementById(id) ? document.getElementById(id).value : '');

                doc.text(getVal('cliente'), 38, 45);
                doc.text(getVal('ubicacion'), 38, 51);
                doc.text('Refrigeración/Cocina', 38, 57);
                doc.text(getVal('modelo'), 38, 63);

                doc.text(getVal('distribuidor'), 142, 45);
                doc.text(getVal('fecha'), 142, 51);
                doc.text(getVal('marca'), 142, 57);
                doc.text(getVal('serie'), 142, 63);

                doc.setFont('helvetica', 'normal');
                const obs = doc.splitTextToSize(getVal('observaciones'), 180);
                doc.text(obs, 15, 76);
                doc.setFont('helvetica', 'bold');

                doc.text(getVal('amperaje'), 38, 145);
                doc.text(getVal('voltaje'), 110, 145);
                doc.text(getVal('presion'), 176, 145);

                doc.text(getVal('temp_ambiente'), 66, 151);
                doc.text(getVal('temp_cabina'), 156, 151);

                doc.setFontSize(14);
                const isGarantia = document.getElementById('garantia') && document.getElementById('garantia').value === 'true';
                if (isGarantia) {
                    doc.text('X', 54, 158);
                } else {
                    doc.text('X', 119, 158);
                }

                const tipoSrv = getVal('tipo_servicio');
                if (tipoSrv === 'REPARACION') {
                    doc.text('X', 119, 164);
                } else if (tipoSrv === 'MANTENIMIENTO') {
                    doc.text('X', 182, 164);
                } else {
                    doc.text('X', 54, 164);
                }

                const refacciones = getVal('refacciones_estado');
                if (refacciones === 'COLOCADAS') {
                    doc.text('X', 119, 175);
                } else if (refacciones === 'POR_COTIZAR') {
                    doc.text('X', 182, 175);
                }

                pdfDocumentBase64 = doc.output('datauristring');

                btnGeneratePdf.style.display = 'none';
                if (pdfStatus) pdfStatus.style.display = 'flex';
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.style.opacity = '1';
                    btnSubmit.style.cursor = 'pointer';
                }
            } catch (error) {
                console.error(error);
                solicitudSetFeedback('Error al generar el PDF. Intenta de nuevo.', true);
                solicitudResetPdfButton(btnGeneratePdf);
                btnGeneratePdf.disabled = false;
            }
        });

        const btnDeletePdf = document.getElementById('btn-delete-pdf');
        const btnDownloadPdf = document.getElementById('btn-download-pdf');

        if (btnDownloadPdf) {
            btnDownloadPdf.addEventListener('click', () => {
                if (pdfDocumentBase64) {
                    const link = document.createElement('a');
                    link.href = pdfDocumentBase64;
                    const cliente = document.getElementById('cliente').value || 'Servicio';
                    link.download = `Solicitud_${cliente.replace(/\s+/g, '_')}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        }

        if (btnDeletePdf) {
            btnDeletePdf.addEventListener('click', () => {
                pdfDocumentBase64 = null;
                if (pdfStatus) pdfStatus.style.display = 'none';
                btnGeneratePdf.style.display = 'block';
                btnGeneratePdf.disabled = false;
                solicitudResetPdfButton(btnGeneratePdf);

                if (btnSubmit) {
                    btnSubmit.disabled = true;
                    btnSubmit.style.opacity = '0.5';
                    btnSubmit.style.cursor = 'not-allowed';
                }
            });
        }
    }

    if (solicitudForm) {
        solicitudForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            solicitudSetFeedback('', false);

            const requeridos = [
                ['cliente', 'Nombre del cliente / empresa'],
                ['distribuidor', 'Distribuidor'],
                ['fecha', 'Fecha'],
                ['ubicacion', 'Ubicación'],
                ['marca', 'Marca'],
                ['modelo', 'Modelo'],
                ['serie', 'Número de serie']
            ];
            for (let i = 0; i < requeridos.length; i += 1) {
                const fieldId = requeridos[i][0];
                const label = requeridos[i][1];
                const el = document.getElementById(fieldId);
                if (!el || !String(el.value).trim()) {
                    solicitudSetFeedback(`Por favor completa: ${label}.`, true);
                    if (el && el.focus) el.focus();
                    return;
                }
            }

            if (!fotoEq1 || fotoEq1.files.length === 0 || !fotoEq2 || fotoEq2.files.length === 0) {
                solicitudSetFeedback('Agrega las fotos del equipo 1 y 2 (obligatorias).', true);
                return;
            }
            if (fotoPlaca && fotoPlaca.files.length < 1) {
                solicitudSetFeedback('Agrega la fotografía de la placa de especificaciones.', true);
                return;
            }
            if (!pdfDocumentBase64) {
                solicitudSetFeedback('Genera el documento PDF antes de enviar.', true);
                return;
            }

            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.style.opacity = '0.7';
                btnSubmit.style.cursor = 'wait';
                btnSubmit.textContent = 'Enviando…';
            }

            let fotos_base64;
            try {
                const eq1Data = await readFileAsDataURL(fotoEq1.files[0]);
                const eq2Data = await readFileAsDataURL(fotoEq2.files[0]);
                const placaData = await readFileAsDataURL(fotoPlaca.files[0]);
                const eq3Data = fotoEq3 && fotoEq3.files.length > 0
                    ? await readFileAsDataURL(fotoEq3.files[0])
                    : null;
                fotos_base64 = { eq1: eq1Data, eq2: eq2Data, eq3: eq3Data, placa: placaData };
            } catch (err) {
                console.error(err);
                solicitudSetFeedback('No se pudieron leer las imágenes. Vuelve a seleccionar las fotos e intenta otra vez.', true);
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.style.opacity = '1';
                    btnSubmit.style.cursor = 'pointer';
                    btnSubmit.textContent = 'Enviar Solicitud';
                }
                return;
            }

            const gpsData = readGpsFromSolicitudForm();

            const data = {
                pdf_document: pdfDocumentBase64,
                fotos_base64,
                gps: gpsData,
                cliente: document.getElementById('cliente').value,
                distribuidor: document.getElementById('distribuidor').value,
                fecha: document.getElementById('fecha').value,
                ubicacion: document.getElementById('ubicacion').value,
                equipo: {
                    marca: document.getElementById('marca').value,
                    modelo: document.getElementById('modelo').value,
                    serie: document.getElementById('serie').value,
                    amperaje: document.getElementById('amperaje') ? document.getElementById('amperaje').value : '',
                    voltaje: document.getElementById('voltaje') ? document.getElementById('voltaje').value : '',
                    presion: document.getElementById('presion') ? document.getElementById('presion').value : '',
                    temp_ambiente: document.getElementById('temp_ambiente') ? document.getElementById('temp_ambiente').value : '',
                    temp_cabina: document.getElementById('temp_cabina') ? document.getElementById('temp_cabina').value : ''
                },
                tipo_servicio: document.getElementById('tipo_servicio').value,
                garantia: document.getElementById('garantia').value === 'true',
                refacciones_estado: document.getElementById('refacciones_estado') ? document.getElementById('refacciones_estado').value : '',
                observaciones: document.getElementById('observaciones').value
            };

            let cliente_usuario_id = null;
            try {
                const s = db.getSession();
                if (s && s.rol === 'CLIENTE') cliente_usuario_id = s.id;
            } catch (ignoreDb) {
                /* sin sesión */
            }
            data.cliente_usuario_id = cliente_usuario_id;

            let sol;
            try {
                sol = SolicitudesManager.create(data);
            } catch (err) {
                console.error(err);
                if (err && err.message === 'QUOTA_EXCEEDED') {
                    solicitudSetFeedback('No hay espacio suficiente para guardar (datos muy pesados). Reduce el tamaño de las fotos o borra datos de prueba del navegador.', true);
                } else {
                    solicitudSetFeedback('No se pudo guardar la solicitud. Si el problema continúa, revisa que el sitio no esté bloqueando el almacenamiento local.', true);
                }
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.style.opacity = '1';
                    btnSubmit.style.cursor = 'pointer';
                    btnSubmit.textContent = 'Enviar Solicitud';
                }
                return;
            }

            const folioStr = sol && sol.id != null ? String(sol.id).trim() : '';
            if (!folioStr) {
                console.error('Solicitud sin folio tras guardar', sol);
                solicitudSetFeedback('Error al generar el folio. Intenta enviar de nuevo.', true);
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.style.opacity = '1';
                    btnSubmit.style.cursor = 'pointer';
                    btnSubmit.textContent = 'Enviar Solicitud';
                }
                return;
            }

            try {
                sessionStorage.setItem('cc_ultimo_folio', folioStr);
            } catch (ignoreSession) {
                /* ignore */
            }
            try {
                localStorage.setItem('cc_ultimo_folio', folioStr);
            } catch (ignoreLs) {
                /* ignore */
            }

            const exitoUrl = new URL('solicitud-exito.html', window.location.href);
            exitoUrl.searchParams.set('folio', folioStr);
            exitoUrl.hash = 'folio=' + encodeURIComponent(folioStr);
            window.location.assign(exitoUrl.toString());
        });
    }
});
