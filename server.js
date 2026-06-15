const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const basicAuth = require('express-basic-auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic Auth for Admin Page
const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PASS || 'secret123';

app.use('/admin.html', basicAuth({
    users: { [adminUser]: adminPass },
    challenge: true,
    unauthorizedResponse: 'Unauthorized Access. Please provide admin credentials.'
}));

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.use(express.static(path.join(__dirname, '')));

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Multer setup
const upload = multer({ dest: '/tmp' });

// Mongoose Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI && !MONGODB_URI.includes('REPLACE_WITH')) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('⚠️ MongoDB URI is missing or invalid in .env file. API routes will fail until connected.');
}

// Mongoose Schemas
const CardSchema = new mongoose.Schema({
  title: String,
  link: String,
  colSpan: Number,
  rowSpan: Number,
  bgColor: String,
  isGhost: Boolean,
  imageFill: Boolean,
  posTop: String,
  posBottom: String,
  posLeft: String,
  posRight: String,
  imageZIndex: Number,
  imageScale: Number,
  btnText: String,
  btnLink: String,
  btnPosTop: String,
  btnPosBottom: String,
  btnPosLeft: String,
  btnPosRight: String,
  mediaUrl: String,
  mediaType: String
}, { timestamps: true });

// Transform _id to id for frontend compatibility
CardSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const BlogSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  title: String,
  date: { type: Date, default: Date.now },
  blocks: [mongoose.Schema.Types.Mixed] // Flexible array
}, { timestamps: true });

BlogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const SettingsSchema = new mongoose.Schema({
  globalBgColor: String
});

const Card = mongoose.model('Card', CardSchema);
const Blog = mongoose.model('Blog', BlogSchema);
const Settings = mongoose.model('Settings', SettingsSchema);

function generateSlug(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
}

// --- Cards API ---
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.find({});
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/cards', upload.single('media'), async (req, res) => {
  try {
    let mediaUrl = '';
    let mediaType = '';

    if (req.file) {
      const isVideo = req.file.mimetype.startsWith('video');
      mediaType = isVideo ? 'video' : 'image';
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: isVideo ? 'video' : 'image',
        folder: 'bento_portfolio'
      });
      mediaUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newCard = new Card({
      title: req.body.title || '',
      link: req.body.link || '',
      colSpan: parseInt(req.body.colSpan) || 1,
      rowSpan: parseInt(req.body.rowSpan) || 1,
      bgColor: req.body.bgColor || '#ffffff',
      isGhost: req.body.isGhost === 'true',
      imageFill: req.body.imageFill === 'true',
      posTop: req.body.posTop || '',
      posBottom: req.body.posBottom || '',
      posLeft: req.body.posLeft || '',
      posRight: req.body.posRight || '',
      imageZIndex: parseInt(req.body.imageZIndex) || 5,
      imageScale: parseFloat(req.body.imageScale) || 1,
      btnText: req.body.btnText || '',
      btnLink: req.body.btnLink || '',
      btnPosTop: req.body.btnPosTop || '',
      btnPosBottom: req.body.btnPosBottom || '',
      btnPosLeft: req.body.btnPosLeft || '',
      btnPosRight: req.body.btnPosRight || '',
      mediaUrl: mediaUrl,
      mediaType: mediaType
    });

    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

app.put('/api/cards/:id', upload.single('media'), async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });

    if (req.file) {
      const isVideo = req.file.mimetype.startsWith('video');
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: isVideo ? 'video' : 'image',
        folder: 'bento_portfolio'
      });
      card.mediaUrl = result.secure_url;
      card.mediaType = isVideo ? 'video' : 'image';
      fs.unlinkSync(req.file.path);
    }

    if (req.body.title !== undefined) card.title = req.body.title;
    if (req.body.link !== undefined) card.link = req.body.link;
    if (req.body.colSpan !== undefined) card.colSpan = parseInt(req.body.colSpan);
    if (req.body.rowSpan !== undefined) card.rowSpan = parseInt(req.body.rowSpan);
    if (req.body.bgColor !== undefined) card.bgColor = req.body.bgColor;
    if (req.body.isGhost !== undefined) card.isGhost = req.body.isGhost === 'true';
    if (req.body.imageFill !== undefined) card.imageFill = req.body.imageFill === 'true';
    if (req.body.posTop !== undefined) card.posTop = req.body.posTop;
    if (req.body.posBottom !== undefined) card.posBottom = req.body.posBottom;
    if (req.body.posLeft !== undefined) card.posLeft = req.body.posLeft;
    if (req.body.posRight !== undefined) card.posRight = req.body.posRight;
    if (req.body.imageZIndex !== undefined) card.imageZIndex = parseInt(req.body.imageZIndex);
    if (req.body.imageScale !== undefined) card.imageScale = parseFloat(req.body.imageScale);
    if (req.body.btnText !== undefined) card.btnText = req.body.btnText;
    if (req.body.btnLink !== undefined) card.btnLink = req.body.btnLink;
    if (req.body.btnPosTop !== undefined) card.btnPosTop = req.body.btnPosTop;
    if (req.body.btnPosBottom !== undefined) card.btnPosBottom = req.body.btnPosBottom;
    if (req.body.btnPosLeft !== undefined) card.btnPosLeft = req.body.btnPosLeft;
    if (req.body.btnPosRight !== undefined) card.btnPosRight = req.body.btnPosRight;

    const updatedCard = await card.save();
    res.json(updatedCard);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// Settings API
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ globalBgColor: '#ffffff' });
      await settings.save();
    }
    res.json({ globalBgColor: settings.globalBgColor });
  } catch (err) {
    res.json({ globalBgColor: '#ffffff' });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }
    settings.globalBgColor = req.body.globalBgColor || '#ffffff';
    await settings.save();
    res.json({ globalBgColor: settings.globalBgColor });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

