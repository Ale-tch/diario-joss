
document.addEventListener("DOMContentLoaded", () => {

    const loginSection = document.getElementById("loginSection");
    const adminSection = document.getElementById("adminSection");

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    const contentForm = document.getElementById("contentForm");
    const saveMessage = document.getElementById("saveMessage");

    const logoutButton = document.getElementById("logoutButton");
    const contentList = document.getElementById("contentList");

    // Mostrar mensajes
    function mostrarMensaje(elemento, mensaje, error = false) {
        elemento.textContent = mensaje;
        elemento.style.color = error ? "#e58b8b" : "#9bd6a3";
    }

    // Mostrar panel de administración
    function mostrarPanel() {
        loginSection.classList.add("admin-hidden");
        adminSection.classList.remove("admin-hidden");
    }

    // Mostrar inicio de sesión
    function mostrarLogin() {
        adminSection.classList.add("admin-hidden");
        loginSection.classList.remove("admin-hidden");
    }

    // Verificar sesión al cargar la página
    async function verificarSesion() {
        try {
            const respuesta = await fetch("/api/login", {
                method: "GET",
                credentials: "include"
            });

            if (respuesta.ok) {
                mostrarPanel();
                cargarContenido();
            } else {
                mostrarLogin();
            }

        } catch (error) {
            mostrarLogin();
            mostrarMensaje(
                loginMessage,
                "No se pudo conectar con el servidor.",
                true
            );
        }
    }

    // Iniciar sesión
    loginForm.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const password = document.getElementById("password").value;

        mostrarMensaje(loginMessage, "Verificando acceso...");

        try {
            const respuesta = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ password })
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || "Contraseña incorrecta.");
            }

            loginForm.reset();
            mostrarPanel();
            cargarContenido();

        } catch (error) {
            mostrarMensaje(loginMessage, error.message, true);
        }
    });

    // Cerrar sesión
    logoutButton.addEventListener("click", async () => {
        try {
            const respuesta = await fetch("/api/logout", {
                method: "POST",
                credentials: "include"
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo cerrar la sesión.");
            }

            mostrarLogin();
            loginForm.reset();

            mostrarMensaje(loginMessage, "Sesión cerrada correctamente.");

        } catch (error) {
            mostrarMensaje(saveMessage, error.message, true);
        }
    });

    // Guardar un escrito
    contentForm.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const contenido = {
            tipo: document.getElementById("contentType").value,
            titulo: document.getElementById("contentTitle").value.trim(),
            fecha: document.getElementById("contentDate").value,
            contenido: document.getElementById("contentText").value.trim()
        };

        if (!contenido.titulo || !contenido.contenido || !contenido.fecha) {
            mostrarMensaje(saveMessage, "Completa todos los campos.", true);
            return;
        }

        mostrarMensaje(saveMessage, "Guardando escrito...");

        try {
            const respuesta = await fetch("/api/guardar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(contenido)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || "No se pudo guardar.");
            }

            contentForm.reset();

            mostrarMensaje(saveMessage, "Escrito guardado correctamente.");

            cargarContenido();

        } catch (error) {
            mostrarMensaje(saveMessage, error.message, true);
        }
    });

    // Cargar escritos guardados
    async function cargarContenido() {
        contentList.textContent = "Cargando escritos...";

        try {
            const respuesta = await fetch("/api/contenido", {
                method: "GET",
                credentials: "include"
            });

            if (!respuesta.ok) {
                throw new Error("No se pudieron cargar los escritos.");
            }

            const resultado = await respuesta.json();

            const escritos = resultado.contenidos || [];

            contentList.replaceChildren();

            if (escritos.length === 0) {
                contentList.textContent = "Todavía no hay escritos guardados.";
                return;
            }

            escritos.forEach((escrito) => {
                const articulo = document.createElement("article");
                const titulo = document.createElement("h4");
                const tipo = document.createElement("p");
                const fecha = document.createElement("p");
                const texto = document.createElement("p");

                titulo.textContent = escrito.titulo;
                tipo.textContent = "Tipo: " + escrito.tipo;
                fecha.textContent = "Fecha: " + escrito.fecha;
                texto.textContent = escrito.contenido;

                articulo.append(titulo, tipo, fecha, texto);
                articulo.style.marginBottom = "25px";

                contentList.appendChild(articulo);
            });

        } catch (error) {
            contentList.textContent = error.message;
        }
    }

    // Fecha actual por defecto
    const campoFecha = document.getElementById("contentDate");

    if (campoFecha) {
        campoFecha.value = new Date().toISOString().split("T")[0];
    }

    // Comprobar sesión
    verificarSesion();

});
