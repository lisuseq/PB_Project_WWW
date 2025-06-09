document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', function(event) {
            statusDiv.innerHTML = '';
            statusDiv.className = '';

            // Walidacja danych
            const imie = document.getElementById('imie').value.trim();
            const email = document.getElementById('email').value.trim();
            const temat = document.getElementById('temat').value.trim();
            const wiadomosc = document.getElementById('wiadomosc').value.trim();

            if (!imie || !email || !temat || !wiadomosc) {
                event.preventDefault();
                showStatus('Wszystkie pola są wymagane!', 'error');
                return;
            }

            if (!validateEmail(email)) {
                event.preventDefault();
                showStatus('Proszę podać poprawny adres e-mail.', 'error');
                return;
            }

            showStatus('Przetwarzanie...', 'success');
        });
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = type === 'success' ? 'status-success' : 'status-error';
    }

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }
});