import { loginUser } from "./api.js";

async function handleLogin() {
    let loader = document.querySelector(".loader");
    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;
    loader.classList.remove("hidden")

    if (!nickname || !password) {
        document.getElementById("errorMsg").textContent = "Por favor complete todos los campos";
        loader.classList.add("hidden");
        return;
    }

    try {
        await loginUser(nickname, password);
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        document.getElementById("errorMsg").textContent = error.message;
    } finally {
        loader.classList.add("hidden");
    }
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    handleLogin();
});


