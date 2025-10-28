const e=`<header id="main-navbar">
  <a href="index.html" class="logo">Antonino Cilione</a>
  <nav class="desktop-nav">
    <ul class="nav-links">
      <li><a href="index.html" class="active">Home</a></li>
      <li><a href="cv.html">CV</a></li>
      <li><a href="projects.html">Projects</a></li>
    </ul>
  </nav>
  <div class="nav-actions" aria-hidden="true"></div>
  <button class="menu-toggle" aria-label="Toggle navigation menu">
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
    <span class="line"></span>
  </button>
  <nav class="mobile-nav">
    <ul class="nav-links">
      <li><a href="index.html" class="active">Home</a></li>
      <li><a href="cv.html">CV</a></li>
      <li><a href="projects.html">Projects</a></li>
    </ul>
  </nav>
</header>`;async function t(){let t=document.getElementById("navbar-container");if(t)try{t.innerHTML=e;let a=t.querySelector(".menu-toggle"),l=t.querySelector(".mobile-nav");a&&l&&(a.addEventListener("click",()=>{a.classList.toggle("open"),l.classList.toggle("open")}),l.querySelectorAll("a").forEach(e=>e.addEventListener("click",()=>{a.classList.remove("open"),l.classList.remove("open")})));let r=t.querySelectorAll(".nav-links a"),n=location.pathname.split("/").pop()||"index.html";r.forEach(e=>{let t=e.getAttribute("href")||"";t.endsWith("/")&&(t+="index.html"),t=t.replace(/^\.\//,""),e.classList.remove("active"),(t===n||"index.html"===t&&""===n)&&e.classList.add("active")}),function(){let e=document.documentElement,t=localStorage.getItem("theme"),a=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,l=t=>{"dark"===t?e.setAttribute("data-theme","dark"):e.removeAttribute("data-theme")},r=t||(a?"dark":"light");function n(t){let a=document.createElement("button");a.type="button",a.className="theme-toggle",a.setAttribute("aria-pressed","dark"===t?"true":"false");let r=document.createElement("span");r.className="theme-icon";let n='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',o='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';r.innerHTML="dark"===t?o:n;let i=document.createElement("span");return i.className="theme-label",i.textContent="dark"===t?"Light":"Dark",a.appendChild(r),a.appendChild(i),a.addEventListener("click",()=>{let t="dark"==("dark"===e.getAttribute("data-theme")?"dark":"light")?"light":"dark";l(t),localStorage.setItem("theme",t),document.querySelectorAll("#main-navbar .theme-toggle").forEach(e=>{e.querySelector(".theme-icon").innerHTML="dark"===t?o:n,e.querySelector(".theme-label").textContent="dark"===t?"Light":"Dark",e.setAttribute("aria-pressed","dark"===t?"true":"false")})}),a}l(r);let o=document.getElementById("main-navbar");if(!o)return;let i=o.querySelector(".desktop-nav .nav-links")||o.querySelector(".nav-links"),s=o.querySelector(".mobile-nav .nav-links"),c=n(r),d=o.querySelector(".nav-actions");if(d)d.appendChild(c);else if(i){let e=document.createElement("li");e.className="theme-wrap",e.appendChild(c),i.appendChild(e)}if(s){let e=n(r),t=document.createElement("li");t.className="theme-wrap",t.appendChild(e),s.insertBefore(t,s.firstChild)}try{let e=window.matchMedia("(prefers-color-scheme: dark)");e.addEventListener&&e.addEventListener("change",e=>{localStorage.getItem("theme")||(l(e.matches?"dark":"light"),document.querySelectorAll("#main-navbar .theme-toggle").forEach(t=>{t.querySelector(".theme-icon").innerHTML=e.matches?'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>':'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',t.querySelector(".theme-label").textContent=e.matches?"Dark":"Light",t.setAttribute("aria-pressed",e.matches?"true":"false")}))})}catch(e){}}()}catch(e){console.error("Navbar load error:",e)}}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",t):t();
//# sourceMappingURL=acilione.github.io.b021bd08.js.map
