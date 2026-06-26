const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");

const ICON_PLAYING = "images/navbar/unmute.svg";
const ICON_MUTED = "images/navbar/volume-mute.svg";

let isPlaying = false;
let userHasInteracted = false;

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
        .catch(() => {
            // El navegador aún la bloqueó; se reintentará en el próximo gesto
        });
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

musicToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    userHasInteracted = true;

    if (isPlaying) {
        pauseMusic();
    } else {
        startMusic();
    }
});

// Estado inicial: ícono en "muted" hasta que arranque la música
setMusicIcon(false);