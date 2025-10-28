const e=`<header id="main-navbar">
  <a href="index.html" class="logo">Antonino Cilione</a>
  <nav class="desktop-nav">
    <ul class="nav-links">
      <li><a href="index.html" class="active">Home</a></li>
      <li><a href="cv.html">CV</a></li>
      <li><a href="projects.html">Projects</a></li>
    </ul>
  </nav>
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
</header>`;async function a(){let a=document.getElementById("navbar-container");if(a)try{a.innerHTML=e;let l=a.querySelector(".menu-toggle"),n=a.querySelector(".mobile-nav");l&&n&&(l.addEventListener("click",()=>{l.classList.toggle("open"),n.classList.toggle("open")}),n.querySelectorAll("a").forEach(e=>e.addEventListener("click",()=>{l.classList.remove("open"),n.classList.remove("open")})));let t=a.querySelectorAll(".nav-links a"),s=location.pathname.split("/").pop()||"index.html";t.forEach(e=>{let a=e.getAttribute("href")||"";a.endsWith("/")&&(a+="index.html"),a=a.replace(/^\.\//,""),e.classList.remove("active"),(a===s||"index.html"===a&&""===s)&&e.classList.add("active")})}catch(e){console.error("Navbar load error:",e)}}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",a):a();
//# sourceMappingURL=acilione.github.io.b6512202.js.map
