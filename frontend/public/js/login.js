// =============================================
// File: login.js
// Description: Login functionality for the frontend.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

import { loginUser } from "./api.js";

// Function to handle the login process
async function handleLogin() {
  // Declare the loader element and get the nickname and password values
  let loader = document.querySelector(".loader");
  const nickname = document.getElementById("nickname").value;
  const password = document.getElementById("password").value;

  //Show the loader while processing the login
  loader.classList.remove("hidden");

  // Validate the input fields
  if (!nickname || !password) {
    document.getElementById("errorMsg").textContent =
      "Por favor complete todos los campos";
    loader.classList.add("hidden");
    return;
  }

  // Attempt to log in the user
  try {
    await loginUser(nickname, password);
  } catch (error) {
    // Handle any errors that occur during login
    console.error("Error al iniciar sesión:", error);
    document.getElementById("errorMsg").textContent = error.message;
  } finally {
    loader.classList.add("hidden");
  }
}

// Add an event listener to the login form to handle submission
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  handleLogin();
});
