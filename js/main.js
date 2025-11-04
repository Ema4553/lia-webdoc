//importer fonction du fichier navbar.js
import { setupCarrousels } from './carrousels.js';
import { setupNavbar } from './navbar.js';

(function main(){
    'use strict';
    setupNavbar();

    //Carrousels
    setupCarrousels();
}
)();