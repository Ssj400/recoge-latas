import { getProfile, getRanking, getTotal, addLata, logOut } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    let sum = document.querySelector(".sum");
    let adder = document.querySelector(".adder");
    let total = document.querySelector(".total");
    let percentage = document.querySelector(".percent");
    let logOutButton = document.querySelector("#logout");
    let nickname = "";
    let firstPlace = false;

    async function updateProfile() {
        const data = await getProfile();
        
        if (!data) {
            logOut();
            return;
        }

        if (data.last === true) {
            document.getElementById("placeMsg").textContent = "Eres el último en la lista, ¡anímate a recolectar más latas!";
        }
        nickname = data.nickname;
        document.getElementById("userInfo").textContent = `Hola ${data.nickname}, has recolectado ${data.total_cans} latas. (${((data.total_cans * 100) / 2000).toFixed(4)}% de lo que se espera de ti)`;
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


    function launchConfetti() {
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.6 }
        });
    }

    async function updateRanking() { 
        const ranking = await getRanking();
        if (ranking) {
            const rankingContainer = document.getElementById("ranking");
            rankingContainer.innerHTML = ""; 

            ranking.forEach((user, index) => {
                const listItem = document.createElement("li");
                listItem.classList.add("ranking-item");
                listItem.textContent = `${index + 1}. ${user.name} (${user.nickname}) - ${user.total_cans} latas`;
                if (index === 0) {
                    listItem.textContent = `${index + 1}. ${user.name} (${user.nickname}) - ${user.total_cans} latas 👑`;
                } else if (index == 1) {
                    listItem.textContent = `${index + 1}. ${user.name} (${user.nickname}) - ${user.total_cans} latas 🥈`;

                } else if (index == 2) {
                    listItem.textContent = `${index + 1}. ${user.name} (${user.nickname}) - ${user.total_cans} latas 🥉`;
                } 
                rankingContainer.appendChild(listItem);
            });

            if (nickname === ranking[0].nickname) {
                firstPlace = true;
            }
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
    adder.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddLata();
        }
    });
    logOutButton.addEventListener("click", logOut);


    await updateTotal();
    await updateProfile();
    await updateRanking(); 

    
    launchConfetti();
    if (firstPlace) {
        document.getElementById("placeMsg").textContent = "¡Felicidades, eres el primero en la lista!";
        document.getElementById("placeMsg").style.color = "gold";
    }
});

window.addEventListener("load", () => {
    let loader = document.querySelector(".preloader");
    loader.style.display = "none"
    document.body.classList.add("loaded");
})






