// ========================================
// MichelArmaniAudioPlayer.js - CORREGIDO
// ========================================

// Variables globales del reproductor
let currentTrackIndex = 0;
let isPlaying = false;
let audioPlayer = null;
let allTracks = [];
let isInitialized = false;

// Referencias a elementos del DOM
let playButtons = null;
let playerModal = null;
let closePlayer = null;
let playerTrackTitle = null;
let playerTrackArtist = null;
let playPauseBtn = null;
let prevBtn = null;
let nextBtn = null;
let progressBar = null;
let progress = null;
let currentTimeEl = null;
let durationEl = null;
let volumeSlider = null;

// ========================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
// ========================================

function initAudioPlayer() {
    console.log("[AudioPlayer] Inicializando reproductor...");
    
    // Verificar que getTracks esté disponible
    if (typeof getTracks !== 'function') {
        console.warn("[AudioPlayer] getTracks() no está disponible aún, reintentando...");
        setTimeout(initAudioPlayer, 200);
        return false;
    }
    
    // Obtener tracks
    try {
        allTracks = getTracks();
        if (!allTracks || allTracks.length === 0) {
            console.warn("[AudioPlayer] No se encontraron tracks");
            return false;
        }
        console.log(`[AudioPlayer] ${allTracks.length} tracks cargados`);
    } catch (error) {
        console.error("[AudioPlayer] Error al obtener tracks:", error);
        return false;
    }
    
    // Obtener referencias a elementos del DOM
    const elementsFound = getDOMElements();
    if (!elementsFound) {
        console.warn("[AudioPlayer] Elementos del DOM no encontrados, reintentando...");
        setTimeout(initAudioPlayer, 200);
        return false;
    }
    
    // Generar items de tracks en la lista
    generateTrackItems();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar audio player
    if (audioPlayer && volumeSlider) {
        audioPlayer.volume = volumeSlider.value || 0.5;
    }
    
    isInitialized = true;
    console.log("[AudioPlayer] Inicialización completada");
    
    return true;
}

// ========================================
// OBTENER ELEMENTOS DEL DOM
// ========================================

function getDOMElements() {
    audioPlayer = document.getElementById('audio-player');
    playerModal = document.getElementById('player-modal');
    closePlayer = document.getElementById('close-player');
    playerTrackTitle = document.getElementById('player-track-title');
    playerTrackArtist = document.getElementById('player-track-artist');
    playPauseBtn = document.getElementById('play-pause-btn');
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    progressBar = document.getElementById('progress-bar');
    progress = document.getElementById('progress');
    currentTimeEl = document.getElementById('current-time');
    durationEl = document.getElementById('duration');
    volumeSlider = document.getElementById('volume-slider');
    
    // Verificar elementos críticos
    if (!audioPlayer || !playerModal || !playPauseBtn) {
        console.warn("[AudioPlayer] Faltan elementos críticos del DOM");
        return false;
    }
    
    return true;
}

// ========================================
// GENERAR LISTA DE TRACKS
// ========================================

function generateTrackItems() {
    const tracksContainer = document.getElementById('tracks-container');
    
    if (!tracksContainer) {
        console.warn("[AudioPlayer] tracks-container no encontrado");
        return;
    }
    
    // Filtrar solo producciones (no items de tienda)
    const productionTracks = allTracks.filter(track => track.type === "production");
    
    if (productionTracks.length === 0) {
        console.log("[AudioPlayer] No hay tracks de producción para mostrar");
        return;
    }
    
    // Limpiar contenedor
    tracksContainer.innerHTML = '';
    
    // Crear items
    productionTracks.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.setAttribute('data-track', track.id);
        
        trackItem.innerHTML = `
            <div class="track-number">${index + 1}</div>
            <div class="track-info">
                <div class="track-title">${escapeHtml(track.title)}</div>
                <div class="track-artist">${escapeHtml(track.artist)}</div>
            </div>
            <div class="track-duration">${track.duration || ''}</div>
            <button class="play-btn" data-track="${track.id}">
                <i class="fas fa-play"></i>
            </button>
        `;
        
        tracksContainer.appendChild(trackItem);
    });
    
    // Actualizar referencia a botones
    playButtons = document.querySelectorAll('.play-btn');
    
    console.log(`[AudioPlayer] ${productionTracks.length} tracks renderizados`);
}

