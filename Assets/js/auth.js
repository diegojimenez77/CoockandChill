// auth.js - Manejo de autenticación (Login y Registro)

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleViewBtns = document.querySelectorAll('.auth-toggle');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const feedback = document.getElementById('auth-feedback');
    const subtitle = document.getElementById('auth-subtitle');
    const demoBoxAdmin = document.getElementById('auth-demo-box-admin');
    const demoBoxTec = document.getElementById('auth-demo-box-tec');

    function showAuthFeedback(message, isError) {
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
    const portalParam = params.get('portal');
    const showDemoAll = params.get('demo') === '1';

    if (demoBoxAdmin && demoBoxTec) {
        if (showDemoAll) {
            demoBoxAdmin.style.display = 'block';
            demoBoxTec.style.display = 'block';
        } else if (portalParam === 'admin') {
            demoBoxAdmin.style.display = 'block';
            demoBoxTec.style.display = 'none';
        } else if (portalParam === 'tec') {
            demoBoxAdmin.style.display = 'none';
            demoBoxTec.style.display = 'block';
        }
    }
    if (params.get('error') === 'nosesion') {
        showAuthFeedback('Inicia sesión para continuar.', true);
    }
    if (params.get('error') === 'sinpermiso') {
        showAuthFeedback('No tienes permiso para acceder a esa área.', true);
    }

    const portal = portalParam;
    if (subtitle) {
        if (portal === 'admin') {
            subtitle.textContent = 'Acceso al panel de administración';
        } else if (portal === 'tec') {
            subtitle.textContent = 'Acceso al portal técnico';
        } else {
            subtitle.textContent = 'Ingresa a tu cuenta para continuar';
        }
    }

    if (params.get('view') === 'register' && loginView && registerView) {
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    }

    if (toggleViewBtns.length > 0) {
        toggleViewBtns.forEach((btn) => {
            btn.addEventListener('click', (ev) => {
                ev.preventDefault();
                showAuthFeedback('', false);
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
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showAuthFeedback('', false);
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const usuariosRaw = db.get(DB_KEYS.USUARIOS);
            const usuarios = Array.isArray(usuariosRaw) ? usuariosRaw : [];
            const user = usuarios.find((u) => u.email === email && u.password === password);

            if (user) {
                if (user.rol === 'CLIENTE') {
                    showAuthFeedback('Las cuentas de cliente deben iniciar sesión en el área de clientes.', true);
                    return;
                }
                db.setSession(user);
                if (user.rol === 'ADMIN') {
                    window.location.href = 'admin.html';
                } else if (user.rol === 'TECNICO') {
                    window.location.href = 'tecnico.html';
                }
            } else {
                showAuthFeedback('Credenciales incorrectas.', true);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showAuthFeedback('', false);
            const nombre = document.getElementById('reg-nombre').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const rol = 'TECNICO';

            const usuariosRaw = db.get(DB_KEYS.USUARIOS);
            const usuarios = Array.isArray(usuariosRaw) ? usuariosRaw : [];

            if (usuarios.find((u) => u.email === email)) {
                showAuthFeedback('El correo ya está registrado.', true);
                return;
            }

            const newUser = {
                id: Date.now(),
                nombre,
                email,
                password,
                rol
            };

            usuarios.push(newUser);
            db.set(DB_KEYS.USUARIOS, usuarios);

            showAuthFeedback('Registro exitoso. Redirigiendo…', false);
            db.setSession(newUser);
            window.location.href = 'tecnico.html';
        });
    }
});
