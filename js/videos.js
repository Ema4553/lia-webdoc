(function main() {
    'use strict';
    setupVideos().catch(e => console.error("Erreur critique dans setupVideos:", e));
})();

let videosData = [];

export async function setupVideos() {
    const container = document.getElementById('container-timeline');
    if (!container) return;

    try {
        const response = await fetch('../data/videos.json');
        if (!response.ok) throw new Error('Erreur de chargement du fichier JSON');
        videosData = await response.json();

        // --- CONFIGURATION DE LA GRILLE ---
        container.style.display = 'grid';
        container.style.gridTemplateRows = 'auto auto auto'; 
        // Pas de colonne supplémentaire pour "FIN"
        container.style.gridTemplateColumns = `repeat(${videosData.length}, 280px)`;
        container.style.gap = '0';
        container.style.position = 'relative';
        
        // MODIFICATION : 4rem (haut), 10rem (droite), 4rem (bas), 2rem (gauche)
        container.style.padding = '4rem 0rem 4rem 2rem'; 
        
        container.style.alignItems = 'center'; 

        videosData.forEach((video, index) => {
            const isTop = index % 2 === 0;
            const colIndex = index + 1;

            if (isTop) {
                // === CAS 1 : TEXTE EN HAUT (avec barre à gauche) ===
                
                const topWrapper = document.createElement('div');
                topWrapper.style.gridColumn = colIndex;
                topWrapper.style.gridRow = '1';
                topWrapper.style.width = '200px'; 
                topWrapper.style.justifySelf = 'start'; 
                topWrapper.style.display = 'flex';
                topWrapper.style.flexDirection = 'row'; 
                topWrapper.style.alignItems = 'stretch';
                topWrapper.style.paddingBottom = '1rem'; 

                const verticalLine = createVerticalLine();
                const textContent = createTextContent(video, 'flex-end');

                topWrapper.appendChild(verticalLine);
                topWrapper.appendChild(textContent);
                container.appendChild(topWrapper);

                const img = createImagePlaceholder(colIndex);
                img.style.overflow = 'hidden';

                const image = document.createElement('img');
                img.style.display = 'flex';
                img.style.justifySelf = 'start';
                image.src = video.image;
                image.style.width = '200px';
                image.style.height = 'auto';
                
                container.appendChild(img);
                img.appendChild(image);

            } else {
                // === CAS 2 : TEXTE EN BAS (avec barre à gauche) ===
                
                const img = createImagePlaceholder(colIndex);
                img.style.display = 'flex';
                img.style.justifySelf = 'start';
                img.style.overflow = 'hidden';

                const image = document.createElement('img');
                image.src = video.image;
                image.style.width = '200px';
                image.style.height = 'auto';
                
                container.appendChild(img);
                img.appendChild(image);

                const bottomWrapper = document.createElement('div');
                bottomWrapper.style.gridColumn = colIndex;
                bottomWrapper.style.gridRow = '3';
                bottomWrapper.style.width = '200px'; 
                bottomWrapper.style.justifySelf = 'start';
                bottomWrapper.style.display = 'flex';
                bottomWrapper.style.flexDirection = 'row'; 
                bottomWrapper.style.alignItems = 'stretch';
                bottomWrapper.style.paddingTop = '1rem'; 

                const verticalLine = createVerticalLine();
                const textContent = createTextContent(video, 'flex-start');

                bottomWrapper.appendChild(verticalLine);
                bottomWrapper.appendChild(textContent);
                container.appendChild(bottomWrapper);
            }
        });

    } catch (error) {
        console.error('Erreur chargement JSON :', error);
        container.innerHTML = `<p style="color:red; text-align:center;">Erreur: ${error.message}</p>`;
    }
}

// --- FONCTIONS UTILITAIRES POUR ÉVITER LA RÉPÉTITION ---

function createImagePlaceholder(colIndex) {
    const div = document.createElement('div');
    div.style.gridColumn = colIndex;
    div.style.gridRow = '2';
    div.style.width = '200px';
    div.style.height = '355px';
    div.style.backgroundColor = 'white';
    div.style.borderRadius = '8px';
    div.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    div.style.justifySelf = 'center';
    return div;
}

function createVerticalLine() {
    const line = document.createElement('div');
    line.style.width = '2px';
    line.style.backgroundColor = 'white';
    line.style.marginRight = '15px'; 
    line.style.minHeight = '60px'; 
    return line;
}

function createTextContent(video, justifyDirection) {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.justifyContent = justifyDirection; 
    div.style.textAlign = 'left';
    
    const h3 = document.createElement('h3');
    h3.textContent = video.title;
    h3.style.color = 'white';
    h3.style.fontSize = '1.25rem';
    h3.style.fontWeight = 'bold';
    h3.style.margin = '0 0 0.5rem 0';
    
    const p = document.createElement('p');
    p.textContent = video.description;
    p.style.color = 'white';
    p.style.fontSize = '0.8rem';
    p.style.margin = '0';

    div.appendChild(h3);
    div.appendChild(p);
    return div;
}