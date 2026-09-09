const current = location.pathname.split("/").pop() || "index.html";
const links = [
  ["index.html", "Home"],
  ["projects.html", "Projects"],
  ["cv.html", "About / CV"],
];
const nav = links
  .map(
    ([href, label]) =>
      `<li><a href="${href}" ${current === href ? 'class="active" aria-current="page"' : ""}>${label}</a></li>`,
  )
  .join("");
const container = document.getElementById("navbar-container");
if (container) {
  container.innerHTML = `<header id="main-navbar"><a class="logo" href="index.html"><span class="logo-mark" aria-hidden="true">ac</span>Antonino Cilione</a><nav class="desktop-nav" aria-label="Main"><ul class="nav-links">${nav}</ul></nav><button class="theme-toggle" type="button"></button><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-navigation">Menu</button><nav id="mobile-navigation" class="mobile-nav" aria-label="Mobile"><ul class="nav-links">${nav}</ul></nav></header>`;
  const menu = container.querySelector(".menu-toggle"),
    mobile = container.querySelector(".mobile-nav");
  const close = () => {
    menu.setAttribute("aria-expanded", "false");
    mobile.classList.remove("open");
  };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    mobile.classList.toggle("open", open);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobile.classList.contains("open")) {
      close();
      menu.focus();
    }
  });
  mobile
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", close));
  const themeButton = container.querySelector(".theme-toggle");
  const update = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    themeButton.textContent = dark ? "Light mode ↗" : "Dark mode ↗";
    themeButton.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme",
    );
  };
  update();
  themeButton.addEventListener("click", () => {
    const theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {}
    update();
  });
}
