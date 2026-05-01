/**
 * Carga siempre las solicitudes de ejemplo desde Assets/data/demo-solicitudes.json.
 * Se combinan en memoria con las guardadas en localStorage (fol SOL-DEMO-*: solo lectura).
 * Desactivar con ?sin_demo_json=1 si hiciera falta depurar sin el archivo.
 */
(function initDemoJsonLoader() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sin_demo_json') === '1') {
        window.__CC_DEMO_SOLICITUDES = [];
        window.CC_demoJsonReady = Promise.resolve();
        return;
    }

    const jsonUrl = new URL('Assets/data/demo-solicitudes.json', window.location.href);
    window.CC_demoJsonReady = fetch(jsonUrl.href)
        .then((res) => {
            if (!res.ok) {
                throw new Error('No se pudo cargar demo-solicitudes.json');
            }
            return res.json();
        })
        .then((data) => {
            window.__CC_DEMO_SOLICITUDES = Array.isArray(data) ? data : [];
        })
        .catch(() => {
            window.__CC_DEMO_SOLICITUDES = [];
        });
})();
