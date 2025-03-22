// Script per recuperare i feed da Substack e Medium utilizzando un'API JSON per RSS
document.addEventListener('DOMContentLoaded', function() {
    // Verifica che sia stato caricato l'articolo #blog
    const blogArticle = document.getElementById('blog');
    if (!blogArticle) return;

    // Assicurati che gli elementi contenitore esistano
    const substackFeed = document.getElementById('substack-feed');
    const mediumFeed = document.getElementById('medium-feed');

    if (substackFeed) {
        fetchSubstackFeed(substackFeed);
    }

    if (mediumFeed) {
        fetchMediumFeed(mediumFeed);
    }
});

// Funzione per recuperare il feed da Medium usando rss2json.com
function fetchMediumFeed(container) {
    // Inserisci il tuo username Medium (senza il simbolo @)
    const mediumUsername = 'gavinogiovannimarras';  // Modifica questo con il tuo username effettivo

    // Utilizziamo un servizio proxy pubblico per risolvere i problemi CORS
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://medium.com/feed/@${mediumUsername}`)}`;

    container.innerHTML = '<p>Caricamento articoli da Medium...</p>';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nella risposta della rete');
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.contents) {
                throw new Error('Risposta API non valida');
            }

            // Converti l'XML in un oggetto DOM
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, "text/xml");

            // Estrai gli elementi del feed
            const items = xmlDoc.querySelectorAll('item');

            if (!items || items.length === 0) {
                container.innerHTML = '<p>Nessun articolo trovato su Medium.</p>';
                return;
            }

            // Limita a 3 articoli
            const maxItems = Math.min(items.length, 3);
            let html = '';

            for (let i = 0; i < maxItems; i++) {
                const item = items[i];
                const title = item.querySelector('title')?.textContent || 'Titolo non disponibile';
                const link = item.querySelector('link')?.textContent || '#';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';

                // Estrai l'estratto dal contenuto HTML
                let excerpt = '';
                if (description) {
                    const div = document.createElement('div');
                    div.innerHTML = description;
                    excerpt = div.textContent || '';
                    if (excerpt.length > 150) {
                        excerpt = excerpt.substring(0, 150) + '...';
                    }
                }

                // Formatta la data
                let formattedDate = 'Data non disponibile';
                if (pubDate) {
                    const date = new Date(pubDate);
                    formattedDate = date.toLocaleDateString('it-IT', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                }

                html += `
                    <div class="blog-post">
                        <h4>${title}</h4>
                        <span class="blog-post-date">${formattedDate}</span>
                        <p class="blog-post-excerpt">${excerpt}</p>
                        <a href="${link}" target="_blank" class="read-more">Leggi l'articolo completo</a>
                    </div>
                `;
            }

            container.innerHTML = html || '<p>Nessun articolo trovato su Medium.</p>';
        })
        .catch(error => {
            console.error('Errore nel recupero dei post di Medium:', error);
            container.innerHTML = `
                <p>Errore nel caricamento degli articoli da Medium.</p>
                <p>Dettaglio: ${error.message}</p>
                <p><small>Potrebbe trattarsi di un problema di CORS o l'username "${mediumUsername}" potrebbe non essere corretto.</small></p>
            `;
        });
}

// Funzione per recuperare il feed da Substack usando un proxy CORS
function fetchSubstackFeed(container) {
    // Inserisci il nome del tuo Substack (solo il nome, senza .substack.com)
    const substackName = 'gavinogmarras';  // Modifica questo con il tuo nome Substack effettivo

    // Utilizziamo un servizio proxy pubblico per risolvere i problemi CORS
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://${substackName}.substack.com/feed`)}`;

    container.innerHTML = '<p>Caricamento articoli da Substack...</p>';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nella risposta della rete');
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.contents) {
                throw new Error('Risposta API non valida');
            }

            // Converti l'XML in un oggetto DOM
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, "text/xml");

            // Estrai gli elementi del feed
            const items = xmlDoc.querySelectorAll('item');

            if (!items || items.length === 0) {
                container.innerHTML = '<p>Nessun articolo trovato su Substack.</p>';
                return;
            }

            // Limita a 3 articoli
            const maxItems = Math.min(items.length, 3);
            let html = '';

            for (let i = 0; i < maxItems; i++) {
                const item = items[i];
                const title = item.querySelector('title')?.textContent || 'Titolo non disponibile';
                const link = item.querySelector('link')?.textContent || '#';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';

                // Estrai l'estratto dal contenuto HTML
                let excerpt = '';
                if (description) {
                    const div = document.createElement('div');
                    div.innerHTML = description;
                    excerpt = div.textContent || '';
                    if (excerpt.length > 150) {
                        excerpt = excerpt.substring(0, 150) + '...';
                    }
                }

                // Formatta la data
                let formattedDate = 'Data non disponibile';
                if (pubDate) {
                    const date = new Date(pubDate);
                    formattedDate = date.toLocaleDateString('it-IT', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                }

                html += `
                    <div class="blog-post">
                        <h4>${title}</h4>
                        <span class="blog-post-date">${formattedDate}</span>
                        <p class="blog-post-excerpt">${excerpt}</p>
                        <a href="${link}" target="_blank" class="read-more">Leggi l'articolo completo</a>
                    </div>
                `;
            }

            container.innerHTML = html || '<p>Nessun articolo trovato su Substack.</p>';
        })
        .catch(error => {
            console.error('Errore nel recupero dei post di Substack:', error);
            container.innerHTML = `
                <p>Errore nel caricamento degli articoli da Substack.</p>
                <p>Dettaglio: ${error.message}</p>
                <p><small>Potrebbe trattarsi di un problema di CORS o l'URL "${substackName}.substack.com" potrebbe non essere corretto.</small></p>
                <p><small>Puoi verificare se la newsletter esiste visitando <a href="https://${substackName}.substack.com" target="_blank">questo link</a>.</small></p>
            `;
        });
}