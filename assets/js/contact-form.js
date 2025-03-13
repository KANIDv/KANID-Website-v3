// EmailJS Kontaktformular-Funktionalität
document.addEventListener('DOMContentLoaded', function() {
    // EmailJS initialisieren
    emailjs.init("CXo-0j7h5Uf3BqfaH"); // Korrekter User ID für EmailJS
    
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
            
            // EmailJS Parameter vorbereiten
            const templateParams = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };
            
            // EmailJS Service und Template IDs hier eintragen
            emailjs.send(
                'service_qrnw51e',  // Service ID
                'template_7fy7aov', // Template ID
                templateParams
            )
            .then(function(response) {
                console.log('E-Mail erfolgreich gesendet!', response.status, response.text);
                
                // Formular zurücksetzen
                contactForm.reset();
                
                // Erfolgsmeldung anzeigen
                successMessage.style.display = 'block';
                
                // Weiterleitung zur Dankesseite nach 3 Sekunden
                setTimeout(() => {
                    window.location.href = '/danke';
                }, 3000);
            })
            .catch(function(error) {
                console.error('Fehler beim Senden der E-Mail:', error);
                errorMessage.textContent = 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.';
                errorMessage.style.display = 'block';
            })
            .finally(function() {
                // Button wieder aktivieren
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
}); 