
// ==========================================================
// PARA JOSS — FUNCIONES DEL DIARIO
// ==========================================================

// Contenido provisional.
// Aquí incorporaremos los poemas originales posteriormente.

const poemas = {
    quimica: {
        categoria: "POEMA · QUÍMICA",
        titulo: "La química de lo que siento",
        texto: `Hay cosas que la ciencia puede nombrar,
medir y explicar.

La dopamina, la oxitocina,
los pequeños movimientos invisibles
que acompañan una emoción.

Pero ninguna fórmula alcanza
para contar por completo
lo que una persona puede despertar
en el mundo de alguien más.

Este espacio queda reservado
para el poema original.`
    },

    silencios: {
        categoria: "POEMA · NOSTALGIA",
        titulo: "Lo que guardan los silencios",
        texto: `Hay recuerdos que encuentran la forma
de volver en los momentos más tranquilos.

No hacen ruido.
Solo se quedan un instante
y nos recuerdan que algo fue importante.

Aquí irá el poema original.`
    },

    detalles: {
        categoria: "POEMA · CARIÑO",
        titulo: "Las cosas que te hacen tú",
        texto: `A veces son los detalles pequeños
los que terminan ocupando
las páginas más grandes.

Una sonrisa, una mirada,
una forma particular de ser.

Aquí irá el poema original.`
    }
};


// ==========================================================
// ELEMENTOS DEL MODAL
// ==========================================================

const modal = document.getElementById("poemModal");
const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");


// ==========================================================
// ABRIR POEMAS
// ==========================================================

function abrirPoema(id) {

    const poema = poemas[id];

    if (!poema) return;

    modalTitle.textContent = poema.titulo;
    modalCategory.textContent = poema.categoria;
    modalBody.textContent = poema.texto;

    modal.classList.add("open");

    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    modalClose.focus();
}


// ==========================================================
// CERRAR POEMAS
// ==========================================================

function cerrarPoema() {

    modal.classList.remove("open");

    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
}


// Botones para abrir poemas

document.querySelectorAll("[data-poem]").forEach(button => {

    button.addEventListener("click", () => {

        abrirPoema(button.dataset.poem);

    });

});


// Botón de cerrar

modalClose.addEventListener("click", cerrarPoema);


// Cerrar al pulsar fuera del contenido

modal.querySelectorAll("[data-close-modal]").forEach(element => {

    element.addEventListener("click", cerrarPoema);

});


// Cerrar con Escape

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        modal.classList.contains("open")
    ) {

        cerrarPoema();

    }

});


// ==========================================================
// MENÚ RESPONSIVE
// ==========================================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {

    const abierto = mainNav.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(abierto)
    );

});


// Cerrar menú al seleccionar una sección

mainNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        mainNav.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


// ==========================================================
// FILTROS DEL ÁLBUM DE POEMAS
// ==========================================================

const filterButtons = document.querySelectorAll(".filter-button");
const poemCards = document.querySelectorAll(".poem-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Quitar selección anterior

        filterButtons.forEach(item => {

            item.classList.remove("active");

        });

        // Activar filtro seleccionado

        button.classList.add("active");

        const filtro = button.dataset.filter;

        // Mostrar u ocultar poemas

        poemCards.forEach(card => {

            const categoria = card.dataset.category;

            const mostrar =
                filtro === "todos" ||
                categoria === filtro;

            card.hidden = !mostrar;

        });

    });

});


// ==========================================================
// NAVEGACIÓN ACTIVA AL DESPLAZARSE
// ==========================================================

const navLinks = [
    ...document.querySelectorAll(".nav-link")
];

const sections = [
    ...document.querySelectorAll("main section[id]")
];

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            navLinks.forEach(link => {

                const coincide =
                    link.getAttribute("href") ===
                    `#${entry.target.id}`;

                link.classList.toggle(
                    "active",
                    coincide
                );

            });

        }

    });

}, {
    rootMargin: "-35% 0px -55% 0px"
});


// Observar todas las secciones

sections.forEach(section => {

    observer.observe(section);

});