app.delete('/api/cards/:id', async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// --- Blogs API ---
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/blogs', upload.array('blockImages', 10), async (req, res) => {
  try {
    const blocks = JSON.parse(req.body.blocks || '[]');
    const files = req.files || [];
    
    let fileIndex = 0;
    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];
      if (block.type === 'image' && block.needsUpload) {
        if (files[fileIndex]) {
          const result = await cloudinary.uploader.upload(files[fileIndex].path, {
            resource_type: 'image',
            folder: 'bento_portfolio_blog'
          });
          block.content = result.secure_url;
          fs.unlinkSync(files[fileIndex].path);
          fileIndex++;
        }
        delete block.needsUpload;
      }
    }

    let slug = generateSlug(req.body.title || 'Untitled');
    let counter = 1;
    let originalSlug = slug;
    
    while (await Blog.findOne({ slug: slug })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const newBlog = new Blog({
      slug: slug,
      title: req.body.title || 'Untitled',
      blocks: blocks
    });
    
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Blog Upload error:", error);
    res.status(500).json({ error: 'Failed to upload blog media' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// --- Cloudinary Settings API ---
app.delete('/api/cloudinary/clear', async (req, res) => {
  try {
    await cloudinary.api.delete_resources_by_prefix('bento_portfolio');
    await cloudinary.api.delete_resources_by_prefix('bento_portfolio_blog');
    res.json({ message: 'Cloudinary storage cleared successfully' });
  } catch (error) {
    console.error("Cloudinary clear error:", error);
    res.status(500).json({ error: 'Failed to clear Cloudinary storage.' });
  }
});

app.get('/blog/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    
    if (!blog) {
      return res.status(404).send('Blog post not found');
    }

    let htmlContent = '';
    let firstImageUrl = '';
    let previewText = '';

    blog.blocks.forEach(block => {
      if (block.type === 'text') {
        htmlContent += `<p>${block.content}</p>`;
        if (!previewText) previewText = block.content.substring(0, 150) + '...';
      } else if (block.type === 'image') {
        const src = Array.isArray(block.content) ? block.content[0] : block.content;
        htmlContent += `<img src="${src}" alt="Blog Image" style="max-width:100%; border-radius:8px; margin-bottom:1rem;">`;
        if (!firstImageUrl) firstImageUrl = src;
      } else if (block.type === 'image-row') {
        const src = Array.isArray(block.content) ? block.content[0] : block.content;
        htmlContent += `<img src="${src}" alt="Blog Image" style="max-width:100%; border-radius:8px; margin-bottom:1rem;">`;
        if (!firstImageUrl) firstImageUrl = src;
      }
    });

    if (!previewText) previewText = blog.title;

    const templatePath = path.join(__dirname, 'blog-post.html');
    if (fs.existsSync(templatePath)) {
      let template = fs.readFileSync(templatePath, 'utf8');
      
      template = template.replace(/{{SEO_TITLE}}/g, blog.title + ' - dotted pixels');
      template = template.replace(/{{SEO_DESC}}/g, previewText);
      template = template.replace(/{{SEO_IMAGE}}/g, firstImageUrl);
      template = template.replace(/{{BLOG_TITLE}}/g, blog.title);
      template = template.replace(/{{BLOG_DATE}}/g, new Date(blog.date).toLocaleDateString());
      template = template.replace(/{{BLOG_CONTENT}}/g, htmlContent);

      res.send(template);
    } else {
      res.status(500).send('Blog template not found');
    }
  } catch (err) {
    res.status(500).send('Database error');
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
