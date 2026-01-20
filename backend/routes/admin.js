const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied: Admins only' });
    }
};

// Create Event (Admin Only)
router.post('/', auth, adminAuth, async (req, res) => {
    const { title, date, description, category, venue, image, price } = req.body;
    try {
        const newEvent = new Event({ title, date, description, category, venue, image, price });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// Update Event (Admin Only)
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        const { title, date, description, category, venue, image, price } = req.body;
        if (title) event.title = title;
        if (date) event.date = date;
        if (description) event.description = description;
        if (category) event.category = category;
        if (venue) event.venue = venue;
        if (image) event.image = image;
        if (price) event.price = price;

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete Event (Admin Only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get All Registrations (Admin Only)
router.get('/registrations', auth, adminAuth, async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('user', 'name email')
            .populate('event', 'title date venue');
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Delete Registration (Admin Only)
router.delete('/registrations/:id', auth, adminAuth, async (req, res) => {
    try {
        const registration = await Registration.findByIdAndDelete(req.params.id);
        if (!registration) return res.status(404).json({ msg: 'Registration not found' });
        res.json({ msg: 'Registration removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
