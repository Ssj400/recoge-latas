let sum = document.querySelector(".sum");
let adder = document.querySelector(".adder");
let total = document.querySelector(".total");
let percentage = document.querySelector(".percent")

async function getTotal() {
    
    try {
       const response = await fetch("http://172.26.30.21:3000/total");
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
        const response = await fetch("http://172.26.30.21:3000/sum", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ "user_id": 1, amount }) 
        });

        if (!response.ok) {
            throw new Error("Error al agregar las latas");
        }
        adder.value = "";
        alert("Latas enviadas");
        await getTotal();
    } catch (error) {
        console.error("Error:", error);
    }
    
    

}

sum.addEventListener("click", addLata);

getTotal(); 
