document.addEventListener('DOMContentLoaded', function() {
    const hamburgerButton = document.getElementById('hamburger');
    const navCenter = document.getElementById('NavCenter');

    if (hamburgerButton && navCenter) {
        hamburgerButton.addEventListener('click', function() {
            navCenter.classList.toggle('nav-active');
        });
    } else {
        if (!hamburgerButton) {
            console.error("Nie znaleziono przycisku hamburgera o ID 'hamburger'.");
        }
        if (!navCenter) {
            console.error("Nie znaleziono elementu nawigacji o ID 'NavCenter'.");
        }
    }
});