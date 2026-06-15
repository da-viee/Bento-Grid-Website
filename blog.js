document.addEventListener('DOMContentLoaded', async () => {
    const blogList = document.getElementById('blog-list-public');
    if (!blogList) return;

    try {
        const res = await fetch('/api/blogs');
        const blogs = await res.json();

        if (!blogs || blogs.length === 0) {
            blogList.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 4rem;">No blog posts yet. Create some from the Admin Dashboard!</p>';
            return;
        }

        blogList.innerHTML = blogs.map(blog => {
            // Find the first image block or text block for a preview snippet
            let previewText = 'Read more...';
            let imgHtml = '';
            
            if (blog.blocks && blog.blocks.length > 0) {
                const textBlock = blog.blocks.find(b => b.type === 'text');
                if (textBlock && textBlock.content) {
                    previewText = textBlock.content.substring(0, 100) + '...';
                }
                const imgBlock = blog.blocks.find(b => b.type === 'image' || b.type === 'image-row');
                if (imgBlock && imgBlock.content) {
                    const imgSrc = Array.isArray(imgBlock.content) ? imgBlock.content[0] : imgBlock.content;
                    imgHtml = `<img src="${imgSrc}" alt="Blog Image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">`;
                }
            }

            return `
                <div class="blog-card" style="cursor:pointer;" onclick="location.href='/blog/${blog.slug || blog.id}'">
                    ${imgHtml}
                    <h3>${blog.title || 'Untitled'}</h3>
                    <p class="blog-content">${previewText}</p>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Failed to load blogs:', err);
        blogList.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 4rem;">Failed to load blog posts.</p>';
    }
});
