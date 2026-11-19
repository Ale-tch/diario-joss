
import crypto from "node:crypto";

const DURACION_SESION = 60 * 60 * 24 * 7;

function crearFirma(expiracion) {
    return crypto
        .createHmac("sha256", process.env.SESSION_SECRET)
        .update(String(expiracion))
        .digest("hex");
}

function compararFirmas(a, b) {
    const firmaA = Buffer.from(a);
    const firmaB = Buffer.from(b);

    return firmaA.length === firmaB.length &&
        crypto.timingSafeEqual(firmaA, firmaB);
}

function obtenerSesion(req) {
    const cookies = req.headers.cookie || "";

    const cookie = cookies
        .split(";")
        .map(item => item.trim())
        .find(item => item.startsWith("joss_session="));

    if (!cookie) return false;

    const valor = decodeURIComponent(cookie.split("=")[1]);
    const [expiracion, firma] = valor.split(".");

    if (!expiracion || !firma) return false;
    if (!/^\d+$/.test(expiracion)) return false;
    if (Number(expiracion) < Math.floor(Date.now() / 1000)) {
        return false;
    }

    const firmaCorrecta = crearFirma(expiracion);

    return compararFirmas(firma, firmaCorrecta);
}

function responder(res, estado, datos) {
    return res.status(estado).json(datos);
}

export default function handler(req, res) {

    if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
        return responder(res, 500, {
            mensaje: "Falta configurar la autenticación en Vercel."
        });
    }

    if (req.method === "GET") {
        if (obtenerSesion(req)) {
            return responder(res, 200, {
                autenticado: true
            });
        }

        return responder(res, 401, {
            autenticado: false
        });
    }

    if (req.method === "POST") {
        const { password } = req.body || {};

        if (
            typeof password !== "string" ||
            password.length === 0 ||
            password.length > 256
        ) {
            return responder(res, 400, {
                mensaje: "Introduce una contraseña válida."
            });
        }

        const contrasenaCorrecta =
            Buffer.from(process.env.ADMIN_PASSWORD);

        const contrasenaIngresada = Buffer.from(password);

        const esCorrecta =
            contrasenaCorrecta.length === contrasenaIngresada.length &&
            crypto.timingSafeEqual(
                contrasenaCorrecta,
                contrasenaIngresada
            );

        if (!esCorrecta) {
            return responder(res, 401, {
                mensaje: "Contraseña incorrecta."
            });
        }

        const expiracion =
            Math.floor(Date.now() / 1000) + DURACION_SESION;

        const firma = crearFirma(expiracion);

        const valorCookie = `${expiracion}.${firma}`;

        const secure = process.env.NODE_ENV === "production"
            ? "Secure;"
            : "";

        res.setHeader(
            "Set-Cookie",
            `joss_session=${valorCookie}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=${DURACION_SESION}`
        );

        return responder(res, 200, {
            mensaje: "Acceso autorizado."
        });
    }

    res.setHeader("Allow", ["GET", "POST"]);

    return responder(res, 405, {
        mensaje: "Método no permitido."
    });
}
