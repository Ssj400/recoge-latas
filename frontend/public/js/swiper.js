// =============================================
// File: swiper.js
// Description: Swiper slider functionality for the frontend.
// Author: José Garrillo
// Date: 12-06-25
// Status: Proyect finished, in read-only mode
// =============================================

// Create a new Swiper instance for the slider
const swiper = new Swiper(".slider-container", {
  effect: "slide",
  speed: 100,

  navigation: {
    prevEl: "#slide-prev",
    nextEl: "#slide-next",
  },
});
