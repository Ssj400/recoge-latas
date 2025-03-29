import { loginUser } from "./api.js";

async function handleLogin(e) { 
    e.preventDefault();

    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;

    try {
        await loginUser(nickname, password);
        window.location.replace("profile.html");
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        document.getElementById("errorMsg").textContent = error.message;
    }
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);


