let sum = document.querySelector(".sum");
let adder = document.querySelector(".adder");
let total = document.querySelector(".total");
let percentage = document.querySelector(".percent")

async function getTotal() {
    try {
       const response = await fetch("http://192.168.158.107:3000/total");
       const data = await response.json();
       total.textContent = data.total;
       percentage.textContent = `${((data.total * 100) / 60000).toFixed(4)}%`;
    } catch (error) {
       alert(error);
    }
}

async function addLata() {
    let amount = adder.value;
    if (!amount || amount == "0") { alert("Ingrese datos validos") }
    
    await fetch("http://192.168.158.107:3000/sum", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ amount }) 
    });
    
    adder.value = "";
    alert("Latas enviadas");

    getTotal();
}

sum.addEventListener("click", addLata);
