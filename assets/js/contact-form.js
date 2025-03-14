// Kontaktformular mit API-Anbindung für Resend
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Formularvalidierung
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const errorMessage = document.getElementById('form-error');
            const successMessage = document.getElementById('form-success');
            
            // E-Mail-Validierungsfunktion
            function validateEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            // Felder prüfen
            if (!name || !email || !subject || !message) {
                errorMessage.textContent = 'Bitte füllen Sie alle Pflichtfelder aus.';
                errorMessage.style.display = 'block';
                return;
            }
            
            // E-Mail-Format validieren
            if (!validateEmail(email)) {
                errorMessage.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Fehler- und Erfolgsmeldungen zurücksetzen
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';
            
            // Zeige Ladeanimation an
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Wird gesendet...';
            submitButton.disabled = true;
            
            // Daten für den API-Request vorbereiten
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };
            
            // API-Anfrage an den Server senden
            fetch('/api/kontakt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Ein unbekannter Fehler ist aufgetreten');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Anfrage erfolgreich:', data);
                
                // Formular zurücksetzen
                contactForm.reset();
                
                // Erfolgsmeldung anzeigen
                successMessage.style.display = 'block';
                
                // Weiterleitung zur Dankesseite nach 3 Sekunden
                setTimeout(() => {
                    window.location.href = '/danke';
                }, 3000);
            })
            .catch(error => {
                console.error('Fehler beim Senden der Anfrage:', error);
                errorMessage.textContent = error.message || 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.';
                errorMessage.style.display = 'block';
            })
            .finally(() => {
                // Button wieder aktivieren
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
});