// ========================================
// CONFIGURAR EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Botones de play en la lista
    if (playButtons) {
        playButtons.forEach(button => {
            button.addEventListener('click', handlePlayButtonClick);
        });
    }
    
    // Cerrar modal
    if (closePlayer) {
        closePlayer.addEventListener('click', handleClosePlayer);
    }
    
    // Botón play/pause
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', handlePlayPause);
    }
    
    // Botones anterior/siguiente
    if (prevBtn) {
        prevBtn.addEventListener('click', handlePrevious);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNext);
    }
    
    // Barra de progreso
    if (progressBar) {
        progressBar.addEventListener('click', handleProgressBarClick);
    }
    
    // Control de volumen
    if (volumeSlider) {
        volumeSlider.addEventListener('input', handleVolumeChange);
    }
    
    // Eventos del audio
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', handleTimeUpdate);
        audioPlayer.addEventListener('ended', handleTrackEnded);
        audioPlayer.addEventListener('error', handleAudioError);
        audioPlayer.addEventListener('loadedmetadata', handleLoadedMetadata);
    }
    
    // Cerrar modal al hacer click fuera
    if (playerModal) {
        playerModal.addEventListener('click', handleModalClick);
    }
    
    // Teclas
    document.addEventListener('keydown', handleKeyPress);
}

// ========================================
// HANDLERS DE EVENTOS
// ========================================

function handlePlayButtonClick(e) {
    const trackId = parseInt(this.getAttribute('data-track'));
    
    if (isNaN(trackId)) {
        console.error("[AudioPlayer] ID de track inválido");
        return;
    }
    
    currentTrackIndex = allTracks.findIndex(track => track.id === trackId);
    
    if (currentTrackIndex === -1) {
        console.error("[AudioPlayer] Track no encontrado:", trackId);
        return;
    }
    
    loadTrack(currentTrackIndex);
    openPlayerModal();
    playTrack();
    updatePlayingState(trackId);
}

function handleClosePlayer() {
    closePlayerModal();
    pauseTrack();
}

function handlePlayPause() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function handlePrevious() {
    if (allTracks.length === 0) return;
    
    currentTrackIndex = (currentTrackIndex - 1 + allTracks.length) % allTracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

function handleNext() {
    if (allTracks.length === 0) return;
    
    currentTrackIndex = (currentTrackIndex + 1) % allTracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
}

function handleProgressBarClick(e) {
    if (!audioPlayer || !audioPlayer.duration) return;
    
    const rect = this.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

function handleVolumeChange() {
    if (audioPlayer) {
        audioPlayer.volume = Math.max(0, Math.min(1, this.value));
    }
}

function handleTimeUpdate() {
    if (!audioPlayer || !progress || !currentTimeEl) return;
    
    const currentTime = audioPlayer.currentTime || 0;
    const duration = audioPlayer.duration || 0;
    
    if (duration > 0) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }
    
    currentTimeEl.textContent = formatTime(currentTime);
}

function handleTrackEnded() {
    // Auto-reproducir siguiente
    handleNext();
}

function handleAudioError(e) {
    console.error("[AudioPlayer] Error de audio:", e);
    
    // Mostrar mensaje al usuario
    if (playerTrackTitle) {
        playerTrackTitle.textContent = "Error al cargar el audio";
    }
}

function handleLoadedMetadata() {
    if (durationEl && audioPlayer) {
        durationEl.textContent = formatTime(audioPlayer.duration);
    }
}

function handleModalClick(e) {
    if (e.target === playerModal) {
        closePlayerModal();
        pauseTrack();
    }
}

function handleKeyPress(e) {
    if (!playerModal || !playerModal.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closePlayerModal();
            pauseTrack();
            break;
        case ' ':
            e.preventDefault();
            handlePlayPause();
            break;
        case 'ArrowLeft':
            if (audioPlayer) {
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
            }
            break;
        case 'ArrowRight':
            if (audioPlayer) {
                audioPlayer.currentTime = Math.min(audioPlayer.duration || 0, audioPlayer.currentTime + 5);
            }
            break;
    }
}

// ========================================
// FUNCIONES DEL REPRODUCTOR
// ========================================

function loadTrack(index) {
    if (!allTracks[index]) {
        console.error("[AudioPlayer] Índice de track inválido:", index);
        return;
    }
    
    const track = allTracks[index];
    
    // VALIDAR QUE HAY PREVIEW
    if (!track.preview || track.preview.trim() === '') {
        console.error(`[AudioPlayer] El track "${track.title}" no tiene archivo de preview`);
        
        // Mostrar mensaje al usuario
        if (playerTrackTitle) {
            playerTrackTitle.textContent = track.title + " (Sin preview)";
        }
        if (playerTrackArtist) {
            playerTrackArtist.textContent = "Este track no tiene archivo de audio";
        }
        
        // Deshabilitar reproducción
        if (audioPlayer) {
            audioPlayer.src = '';
        }
        
        return;
    }
    
    console.log(`[AudioPlayer] Cargando track: ${track.title}`);
    console.log(`[AudioPlayer] URL preview: ${track.preview}`);
    
    if (audioPlayer) {
        audioPlayer.src = track.preview;
        audioPlayer.load();
    }
    
    if (playerTrackTitle) {
        playerTrackTitle.textContent = track.title || 'Unknown';
    }
    
    if (playerTrackArtist) {
        playerTrackArtist.textContent = track.artist || 'Unknown Artist';
    }
    
    if (durationEl) {
        durationEl.textContent = track.duration || '0:00';
    }
    
    updatePlayingState(track.id);
}

function playTrack() {
    if (!audioPlayer) return;
    
    const playPromise = audioPlayer.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            updatePlayPauseButton();
        }).catch(error => {
            console.error("[AudioPlayer] Error al reproducir:", error);
            isPlaying = false;
            updatePlayPauseButton();
        });
    }
}

