const API_BASE = "https://recoge-latas-production.up.railway.app/api";
//const API_BASE = "http://localhost:8080/api";
export async function getProfile() {
  try {
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener el perfil");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getTotal() {
  try {
    const response = await fetch(`${API_BASE}/collects/total`);

    if (!response.ok) {
      throw new Error("Error al obtener el total");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function addLata(amount) {
  try {
    const response = await fetch(`${API_BASE}/collects/sum`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error("Error al agregar las latas");
    }
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

export async function getRanking() {
  try {
    const response = await fetch(`${API_BASE}/users/ranking`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener el ranking");
    }

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo ranking:", error);
    return [];
  }
}

export async function logOut() {
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }
  } catch (error) {
    console.error("Error cerrando sesión:", error);
  }
  window.location.href = "index.html";
}

export async function registerUser(name, nickname, password) {
  nickname = nickname.trim();
  password = password.trim();
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, nickname, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error al registrar el usuario");
    }

    return data;
  } catch (error) {
    console.error("Error registrando usuario:", error);
    throw error;
  }
}

export async function getAvailableNames() {
  try {
    const response = await fetch(`${API_BASE}/logs/available-names`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener nombres disponibles");
    }

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo nombres disponibles:", error);
    return [];
  }
}

export async function loginUser(nickname, password) {
  nickname = nickname.trim();
  password = password.trim();
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      document.getElementById("errorMsg").textContent = data.error;
      throw new Error("Error al iniciar sesión");
    }

    window.location = "profile.html";
    return data;
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    return null;
  }
}

export async function getGroup() {
  try {
    const response = await fetch(`${API_BASE}/groups/my-group`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener el grupo");
    }

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo el grupo:", error);
    return null;
  }
}

export async function getGroupRanking() {
  try {
    const response = await fetch(`${API_BASE}/groups/ranking`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener el ranking del grupo");
    }

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo el ranking del grupo:", error);
    return null;
  }
}

export async function getHistory() {
  try {
    const response = await fetch(`${API_BASE}/users/history`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener el ranking del grupo");
    }

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo el ranking del grupo:", error);
    return null;
  }
}

export async function deleteHistoryItem(id) {
  try {
    const response = await fetch(`${API_BASE}/users/history/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      alert("Error al eliminar elemento del historial");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al eliminar elemento del historial:", error);
    return null;
  }
}

export async function fetchUserStats() {
  try {
    const response = await fetch(`${API_BASE}/users/stats`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener estadísticas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo estadísticas");
    return null;
  }
}
