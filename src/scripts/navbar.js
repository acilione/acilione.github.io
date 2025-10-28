// Parcel-friendly navbar loader
// Embedded navbar HTML (inlined to avoid bundler resolution issues)
const NAVBAR_HTML = `<header id="main-navbar">
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
</header>`;

async function loadNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  try {
  // Inject navbar HTML bundled by Parcel (imported as raw text)
  container.innerHTML = NAVBAR_HTML;

    // wire menu toggle
    const menuToggle = container.querySelector('.menu-toggle');
    const mobileNav = container.querySelector('.mobile-nav');
    if (menuToggle && mobileNav) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        mobileNav.classList.toggle('open');
      });

      // close mobile menu on link click
      mobileNav.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => {
          menuToggle.classList.remove('open');
          mobileNav.classList.remove('open');
        })
      );
    }

    // mark active links safely (don't overwrite other classes like .logo)
    const navLinks = container.querySelectorAll('.nav-links a');
    const current = (location.pathname.split('/').pop() || 'index.html');

    navLinks.forEach(a => {
      // normalize href (handle folder links like 'cv/' -> 'cv/index.html')
      let href = a.getAttribute('href') || '';
      if (href.endsWith('/')) href += 'index.html';
      href = href.replace(/^\.\//, '');

      // remove previous state and set active where appropriate
      a.classList.remove('active');
      if (href === current || (href === 'index.html' && current === '')) {
        a.classList.add('active');
      }
    });
  } catch (e) {
    console.error('Navbar load error:', e);
  }
}

// Load navbar on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
  loadNavbar();
}
