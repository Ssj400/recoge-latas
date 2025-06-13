// =============================================
// File: api.js
// Description: Handles API requests and manages the express application with the routes folders.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

// Define the base URL for the API based on the environment
const isLocalhost = window.location.hostname === "localhost";
const API_BASE = isLocalhost
  ? "http://localhost:8080/api"
  : "https://recoge-latas-production.up.railway.app/api";

// Function to get the profile of the logged-in user
export async function getProfile() {
  try {
    // Fetch the user profile from the API
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: "GET",
      credentials: "include",
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al obtener el perfil");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

//Function to get the total number of cans collected
export async function getTotal() {
  try {
    // Fetch the total number of cans collected from the API
    const response = await fetch(`${API_BASE}/collects/total`);

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al obtener el total");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Function to add a new can collection
export async function addLata(amount) {
  try {
    // Post the amount of cans collected to the API
    const response = await fetch(`${API_BASE}/collects/sum`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al agregar las latas");
    }
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

// Function to get the ranking of users
export async function getRanking() {
  try {
    // Fetch the ranking of users from the API
    const response = await fetch(`${API_BASE}/users/ranking`, {
      method: "GET",
      credentials: "include",
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al obtener el ranking");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo ranking:", error);
    return [];
  }
}

// Function to log out the user
export async function logOut() {
  try {
    // Send a POST request to the logout endpoint
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }
  } catch (error) {
    console.error("Error cerrando sesión:", error);
  }
  // Redirect to the index page after logging out
  window.location.href = "index.html";
}

// Function to register a new user
export async function registerUser(name, nickname, password) {
  // Trim whitespace from the input fields
  nickname = nickname.trim();
  password = password.trim();
  try {
    // Post the user registration data to the API
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, nickname, password }),
    });

    // Parse the JSON response
    const data = await response.json();

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al registrar el usuario");
    }

    return data;
  } catch (error) {
    console.error("Error registrando usuario:", error);
    throw error;
  }
}

// Function to get available names for registration
export async function getAvailableNames() {
  try {
    // Fetch the available names from the API
    const response = await fetch(`${API_BASE}/logs/available-names`, {
      method: "GET",
      credentials: "include",
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al obtener nombres disponibles");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo nombres disponibles:", error);
    return [];
  }
}

// Function to log in a user
export async function loginUser(nickname, password) {
  // Trim whitespace from the input fields
  nickname = nickname.trim();
  password = password.trim();
  try {
    // Post the login data to the API
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, password }),
    });
    const data = await response.json();

    // If the response is not OK, display an error message and throw an error
    if (!response.ok) {
      document.getElementById("errorMsg").textContent = data.error;
      throw new Error("Error al iniciar sesión");
    }

    // If login is successful, redirect to the profile page
    window.location = "profile.html";
    return data;
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    return null;
  }
}

// Function to get the group information
export async function getGroup() {
  try {
    // Fetch the group information from the API
    const response = await fetch(`${API_BASE}/groups/my-group`, {
      method: "GET",
      credentials: "include",
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al obtener el grupo");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo el grupo:", error);
    return null;
  }
}

// Function to get the group ranking
export async function getGroupRanking() {
  try {
    // Fetch the group ranking from the API
    const response = await fetch(`${API_BASE}/groups/ranking`, {
      method: "GET",
      credentials: "include",
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al obtener el ranking del grupo");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo el ranking del grupo:", error);
    return null;
  }
}

// Function to get the history of collected cans
export async function getHistory() {
  try {
    // Fetch the user's history from the API
    const response = await fetch(`${API_BASE}/users/history`, {
      method: "GET",
      credentials: "include",
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al obtener el ranking del grupo");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo el ranking del grupo:", error);
    return null;
  }
}

// Function to delete a history item by its ID
export async function deleteHistoryItem(id) {
  try {
    // Send a DELETE request to the API to remove the history item
    const response = await fetch(`${API_BASE}/users/history/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    // If the response is not OK, alert the user
    if (!response.ok) {
      alert("Error al eliminar elemento del historial");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar elemento del historial:", error);
    return null;
  }
}

// Function to fetch user statistics
export async function fetchUserStats() {
  try {
    // Fetch user statistics from the API
    const response = await fetch(`${API_BASE}/users/stats`, {
      credentials: "include",
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al obtener estadísticas");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo estadísticas");
    return null;
  }
}

// Function to get the weekly ranking of users
export async function getWeeklyRanking() {
  try {
    // Fetch the weekly ranking of users from the API
    const response = await fetch(`${API_BASE}/users/ranking-weekly`, {
      credentials: "include",
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al obtener el ranking semanal");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo el ranking semanal");
    return null;
  }
}

// Function to get the weekly ranking of groups
export async function getGroupRankingWeekly() {
  try {
    // Fetch the weekly ranking of groups from the API
    const response = await fetch(`${API_BASE}/groups/ranking-weekly`, {
      method: "GET",
      credentials: "include",
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error("Error al obtener el ranking semanal del grupo");
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo el ranking semanal del grupo:", error);
    return null;
  }
}
