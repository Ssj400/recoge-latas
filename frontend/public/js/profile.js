// =============================================
// File: profile.js
// Description: Profile management functionality for the frontend.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================
import {
  getProfile,
  getRanking,
  getTotal,
  addLata,
  logOut,
  getGroup,
  getGroupRanking,
  getGroupRankingWeekly,
  getWeeklyRanking,
  getHistory,
  deleteHistoryItem,
  fetchUserStats,
} from "./api.js";

//Detect the dom content loaded event to ensure the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", async () => {
  // Variables for DOM elements
  let sum = document.querySelector(".sum");
  let adder = document.querySelector(".adder");
  let total = document.querySelector(".total");
  let percentage = document.querySelector(".percent");
  let logOutButton = document.querySelectorAll("#logout");
  let nickname = "";
  let firstPlace = false;
  let userChart;
  let cakeChart;

  // Function to update the profile information
  async function updateProfile() {
    // Fetch the profile data from the API
    const data = await getProfile();

    // If no data is returned, log out the user
    if (!data) {
      logOut();
      return;
    }

    //If the user is the last in the list, display a message
    if (data.last === true) {
      document.getElementById("placeMsg").textContent =
        "Eres el último en la lista, ¡anímate a recolectar más latas!";
    }

    // Update the profile information in the DOM
    nickname = data.nickname;
    document.getElementById("userInfo").textContent = `Hola ${
      data.nickname
    }, has recolectado ${data.total_cans} latas. (${(
      (data.total_cans * 100) /
      2000
    ).toFixed(4)}% de lo que se espera de ti)`;
  }

  // Function to update the total number of cans
  async function updateTotal() {
    // Fetch the total number of cans from the API
    const data = await getTotal();

    // If data is returned, update the total and percentage in the DOM
    if (data) {
      total.textContent = data.total;
      percentage.textContent = `${((data.total * 100) / 60000).toFixed(4)}%`;
    } else {
      alert("Error al obtener el total");
    }
  }

  // Function to launch confetti animation
  // This function uses the confetti library to create a celebratory effect
  function launchConfetti() {
    // Use the confetti library to create a confetti effect
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
    });
  }

  // Function to update the ranking of users
  async function updateRanking() {
    // Fetch the ranking data from the API
    const ranking = await getRanking();

    // If ranking data is returned, update the ranking list in the DOM
    if (ranking) {
      const rankingContainer = document.getElementById("ranking");
      rankingContainer.innerHTML = "";

      // Create list items for each user in the ranking
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

      // Check if the user is in first place
      if (nickname === ranking[0].nickname) {
        firstPlace = true;
      }
    } else {
      alert("Error al cargar el ranking");
    }
  }

  // Function to update the weekly ranking of users
  async function updateWeeklyRanking() {
    // Fetch the weekly ranking data from the API
    const weeklyRanking = await getWeeklyRanking();
    if (weeklyRanking) {
      // If weekly ranking data is returned, update the weekly ranking list in the DOM
      const weeklyRankingContainer = document.getElementById("weeklyRanking");
      weeklyRankingContainer.innerHTML = "";
      weeklyRanking.forEach((user, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("ranking-item");
        listItem.textContent = `${index + 1}. ${user.name} (${
          user.nickname
        }) - ${user.total_cans_last_week} latas`;
        weeklyRankingContainer.appendChild(listItem);
      });
    } else {
      alert("Error al cargar el ranking semanal");
    }
  }

  // Function to update the weekly ranking of the group
  async function updateGroupRankingWeekly() {
    // Fetch the weekly group ranking data from the API
    const groupRankingWeekly = await getGroupRankingWeekly();

    // If group weekly ranking data is returned, update the group weekly ranking list in the DOM
    if (groupRankingWeekly) {
      const groupRankingWeeklyContainer =
        document.getElementById("groupRankingWeekly");
      groupRankingWeeklyContainer.innerHTML = "";
      groupRankingWeekly.forEach((user, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("ranking-item");
        listItem.textContent = `${index + 1}. ${user.name} (${
          user.nickname
        }) - ${user.total_cans_last_week} latas`;
        groupRankingWeeklyContainer.appendChild(listItem);
      });
    } else {
      alert("Error al cargar el ranking semanal del grupo");
    }
  }

  // Function to handle adding a new can
  async function handleAddLata() {
    // Get the value from the adder input field
    let amount = Number(adder.value).toFixed(0);

    // Validate the input amount
    if (!amount || amount <= 0) {
      alert("Ingrese datos validos");
      return;
    }

    // Call the addLata function from the API to add the can
    const result = await addLata(amount);

    // If the result is successful, reset the adder input field and update the UI
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
      await getWeeklyRanking();
      await updateGroupRankingWeekly();

      launchConfetti();

      setTimeout(() => {
        total.classList.remove("lataAdded");
      }, 1000);
    } else {
      alert("Error al agregar las latas");
    }
  }

  // Function to update the group information
  async function updateGroup() {
    // Fetch the group data from the API
    const groupData = await getGroup();
    if (groupData) {
      // If group data is returned, update the group information in the DOM
      const groupContainer = document.getElementById("group");
      groupContainer.innerHTML = "";

      groupContainer.textContent = `${groupData.grupo} - Total de latas: ${groupData.total_latas} - Integrantes: ${groupData.integrantes}.`;
    } else {
      alert("Error al cargar el grupo");
    }
  }

  // Function to update the group ranking
  async function updateGroupRanking() {
    // Fetch the group ranking data from the API
    const groupRanking = await getGroupRanking();

    // If group ranking data is returned, update the group ranking list in the DOM
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

  // Function to update the history of actions
  async function updateHistory() {
    // Fetch the history data from the API
    const history = await getHistory();
    const historyContainer = document.querySelector(".history");
    historyContainer.innerHTML = "";

    //For each item in the history, create a list item and a delete button
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

  // Function to fetch user statistics for the chart
  async function getUserChart(range = "7") {
    // Fetch user statistics from the API
    const data = await fetchUserStats();
    // If no data is returned, exit the function
    if (!data) return;

    const { groupMembers, stats } = data;

    // Sort the stats by date
    const uniqueDates = Array.from(
      new Set(stats.map((entry) => entry.date)),
    ).sort();

    //Filter the dates based on the selected range
    const filteredDates =
      range === "all" ? uniqueDates : uniqueDates.slice(-Number(range));
    // Create a map to hold user data
    const userMap = {};

    // Initialize the userMap with group members and their totals
    groupMembers.forEach((user) => {
      userMap[user.id] = {
        name: user.name,
        totals: Array(filteredDates.length).fill(0),
      };
    });

    // Populate the userMap with stats data
    stats.forEach((entry) => {
      const dateIndex = filteredDates.indexOf(entry.date);
      if (dateIndex !== -1 && userMap[entry.user_id]) {
        userMap[entry.user_id].totals[dateIndex] = Number(entry.total);
      }
    });

    // Prepare the labels and datasets for the chart
    const labels = filteredDates.map((d) => d.substring(5, 10));

    // Create a dataset for each user
    const datasets = Object.values(userMap).map((user, idx) => {
      const color = getColor(idx);

      return {
        label: user.name,
        data: user.totals,
        fill: false,
        borderColor: color,
        backgroundColor: color + "88",
        tension: 0.3,
      };
    });

    // Create or update the chart
    const ctx = document.getElementById("group-chart").getContext("2d");

    // If userChart already exists, update it; otherwise, create a new chart
    if (userChart) {
      userChart.data.labels = labels;
      userChart.data.datasets = datasets;
      userChart.update();
    } else {
      userChart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
            x: {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 7,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Inserciones por día de cada integrante del grupo",
              font: {
                size: 16,
              },
            },
            legend: {
              display: true,
              position: "bottom",
              labels: {
                boxWidth: 10,
                font: {
                  size: 10,
                },
                padding: 15,
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
              bodyFont: {
                size: 12,
              },
              titleFont: {
                size: 14,
              },
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        },
      });
    }
  }

  // Function to get the group cake chart
  async function getGroupCake() {
    // Fetch the group ranking data from the API
    const groupData = await getGroupRanking();

    if (!groupData) return;

    // If group data is returned, prepare the data for the pie chart
    let labels = [];
    let datasets = [];

    labels = groupData.map((item) => item.name);
    datasets = [
      {
        label: "Total de latas",
        data: groupData.map((item) => item.total_cans),
        backgroundColor: [
          "#3e95cd",
          "#8e5ea2",
          "#3cba9f",
          "#e8c3b9",
          "#c45850",
          "#ff9f40",
          "#9966ff",
          "#4bc0c0",
          "#ff6384",
          "#36a2eb",
        ],
        hoverOffset: 4,
      },
    ];

    // Create the pie chart
    const ctx = document.getElementById("group-cake").getContext("2d");

    // Create the pie chart
    cakeChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Cantidad total por integrante del grupo",
            font: {
              size: 16,
            },
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              boxWidth: 10,
              font: {
                size: 12,
              },
              padding: 15,
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            bodyFont: {
              size: 12,
            },
            titleFont: {
              size: 14,
            },
          },
        },
      },
    });
  }

  // Function to get the color for the chart
  function getColor(index) {
    const palette = [
      "#3e95cd",
      "#8e5ea2",
      "#3cba9f",
      "#e8c3b9",
      "#c45850",
      "#ff9f40",
      "#9966ff",
      "#4bc0c0",
      "#ff6384",
      "#36a2eb",
    ];
    return palette[index % palette.length];
  }

  // Add event listeners for the sum button and adder input field
  sum.addEventListener("click", handleAddLata);

  adder.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLata();
    }
  });

  // Add event listeners for the log out button
  logOutButton.forEach((item) => {
    item.addEventListener("click", logOut);
  });

  // Initial data fetch and UI update
  await updateTotal();
  await updateProfile();
  await updateRanking();
  await updateGroup();
  await updateGroupRanking();
  await updateHistory();
  await getUserChart();
  await getGroupCake();
  await updateWeeklyRanking();
  await updateGroupRankingWeekly();

  // Display a message if the user is in first place
  if (firstPlace) {
    document.getElementById("placeMsg").textContent =
      "¡Felicidades, eres el primero en la lista!";
    document.getElementById("placeMsg").style.color = "gold";
  }

  // Add event listener for the days select dropdown to update the chart
  document
    .getElementById("daysSelect")
    .addEventListener("change", async (e) => {
      await getUserChart(e.target.value);
    });
});

// Add an event listener for the window load event to hide the preloader
window.addEventListener("load", () => {
  let loader = document.querySelector(".preloader");
  if (loader) {
    try {
      loader.style.display = "none";
    } catch (e) {
      // ignore style errors
    }
  }
  document.body.classList.add("loaded");
});
