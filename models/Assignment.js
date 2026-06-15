const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    assignedToUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedToCohort: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cohort'
    },
    lessonUnlockDates: [{
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        unlockDate: { type: Date }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
