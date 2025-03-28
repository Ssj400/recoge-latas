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
            document.getElementById("userInfo").textContent = `Hola, ${data.nickname}. Has recolectado ${data.total_cans} latas.`;
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

document.addEventListener("DOMContentLoaded", getProfile);


document.getElementById("logout").addEventListener("click", logOut)

sum.addEventListener("click", addLata);

getTotal(); 