function pauseTrack() {
    if (!audioPlayer) return;
    
    audioPlayer.pause();
    isPlaying = false;
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    if (playPauseBtn) {
        playPauseBtn.innerHTML = isPlaying 
            ? '<i class="fas fa-pause"></i>' 
            : '<i class="fas fa-play"></i>';
    }
}

function openPlayerModal() {
    if (playerModal) {
        playerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePlayerModal() {
    if (playerModal) {
        playerModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function updatePlayingState(trackId) {
    // Remover clase 'playing' de todos los items
    document.querySelectorAll('.track-item, .beat-card').forEach(item => {
        item.classList.remove('playing');
    });
    
    // Añadir clase 'playing' al item actual
    if (trackId) {
        const playingElement = document.querySelector(`[data-track="${trackId}"]`);
        if (playingElement) {
            playingElement.classList.add('playing');
        }
    }
}

// ========================================
// FUNCIÓN GLOBAL PARA CARGAR Y REPRODUCIR
// ========================================

window.loadAndPlayTrack = function(trackId) {
    if (!isInitialized) {
        console.warn("[AudioPlayer] Reproductor no inicializado");
        return;
    }
    
    const index = allTracks.findIndex(track => track.id === trackId);
    
    if (index === -1) {
        console.error("[AudioPlayer] Track no encontrado:", trackId);
        return;
    }
    
    currentTrackIndex = index;
    loadTrack(index);
    openPlayerModal();
    playTrack();
};

// ========================================
// FUNCIÓN PARA RECARGAR TRACKS
// ========================================

window.reloadTracks = function() {
    if (typeof getTracks === 'function') {
        allTracks = getTracks();
        generateTrackItems();
        
        // Re-asignar event listeners a nuevos botones
        playButtons = document.querySelectorAll('.play-btn');
        playButtons.forEach(button => {
            button.addEventListener('click', handlePlayButtonClick);
        });
        
        console.log("[AudioPlayer] Tracks recargados");
    }
};

// ========================================
// UTILIDADES
// ========================================

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity || seconds === null) {
        return "0:00";
    }
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Pequeño delay para asegurar que otros scripts se cargaron
        setTimeout(initAudioPlayer, 100);
    });
} else {
    // DOM ya está listo
    setTimeout(initAudioPlayer, 100);
}

// También intentar inicializar cuando cambie el estado de carga
window.addEventListener('load', function() {
    if (!isInitialized) {
        setTimeout(initAudioPlayer, 200);
    }
});

console.log("[AudioPlayer] Script cargado");



