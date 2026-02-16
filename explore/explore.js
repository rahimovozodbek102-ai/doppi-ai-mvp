import { prompts } from "../data/prompts.js";

const grid = document.getElementById("promptGrid");

function renderPrompts(category = "All") {

  grid.innerHTML = "";

  const filtered = category === "All"
    ? prompts
    : prompts.filter(p => p.category === category);

  filtered.forEach(p => {

    const card = document.createElement("div");
    card.className = "prompt-card";

    card.innerHTML = `
      <img src="${p.image}">
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <span class="badge">${p.style}</span>
        ${p.premium ? '<span class="premium">PRO</span>' : ''}
        <button class="use-btn">Use Prompt</button>
      </div>
    `;

    card.querySelector(".use-btn").onclick = () => {
      localStorage.setItem("selectedPrompt", p.description);
      window.location.href = "/generate/";
    };

    grid.appendChild(card);
  });
}

renderPrompts();

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.onclick = () => {

    document.querySelectorAll(".filter-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    renderPrompts(btn.dataset.category);
  };
});
