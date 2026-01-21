const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sendEmail = require('../utils/sendEmail');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (role === 'admin' && email !== 'r@gmail.com') {
            return res.status(400).json({ msg: 'Admin registration is restricted.' });
        }
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        // Send Welcome Email
        // Send Welcome Email
        const subject = 'Welcome to EventGO! 🚀';
        const text = `Hi ${name},\n\nWelcome to EventGO! We are thrilled to have you join our community.\n\nStart exploring events now: https://aeventgo.vercel.app/dashboard\n\nBest Regards,\nThe EventGO Team`;

        const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 10px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                
                <!-- Logo / Header -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">EventGO</h1>
                    <p style="color: #6b7280; margin-top: 5px; font-size: 14px;">Your Gateway to Amazing Events</p>
                </div>

                <!-- Main Content -->
                <div style="color: #374151; font-size: 16px; line-height: 1.6;">
                    <p style="margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
                    <p style="margin-bottom: 20px;">Welcome to the EventGO family! 🎉 We're absolutely thrilled to have you on board.</p>
                    <p style="margin-bottom: 20px;">You are now part of a community that loves to explore, register, and participate in the most exciting events happening around you.</p>
                    
                    <ul style="margin-bottom: 30px; padding-left: 20px; color: #4b5563;">
                        <li style="margin-bottom: 10px;">🔍 <strong>Discover</strong> exclusive events</li>
                        <li style="margin-bottom: 10px;">🎟️ <strong>Register</strong> seamlessly with your team</li>
                        <li style="margin-bottom: 10px;">✨ <strong>Experience</strong> memorable moments</li>
                    </ul>

                    <!-- Call to Action Button -->
                    <div style="text-align: center; margin-bottom: 40px;">
                        <a href="https://aeventgo.vercel.app/dashboard" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);"> Go to Dashboard </a>
                    </div>

                    <p style="margin-bottom: 0;">Ready to get started?</p>
                    <p style="margin-top: 5px;"><strong>The EventGO Team</strong></p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} EventGO. All rights reserved.</p>
                <p>Need help? Reply to this email.</p>
            </div>
        </div>
        `;

        // Don't await email to prevent blocking response
        sendEmail(email, subject, text, html);

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        let isMatch = false;

        if (user.role === 'admin') {
            // Strict check for the only allowed admin
            if (email === 'r@gmail.com' && password === 'akhilesh') {
                isMatch = true;
            } else {
                return res.status(400).json({ msg: 'Invalid Admin Credentials' });
            }
        } else {
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Current User
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
