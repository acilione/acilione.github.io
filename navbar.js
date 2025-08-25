document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar-container');
    console.log(navbarContainer)
    // Fetch the navbar HTML and inject it
    fetch('navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            navbarContainer.innerHTML = html;

            // Once the navbar is loaded, attach the event listeners
            const menuToggle = document.querySelector('.menu-toggle');
            const mobileNav = document.querySelector('.mobile-nav');
            const navLinks = document.querySelectorAll('.nav-links a');

            if (menuToggle && mobileNav) {
                menuToggle.addEventListener('click', () => {
                    menuToggle.classList.toggle('open');
                    mobileNav.classList.toggle('open');
                });
            }

            // Optional: Close the menu if a link is clicked
            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('open');
                    mobileNav.classList.remove('open');
                });
            });

            // Set the 'active' class on the current page's link
            const currentPagePath = window.location.pathname.split('/').pop();
            navLinks.forEach(link => {
                const linkPath = link.getAttribute('href');
                if (linkPath === currentPagePath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        })
        .catch(error => {
            console.error('Error loading the navbar:', error);
        });
});