document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.querySelector('.header__mobile-btn');
    const mobileMenu = document.querySelector('.header__mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        const menuIcon = mobileMenuButton.querySelector('.material-symbols-outlined');

        function setMenuOpen(isOpen) {
            if (isOpen) {
                mobileMenu.classList.add('header__mobile-menu--active');
                if (menuIcon) menuIcon.textContent = 'close';
                mobileMenuButton.setAttribute('aria-expanded', 'true');
                mobileMenuButton.setAttribute('aria-label', 'Cerrar menú');
            } else {
                mobileMenu.classList.remove('header__mobile-menu--active');
                if (menuIcon) menuIcon.textContent = 'menu';
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenuButton.setAttribute('aria-label', 'Abrir menú');
            }
        }

        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = !mobileMenu.classList.contains('header__mobile-menu--active');
            setMenuOpen(willOpen);
        });

        document.addEventListener('click', () => {
            if (mobileMenu.classList.contains('header__mobile-menu--active')) {
                setMenuOpen(false);
            }
        });

        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                setMenuOpen(false);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
            }
        });
    }
});
