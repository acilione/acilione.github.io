let theme = "dark";
try {
  theme = localStorage.getItem("theme") || "dark";
} catch {}
document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
