(function main(){
  'use strict';

  setupCarrousels();
}
)();

let carrouselsData = [];
let currentImages = [];
let currentIndex = 0;

export async function setupCarrousels() {
  const grid = document.querySelector('.carrousel-grid');
  const emplacement = document.querySelector('.emplacement-carrousel');

  try {
    const response = await fetch('../data/carrousels.json');
    if (!response.ok) throw new Error('Erreur de chargement du fichier JSON');
    carrouselsData = await response.json();

    // Génération des aperçus
    carrouselsData.forEach(carrousel => {
      const img = document.createElement('img');
      img.src = carrousel.thumbnail;
      img.alt = `Carrousel ${carrousel.id}`;
      img.className = 'carrousel overflow-hidden';
      img.style.borderRadius = '15px';
      img.style.cursor = 'pointer';

      img.addEventListener('click', () => {
        currentImages = carrousel.images; 
        currentIndex = 0; 
        afficherCarrousel(emplacement);
      });

      grid.appendChild(img);
    });
  } catch (error) {
    console.error('Erreur chargement JSON :', error);
  }
}

function afficherCarrousel(emplacement) {
  const flecheGauche = document.querySelector('#btn-prev');
  const flecheDroite = document.querySelector('#btn-next');

  flecheGauche.classList.remove('hidden');
  flecheDroite.classList.remove('hidden');

  flecheGauche.onclick = () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    afficherCarrousel(emplacement);
  };

  flecheDroite.onclick = () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    afficherCarrousel(emplacement);
  };

  emplacement.innerHTML = '';
  emplacement.classList.remove('bg-gray-500', 'bg-clip-padding', 'backdrop-filter', 'backdrop-blur', 'bg-opacity-20', 'backdrop-saturate-100', 'backdrop-contrast-100', 'shadow-[inset_0_0_5px_rgba(255,255,255,0.3)]')

  const post = document.createElement('div');
  post.style.backgroundColor = 'white';
  post.style.borderRadius = '15px'
  post.style.gridTemplateRows = 'auto 1fr auto';
  post.style.overflow = 'hidden';

  let height = '24rem'; 
  
  if (window.matchMedia('(min-width: 1024px)').matches) {
    height = '24rem';
  } else if (window.matchMedia('(min-width: 768px)').matches) {
    height = '20rem'; 
  }
  
  post.style.height = height;


  //Bannière haute
  const header = document.createElement('div');
  header.className = 'flex items-center';
  header.style.padding = '10px';
  header.innerHTML = `
    <div class="flex items-center gap-2">
      <img src="../assets/images/RSE_0922_LIALogo_V1.svg" alt="Profil" class="w-5 h-5 rounded-full object-cover">
      <span class="font-century-gothic font-semibold text-gray-800">lia</span>
    </div>
  `;

  //Image
  const img = document.createElement('img');
  img.src = currentImages[currentIndex];
  img.alt = currentImages[currentIndex].alt;

  //Pied de post
  const footer = document.createElement('div');
  footer.className = 'flex justify-around';
  footer.style.paddingLeft = '10px';
  footer.style.paddingTop = '3px';
  footer.innerHTML = `
    <button>❤️</button>
    <button>💬</button>
    <button>✈️</button>
  `;

  post.appendChild(header);
  post.appendChild(img);
  post.appendChild(footer);
  emplacement.appendChild(post);
}
