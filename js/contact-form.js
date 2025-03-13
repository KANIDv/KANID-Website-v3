// EmailJS Kontaktformular-Funktionalität
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Zeige Ladeanimation an
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Wird gesendet...';
            submitButton.disabled = true;
            
            // EmailJS Parameter vorbereiten
            const templateParams = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                subject: contactForm.querySelector('#subject').value,
                message: contactForm.querySelector('#message').value
            };
            
            // EmailJS Service und Template IDs hier eintragen
            // Diese IDs erhalten Sie in Ihrem EmailJS-Dashboard
            emailjs.send(
                'YOUR_SERVICE_ID',  // z.B. 'gmail'
                'YOUR_TEMPLATE_ID', // z.B. 'contact_form'
                templateParams
            )
            .then(function(response) {
                console.log('E-Mail erfolgreich gesendet!', response.status, response.text);
                
                // Formular zurücksetzen
                contactForm.reset();
                
                // Erfolgsmeldung anzeigen
                alert('Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.');
                
                // Optional: Weiterleitung zur Dankesseite
                // window.location.href = '/danke.html';
            })
            .catch(function(error) {
                console.error('Fehler beim Senden der E-Mail:', error);
                alert('Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.');
            })
            .finally(function() {
                // Button wieder aktivieren
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
}); 