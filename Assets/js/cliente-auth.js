// cliente-auth.js — Login y registro de clientes (seguimiento de solicitudes)

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('cliente-login-form');
    const registerForm = document.getElementById('cliente-register-form');
    const toggleViewBtns = document.querySelectorAll('.cliente-auth-toggle');
    const loginView = document.getElementById('cliente-login-view');
    const registerView = document.getElementById('cliente-register-view');
    const feedback = document.getElementById('cliente-auth-feedback');

    function showFeedback(message, isError) {
        if (!feedback) return;
        feedback.textContent = message || '';
        feedback.style.display = message ? 'block' : 'none';
        feedback.style.padding = message ? 'var(--space-3)' : '0';
        feedback.style.borderRadius = 'var(--radius-md)';
        feedback.style.fontSize = '1.4rem';
        feedback.style.marginBottom = 'var(--space-4)';
        feedback.style.background = isError ? 'rgba(220, 38, 38, 0.12)' : 'rgba(22, 101, 52, 0.12)';
        feedback.style.color = isError ? 'var(--color-error)' : '#166534';
        feedback.setAttribute('role', 'alert');
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'nosesion') {
        showFeedback('Inicia sesión para ver tus solicitudes.', true);
    }
    if (params.get('error') === 'sinpermiso') {
        showFeedback('Esta cuenta no tiene acceso al área de clientes.', true);
    }

    if (params.get('view') === 'register' && loginView && registerView) {
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    }

    toggleViewBtns.forEach((btn) => {
        btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            showFeedback('', false);
            const target = ev.currentTarget.getAttribute('data-target');
            if (target === 'register') {
                loginView.style.display = 'none';
                registerView.style.display = 'block';
            } else {
                registerView.style.display = 'none';
                loginView.style.display = 'block';
            }
        });
    });

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showFeedback('', false);
            const email = document.getElementById('cliente-login-email').value.trim();
            const password = document.getElementById('cliente-login-password').value;

            const usuariosRaw = db.get(DB_KEYS.USUARIOS);
            const usuarios = Array.isArray(usuariosRaw) ? usuariosRaw : [];
            const user = usuarios.find((u) => u.email === email && u.password === password);

            if (!user) {
                showFeedback('Credenciales incorrectas.', true);
                return;
            }
            if (user.rol !== 'CLIENTE') {
                showFeedback('Este acceso es solo para clientes. Personal administrativo debe usar el portal de staff.', true);
                return;
            }
            db.setSession(user);
            window.location.href = 'cliente-panel.html';
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showFeedback('', false);
            const nombre = document.getElementById('cliente-reg-nombre').value.trim();
            const email = document.getElementById('cliente-reg-email').value.trim();
            const password = document.getElementById('cliente-reg-password').value;

            if (!nombre || !email || !password) {
                showFeedback('Completa todos los campos.', true);
                return;
            }

            const usuariosRaw = db.get(DB_KEYS.USUARIOS);
            const usuarios = Array.isArray(usuariosRaw) ? usuariosRaw : [];

            if (usuarios.find((u) => u.email === email)) {
                showFeedback('El correo ya está registrado.', true);
                return;
            }

            const newUser = {
                id: Date.now(),
                nombre,
                email,
                password,
                rol: 'CLIENTE'
            };

            usuarios.push(newUser);
            db.set(DB_KEYS.USUARIOS, usuarios);
            db.setSession(newUser);
            window.location.href = 'cliente-panel.html';
        });
    }
});
