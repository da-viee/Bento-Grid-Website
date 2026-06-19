const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Section 1: Hero & Creative Services
html = html.replace(
    '<p>ANIMATION, DIGITAL MEDIA, AND CREATIVE SERVICES, INCLUDING THE PRODUCTION AND MARKETING OF MOTION GRAPHICS, DESIGN, ILLUSTRATION, VISUAL EFFECTS, INTERACTIVE DIGITAL CONTENT.</p>',
    '<p>We provide ANIMATION, DIGITAL MEDIA, AND CREATIVE SERVICES, INCLUDING THE PRODUCTION AND MARKETING OF MOTION GRAPHICS, DESIGN, ILLUSTRATION, VISUAL EFFECTS, INTERACTIVE DIGITAL CONTENT, and the management of related Intellectual Property.</p>'
);

// Section 2: Metrics block replacement
const oldMetrics = `    <!-- Wide bottom item: Metrics -->
    <div class="bento-item-s2 item-metrics">
        <div class="metric-item">
            <img src="assets/images/6-300x300.png" alt="Metrics image 1">
        </div>
        <div class="metric-item">
            <img src="assets/images/PIN1-300x300.png" alt="Metrics image 2" class="circle">
            <div class="metric-data">
                <span>AHT (Average Handling Time)</span>
                <p>97%</p>
            </div>
        </div>
        <div class="metric-item">
            <img src="assets/images/SALEM2-300x300.webp" alt="Metrics image 3" class="circle">
        </div>
        <div class="metric-item">
             <img src="assets/images/bagged-updated-300x300.png" alt="Metrics image 4" class="circle">
             <div class="metric-data">
                <span>AHT (Average Handling Time)</span>
                <p>97%</p>
            </div>
        </div>
    </div>`;

const newMetrics = `    <!-- Wide bottom item: Services -->
    <div class="bento-item-s2 item-metrics">
        <div class="metric-item">
            <img src="assets/images/6-300x300.png" alt="Motion Graphics" style="width:80px; height:80px; object-fit:cover; border-radius:20px;">
            <div class="metric-data">
                <p style="font-size:16px; margin-top:10px;">Motion Graphics</p>
            </div>
        </div>
        <div class="metric-item">
            <img src="assets/images/PIN1-300x300.png" alt="Illustration" class="circle" style="width:80px; height:80px; object-fit:cover;">
            <div class="metric-data">
                <p style="font-size:16px; margin-top:10px;">Illustration</p>
            </div>
        </div>
        <div class="metric-item">
            <img src="assets/images/SALEM2-300x300.webp" alt="Visual Effects" class="circle" style="width:80px; height:80px; object-fit:cover;">
            <div class="metric-data">
                <p style="font-size:16px; margin-top:10px;">Visual Effects</p>
            </div>
        </div>
        <div class="metric-item">
             <img src="assets/images/bagged-updated-300x300.png" alt="Interactive Media" class="circle" style="width:80px; height:80px; object-fit:cover;">
             <div class="metric-data">
                <p style="font-size:16px; margin-top:10px;">Digital Content</p>
            </div>
        </div>
    </div>`;

html = html.replace(oldMetrics, newMetrics);

// Fix Section 4: "There is something else for you"
html = html.replace(
    '<h2>Development of Intellectual Property</h2>',
    '<h2 style="font-size:32px;">Production, Marketing, and Management of Intellectual Property</h2>'
);

// Fix Section 5 titles to fit the story
html = html.replace('<h3>Unleash Creative Potential</h3>', '<h3>Unleash Creative Potential</h3><p>We handle every step of digital media production.</p>');
html = html.replace('<p>Make the creative process yours.</p>', '');

fs.writeFileSync('index.html', html);
