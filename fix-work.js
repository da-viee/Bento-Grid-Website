const fs = require('fs');

// Update work.css
let css = fs.readFileSync('work.css', 'utf8');

// Update hover states
css = css.replace('.project-card {', '.project-card {\n    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;\n    border: 1px solid rgba(255, 255, 255, 0.05);\n');
css = css.replace('.project-card:hover {\n    transform: scale(1.02);\n}', '.project-card:hover {\n    transform: translateY(-8px) scale(1.02);\n    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.1);\n    z-index: 10;\n}');

// Replace colors with images
css = css.replace('background-color: #f98e2d;', 'background-image: url(\'assets/images/bagged4-300x300.webp\'); background-size: cover; background-position: center;');
css = css.replace('background-color: #8282ff;', 'background-image: url(\'assets/images/game.png\'); background-size: cover; background-position: center;');
css = css.replace('background-color: #beff5a;', 'background-image: url(\'assets/images/0001.png\'); background-size: cover; background-position: center;');
css = css.replace('background-color: #c5a1ff;', 'background-image: url(\'assets/images/untitled.png\'); background-size: cover; background-position: center;');
css = css.replace('background-color: #e6e6e6;', 'background-image: url(\'assets/images/nivia.png\'); background-size: cover; background-position: center;');
css = css.replace('background-color: #1a1a1a;', 'background-image: url(\'assets/images/PIN1-300x300.png\'); background-size: cover; background-position: center;');

fs.writeFileSync('work.css', css);

// Update work.html
let html = fs.readFileSync('work.html', 'utf8');
html = html.replace(/<div class="logo">[\s\S]*?<\/div>/, '<div class="logo">\n                <span class="pixel-font">dotted pixel</span>\n            </div>');
html = html.replace(/<nav class="nav-links">[\s\S]*?<\/nav>/, '<nav class="nav-links">\n                <a href="index.html">Home</a>\n                <a href="work.html" class="active">Our Work</a>\n                <a href="blog.html">Blog</a>\n                <a href="contact.html">Contact Us</a>\n            </nav>');
html = html.replace('<button class="download-btn">Start a Project</button>', '');

// Fix filter buttons
html = html.replace(/<button class="filter-btn active" onclick="showPopup[^>]+>Recent<\/button>/, '<button class="filter-btn active" data-filter="all">Recent</button>');
html = html.replace(/<button class="filter-btn" onclick="showPopup[^>]+>3D Renders<\/button>/, '<button class="filter-btn" data-filter="3d">3D Renders</button>');
html = html.replace(/<button class="filter-btn" onclick="showPopup[^>]+>Motion Graphics<\/button>/, '<button class="filter-btn" data-filter="motion">Motion Graphics</button>');
html = html.replace(/<button class="filter-btn" onclick="showPopup[^>]+>Social Ads<\/button>/, '<button class="filter-btn" data-filter="social">Social Ads</button>');

// Add data-category to projects
html = html.replace('id="project-a"', 'id="project-a" data-category="3d"');
html = html.replace('id="project-b"', 'id="project-b" data-category="motion"');
html = html.replace('id="project-c"', 'id="project-c" data-category="social"');
html = html.replace('id="project-d"', 'id="project-d" data-category="3d"');
html = html.replace('id="project-e"', 'id="project-e" data-category="motion"');
html = html.replace('id="project-f"', 'id="project-f" data-category="social"');

// Remove popup
html = html.replace(/<!-- Popup for filter error messages -->[\s\S]*?<\/div>\s*<\/div>/, '');

fs.writeFileSync('work.html', html);
