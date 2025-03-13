// Nur für lokales Testen: Simuliert die FormSubmit-Funktionalität
document.addEventListener('DOMContentLoaded', function() {
    const isLocalEnvironment = window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1' ||
                              window.location.protocol === 'file:';
    
    // Prüfen, ob wir uns auf der Danke-Seite befinden
    const isDankePage = window.location.pathname.includes('danke.html');
    
    // Wenn Danke-Seite, nichts weiter tun
    if (isDankePage) {
        console.log('Danke-Seite geladen - keine Formularbehandlung nötig');
        return;
    }
    
    if (isLocalEnvironment) {
        console.log('Lokale Testumgebung erkannt - Kontaktformular im Simulationsmodus');
        
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            // Formular-Absenden abfangen für lokalen Test
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Formularwerte auslesen
                const name = contactForm.querySelector('#name').value;
                const email = contactForm.querySelector('#email').value;
                const subject = contactForm.querySelector('#subject').value;
                const message = contactForm.querySelector('#message').value;
                
                // In Konsole ausgeben (nur für Debugging)
                console.log('Formular-Submission simuliert:', {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                });
                
                // Formular zurücksetzen
                contactForm.reset();
                
                // Pfadprüfung für verschiedene Umgebungen
                let dankePath = '';
                
                // Versuchen, den richtigen Pfad zu bestimmen
                if (window.location.pathname.includes('/html/')) {
                    // Wir sind bereits im html-Verzeichnis
                    dankePath = 'danke.html';
                } else if (window.location.pathname.includes('/Webseite_v2/')) {
                    // Wir sind im Hauptverzeichnis
                    dankePath = 'html/danke.html';
                } else {
                    // Fallback
                    dankePath = 'html/danke.html';
                }
                
                console.log('Weiterleitung zu:', dankePath);
                
                // Lokale Speicherung der Formulardaten
                localStorage.setItem('form_submitted', 'true');
                localStorage.setItem('form_name', name);
                
                // Weiterleitung mit Cache-Buster
                const timestamp = new Date().getTime();
                window.location.href = dankePath + '?t=' + timestamp;
            });
        }
    }
}); 