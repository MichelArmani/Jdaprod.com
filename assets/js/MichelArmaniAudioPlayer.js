// No hay comentarios aquí. Fue duro programarlo. Debe ser duro entenderlo.

const tracks = getTracks()

function generateTrackItems() {
    const tracksContainer = document.getElementById('tracks-container');
    const tracks = getTracks().filter(track => track.type === "production"); 

    tracks.forEach(track => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.setAttribute('data-track', track.id);

        trackItem.innerHTML = `
    <div class="track-number">${track.id}</div>
    <div class="track-info">
        <div class="track-title">${track.title}</div>
        <div class="track-artist">${track.artist}</div>
    </div>
    <div class="track-duration">${track.duration}</div>
    <button class="play-btn" data-track="${track.id}">
        <i class="fas fa-play"></i>
    </button>
`;

        tracksContainer.appendChild(trackItem);
    });
}


let currentTrackIndex = 0;
let isPlaying = false;
let audioPlayer;
let allTracks = []; 


document.addEventListener('DOMContentLoaded', function () {
    allTracks = getTracks(); 

    generateTrackItems();

    const playButtons = document.querySelectorAll('.play-btn');
    const playerModal = document.getElementById('player-modal');
    const closePlayer = document.getElementById('close-player');
    const playerTrackTitle = document.getElementById('player-track-title');
    const playerTrackArtist = document.getElementById('player-track-artist');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');

    audioPlayer = document.getElementById('audio-player');
    audioPlayer.volume = volumeSlider.value;

    playButtons.forEach(button => {
        button.addEventListener('click', function () {
            const trackId = parseInt(this.getAttribute('data-track'));
            currentTrackIndex = allTracks.findIndex(track => track.id === trackId); 
            loadTrack(currentTrackIndex);
            playerModal.classList.add('active');
            document.body.style.overflow = 'hidden';
    
            document.querySelectorAll('.track-item').forEach(item => {
                item.classList.remove('playing');
            });
            document.querySelector(`.track-item[data-track="${trackId}"]`).classList.add('playing');
        });
    });

    
    window.loadAndPlayTrack = function(trackId) {
        currentTrackIndex = allTracks.findIndex(track => track.id === trackId);
        if (currentTrackIndex !== -1) {
            loadTrack(currentTrackIndex);
            playTrack();
            
            const playerModal = document.getElementById('player-modal');
            if (playerModal) {
                playerModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            
            document.querySelectorAll('.track-item, .beat-card').forEach(item => {
                item.classList.remove('playing');
            });
            const playingElement = document.querySelector(`[data-track="${trackId}"]`);
            if (playingElement) {
                playingElement.classList.add('playing');
            }
        }
    };

    closePlayer.addEventListener('click', function () {
        playerModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        pauseTrack();
    });

    playPauseBtn.addEventListener('click', function () {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    });

    prevBtn.addEventListener('click', function () {
        currentTrackIndex = (currentTrackIndex - 1 + allTracks.length) % allTracks.length;
        loadTrack(currentTrackIndex);
        playTrack();
    });

    nextBtn.addEventListener('click', function () {
        currentTrackIndex = (currentTrackIndex + 1) % allTracks.length;
        loadTrack(currentTrackIndex);
        playTrack();
    });

    progressBar.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });

    volumeSlider.addEventListener('input', function () {
        audioPlayer.volume = this.value;
    });

    audioPlayer.addEventListener('timeupdate', function () {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;

        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(duration);
    });

    audioPlayer.addEventListener('ended', function () {
        nextBtn.click();
    });

    function loadTrack(index) {
        const track = allTracks[index]; 
        audioPlayer.src = track.preview;
        playerTrackTitle.textContent = track.title;
        playerTrackArtist.textContent = track.artist;
        durationEl.textContent = track.duration;

        document.querySelectorAll('.track-item, .beat-card').forEach(item => {
            item.classList.remove('playing');
        });
        const playingElement = document.querySelector(`[data-track="${track.id}"]`);
        if (playingElement) {
            playingElement.classList.add('playing');
        }
    }

    function playTrack() {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function pauseTrack() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";

        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    playerModal.addEventListener('click', function (e) {
        if (e.target === playerModal) {
            playerModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            pauseTrack();
        }
    });
});