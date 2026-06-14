const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },

    answers: [{
        type: Number
    }],

    score: {
        type: Number,
        required: true
    },

    passed: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
