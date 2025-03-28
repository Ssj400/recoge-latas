async function registerUser() {
    const nickname = document.getElementById("nickname").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/register", {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  name, nickname, password })
        
    })

    console.log( JSON.stringify({ name, nickname, password }))
    const data = await response.json();
    if (response.ok) {
        alert(`Registro exitoso`);

        window.location.replace("index.html");
    } else {
        alert(`Error ${data.error}`);
    }
}

async function loadAvailableNames() {
    
    try {
    const res = await fetch("http://localhost:3000/available-names",  {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error("Error al obtener nombre", res.statusText);
    }

    const data = await res.json();
    const select = document.querySelector("select");

    data.forEach(name => {
        const newName = document.createElement("option");
        newName.value = name;
        newName.textContent = name;
        select.appendChild(newName);
    }); 
    
    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadAvailableNames);


document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    registerUser();
})