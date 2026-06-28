const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/content', express.static(path.join(__dirname, '..', 'content')));

// API Routes
app.use('/api/contact', require('./routes/contact'));
// app.use('/api/quote', require('./routes/quote')); // Quote route not implemented yet

// Serve index.html for all routes (SPA-like)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Bizatech Services server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the site`);
});