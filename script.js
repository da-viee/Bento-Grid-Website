document.addEventListener('DOMContentLoaded', function() {

    // --- Hamburger Menu ---
    var hamburgerMenu = document.querySelector('.hamburger-menu');
    var navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            var spans = hamburgerMenu.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('active')) {
                if (!navLinks.contains(event.target) && !hamburgerMenu.contains(event.target)) {
                    navLinks.classList.remove('active');
                    var spans = hamburgerMenu.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    }

    // --- Tab Switching (work.html) ---
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabSections = document.querySelectorAll('.tab-section');

    if (tabBtns.length > 0) {
        tabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var targetTab = this.getAttribute('data-tab');

                // Update button active state
                tabBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                // Show the matching section, hide others
                tabSections.forEach(function(section) {
                    section.classList.remove('active');
                });
                var target = document.getElementById('tab-' + targetTab);
                if (target) {
                    target.classList.add('active');
                    // Scroll to top of the section smoothly
                    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });
    }

});