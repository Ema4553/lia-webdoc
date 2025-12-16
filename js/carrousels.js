(function main() {
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
      img.style.borderRadius = '15px';
      img.style.cursor = 'pointer';
      img.onmouseenter = () => {
        img.style.transform = 'scale(1.05)';
        img.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        img.style.transition = 'transform 0.3s ease-in-out';
      };

      img.onmouseleave = () => {
        img.style.transform = 'scale(1)';
        img.style.boxShadow = 'none';
        img.style.transition = 'transform 0.3s ease-in-out';
      };

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

  if (currentIndex === 0) {
    flecheGauche.classList.add('invisible');
    flecheDroite.classList.remove('invisible');
  } else if (currentIndex === currentImages.length -1) {
    flecheGauche.classList.remove('invisible');
    flecheDroite.classList.add('invisible');
  } else {
    flecheGauche.classList.remove('invisible');
    flecheDroite.classList.remove('invisible');
  }

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

  let height = '28rem';

  if (window.matchMedia('(min-width: 1024px)').matches) {
    height = '28rem';
  } else if (window.matchMedia('(min-width: 768px)').matches) {
    height = '24rem';
  }

  post.style.height = height;


  //Bannière haute
  const header = document.createElement('div');
  header.className = 'flex items-center';
  header.style.padding = '10px';
  header.innerHTML = `
    <div class="flex items-center gap-2">
      <img src="../assets/images/logo-fond-vert.png" alt="Profil" class="w-5 h-5 rounded-full object-cover">
      <span class="font-century-gothic font-semibold text-gray-800">lia</span>
    </div>
  `;

  //Image
  const img = document.createElement('img');
  img.src = currentImages[currentIndex];
  img.alt = currentImages[currentIndex].alt;

  //Pied de post
  const footer = document.createElement('div');
  footer.style.paddingLeft = '10px';
  footer.style.paddingTop = '7px';
  footer.style.display = 'flex';
  footer.style.gap = '10px';
  footer.innerHTML = `
    <i class="fa-solid fa-heart" style="color: #e61919;"></i>
    <i class="fa-regular fa-comment" style="color: #000000;"></i>
    <i class="fa-regular fa-paper-plane" style="color: #000000;"></i>
  `;

  post.appendChild(header);
  post.appendChild(img);
  post.appendChild(footer);
  emplacement.appendChild(post);
}
