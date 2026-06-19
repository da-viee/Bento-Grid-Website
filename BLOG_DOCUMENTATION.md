# Blog System Documentation

This document explains how the blog system works on the Dotted Pixel website. It is specifically written for AI assistants or developers who need to understand how to add or modify blog posts.

## Overview
The blog is completely statically driven via JSON to avoid the need for a complex database. All blog content is stored in `blog-data.json`.
The client-side JavaScript (`blog.js`) fetches this JSON file and dynamically generates the HTML for both the blog list page (`blog.html`) and individual blog post pages (`blog-post.html`).

## How to Add a New Blog Post
To add a new blog post, simply open `blog-data.json` and append a new object to the main JSON array.

### Post Structure
Each blog post object must have the following keys:
- `slug`: (String) A unique URL-friendly string (e.g., `"my-new-post"`). This is used to load the post in `blog-post.html?slug=my-new-post`.
- `title`: (String) The title of the blog post.
- `date`: (String) The publication date (e.g., `"2026-06-19"`).
- `blocks`: (Array) A list of content block objects.

### The Blocks Array
The `blocks` array allows you to mix text and images sequentially. This is how you insert images *in between* text paragraphs.

Each block is an object with two properties:
- `type`: Either `"text"` or `"image"`.
- `content`: 
  - For a text block, this is the text string (HTML is technically allowed but plain text is preferred).
  - For an image block, this is the relative path to the image file (e.g., `"assets/images/my-image.png"`).

### Example JSON Entry
```json
{
  "slug": "behind-the-scenes-vfx",
  "title": "Behind the Scenes: Visual Effects Workflow",
  "date": "2026-06-20",
  "blocks": [
    {
      "type": "text",
      "content": "Today we are breaking down our recent visual effects project..."
    },
    {
      "type": "image",
      "content": "assets/images/vfx-breakdown-1.png"
    },
    {
      "type": "text",
      "content": "As you can see in the image above, the compositing process involves..."
    }
  ]
}
```

## Styling
The blog cards on `blog.html` and the post content on `blog-post.html` are styled using the global bento-grid CSS system (`global.css` and `style.css`). Make sure `global.css` and the preloader HTML are included if any new pages are created to maintain the custom cursor and page transitions.
