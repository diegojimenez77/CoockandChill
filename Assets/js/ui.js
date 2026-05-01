// ui.js - Lógica de renderizado e interacción de UI

const UI = {
    clearElement: (el) => {
        if (!el) return;
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    },

    /** Abre un data URI (p. ej. PDF) en una pestaña nueva usando solo DOM. */
    openDataUriInNewTab: (dataUri) => {
        const w = window.open('about:blank', '_blank', 'noopener,noreferrer');
        if (!w) return;
        const d = w.document;
        const iframe = d.createElement('iframe');
        iframe.setAttribute('src', dataUri);
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        d.body.style.margin = '0';
        d.body.appendChild(iframe);
    },

    /**
     * Descarga el PDF guardado en la solicitud (data URI generado en solicitud del cliente).
     */
    downloadSolicitudPdf: (dataUri, sol) => {
        if (!dataUri) return;
        const cliente = (sol && sol.cliente ? String(sol.cliente) : 'Servicio').replace(/\s+/g, '_');
        const folioRaw = sol && sol.id != null ? String(sol.id) : 'folio';
        const folio = folioRaw.replace(/[^\w.-]+/g, '_');
        const name = `Solicitud_${cliente}_${folio}.pdf`;

        if (dataUri.startsWith('http://') || dataUri.startsWith('https://')) {
            const link = document.createElement('a');
            link.href = dataUri;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        const link = document.createElement('a');
        link.href = dataUri;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    /** Etiqueta en español para el flujo de atención (cliente / tablas). */
    formatEstadoAtencion: (estado) => {
        const map = {
            ENVIADA: 'Enviada',
            EN_REVISION: 'En revisión',
            ASIGNADA: 'Asignada',
            EN_PROCESO: 'En proceso',
            CERRADA: 'Cerrada',
            PENDIENTE: 'En revisión',
            ASIGNADO: 'Asignada',
            FINALIZADO: 'Cerrada'
        };
        return map[estado] || estado || '—';
    },

    getBadgeClass: (estado) => {
        switch (estado) {
            case 'ENVIADA':
                return 'badge--gray';
            case 'EN_REVISION':
            case 'PENDIENTE':
                return 'badge--pendiente';
            case 'ASIGNADA':
            case 'ASIGNADO':
                return 'badge--gray-active';
            case 'EN_PROCESO':
                return 'badge--reparacion';
            case 'CERRADA':
            case 'FINALIZADO':
                return 'badge--mantenimiento';
            default:
                return 'badge--gray';
        }
    },

    renderMetrics: (metrics, prefix) => {
        for (const [key, value] of Object.entries(metrics)) {
            const el = document.getElementById(`${prefix}-${key}`);
            if (el) el.textContent = value;
        }
    },

    appendSpecRow: (container, label, value) => {
        const div = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = label + ': ';
        div.appendChild(strong);
        div.appendChild(document.createTextNode(String(value)));
        container.appendChild(div);
    },

    renderSolicitudesTable: (containerId, solicitudes, onRowClick) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        UI.clearElement(container);
        if (solicitudes.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.className = 'table__td';
            td.colSpan = 5;
            td.style.textAlign = 'center';
            td.style.padding = '2rem';
            td.textContent = 'No hay solicitudes';
            tr.appendChild(td);
            container.appendChild(tr);
            return;
        }

        solicitudes.forEach((sol) => {
            const tr = document.createElement('tr');
            tr.className = 'table__tr';
            tr.style.cursor = 'pointer';

            const tdId = document.createElement('td');
            tdId.className = 'table__td';
            tdId.style.fontWeight = '700';
            tdId.textContent = sol.id;

            const tdCliente = document.createElement('td');
            tdCliente.className = 'table__td';
            tdCliente.textContent = sol.cliente;

            const tdFecha = document.createElement('td');
            tdFecha.className = 'table__td';
            tdFecha.textContent = sol.fecha;

            const tdEstado = document.createElement('td');
            tdEstado.className = 'table__td';
            const badge = document.createElement('span');
            badge.className = `badge ${UI.getBadgeClass(sol.estado)}`;
            badge.textContent = UI.formatEstadoAtencion(sol.estado);
            tdEstado.appendChild(badge);

            const tdAccion = document.createElement('td');
            tdAccion.className = 'table__td';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'button button--white';
            btn.style.padding = '0.4rem 0.8rem';
            btn.style.fontSize = '1rem';
            btn.textContent = 'Ver';
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                onRowClick(sol);
            });
            tdAccion.appendChild(btn);

            tr.appendChild(tdId);
            tr.appendChild(tdCliente);
            tr.appendChild(tdFecha);
            tr.appendChild(tdEstado);
            tr.appendChild(tdAccion);

            tr.addEventListener('click', () => onRowClick(sol));
            container.appendChild(tr);
        });
    },

    openModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('modal-overlay--active');
    },

    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('modal-overlay--active');
    },

    fillModalData: (sol, prefix) => {
        const fields = ['id', 'cliente', 'fecha', 'ubicacion', 'diagnostico', 'observaciones'];
        fields.forEach((f) => {
            const el = document.getElementById(`${prefix}-${f}`);
            if (el) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = sol[f] || '';
                else el.textContent = sol[f] || '';
            }
        });

        const equipoSpan = document.getElementById(`${prefix}-equipo`);
        if (equipoSpan && sol.equipo) {
            equipoSpan.textContent = `${sol.equipo.marca} / ${sol.equipo.modelo} (SN: ${sol.equipo.serie})`;
        }

        const specsGroup = document.getElementById(`${prefix}-specs-group`);
        const specsContainer = document.getElementById(`${prefix}-specs`);
        if (specsGroup && specsContainer && sol.equipo) {
            UI.clearElement(specsContainer);
            let count = 0;
            if (sol.equipo.amperaje) {
                UI.appendSpecRow(specsContainer, 'Amperaje', sol.equipo.amperaje);
                count += 1;
            }
            if (sol.equipo.voltaje) {
                UI.appendSpecRow(specsContainer, 'Voltaje', sol.equipo.voltaje);
                count += 1;
            }
            if (sol.equipo.presion) {
                UI.appendSpecRow(specsContainer, 'Presión', sol.equipo.presion);
                count += 1;
            }
            if (sol.equipo.temp_ambiente) {
                UI.appendSpecRow(specsContainer, 'T. Ambiente', sol.equipo.temp_ambiente);
                count += 1;
            }
            if (sol.equipo.temp_cabina) {
                UI.appendSpecRow(specsContainer, 'T. Cabina', sol.equipo.temp_cabina);
                count += 1;
            }
            if (sol.refacciones_estado) {
                UI.appendSpecRow(specsContainer, 'Refacciones', sol.refacciones_estado);
                count += 1;
            }
            if (count > 0) {
                specsGroup.style.display = 'block';
            } else {
                specsGroup.style.display = 'none';
            }
        }

        const gpsGroup = document.getElementById(`${prefix}-gps-group`);
        const gpsContainer = document.getElementById(`${prefix}-gps-container`);
        if (gpsGroup && gpsContainer) {
            UI.clearElement(gpsContainer);
            if (sol.gps && sol.gps.lat) {
                const lat = String(sol.gps.lat);
                const lng = String(sol.gps.lng);
                const divCoords = document.createElement('div');
                divCoords.style.marginBottom = 'var(--space-2)';
                const strong = document.createElement('strong');
                strong.textContent = 'Coordenadas: ';
                divCoords.appendChild(strong);
                divCoords.appendChild(document.createTextNode(`${lat}, ${lng}`));
                gpsContainer.appendChild(divCoords);

                const iframe = document.createElement('iframe');
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('height', '150');
                iframe.setAttribute('frameborder', '0');
                iframe.style.border = '0';
                iframe.style.borderRadius = 'var(--radius-sm)';
                iframe.setAttribute('src', `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`);
                iframe.setAttribute('allowfullscreen', 'true');
                gpsContainer.appendChild(iframe);

                gpsGroup.style.display = 'block';
            } else {
                gpsGroup.style.display = 'none';
            }
        }

        const fotosGroup = document.getElementById(`${prefix}-fotos-group`);
        const fotosContainer = document.getElementById(`${prefix}-fotos`);
        if (fotosGroup && fotosContainer) {
            UI.clearElement(fotosContainer);
            let hasPhotos = false;
            if (sol.fotos_base64) {
                Object.values(sol.fotos_base64).forEach((src) => {
                    if (src) {
                        hasPhotos = true;
                        const img = document.createElement('img');
                        img.src = src;
                        img.style.height = '100px';
                        img.style.borderRadius = 'var(--radius-md)';
                        img.style.objectFit = 'cover';
                        img.style.border = '1px solid var(--color-zinc-200)';
                        img.style.cursor = 'pointer';
                        img.addEventListener('click', () => window.open(src, '_blank', 'noopener,noreferrer'));
                        fotosContainer.appendChild(img);
                    }
                });
            }
            fotosGroup.style.display = hasPhotos ? 'block' : 'none';
        }

        const estAt = document.getElementById(`${prefix}-estado-atencion`);
        if (estAt) estAt.textContent = UI.formatEstadoAtencion(sol.estado);
    },

    /** Mensaje temporal tipo toast (texto plano). */
    showToast: (message, isError) => {
        let host = document.getElementById('page-toast');
        if (!host) {
            host = document.createElement('div');
            host.id = 'page-toast';
            host.setAttribute('role', 'status');
            host.style.cssText = 'position:fixed;bottom:6rem;left:50%;transform:translateX(-50%);z-index:200;padding:1.2rem 1.6rem;border-radius:var(--radius-lg);font-size:1.4rem;max-width:90%;box-shadow:var(--shadow-xl);';
            document.body.appendChild(host);
        }
        host.textContent = message;
        host.style.background = isError ? 'var(--color-error)' : 'var(--color-zinc-900)';
        host.style.color = '#fff';
        host.style.display = 'block';
        clearTimeout(UI._toastTimer);
        UI._toastTimer = setTimeout(() => {
            host.style.display = 'none';
        }, 3200);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('modal__close')) {
                overlay.classList.remove('modal-overlay--active');
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay--active').forEach((m) => m.classList.remove('modal-overlay--active'));
        }
    });

    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            db.logout();
        });
    }
});
