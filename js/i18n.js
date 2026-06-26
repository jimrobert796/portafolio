let currentTranslations = {};

async function loadLanguage(lang) {
    try {
        const res = await fetch(`lang/${lang}.json`);
        const newTranslations = await res.json();

        // 1. Fade out
        fadeOutTexts();

        // 2. Espera a que termine la transición antes de cambiar el contenido
        setTimeout(() => {
            currentTranslations = newTranslations;
            applyTranslations();
            fadeInTexts();

            document.documentElement.lang = lang;
            document.querySelector(".lang-current").textContent = lang.toUpperCase();
            localStorage.setItem("preferredLang", lang);
        }, 250); // debe coincidir con la duración del CSS (0.25s)

    } catch (err) {
        console.error("No se pudo cargar el idioma:", lang, err);
    }
}

function fadeOutTexts() {
    document.querySelectorAll("[data-i18n], [data-i18n-placeholder]").forEach(el => {
        el.classList.add("i18n-fading");
    });
}

function fadeInTexts() {
    document.querySelectorAll("[data-i18n], [data-i18n-placeholder]").forEach(el => {
        el.classList.remove("i18n-fading");
    });
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (currentTranslations[key] !== undefined) {
            el.textContent = currentTranslations[key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (currentTranslations[key] !== undefined) {
            el.placeholder = currentTranslations[key];
        }
    });
}

function getInitialLanguage() {
    const saved = localStorage.getItem("preferredLang");
    if (saved) return saved;

    const browserLang = navigator.language.slice(0, 2);
    return ["es", "en"].includes(browserLang) ? browserLang : "es";
}

document.getElementById("lang-toggle").addEventListener("click", (e) => {
    e.preventDefault();
    const current = localStorage.getItem("preferredLang") || "es";
    const next = current === "es" ? "en" : "es";
    loadLanguage(next);
});

// Primera carga: sin fade, para que no haya parpadeo al entrar a la página
window.addEventListener("DOMContentLoaded", async () => {
    const lang = getInitialLanguage();
    const res = await fetch(`lang/${lang}.json`);
    currentTranslations = await res.json();
    applyTranslations();
    document.documentElement.lang = lang;
    document.querySelector(".lang-current").textContent = lang.toUpperCase();
});