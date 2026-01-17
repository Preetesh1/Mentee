const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({ 
    // Basic Info
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    
    // Role System
    role: {
        type: String,
        enum: ['Mentee', 'Mentor', 'Admin'],
        default: 'Mentee',
        required: true
    },
    
    // Profile Information
    profile: {
        fullName: {
            type: String,
            default: ''
        },
        college: {
            type: String,
            default: ''
        },
        branch: {
            type: String,
            default: ''
        },
        year: {
            type: String,
            enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni', ''],
            default: ''
        },
        bio: {
            type: String,
            default: '',
            maxlength: 500
        },
        skills: [{
            type: String
        }],
        interests: [{
            type: String
        }],
        linkedin: {
            type: String,
            default: ''
        },
        github: {
            type: String,
            default: ''
        },
        // For mentors
        expertise: [{
            type: String
        }],
        yearsOfExperience: {
            type: Number,
            default: 0
        },
        company: {
            type: String,
            default: ''
        },
        position: {
            type: String,
            default: ''
        },
        availability: {
            type: Boolean,
            default: true
        }
    },
    
    // Status
    active: {
        type: Boolean,
        default: true
    },
    
    // Verification
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)