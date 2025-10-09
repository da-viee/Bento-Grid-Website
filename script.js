document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Hamburger animation
            const spans = hamburgerMenu.querySelectorAll('span');
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
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active')) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburgerMenu.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger) {
                navLinks.classList.remove('active');
                
                // Reset hamburger animation
                const spans = hamburgerMenu.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
    
    // Add event listener for popup close button
    const popupClose = document.querySelector('.popup-close');
    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }
    
    // Close popup when clicking outside content
    const popupOverlay = document.getElementById('filter-popup');
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(event) {
            if (event.target === popupOverlay) {
                closePopup();
            }
        });
    }
});

function showPopup(message) {
    const popup = document.getElementById('filter-popup');
    const messageElement = document.getElementById('popup-message');
    
    if (popup && messageElement) {
        messageElement.textContent = message;
        popup.style.display = 'flex';
    }
}

function closePopup() {
    const popup = document.getElementById('filter-popup');
    if (popup) {
        popup.style.display = 'none';
    }
}