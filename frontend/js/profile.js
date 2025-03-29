import { getProfile, getRanking, getTotal, addLata, logOut } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    let sum = document.querySelector(".sum");
    let adder = document.querySelector(".adder");
    let total = document.querySelector(".total");
    let percentage = document.querySelector(".percent");
    let logOutButton = document.querySelector("#logout");

    async function updateProfile() {
        const data = await getProfile();
        if (data) {
            document.getElementById("userInfo").textContent = `Hola ${data.nickname}, has recolectado ${data.total_cans} latas. (${((data.total_cans * 100) / 60000).toFixed(4)}%)`;
        } else {
            logOut();
        }
    }



    async function updateTotal() {
        const data = await getTotal();
        if (data) {
            total.textContent = data.total;
            percentage.textContent = `${((data.total * 100) / 60000).toFixed(4)}%`;
        } else {
            alert("Error al obtener el total");
        }   
    }

    async function updateRanking() { 
        const ranking = await getRanking();
        if (ranking) {
            const rankingContainer = document.getElementById("ranking");
            rankingContainer.innerHTML = ""; 

            ranking.forEach((user, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${index + 1}. ${user.name} (${user.nickname}) - ${user.total_cans} latas`;
                rankingContainer.appendChild(listItem);
            });
        } else {
            alert("Error al cargar el ranking");
        }
    }

    async function handleAddLata() {
        let amount = Number(adder.value).toFixed(0);
        if (!amount || amount <= 0) { 
            alert("Ingrese datos validos");
            return;
        }
    
        const result = await addLata(amount);
        if (result) {
            adder.value = "";
            alert("Latas enviadas");
            await updateTotal();
            await updateProfile();
            await updateRanking();
        } else {
            alert("Error al agregar las latas");
        }
    }

    sum.addEventListener("click", handleAddLata);
    logOutButton.addEventListener("click", logOut);

    await updateTotal();
    await updateProfile();
    await updateRanking();
});






