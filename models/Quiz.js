const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },

    options: [{
        type: String,
        required: true
    }],

    correctAnswers: [{
        type: Number,
        required: true
    }]
}, { _id: true });

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    //score min pour reussir le quiz
    threshold: {
        type: Number,
        required: true,
        default: 50,
        min: 0,
        max: 100
    },

    questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
