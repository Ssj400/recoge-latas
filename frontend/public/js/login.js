import { loginUser } from "./api.js";

async function handleLogin() {

    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;

    if (!nickname || !password) {
        document.getElementById("errorMsg").textContent = "Por favor complete todos los campos";
        return;
    }

    try {
        await loginUser(nickname, password);
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        document.getElementById("errorMsg").textContent = error.message;
    }
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    handleLogin();
});


