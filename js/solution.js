let solutionData = [];
let currentIndex = 0;
let stepsContainer;
let infoSolution;
let inputSwitch;
let btnNext;
let btnPrev;

export async function setupSolution() {
    try {
        const response = await fetch('../data/solution.json');
        if (!response.ok) throw new Error('Erreur de chargement du fichier JSON');
        solutionData = await response.json();
    } catch (error) {
        console.error('Erreur chargement JSON :', error);
        return;
    }

    stepsContainer = document.querySelector('.steps');
    infoSolution = document.querySelector('.info-solution');
    inputSwitch = document.querySelector('.btn-switch input');
    btnNext = document.querySelector('.btn-next');
    btnPrev = document.querySelector('.btn-prev');

    if (!stepsContainer || !infoSolution || !inputSwitch || !btnNext || !btnPrev) {
        console.error('Certains éléments DOM sont introuvables !');
        return;
    }

    setupEventListeners();
    afficherSolution();
}

function setupEventListeners() {
    inputSwitch.addEventListener('change', () => {
        currentIndex = 0;
        afficherSolution();
    });

    btnNext.addEventListener('click', () => {
        const index = inputSwitch.checked ? 1 : 0;
        const maxIndex = solutionData[index].nb_etapes - 1;
        if (currentIndex < maxIndex) currentIndex++;
        afficherSolution();
    });

    btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) currentIndex--;
        afficherSolution();
    });
}

function renderSteps() {
    if (!stepsContainer) return;

    const index = inputSwitch.checked ? 1 : 0;
    stepsContainer.innerHTML = '';
    stepsContainer.className = 'steps flex flex-row gap-10 justify-center ';

    solutionData[index].etapes.forEach(step => {
        const stepButton = document.createElement('button');
        stepButton.textContent = step.etape_id;
        stepButton.style.borderRadius = '50%';
        stepButton.style.width = '60px';
        stepButton.style.height = '60px';
        stepButton.style.fontSize = '2rem';
        stepButton.style.cursor = 'pointer';

        if (currentIndex === step.etape_id - 1) {
            stepButton.style.backgroundColor = '#00C469';
            stepButton.style.color = '#FFFFFF';
        } else {
            stepButton.style.border = '2px solid #00C469';
            stepButton.style.color = '#00C469';
            stepButton.style.backgroundColor = '#2E2E2E';
        }

        stepButton.addEventListener('click', () => {
            currentIndex = step.etape_id - 1;
            afficherSolution();
        });

        stepsContainer.appendChild(stepButton);
    });
}

function renderInfo() {
    if (!infoSolution) return;

    const index = inputSwitch.checked ? 1 : 0;
    const currentStep = solutionData[index].etapes[currentIndex];

    infoSolution.innerHTML = `
        <img src="${currentStep.image}" alt="Étape ${currentStep.etape_id}" class="object-contain mx-auto p-5 w-60">
        <div class="flex flex-col text-start gap-5">
            <h2 class="text-lg lg:text-xl">${currentStep.title}</h2>
            <p class="font-light text-sm lg:text-lg">${currentStep.description}</p>
        </div>
        
    `;
}

function updateButtons() {
    const index = inputSwitch.checked ? 1 : 0;
    const maxIndex = solutionData[index].nb_etapes - 1;

    btnPrev.classList.toggle('invisible', currentIndex === 0);
    btnNext.classList.toggle('invisible', currentIndex === maxIndex);
}

export function afficherSolution() {
    renderSteps();
    renderInfo();
    updateButtons();
}

document.addEventListener('DOMContentLoaded', () => {
    setupSolution();
});
