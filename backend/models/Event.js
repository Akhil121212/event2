const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Technical', 'Cultural', 'Sports'], required: true },
    venue: { type: String, required: true },
    image: { type: String }, // URL to image
    price: { type: Number, default: 0 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Event', EventSchema);
