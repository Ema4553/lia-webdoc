(function main() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const screen = document.getElementById('phoneScreen');
        const videoTemplate = document.getElementById('videoTemplate');
        let isScrolling = false;
        let currentVideoIndex = 0;
        let videos = [];
        let videoPlayers = []; // Pour stocker les API des players YouTube

        // Charger les vidéos depuis les données
        function loadVideos() {
            screen.innerHTML = '';
            videoPlayers = [];
            
            videosData.forEach((video, index) => {
                const videoClone = videoTemplate.content.cloneNode(true);
                const videoElement = videoClone.querySelector('div');
                
                // Configurer l'iframe YouTube
                const iframe = videoElement.querySelector('iframe');
                iframe.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${video.youtubeId}&enablejsapi=1`;
                
                videoElement.setAttribute('data-video-id', video.id);
                screen.appendChild(videoElement);
                
                // Initialiser le player YouTube
                initializeYouTubePlayer(iframe, index);
            });
            
            // Mettre à jour la liste des vidéos
            videos = document.querySelectorAll('#phoneScreen > div');
        }
        
        // Initialiser le player YouTube
        function initializeYouTubePlayer(iframe, index) {
            // YouTube IFrame API chargera automatiquement le player
            // On stocke juste une référence pour plus tard
            videoPlayers[index] = {
                iframe: iframe,
                isPlaying: true // Par défaut en lecture (autoplay)
            };
        }
        
        // Jouer une vidéo
        function playVideo(index) {
            const player = videoPlayers[index];
            if (player && player.iframe) {
                player.iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                player.isPlaying = true;
                updatePlayPauseIndicator(index, true);
            }
        }
        
        // Mettre en pause une vidéo
        function pauseVideo(index) {
            const player = videoPlayers[index];
            if (player && player.iframe) {
                player.iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                player.isPlaying = false;
                updatePlayPauseIndicator(index, false);
            }
        }
        
        // Basculer play/pause pour la vidéo actuelle
        function togglePlayPause() {
            const player = videoPlayers[currentVideoIndex];
            if (player) {
                if (player.isPlaying) {
                    pauseVideo(currentVideoIndex);
                } else {
                    playVideo(currentVideoIndex);
                }
            }
        }
        
        // Mettre à jour l'indicateur de lecture/pause
        function updatePlayPauseIndicator(index, isPlaying) {
            const videoElement = videos[index];
            if (videoElement) {
                const indicator = videoElement.querySelector('[data-play-pause-indicator]');
                const playIcon = videoElement.querySelector('#play-icon');
                const pauseIcon = videoElement.querySelector('#pause-icon');
                
                if (isPlaying) {
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                } else {
                    playIcon.classList.remove('hidden');
                    pauseIcon.classList.add('hidden');
                }
                
                // Afficher brièvement l'indicateur
                indicator.classList.remove('opacity-0');
                indicator.classList.add('opacity-100');
                
                setTimeout(() => {
                    indicator.classList.remove('opacity-100');
                    indicator.classList.add('opacity-0');
                }, 1000);
            }
        }
        
        // Initialiser la position de défilement
        function initScroll() {
            screen.scrollTop = 0;
            currentVideoIndex = 0;
        }
        
        // Fonction pour passer à la vidéo suivante
        function nextVideo() {
            if (currentVideoIndex < videos.length - 1) {
                // Mettre en pause la vidéo actuelle
                pauseVideo(currentVideoIndex);
                
                currentVideoIndex++;
                screen.scrollTo({
                    top: currentVideoIndex * screen.clientHeight,
                    behavior: 'smooth'
                });
                
                // Jouer la nouvelle vidéo après un court délai
                setTimeout(() => {
                    playVideo(currentVideoIndex);
                }, 300);
            }
        }
        
        // Fonction pour passer à la vidéo précédente
        function previousVideo() {
            if (currentVideoIndex > 0) {
                // Mettre en pause la vidéo actuelle
                pauseVideo(currentVideoIndex);
                
                currentVideoIndex--;
                screen.scrollTo({
                    top: currentVideoIndex * screen.clientHeight,
                    behavior: 'smooth'
                });
                
                // Jouer la nouvelle vidéo après un court délai
                setTimeout(() => {
                    playVideo(currentVideoIndex);
                }, 300);
            }
        }
        
        // Gérer le défilement avec la molette de la souris sur tout l'écran
        document.addEventListener('wheel', function(e) {
            // Vérifier si le curseur est sur le téléphone
            const phoneElement = document.querySelector('.bg-gray-900');
            const isOverPhone = phoneElement.contains(e.target) || phoneElement === e.target;
            
            if (!isOverPhone || isScrolling) return;
            
            e.preventDefault();
            
            isScrolling = true;
            
            if (e.deltaY > 0) {
                // Défilement vers le bas - vidéo suivante
                nextVideo();
            } else {
                // Défilement vers le haut - vidéo précédente
                previousVideo();
            }
            
            // Réinitialiser le flag après un délai
            setTimeout(() => {
                isScrolling = false;
            }, 500);
        });
        
        // Gérer le clic pour play/pause sur tout l'écran du téléphone
        screen.addEventListener('click', function(e) {
            // Empêcher le déclenchement multiple
            e.stopPropagation();
            
            // Vérifier qu'on ne clique pas sur les éléments d'interface
            if (!e.target.closest('[data-video-overlay]')) return;
            
            togglePlayPause();
        });
        
        // Gérer le défilement tactile
        let startY = 0;
        let isTouchScrolling = false;
        
        screen.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            isTouchScrolling = true;
        });
        
        screen.addEventListener('touchmove', function(e) {
            if (!isTouchScrolling) return;
            e.preventDefault();
        });
        
        screen.addEventListener('touchend', function(e) {
            if (!isTouchScrolling || isScrolling) return;
            
            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;
            
            // Seuil pour déclencher le changement de vidéo
            if (Math.abs(diff) > 50) {
                isScrolling = true;
                
                if (diff > 0) {
                    // Glissement vers le haut - vidéo suivante
                    nextVideo();
                } else {
                    // Glissement vers le bas - vidéo précédente
                    previousVideo();
                }
                
                // Réinitialiser le flag après un délai
                setTimeout(() => {
                    isScrolling = false;
                    isTouchScrolling = false;
                }, 500);
            } else {
                // Clic simple - toggle play/pause
                togglePlayPause();
                isTouchScrolling = false;
            }
        });
        
        // Gérer les touches du clavier
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                nextVideo();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                previousVideo();
            } else if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                togglePlayPause();
            }
        });
        
        // Charger les vidéos au démarrage
        loadVideos();
        initScroll();
    });
})();

// Données des vidéos (remplacez par votre propre JSON)
const videosData = [
    {
        id: 1,
        title: "Vidéo TikTok amusante",
        youtubeId: "nPBxq2ym3VE",
        backgroundColor: "from-cyan-500 to-blue-500"
    },
    {
        id: 2,
        title: "Tutoriel rapide",
        youtubeId: "xf8hypK_0h0",
        backgroundColor: "from-purple-500 to-pink-500"
    },
    {
        id: 3,
        title: "Vidéo TikTok amusanteeeee",
        youtubeId: "nPBxq2ym3VE",
        backgroundColor: "from-cyan-500 to-blue-500"
    },
    {
        id: 4,
        title: "Tutoriel rapideeeeee",
        youtubeId: "xf8hypK_0h0",
        backgroundColor: "from-purple-500 to-pink-500"
    }
];