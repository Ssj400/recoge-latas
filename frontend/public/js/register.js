// =============================================
// File: register.js
// Description: Registration functionality for the frontend.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================
import { registerUser, getAvailableNames } from "./api.js";

// Function to handle the registration process
async function handleRegister() {
  // Get the values from the input fields
  const name = document.getElementById("name").value;
  const nickname = document.getElementById("nickname").value;
  const password = document.getElementById("password").value;

  // Validate the input fields
  if (!name || !nickname || !password) {
    document.getElementById("errorMsg").textContent =
      "Por favor complete todos los campos";
    return;
  } else if (password.length < 6) {
    document.getElementById("errorMsg").textContent =
      "La contraseña debe tener al menos 6 caracteres";
    return;
  }
  // Attempt to register the user
  try {
    await registerUser(name, nickname, password);
    alert("Usuario registrado exitosamente");
    window.location = "index.html";
  } catch (error) {
    console.error("Error al registrar:", error);
    document.getElementById("errorMsg").textContent = error.message;
  }
}

// Function to load available names into the select dropdown
async function loadAvailableNames() {
  try {
    // Fetch the available names from the API
    const names = await getAvailableNames();
    const select = document.querySelector("select");

    // Iterate over the names and create option elements
    names.forEach((name) => {
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

// Add an event listener to load available names when the document is ready
document.addEventListener("DOMContentLoaded", loadAvailableNames);

// Add an event listener to the registration form to handle submission
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    document.getElementById("confirmPassword").value !==
    document.getElementById("password").value
  ) {
    document.getElementById("errorMsg").textContent =
      "Las contraseñas no coinciden";
  } else {
    handleRegister();
  }
});
