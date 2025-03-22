document.addEventListener('DOMContentLoaded', function() {
    // Attendi che la pagina sia completamente caricata
    setTimeout(function() {
        // Trova tutti i link nella navigazione
        var navLinks = document.querySelectorAll('nav a');

        // Aggiungi event listener a ciascun link
        navLinks.forEach(function(link) {
            // Quando si fa clic su un link...
            link.addEventListener('click', function(e) {
                var target = this.getAttribute('href').substring(1);

                // Verifica se l'elemento esiste
                var targetElement = document.getElementById(target);

                if (targetElement) {
                    // Forza un nuovo evento hash change
                    window.location.hash = '#' + target;

                    // Forza il template a mostrare la sezione
                    setTimeout(function() {
                        var event = new Event('hashchange');
                        window.dispatchEvent(event);
                    }, 100);
                }
            });
        });

        // Se c'è un hash nell'URL all'avvio, forza la navigazione
        if (window.location.hash) {
            setTimeout(function() {
                var event = new Event('hashchange');
                window.dispatchEvent(event);
            }, 100);
        }
    }, 500);
});