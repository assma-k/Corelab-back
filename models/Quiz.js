const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String
    },
    text: {
        type: String
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswerIndex: {
        type: Number
    },
    correctAnswers: [{
        type: Number
    }]
}, { _id: true });

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    passingThreshold: {
        type: Number,
        default: 50
    },
    threshold: {
        type: Number,
        default: 50,
        min: 0,
        max: 100
    },
    questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
