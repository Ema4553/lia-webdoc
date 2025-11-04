(function main(){
    'use strict';
    
    setupNavbar();
  }
  )();

export function setupNavbar() {
    document.addEventListener('DOMContentLoaded', function () {
        const onglets = document.querySelectorAll('nav li');

        onglets.forEach(onglet => {
            onglet.addEventListener('mouseenter', function () {
                // retirer la classe active actuelle
                document.querySelectorAll('.nav-active').forEach(el => {
                    el.classList.remove('nav-active');
                });
                // ajouter la classe sur l’onglet survolé
                onglet.classList.add('nav-active');
            });

            onglet.addEventListener('mouseleave', function () {
                // retirer la classe active actuelle
                document.querySelectorAll('.nav-active').forEach(el => {
                    el.classList.remove('nav-active');
                });
            });
        });
    }
    );
}