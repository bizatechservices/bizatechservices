const express = require('express');
// Forms now send via WhatsApp in frontend
const router = express.Router();

// @route   POST /api/contact
// @desc    Handle contact form submissions
router.post('/', async (req, res) => {
    const { firstName, lastName, email, phone, company, service, details } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !service || !details) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all required fields'
        });
    }

    // Log the enquiry
    console.log('New Contact Enquiry Received:');
    console.log({ firstName, lastName, email, phone, company, service, details });

    res.json({
        success: true,
        message: 'Thank you for your enquiry! We will get back to you within 24 hours.',
        data: { firstName, lastName, email, phone, service }
    });
});

module.exports = router;