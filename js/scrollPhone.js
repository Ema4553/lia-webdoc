(function main() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    const screen = document.getElementById('phoneScreen');
    const videoTemplate = document.getElementById('videoTemplate');
    const timeline = document.getElementById('timeline');
    const timelineText = document.getElementById('timelineText');

    let isScrolling = false;
    let currentVideoIndex = 0;
    let videos = [];
    let videoPlayers = [];
    let dotElements = [];

    const videosData = [
      { id: 1, title: "1. Vidéo TikTok amusante", youtubeId: "nPBxq2ym3VE", description: "Une vidéo vraiment drôle à regarder encore et encore." },
      { id: 2, title: "2. Tutoriel rapide", youtubeId: "xf8hypK_0h0", description: "Un tuto qui va droit au but." },
      { id: 3, title: "3. Vidéo TikTok amusanteeeee", youtubeId: "nPBxq2ym3VE", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc gravida orci eget justo mollis sollicitudin. Ut finibus justo sed rutrum interdum. Proin vel odio in dui blandit pellentesque. Integer vehicula massa non lorem eleifend maximus. Vivamus volutpat metus libero, sit amet feugiat quam imperdiet a." },
      { id: 4, title: "4. Tutoriel rapideeeeee", youtubeId: "xf8hypK_0h0", description: "Toujours un tuto rapide." }
    ];

    // --- LOAD VIDEOS ---
    function loadVideos() {
      screen.innerHTML = '';
      videoPlayers = [];

      videosData.forEach((video, index) => {
        const videoClone = videoTemplate.content.cloneNode(true);
        const videoElement = videoClone.querySelector('div');

        const iframe = videoElement.querySelector('iframe');
        iframe.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${video.youtubeId}&enablejsapi=1`;

        videoElement.setAttribute('data-video-id', video.id);
        const titleEl = videoElement.querySelector('[data-video-title]');
        const descEl = videoElement.querySelector('[data-video-description]');
        if (titleEl) titleEl.textContent = video.title;
        if (descEl) descEl.textContent = video.description;

        screen.appendChild(videoElement);
        initializeYouTubePlayer(iframe, index);
      });

      videos = document.querySelectorAll('#phoneScreen > div');
      videos.forEach(v => { v.style.height = screen.clientHeight + 'px'; });

      loadTimeline();
    }

    function initializeYouTubePlayer(iframe, index) {
      videoPlayers[index] = {
        iframe: iframe,
        isPlaying: true
      };
    }

    function playVideo(index) {
      const player = videoPlayers[index];
      if (player && player.iframe && player.iframe.contentWindow) {
        player.iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        player.isPlaying = true;
        updatePlayPauseIndicator(index, true);
      }
    }

    function pauseVideo(index) {
      const player = videoPlayers[index];
      if (player && player.iframe && player.iframe.contentWindow) {
        player.iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        player.isPlaying = false;
        updatePlayPauseIndicator(index, false);
      }
    }

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

    function updatePlayPauseIndicator(index, isPlaying) {
      const videoElement = videos[index];
      if (videoElement) {
        const indicator = videoElement.querySelector('[data-play-pause-indicator]');
        const playIcon = videoElement.querySelector('#play-icon');
        const pauseIcon = videoElement.querySelector('#pause-icon');

        if (playIcon && pauseIcon) {
          if (isPlaying) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
          } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
          }
        }

        if (indicator) {
          indicator.classList.remove('opacity-0');
          indicator.classList.add('opacity-100');
          setTimeout(() => {
            indicator.classList.remove('opacity-100');
            indicator.classList.add('opacity-0');
          }, 800);
        }
      }
    }

    // --- SCROLL INIT ---
    function initScroll() {
      screen.scrollTop = 0;
      currentVideoIndex = 0;
      updateTimeline();
    }

    // --- NAVIGATION vidéos ---
    function nextVideo() {
      pauseVideo(currentVideoIndex);
      currentVideoIndex = (currentVideoIndex + 1) % videosData.length;
      screen.scrollTo({ top: currentVideoIndex * screen.clientHeight, behavior: 'smooth' });
      setTimeout(() => {
        playVideo(currentVideoIndex);
        updateTimeline();
      }, 300);
    }

    function previousVideo() {
      pauseVideo(currentVideoIndex);
      currentVideoIndex = (currentVideoIndex - 1 + videosData.length) % videosData.length;
      screen.scrollTo({ top: currentVideoIndex * screen.clientHeight, behavior: 'smooth' });
      setTimeout(() => {
        playVideo(currentVideoIndex);
        updateTimeline();
      }, 300);
    }

    // --- GESTES MOLETTE / TOUCH / KEYS ---
    document.addEventListener('wheel', function(e) {
      const phoneElement = document.querySelector('.bg-gray-900');
      const isOverPhone = phoneElement.contains(e.target) || phoneElement === e.target;

      if (!isOverPhone || isScrolling) return;

      e.preventDefault();
      isScrolling = true;

      if (e.deltaY > 0) nextVideo();
      else previousVideo();

      setTimeout(() => { isScrolling = false; }, 500);
    }, { passive: false });

    screen.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!e.target.closest('[data-video-overlay]')) return;
      togglePlayPause();
    });

    let startY = 0;
    let isTouchScrolling = false;
    screen.addEventListener('touchstart', function(e) {
      startY = e.touches[0].clientY;
      isTouchScrolling = true;
    });
    screen.addEventListener('touchmove', function(e) {
      if (!isTouchScrolling) return;
      e.preventDefault();
    }, { passive: false });
    screen.addEventListener('touchend', function(e) {
      if (!isTouchScrolling || isScrolling) return;
      const endY = e.changedTouches[0].clientY;
      const diff = startY - endY;
      if (Math.abs(diff) > 50) {
        isScrolling = true;
        if (diff > 0) nextVideo(); else previousVideo();
        setTimeout(() => { isScrolling = false; isTouchScrolling = false; }, 500);
      } else {
        togglePlayPause();
        isTouchScrolling = false;
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); nextVideo(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); previousVideo(); }
      else if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); togglePlayPause(); }
    });

    // -------------------------
    // TIMELINE VERTICALE AVEC BOUCLE INFINIE
    // -------------------------
    function loadTimeline() {
      // Reset timeline
      const oldPoints = timeline.querySelectorAll('.timeline-point-wrap');
      oldPoints.forEach(n => n.remove());
      dotElements = [];

      // Calculer les indices des points à afficher (toujours 3 points)
      const visibleIndices = getVisibleIndices();

      // Créer les points visibles
      visibleIndices.forEach((index, position) => {
        createTimelinePoint(index, position);
      });

      updateTimelineText();
      updateTimelinePosition();
    }

    function getVisibleIndices() {
      // Retourne toujours 3 indices : [précédent, actuel, suivant] avec boucle
      let indices = [];
      
      // Calculer les indices avec boucle
      const prevIndex = (currentVideoIndex - 1 + videosData.length) % videosData.length;
      const nextIndex = (currentVideoIndex + 1) % videosData.length;
      
      indices = [prevIndex, currentVideoIndex, nextIndex];
      
      return indices;
    }

    function createTimelinePoint(index, position) {
      const video = videosData[index];
      
      // Wrapper pour le point
      const wrap = document.createElement('div');
      wrap.className = 'timeline-point-wrap absolute left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-500';
      
      // Position verticale selon la position (haut, milieu, bas)
      const timelineHeight = timeline.clientHeight;
      const spacing = timelineHeight / 3;
      
      if (position === 0) {
        wrap.style.top = `${spacing * 0.2}px`; // Haut (précédent)
      } else if (position === 1) {
        wrap.style.top = `${spacing * 1.5}px`; // Milieu (actuel)
      } else if (position === 2) {
        wrap.style.top = `${spacing * 2.7}px`; // Bas (suivant)
      }
      
      // SVG point
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 200 200');
      svg.setAttribute('class', 'w-5 lg:w-8 transition-all duration-300 cursor-pointer');
      svg.innerHTML = `<path fill="${index === currentVideoIndex ? 'white' : 'gray'}"
        d="M69.2,-39.7C83.5,-15.1,84.8,17.3,71.1,40.9C57.4,64.5,28.7,79.2,1.2,78.5C-26.3,77.8,-52.6,61.6,-66.2,38.1C-79.8,14.6,-80.9,-16.3,-67.7,-40.3C-54.6,-64.3,-27.3,-81.2,0.1,-81.3C27.4,-81.3,54.8,-64.4,69.2,-39.7Z"
        transform="translate(100 100)" />`;

      // Titre à GAUCHE du point (sauf pour le point actuel)
      const title = document.createElement('div');
      title.className = 'text-xs lg:text-sm text-white/80 mt-2 text-center max-w-[120px] hidden lg:block absolute';
      title.style.color = 'white';
      title.textContent = video.title;
      
      // Positionner le titre à gauche du point
      if (position === 0) { // Point du haut (précédent)
        title.style.right = '2.5rem';
        title.style.top = '50%';
        title.style.transform = 'translateY(-50%)';
        title.style.textAlign = 'right';
      } else if (position === 2) { // Point du bas (suivant)
        title.style.right = '2.5rem';
        title.style.top = '50%';
        title.style.transform = 'translateY(-50%)';
        title.style.textAlign = 'right';
      }

      // Click sur point
      wrap.addEventListener('click', () => {
        if (index === currentVideoIndex) return;
        pauseVideo(currentVideoIndex);
        currentVideoIndex = index;
        screen.scrollTo({ top: currentVideoIndex * screen.clientHeight, behavior: 'smooth' });
        setTimeout(() => { 
          playVideo(currentVideoIndex); 
          updateTimeline(); 
        }, 300);
      });

      wrap.appendChild(svg);
      
      // Ajouter le titre seulement pour les points du haut et du bas
      if (position !== 1) { // Pas pour le point du milieu (actuel)
        wrap.appendChild(title);
      }
      
      timeline.appendChild(wrap);
      
      dotElements.push({ 
        wrap, 
        svg, 
        title: position !== 1 ? title : null, // Pas de titre pour le point actuel
        index,
        position
      });
    }

    function updateTimeline() {
      // Recalculer quels points doivent être affichés
      const visibleIndices = getVisibleIndices();
      
      // Supprimer tous les points existants
      dotElements.forEach(el => el.wrap.remove());
      dotElements = [];
      
      // Recréer les points visibles
      visibleIndices.forEach((index, position) => {
        createTimelinePoint(index, position);
      });
      
      updateTimelinePosition();
      updateTimelineText();
    }

    function updateTimelinePosition() {
      // Mettre à jour les couleurs et tailles des points
      dotElements.forEach((el) => {
        if (!el.wrap) return;
        
        const path = el.svg.querySelector('path');
        if (path) {
          if (el.index === currentVideoIndex) {
            path.setAttribute('fill', 'white');
            el.svg.style.transform = 'scale(1.15)';
            if (el.title) { 
              el.title.classList.remove('opacity-50'); 
              el.title.classList.add('opacity-100'); 
            }
          } else {
            path.setAttribute('fill', 'gray');
            el.svg.style.transform = 'scale(1)';
            if (el.title) { 
              el.title.classList.remove('opacity-100'); 
              el.title.classList.add('opacity-50'); 
            }
          }
        }
      });
    }

    function updateTimelineText() {
      if (!timelineText) return;
      const v = videosData[currentVideoIndex];
      timelineText.innerHTML = `
          <h2 class="text-white text-lg font-semibold">${escapeHtml(v.title)}</h2>
          <p class="text-white/90 max-w-2xl">${escapeHtml(v.description)}</p>
      `;
      timelineText.classList.remove('hidden');
    }

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[s]));
    }

    // --- LANCEMENT ---
    loadVideos();
    initScroll();

    window.addEventListener('resize', () => {
      loadTimeline();
      updateTimeline();
    });

  });
})();