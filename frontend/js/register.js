import { registerUser,  getAvailableNames } from "./api.js";

async function handleRegister() {

    const name = document.getElementById("name").value;
    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;

    if (!name || !nickname || !password) {
        document.getElementById("errorMsg").textContent = "Por favor complete todos los campos";
        return;
    } else if (password.length < 6) {
        document.getElementById("errorMsg").textContent = "La contraseña debe tener al menos 6 caracteres";
        return;
    }
    try {
        await registerUser(name, nickname, password);
        alert("Usuario registrado exitosamente");
        window.location = "index.html";
    } catch (error) {
        console.error("Error al registrar:", error);
        document.getElementById("errorMsg").textContent = error.message;
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

document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (document.getElementById("confirmPassword").value !== document.getElementById("password").value) {
        document.getElementById("errorMsg").textContent = "Las contraseñas no coinciden";   
    } else {
        handleRegister()
    }
}); 