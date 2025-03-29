let sum = document.querySelector(".sum");
let adder = document.querySelector(".adder");
let total = document.querySelector(".total");
let percentage = document.querySelector(".percent")

async function getTotal() {
    
    try {
       const response = await fetch("http://localhost:3000/total");
       const data = await response.json();
       total.textContent = data.total;
       percentage.textContent = `${((data.total * 100) / 60000).toFixed(4)}%`;
    } catch (error) {
       alert("Error al obtener el total");
    }
}

async function addLata() {
    let amount = Number(adder.value).toFixed(0);
    if (!amount || amount <= 0 ) { 
        alert("Ingrese datos validos");
        return;
    }
    

    try {
        const response = await fetch("http://localhost:3000/sum", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ amount }) 
        });

        if (!response.ok) {
            throw new Error("Error al agregar las latas");
        }
        adder.value = "";
        alert("Latas enviadas");

        await getTotal();
        await getProfile();
        await getRanking();
    } catch (error) {
        console.error("Error:", error);
    }
    
    

}

async function getProfile() {

    try {
        const res = await fetch("http://localhost:3000/profile", {
            method: "GET",
            credentials: "include", 
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById("userInfo").textContent = `Hola ${data.nickname}, has recolectado ${data.total_cans} latas. (${((data.total_cans * 100) / 60000).toFixed(4)}%)`;
        } else {
            logOut();
            window.location.href = "index.html"; 
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function logOut () {
    try {
        await fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include",
        });

        console.log("Sesión cerrada");
    } catch (error) {
        console.error("Error:", error);
    }
    window.location.href = "index.html";
}

async function getRanking() {
    try {
        const res = await fetch("http://localhost:3000/ranking", {
            method: "GET",
            credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
            const rankingContainer = document.getElementById("ranking");
            rankingContainer.innerHTML = ""; 

            data.forEach((user, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${index + 1}. ${user.name} (${user.nickname}) - ${user.total_cans} latas`;
                rankingContainer.appendChild(listItem);
            });
        } else {
            console.error("Error al cargar el ranking");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getProfile();
    getRanking();
    getTotal(); 
});


document.getElementById("logout").addEventListener("click", logOut)

sum.addEventListener("click", async () => {
    addLata();
});



