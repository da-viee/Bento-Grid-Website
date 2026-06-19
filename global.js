/* ====================================== */
/*  GLOBAL JS — Cursor, Preloader,        */
/*  Page Transitions, Scroll Reveal       */
/* ====================================== */

(function() {
    'use strict';

    /* ==============================
       1. PRELOADER
    ============================== */
    window.addEventListener('load', function() {
        var preloader = document.getElementById('preloader');
        if (!preloader) return;
        setTimeout(function() {
            preloader.classList.add('fade-out');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 700);
        }, 1200);
    });

    /* ==============================
       2. CUSTOM CURSOR (dot + orbiting dots)
    ============================== */
    var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
        var cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);

        var ring = document.createElement('div');
        ring.className = 'cursor-ring';

        // Create 8 orbiting dots
        var dotCount = 8;
        for (var i = 0; i < dotCount; i++) {
            var dot = document.createElement('div');
            dot.className = 'cursor-ring__dot';
            var angle = (i / dotCount) * 2 * Math.PI;
            var radius = 18;
            var x = Math.cos(angle) * radius;
            var y = Math.sin(angle) * radius;
            dot.style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px))';
            dot.style.width = (i % 2 === 0) ? '3px' : '2px';
            dot.style.height = dot.style.width;
            dot.style.opacity = i % 2 === 0 ? '0.8' : '0.4';
            ring.appendChild(dot);
        }
        document.body.appendChild(ring);

        var mouseX = -100, mouseY = -100;
        var ringX = -100, ringY = -100;
        var speed = 0.12;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth ring follow with lerp
        function animateRing() {
            ringX += (mouseX - ringX) * speed;
            ringY += (mouseY - ringY) * speed;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';

            // Rotate the dots slowly
            var now = Date.now() / 1000;
            var dots = ring.querySelectorAll('.cursor-ring__dot');
            for (var i = 0; i < dots.length; i++) {
                var baseAngle = (i / dots.length) * 2 * Math.PI;
                var rotAngle = baseAngle + now * 0.5;
                var radius = ring.clientWidth / 2 - 3;
                var x = Math.cos(rotAngle) * radius;
                var y = Math.sin(rotAngle) * radius;
                dots[i].style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px))';
            }

            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        var hoverEls = document.querySelectorAll('a, button, .tab-btn, .work-card, .project-row, .bento-item, .bento-item-s2, .bento-item-s4, .bento-item-s5');
        hoverEls.forEach(function(el) {
            el.addEventListener('mouseenter', function() { document.body.classList.add('cursor--hover'); });
            el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor--hover'); });
        });
    }

    /* ==============================
       3. PAGE TRANSITIONS
    ============================== */
    var overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.appendChild(overlay);

    // Intercept internal link clicks
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || link.hasAttribute('target')) return;
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(function() {
            window.location.href = href;
        }, 300);
    });

    // Fade in on arrival
    window.addEventListener('pageshow', function() {
        overlay.classList.remove('active');
    });

    /* ==============================
       4. SCROLL REVEAL
    ============================== */
    var revealEls = document.querySelectorAll('.bento-item, .bento-item-s2, .bento-item-s4, .bento-item-s5, .work-card, .project-row, .detail-card, .blog-card-item');
    revealEls.forEach(function(el, i) {
        el.classList.add('reveal');
        if (i % 3 === 1) el.classList.add('reveal-delay-1');
        if (i % 3 === 2) el.classList.add('reveal-delay-2');
    });

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    revealEls.forEach(function(el) { observer.observe(el); });

    /* ==============================
       5. HAMBURGER MENU
    ============================== */
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

    /* ==============================
       6. TAB SWITCHING (work.html)
    ============================== */
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabSections = document.querySelectorAll('.tab-section');

    if (tabBtns.length > 0) {
        tabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var targetTab = this.getAttribute('data-tab');
                tabBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                tabSections.forEach(function(section) { section.classList.remove('active'); });
                var target = document.getElementById('tab-' + targetTab);
                if (target) {
                    target.classList.add('active');
                    // Re-run reveal on newly visible elements
                    target.querySelectorAll('.reveal').forEach(function(el) {
                        el.classList.add('visible');
                    });
                }
            });
        });
    }

})();
