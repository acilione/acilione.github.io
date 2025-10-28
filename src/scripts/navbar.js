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

    // initialize theme toggle after navbar elements are present
    initThemeToggle();
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

/* Theme toggle implementation ------------------------------------------------ */
function initThemeToggle(){
  const root = document.documentElement;
  const stored = localStorage.getItem('theme'); // 'light'|'dark' or null
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const apply = (t)=>{
    if(t==='dark') root.setAttribute('data-theme','dark'); else root.removeAttribute('data-theme');
  };
  const initial = stored || (prefersDark? 'dark':'light');
  apply(initial);

  function makeButton(theme){
    const btn = document.createElement('button');
    btn.type='button';
    btn.className='theme-toggle';
    btn.setAttribute('aria-pressed', theme==='dark'?'true':'false');
    const icon = document.createElement('span'); icon.className='theme-icon';
    // simple SVG icons
    const sun = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
    const moon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    icon.innerHTML = theme==='dark'? moon : sun;
    const label = document.createElement('span'); label.className='theme-label';
    label.textContent = theme==='dark' ? 'Dark' : 'Light';
    btn.appendChild(icon); btn.appendChild(label);
    btn.addEventListener('click', ()=>{
      const now = root.getAttribute('data-theme')==='dark' ? 'dark' : 'light';
      const next = now==='dark' ? 'light' : 'dark';
      apply(next);
      localStorage.setItem('theme', next);
      // update all buttons
      document.querySelectorAll('#main-navbar .theme-toggle').forEach(b=>{
        b.querySelector('.theme-icon').innerHTML = next==='dark'? moon : sun;
        b.querySelector('.theme-label').textContent = next==='dark'? 'Dark' : 'Light';
        b.setAttribute('aria-pressed', next==='dark'?'true':'false');
      });
    });
    return btn;
  }

  // find navbar
  const navbar = document.getElementById('main-navbar');
  if(!navbar) return;
  const desktopList = navbar.querySelector('.desktop-nav .nav-links') || navbar.querySelector('.nav-links');
  const mobileList = navbar.querySelector('.mobile-nav .nav-links');

  const btnDesktop = makeButton(initial);
  const actionsContainer = navbar.querySelector('.nav-actions');
  if(actionsContainer){
    actionsContainer.appendChild(btnDesktop);
  } else if(desktopList){
    const li = document.createElement('li'); li.className='theme-wrap'; li.appendChild(btnDesktop);
    desktopList.appendChild(li);
  }

  if(mobileList){
    const btnMobile = makeButton(initial);
    const li2 = document.createElement('li'); li2.className='theme-wrap'; li2.appendChild(btnMobile);
    mobileList.insertBefore(li2, mobileList.firstChild);
  }

  // listen to system preference changes only if user hasn't stored a choice
  try{
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener && mql.addEventListener('change', (e)=>{
      if(!localStorage.getItem('theme')){
        apply(e.matches? 'dark' : 'light');
        document.querySelectorAll('#main-navbar .theme-toggle').forEach(b=>{
          b.querySelector('.theme-icon').innerHTML = e.matches? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
          b.querySelector('.theme-label').textContent = e.matches? 'Dark' : 'Light';
          b.setAttribute('aria-pressed', e.matches? 'true' : 'false');
        });
      }
    });
  }catch(e){}
}
