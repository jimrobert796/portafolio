const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");

const ICON_PLAYING = "images/navbar/unmute.svg";
const ICON_MUTED = "images/navbar/volume-mute.svg";

let isPlaying = false;
let userHasInteracted = false;

// ========== SFX ==========
const sfxClick = new Audio("audio/click.mp3");
sfxClick.volume = 0.3;

const sfxHover = new Audio("audio/hover.mp3");
sfxHover.volume = 0.2;

const sfxMute = new Audio("audio/mute.mp3");
sfxMute.volume = 0.3;

const sfxUnmute = new Audio("audio/unmute.mp3");
sfxUnmute.volume = 0.3;

function playSFX(audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
}
// ========== FIN SFX ==========

function setMusicIcon(playing) {
    musicIcon.src = playing ? ICON_PLAYING : ICON_MUTED;
}

function startMusic() {
    if (isPlaying) return;

    bgMusic.volume = 0.35;

    bgMusic.play()
        .then(() => {
            isPlaying = true;
            setMusicIcon(true);
        })
        .catch(() => {});
}

function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    setMusicIcon(false);
}

function handleFirstInteraction() {
    if (userHasInteracted) return;

    userHasInteracted = true;
    startMusic();

    document.removeEventListener("click", handleFirstInteraction);
    document.removeEventListener("scroll", handleFirstInteraction);
    document.removeEventListener("keydown", handleFirstInteraction);
}

document.addEventListener("click", handleFirstInteraction);
document.addEventListener("scroll", handleFirstInteraction, { passive: true });
document.addEventListener("keydown", handleFirstInteraction);

// ========== SFX EN ENLACES Y BOTONES ==========

// Click en enlaces y botones
document.addEventListener("click", (e) => {
    const target = e.target.closest("a, button");

    if (target) {
        // No reproducir click en el botón de música
        if (target.id === "music-toggle") return;

        playSFX(sfxClick);
    }
});

// Hover en enlaces y botones
document.addEventListener(
    "mouseenter",
    (e) => {
        const target = e.target.closest("a, button");

        if (target) {
            // No reproducir hover en el botón de música
            if (target.id === "music-toggle") return;

            playSFX(sfxHover);
        }
    },
    true
);

// ========== BOTÓN DE MÚSICA ==========

musicToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    userHasInteracted = true;

    if (isPlaying) {
        // Sonido al apagar
        playSFX(sfxMute);
        pauseMusic();
    } else {
        // Encender música
        startMusic();

        // Sonido al activar
        playSFX(sfxUnmute);
    }
});

musicToggle.addEventListener("mouseenter", () => {
    playSFX(sfxHover);
});

// ========== ESTADO INICIAL ==========
setMusicIcon(false);