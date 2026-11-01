// Para tener a lado la funcionalidad a en index

emailjs.init('_eiNVkopT8ffSluNZ');

const serviceID = 'default_service';
const templateID = 'template_yksmy3u';

// --- Toast ---
const ICONS = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill'
};

function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast-notif toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <i class="bi ${ICONS[type]} toast-icon"></i>
        <span class="toast-msg"></span>
        <button class="toast-close" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>
    `;
    // textContent evita inyectar HTML con mensajes dinámicos
    toast.querySelector('.toast-msg').textContent = message;

    const remove = () => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    toast.querySelector('.toast-close').addEventListener('click', remove);
    container.appendChild(toast);
    setTimeout(remove, duration);
}

// --- Formulario ---
const form = document.getElementById('contact-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    if (btn) btn.disabled = true; // evita envíos dobles

    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            showToast('¡Mensaje enviado con éxito!', 'success');
            form.reset();
        })
        .catch((error) => {
            console.error(error);
            showToast('No se pudo enviar el mensaje. Intenta de nuevo.', 'error');
        })
        .finally(() => {
            if (btn) btn.disabled = false;
        });
});
