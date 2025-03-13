// Cookie Consent Management
document.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookie-consent');
    const cookieModal = document.getElementById('cookie-settings-modal');
    const acceptAllBtn = document.getElementById('accept-all-cookies');
    const acceptEssentialBtn = document.getElementById('accept-essential-cookies');
    const settingsBtn = document.getElementById('cookie-settings');
    const savePreferencesBtn = document.getElementById('save-preferences');

    // Cookie-Banner sofort anzeigen, wenn keine Einwilligung vorliegt
    function showCookieBanner() {
        if (!localStorage.getItem('cookieConsent')) {
            cookieConsent.style.display = 'block';
        }
    }

    // Initialisierung
    showCookieBanner();

    // Alle Cookies akzeptieren
    acceptAllBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'all');
        localStorage.setItem('analyticsCookies', 'true');
        localStorage.setItem('marketingCookies', 'true');
        cookieConsent.style.display = 'none';
    });

    // Nur essenzielle Cookies akzeptieren
    acceptEssentialBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'essential');
        localStorage.setItem('analyticsCookies', 'false');
        localStorage.setItem('marketingCookies', 'false');
        cookieConsent.style.display = 'none';
    });

    // Cookie-Einstellungen öffnen
    settingsBtn.addEventListener('click', function() {
        cookieModal.style.display = 'flex';
    });

    // Einstellungen speichern
    savePreferencesBtn.addEventListener('click', function() {
        const analyticsCookies = document.getElementById('analytics-cookies').checked;
        const marketingCookies = document.getElementById('marketing-cookies').checked;

        localStorage.setItem('cookieConsent', 'custom');
        localStorage.setItem('analyticsCookies', analyticsCookies);
        localStorage.setItem('marketingCookies', marketingCookies);

        cookieModal.style.display = 'none';
        cookieConsent.style.display = 'none';
    });

    // Modal schließen wenn außerhalb geklickt wird
    cookieModal.addEventListener('click', function(e) {
        if (e.target === cookieModal) {
            cookieModal.style.display = 'none';
        }
    });

    // Vorhandene Einstellungen laden
    if (localStorage.getItem('cookieConsent') === 'custom') {
        document.getElementById('analytics-cookies').checked = 
            localStorage.getItem('analyticsCookies') === 'true';
        document.getElementById('marketing-cookies').checked = 
            localStorage.getItem('marketingCookies') === 'true';
    }

    // Footer Cookie Button
    const footerCookieBtn = document.getElementById('cookie-settings-footer');
    if (footerCookieBtn) {
        footerCookieBtn.addEventListener('click', function() {
            cookieModal.style.display = 'flex';
            
            // Lade aktuelle Einstellungen
            if (localStorage.getItem('cookieConsent') === 'custom' || localStorage.getItem('cookieConsent') === 'all') {
                document.getElementById('analytics-cookies').checked = 
                    localStorage.getItem('analyticsCookies') === 'true';
                document.getElementById('marketing-cookies').checked = 
                    localStorage.getItem('marketingCookies') === 'true';
            }
        });
    }

    // Smooth Scrolling mit Offset für den Fixed Header
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return; // Ignoriere leere Anker
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return; // Prüfe ob Element existiert
                
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Aktiven Menüpunkt markieren beim Scrollen
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-button');
        const headerHeight = document.querySelector('.header').offsetHeight;

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 20; // Extra Offset für bessere UX
                const sectionHeight = section.offsetHeight;
                
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    current = '#' + section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === current) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Fullpage Scrolling
    function initFullPageScroll() {
        // Prüfe ob es ein mobiles Gerät ist
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Deaktiviere Snap-Scrolling auf mobilen Geräten
            document.documentElement.style.scrollSnapType = 'none';
            document.querySelectorAll('section').forEach(section => {
                section.style.scrollSnapAlign = 'none';
            });
            return; // Beende die Funktion für mobile Geräte
        }

        // Deaktiviere Snap-Scrolling für alle Geräte
        document.documentElement.style.scrollSnapType = 'none';
        document.querySelectorAll('section').forEach(section => {
            section.style.scrollSnapAlign = 'none';
        });

        let isScrolling = false;
        const mainSections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const footer = document.querySelector('.footer');
        let currentSectionIndex = 0;

        // Finde den aktuellen Hauptbereich
        function getCurrentSection() {
            const scrollPosition = window.pageYOffset + (window.innerHeight / 3);
            let index = 0;
            mainSections.forEach((section, i) => {
                const sectionTop = section.offsetTop - headerHeight;
                if (scrollPosition >= sectionTop) {
                    index = i;
                }
            });
            return index;
        }

        // Prüfe, ob wir im Footer sind
        function isInFooter() {
            const footerRect = footer.getBoundingClientRect();
            return footerRect.top <= window.innerHeight;
        }

        // Scrolle zum nächsten/vorherigen Bereich
        function scrollToSection(direction) {
            if (isScrolling) return;
            isScrolling = true;

            const currentSection = getCurrentSection();

            if (direction === 'down' && currentSection === mainSections.length - 1) {
                window.scrollTo({
                    top: footer.offsetTop,
                    behavior: 'smooth'
                });
            } else {
                const nextIndex = direction === 'down' ? currentSection + 1 : currentSection - 1;
                if (nextIndex >= 0 && nextIndex < mainSections.length) {
                    window.scrollTo({
                        top: mainSections[nextIndex].offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }

            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }

        // Event-Listener nur für Desktop
        window.addEventListener('wheel', (e) => {
            const contactSection = document.querySelector('#kontakt');
            if (window.pageYOffset >= contactSection.offsetTop - headerHeight) {
                return; // Erlaube natives Scrollen im Kontaktbereich
            }
            const currentSecIndex = getCurrentSection();
            if (mainSections[currentSecIndex].id === 'kontakt') {
                return; // Wenn der Kontaktbereich aktiv ist, nativen Scrollvorgang erlauben
            }
            if (e.target.closest('.contact-section')) {
                return; // Erlaube natives Scrollen im Kontaktbereich
            }
            if (isInFooter() && e.deltaY > 0) {
                return;
            }
            e.preventDefault();
            const direction = e.deltaY > 0 ? 'down' : 'up';
            scrollToSection(direction);
        }, { passive: false });

        // Resize-Event für dynamische Anpassung
        window.addEventListener('resize', () => {
            // Deaktiviere Snap-Scrolling für alle Geräte
            document.documentElement.style.scrollSnapType = 'none';
            document.querySelectorAll('section').forEach(section => {
                section.style.scrollSnapAlign = 'none';
            });
        });
    }

    // Am Anfang der DOMContentLoaded-Funktion
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const body = document.body;
        
        // Erstelle Overlay-Element
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        body.appendChild(overlay);

        menuToggle.addEventListener('click', () => {
            body.classList.toggle('menu-open');
        });

        // Schließe Menü beim Klick auf Overlay
        overlay.addEventListener('click', () => {
            body.classList.remove('menu-open');
        });

        // Schließe Menü beim Klick auf einen Link
        document.querySelectorAll('.nav-button').forEach(link => {
            link.addEventListener('click', () => {
                body.classList.remove('menu-open');
            });
        });

        // Verhindere Scrollen wenn Menü offen ist
        body.addEventListener('touchmove', (e) => {
            if (body.classList.contains('menu-open')) {
                e.preventDefault();
            }
        }, { passive: false });

        // Cookie-Einstellungen Button im mobilen Menü
        const mobileCookieBtn = document.getElementById('mobile-cookie-settings');
        if (mobileCookieBtn) {
            mobileCookieBtn.addEventListener('click', () => {
                body.classList.remove('menu-open'); // Schließe das mobile Menü
                cookieModal.style.display = 'flex'; // Öffne Cookie-Einstellungen
                
                // Lade aktuelle Einstellungen
                if (localStorage.getItem('cookieConsent') === 'custom' || localStorage.getItem('cookieConsent') === 'all') {
                    document.getElementById('analytics-cookies').checked = 
                        localStorage.getItem('analyticsCookies') === 'true';
                    document.getElementById('marketing-cookies').checked = 
                        localStorage.getItem('marketingCookies') === 'true';
                }
            });
        }
    }

    // Initialisierung beim Laden der Seite
    initSmoothScrolling();
    initScrollSpy();
    initFullPageScroll();
    initMobileMenu();

    // Erstelle das Overlay-Element einmal
    const overlay = document.createElement('div');
    overlay.className = 'service-overlay';
    document.body.appendChild(overlay);

    // Erweiterte Inhalte für die Karten
    const expandedContents = {
        'konstruktionsberatung': {
            text: 'Für ein mittelständisches Unternehmen in Gerlingen haben wir Konstruktionsmodelle und Zeichnungen individuell angepasst. Anschließend wurden die überarbeiteten Daten direkt in das unternehmensinterne ERP-System proALPHA integriert, was die Arbeitsprozesse effizienter gestaltet und die Produktionsplanung unterstützt hat.',
            image: '../img/services/Konstruktionsberatung.jpg'
        },
        'prozessoptimierung': {
            text: 'Für ein PV-Installationsunternehmen in Ostfildern haben wir die Projektmanagementsoftware HERO erfolgreich eingeführt. Dabei wurden die bestehenden Prozesse präzise in der Software abgebildet und mittels einer API-Schnittstelle mit Microsoft Teams verbunden. Zusätzlich haben wir die Mitarbeiter umfassend geschult, um einen reibungslosen Übergang und den effektiven Einsatz der neuen Lösung sicherzustellen.',
            image: '../img/services/prozess-detail.jpg'
        },
        'aftersales': {
            text: 'Für ein Unternehmen in Stuttgart haben wir ein modernes Ticketsystem für Reklamationen eingeführt. Ein benutzerfreundliches Formular auf der Homepage ermöglicht es den Kunden, ihre Beschwerden direkt zu übermitteln. Sobald das Formular ausgefüllt wurde, wird automatisch eine Aufgabe für den zuständigen Mitarbeiter erstellt, ein Ticket generiert und eine Bestätigungsmail an den Kunden versendet. Mithilfe von PowerAutomate, MS Forms und MS Tasks konnte so eine effiziente und transparente Bearbeitung des Reklamationsprozesses realisiert werden.',
            image: '../img/services/aftersales-detail.jpg'
        },
        '3d-druck': {
            text: 'Für einen Rasenmäherhersteller haben wir Prototypen für das Antriebsrad konstruiert, im 3D-Druckverfahren hergestellt und ausgiebig getestet. So konnten wir schnell Optimierungspotenziale identifizieren und den Entwicklungsprozess effizient vorantreiben.',
            image: '../img/services/3d-druck-detail.jpg'
        }
    };

    document.querySelectorAll('.service-link').forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Bestimme den Service-Typ basierend auf dem Text der Überschrift
            const originalCard = this.closest('.service-card');
            let serviceType = '';
            
            if (originalCard.querySelector('h3').textContent.includes('Konstruktion')) {
                serviceType = 'konstruktionsberatung';
            } else if (originalCard.querySelector('h3').textContent.includes('Prozess')) {
                serviceType = 'prozessoptimierung';
            } else if (originalCard.querySelector('h3').textContent.includes('Aftersales')) {
                serviceType = 'aftersales';
            } else if (originalCard.querySelector('h3').textContent.includes('3D-Druck')) {
                serviceType = '3d-druck';
            }
            
            // Erstelle eine Kopie der Karte statt die originale zu transformieren
            // Das verhindert alle CSS-Vererbungsprobleme
            const expandedCard = document.createElement('div');
            expandedCard.className = 'service-card expanded';
            
            // Füge Inhalt zur erweiterten Karte hinzu
            if (serviceType && expandedContents[serviceType]) {
                expandedCard.innerHTML = `
                    <h3>${originalCard.querySelector('h3').textContent}</h3>
                    <img src="${expandedContents[serviceType].image}" alt="${originalCard.querySelector('h3').textContent}" style="width: 100%; border-radius: 8px; margin-bottom: 1.5rem;">
                    <p>${expandedContents[serviceType].text}</p>
                    <button class="close-button">×</button>
                `;
            }
            
            // Füge die neue Karte zum Body hinzu
            document.body.appendChild(expandedCard);
            
            // Aktiviere das Overlay
            overlay.classList.add('active');
            
            // Verhindere Scrollen
            document.body.style.overflow = 'hidden';
            
            // Schließen-Button-Funktionalität
            const closeButton = expandedCard.querySelector('.close-button');
            if (closeButton) {
                closeButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Entferne die erweiterte Karte und das Overlay
                    overlay.classList.remove('active');
                    expandedCard.remove(); // Entferne die Kopie der Karte
                    
                    // Erlaube Scrollen wieder
                    document.body.style.overflow = '';
                });
            }
            
            // Overlay-Klick schließt die Karte
            overlay.addEventListener('click', function() {
                if (closeButton) {
                    closeButton.click();
                }
            }, { once: true }); // Wichtig: once: true verhindert mehrfache Event-Listener
            
            return false;
        });
    });

    // Lazy Loading für Bilder
    const lazyImages = document.querySelectorAll('img');
    
    // Beobachte Bilder und lade sie, wenn sie sichtbar werden
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Wenn ein data-src Attribut vorhanden ist, verwende es
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}); 