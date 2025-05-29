document.addEventListener('DOMContentLoaded', function() {
    const hamburgerButton = document.getElementById('hamburger');
    const navCenter = document.getElementById('NavCenter');

    // Upewnij się, że oba elementy istnieją, zanim dodasz event listener
    if (hamburgerButton && navCenter) {
        hamburgerButton.addEventListener('click', function() {
            navCenter.classList.toggle('nav-active'); // Przełącza klasę 'nav-active'
        });
    } else {
        // Pomocnicze logi w konsoli, gdyby czegoś brakowało
        if (!hamburgerButton) {
            console.error("Nie znaleziono przycisku hamburgera o ID 'hamburger'.");
        }
        if (!navCenter) {
            console.error("Nie znaleziono elementu nawigacji o ID 'NavCenter'.");
        }
    }
});