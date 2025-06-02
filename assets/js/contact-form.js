document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const errorMessage = document.getElementById('form-error');
            const successMessage = document.getElementById('form-success');

            function validateEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            // Reset messages
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            if (!name || !email || !subject || !message) {
                errorMessage.textContent = 'Bitte füllen Sie alle Pflichtfelder aus.';
                errorMessage.style.display = 'block';
                return;
            }

            if (!validateEmail(email)) {
                errorMessage.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
                errorMessage.style.display = 'block';
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Wird gesendet...';
            submitButton.disabled = true;

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("subject", subject);
            formData.append("message", message);

            fetch('/api/kontakt', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json()) // Directly parse as JSON
            .then(jsonResponse => { // jsonResponse is now the parsed object
                console.log('Server-Antwort:', jsonResponse);
                // No need for try-catch for JSON.parse, as response.json() handles it

                if (jsonResponse.success === true) {
                    contactForm.reset();
                    successMessage.textContent = jsonResponse.message || 'Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns in Kürze bei Ihnen melden.';
                    successMessage.style.display = 'block';
                    setTimeout(() => {
                        window.location.href = '/danke';
                    }, 3000);
                } else {
                    // Use message from backend if available
                    throw new Error(jsonResponse.message || jsonResponse.error || 'Die Nachricht konnte nicht versendet werden.');
                }
            })
            .catch(error => {
                console.error('Fehler:', error);
                errorMessage.textContent = error.message || 'Beim Senden der Nachricht ist ein Fehler aufgetreten.';
                errorMessage.style.display = 'block';
            })
            .finally(() => {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
});
