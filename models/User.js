const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true
    },

    password: {
        type: String,
        required: true
    },

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    role: {
        type: String,
        required: true,
        enum: ['student', 'admin'],
        default: 'student'

    },

    firstLogin: {
        type: Boolean,
        default:true
    }
})

module.exports = mongoose.model('User', userSchema);