function setLang(lang) {
  const text = document.getElementById("welcomeText");

  if (lang === "uz") {
    text.innerText = "DO’PPI AI ga xush kelibsiz";
  }
  if (lang === "ru") {
    text.innerText = "Добро пожаловать в DO’PPI AI";
  }
  if (lang === "en") {
    text.innerText = "Welcome to DO’PPI AI";
  }

  localStorage.setItem("lang", lang);
} 
