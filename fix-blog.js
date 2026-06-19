const fs = require('fs');

const headerHtml = `
    <header class="navbar main-container">
        <div class="logo">
            <span class="pixel-font">dotted pixel</span>
        </div>
        <nav class="nav-links">
            <a href="index.html">Home</a>
            <a href="work.html">Our Work</a>
            <a href="blog.html" class="active">Blog</a>
            <a href="contact.html">Contact Us</a>
        </nav>
        <div class="navbar-actions">
            <div class="hamburger-menu">
                <span></span><span></span><span></span>
            </div>
        </div>
    </header>
`;

const blogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Dotted Pixel</title>
    <meta name="description" content="Read the latest updates from Dotted Pixel Animation Studio.">
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <div class="main-container" style="max-width: 1200px;">
        ${headerHtml}
        
        <main style="padding: 40px 20px;">
            <h1 style="color: #fff; font-size: 3rem; margin-bottom: 2rem;">Our Blog</h1>
            <div id="blog-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px;">
                <!-- Blog cards will be injected here -->
            </div>
        </main>
    </div>
    <script src="script.js"></script>
    <script src="blog.js"></script>
</body>
</html>`;

fs.writeFileSync('blog.html', blogHtml);

const blogPostHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Post - Dotted Pixel</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <div class="main-container" style="max-width: 900px;">
        ${headerHtml}
        
        <main style="padding: 40px 20px; color: #fff;">
            <a href="blog.html" style="color: #A1A1FF; text-decoration: none; display: inline-block; margin-bottom: 2rem;">← Back to Blog</a>
            <h1 id="post-title" style="font-size: 3rem; margin-bottom: 0.5rem;">Loading...</h1>
            <p id="post-date" style="opacity: 0.6; margin-bottom: 3rem;"></p>
            
            <div id="blog-post-content">
                <!-- Content blocks injected here -->
            </div>
        </main>
    </div>
    <script src="script.js"></script>
    <script src="blog.js"></script>
</body>
</html>`;

fs.writeFileSync('blog-post.html', blogPostHtml);
