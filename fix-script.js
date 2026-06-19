const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

// Remove popup logic
js = js.replace(/\/\/\s*Add event listener for popup close button[\s\S]*?function closePopup\(\) \{[\s\S]*?\}/, '');

// Add filtering logic
const filterLogic = `
    // Filter functionality for work.html
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'flex';
                    } else if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
`;

js = js.replace('});', `    ${filterLogic}\n});`);

fs.writeFileSync('script.js', js);
