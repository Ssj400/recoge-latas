import {
  getProfile,
  getRanking,
  getTotal,
  addLata,
  logOut,
  getGroup,
  getGroupRanking,
  getHistory,
  deleteHistoryItem,
  renderUserChart,
} from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  let sum = document.querySelector(".sum");
  let adder = document.querySelector(".adder");
  let total = document.querySelector(".total");
  let percentage = document.querySelector(".percent");
  let logOutButton = document.querySelectorAll("#logout");
  let nickname = "";
  let firstPlace = false;
  let userChart;

  async function updateProfile() {
    const data = await getProfile();

    if (!data) {
      logOut();
      return;
    }

    if (data.last === true) {
      document.getElementById("placeMsg").textContent =
        "Eres el último en la lista, ¡anímate a recolectar más latas!";
    }
    nickname = data.nickname;
    document.getElementById("userInfo").textContent = `Hola ${
      data.nickname
    }, has recolectado ${data.total_cans} latas. (${(
      (data.total_cans * 100) /
      2000
    ).toFixed(4)}% de lo que se espera de ti)`;
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
      origin: { y: 0.6 },
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
        listItem.textContent = `${index + 1}. ${user.name} (${
          user.nickname
        }) - ${user.total_cans} latas`;
        if (index === 0) {
          listItem.textContent = `${index + 1}. ${user.name} (${
            user.nickname
          }) - ${user.total_cans} latas 👑`;
        } else if (index == 1) {
          listItem.textContent = `${index + 1}. ${user.name} (${
            user.nickname
          }) - ${user.total_cans} latas 🥈`;
        } else if (index == 2) {
          listItem.textContent = `${index + 1}. ${user.name} (${
            user.nickname
          }) - ${user.total_cans} latas 🥉`;
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
      total.classList.add("lataAdded");
      await updateTotal();
      await updateProfile();
      await updateRanking();
      await updateGroup();
      await updateGroupRanking();
      await updateHistory();
      await getUserChart();

      launchConfetti();

      setTimeout(() => {
        total.classList.remove("lataAdded");
      }, 1000);
    } else {
      alert("Error al agregar las latas");
    }
  }

  async function updateGroup() {
    const groupData = await getGroup();
    if (groupData) {
      const groupContainer = document.getElementById("group");
      groupContainer.innerHTML = "";

      groupContainer.textContent = `${groupData.grupo} - Total de latas: ${groupData.total_latas} - Integrantes: ${groupData.integrantes}.`;
    } else {
      alert("Error al cargar el grupo");
    }
  }

  async function updateGroupRanking() {
    const groupRanking = await getGroupRanking();

    if (groupRanking) {
      const groupRankingContainer = document.getElementById("groupRanking");
      groupRankingContainer.innerHTML = "";

      groupRanking.forEach((user, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("ranking-item");
        listItem.textContent = `${index + 1}. ${user.name} (${
          user.nickname
        }) - ${user.total_cans} latas`;
        groupRankingContainer.appendChild(listItem);
      });
    } else {
      alert("Error al cargar el ranking del grupo");
    }
  }

  async function updateHistory() {
    const history = await getHistory();
    const historyContainer = document.querySelector(".history");
    historyContainer.innerHTML = "";

    history.forEach((item, index) => {
      const date = item.timestamp.split("T");
      const listItem = document.createElement("li");
      const deleteButton = document.createElement("button");

      listItem.classList.add("history-item");
      listItem.textContent = `${item.action} - ${date[0]}`;

      deleteButton.classList.add("delete-history");
      deleteButton.textContent = "X";
      deleteButton.setAttribute("data-id", item.id);

      deleteButton.addEventListener("click", async () => {
        if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
          await deleteHistoryItem(item.id);
          await updateTotal();
          await updateProfile();
          await updateRanking();
          await updateGroup();
          await updateGroupRanking();
          await updateHistory();
          await getUserChart();
        }
      });
      listItem.appendChild(deleteButton);

      historyContainer.appendChild(listItem);
    });
  }

  async function getUserChart(range = "7") {
    const data = await renderUserChart();
    if (!data) return;

    let filteredData = data;

    if (range !== "all") {
      const amount = Number(range);
      filteredData = data.slice(-amount);
    }

    const labels = filteredData.map((entry) => entry.date.split("T")[0]);
    const values = filteredData.map((entry) => Number(entry.total));

    const ctx = document.getElementById("userChart").getContext("2d");

    if (userChart) {
      userChart.data.labels = labels;
      userChart.data.datasets[0].data = values;
      userChart.update();
    } else {
      userChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Latas recolectadas por día",
              data: values,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          mantainAspectRatio: true,
          aspectRatio: 2,
          responsive: true,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }
  }

  sum.addEventListener("click", handleAddLata);

  adder.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLata();
    }
  });

  logOutButton.forEach((item) => {
    item.addEventListener("click", logOut);
  });

  await updateTotal();
  await updateProfile();
  await updateRanking();
  await updateGroup();
  await updateGroupRanking();
  await updateHistory();
  await getUserChart();

  if (firstPlace) {
    document.getElementById("placeMsg").textContent =
      "¡Felicidades, eres el primero en la lista!";
    document.getElementById("placeMsg").style.color = "gold";
  }

  document
    .getElementById("daysSelect")
    .addEventListener("change", async (e) => {
      await getUserChart(e.target.value);
    });
});

window.addEventListener("load", () => {
  let loader = document.querySelector(".preloader");
  loader.style.display = "none";
  document.body.classList.add("loaded");
});
