const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    teamName: { type: String, required: true },
    members: [{
        name: { type: String, required: true },
        usn: { type: String, required: true }
    }],
    paymentReference: { type: String }, // Transaction ID
    registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', RegistrationSchema);
