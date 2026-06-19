document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('blog-list');
    const postContainer = document.getElementById('blog-post-content');
    
    try {
        const res = await fetch('blog-data.json');
        const blogs = await res.json();
        
        // If we are on blog.html (List)
        if (listContainer) {
            if (blogs.length === 0) {
                listContainer.innerHTML = '<p style="color: #fff;">No blogs published yet.</p>';
                return;
            }
            
            listContainer.innerHTML = blogs.map(blog => {
                const preview = blog.blocks.find(b => b.type === 'text')?.content || 'Read more...';
                const imageBlock = blog.blocks.find(b => b.type === 'image');
                const imgHtml = imageBlock ? `<img src="${imageBlock.content}" alt="Thumbnail" style="width: 100%; height: 200px; object-fit: cover; border-radius: 16px; margin-bottom: 1rem;">` : '';
                
                return `
                    <a href="blog-post.html?slug=${blog.slug}" class="bento-item blog-card reveal" style="display:block; text-decoration:none; color:#fff; background-color: #1E1E2C; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s ease;">
                        ${imgHtml}
                        <h3 style="margin: 0 0 10px 0; font-size: 1.5rem;">${blog.title}</h3>
                        <p style="opacity: 0.7; font-size: 0.9rem; margin-bottom: 1rem;">${blog.date}</p>
                        <p style="font-size: 0.95rem; line-height: 1.5; opacity: 0.8;">${preview.substring(0, 100)}...</p>
                    </a>
                `;
            }).join('');
        }
        
        // If we are on blog-post.html (Single Post)
        if (postContainer) {
            const urlParams = new URLSearchParams(window.location.search);
            const slug = urlParams.get('slug');
            
            const blog = blogs.find(b => b.slug === slug);
            if (!blog) {
                postContainer.innerHTML = '<h2>Post not found</h2>';
                return;
            }
            
            document.title = blog.title;
            document.getElementById('post-title').textContent = blog.title;
            document.getElementById('post-date').textContent = blog.date;
            
            let contentHtml = '';
            blog.blocks.forEach(block => {
                if (block.type === 'text') {
                    contentHtml += `<p style="line-height: 1.8; font-size: 1.1rem; margin-bottom: 1.5rem;">${block.content}</p>`;
                } else if (block.type === 'image') {
                    contentHtml += `<img src="${block.content}" alt="Blog Image" style="max-width: 100%; border-radius: 16px; margin: 2rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">`;
                }
            });
            
            postContainer.innerHTML = contentHtml;
        }
    } catch(e) {
        console.error('Failed to load blog data', e);
    }
});
