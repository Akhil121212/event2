const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get All Events (Public)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

const Registration = require('../models/Registration');

// Get User Registrations (For Dashboard) - MUST BE BEFORE /:id
router.get('/my-registrations', auth, async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user.id })
            .populate('event', ['title', 'date', 'venue', 'image', 'category']);
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Single Event (Public)
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Register for Event (Protected)
router.post('/register/:id', auth, async (req, res) => {
    const { teamName, members, paymentReference } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        // Check if user already registered for this event
        const existingReg = await Registration.findOne({ user: req.user.id, event: req.params.id });
        if (existingReg) {
            return res.status(400).json({ msg: 'Already registered for this event' });
        }

        const newRegistration = new Registration({
            user: req.user.id,
            event: req.params.id,
            teamName,
            members,
            paymentReference
        });

        await newRegistration.save();

        event.participants.push(req.user.id);
        await event.save();

        res.json({ msg: 'Registered successfully', registrationId: newRegistration.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
