import { registerUser,  getAvailableNames } from "./api.js";

async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;

    try {
        await registerUser(name, nickname, password);
        alert("Usuario registrado exitosamente");
        window.location.replace("index.html");
    } catch (error) {
        console.error("Error al registrar:", error);
        alert("Error al registrar el usuario");
    }
}

async function loadAvailableNames () {
    try {
        const names = await getAvailableNames();
        const select = document.querySelector("select");
    
        names.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar nombres disponibles:", error);
        alert("Error al cargar nombres disponibles");
    }
}

document.addEventListener("DOMContentLoaded", loadAvailableNames);

document.getElementById("registerForm").addEventListener("submit", handleRegister); 