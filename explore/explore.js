const prompts = [
  {
    image: "./images/doppi-master-portrait.jpg",
    prompt: "Ultra realistic Uzbek man wearing traditional doppi, cinematic studio lighting",
    category: "Trending"
  },
  {
    image: "./images/cosmic-doppi-mystic.jpg",
    prompt: "Mystical cosmic doppi master surrounded by purple galaxy energy",
    category: "Fantasy"
  },
  {
    image: "./images/cyber-doppi-android.jpg",
    prompt: "Cyberpunk AI android wearing futuristic doppi, neon purple glow",
    category: "Trending"
  },
  {
    image: "./images/dark-dragon-warrior.jpg",
    prompt: "Dark fantasy Uzbek warrior with dragon behind him, epic fire atmosphere",
    category: "Fantasy"
  },
  {
    image: "./images/spirit-wolf-guardian.jpg",
    prompt: "Uzbek warrior with glowing purple spirit wolf guardian",
    category: "Fantasy"
  },
  {
    image: "./images/fire-armor-samurai.jpg",
    prompt: "Fire armor samurai warrior wearing golden doppi",
    category: "Trending"
  },
  {
    image: "./images/neon-rain-samurai.jpg",
    prompt: "Neon rain cyberpunk samurai in dark city",
    category: "Trending"
  },
  {
    image: "./images/anime-doppi-hero.jpg",
    prompt: "Anime Uzbek hero with glowing energy sword",
    category: "Anime"
  },
  {
    image: "./images/neon-city-doppi-girl.jpg",
    prompt: "Neon city portrait of doppi girl, cinematic lights",
    category: "Trending"
  },
  {
    image: "./images/desert-doppi-traveler.jpg",
    prompt: "Desert traveler wearing traditional doppi, cinematic sunset",
    category: "Fantasy"
  }
];

const grid = document.getElementById("promptGrid");

function renderPrompts(list) {
  grid.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "prompt-card";

    card.innerHTML = `
      <img src="${item.image}" alt="">
      <div class="prompt-overlay">
        <p>${item.prompt}</p>
      </div>
    `;

    card.onclick = () => {
      localStorage.setItem("selectedPrompt", item.prompt);
      window.location.href = "/generate/";
    };

    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPrompts(prompts);
});
