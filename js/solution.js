let solutionData = [];
let infoSolution;
let inputSwitch;

export async function setupSolution() {
    try {
        const response = await fetch('../data/solution.json');
        if (!response.ok) throw new Error('Erreur de chargement du fichier JSON');
        solutionData = await response.json();
    } catch (error) {
        console.error('Erreur chargement JSON :', error);
        return;
    }

    infoSolution = document.querySelector('.info-solution');
    inputSwitch = document.querySelector('.btn-switch input');

    if (!infoSolution || !inputSwitch) {
        console.error('Certains éléments DOM sont introuvables !');
        return;
    }

    setupEventListeners();
    afficherSolution();
}

function setupEventListeners() {
    inputSwitch.addEventListener('change', () => {
        afficherSolution();
    });
}

function renderInfo() {
    if (!infoSolution) return;

    const index = inputSwitch.checked ? 1 : 0;

    infoSolution.innerHTML = `
        <img src="${solutionData[index].image}" alt="Sur-téléchargement" class="object-contain mx-auto p-5 ${index == 1 ? 'h-60' : 'w-60'}">
        <div class="flex flex-col text-start gap-5">
            <h2 class="text-lg lg:text-2xl">${solutionData[index].title}</h2>
            <p class="font-light text-sm lg:text-lg">${solutionData[index].description}</p>
        </div>
        
    `;
}

export function afficherSolution() {
    renderInfo();
}

document.addEventListener('DOMContentLoaded', () => {
    setupSolution();
});
