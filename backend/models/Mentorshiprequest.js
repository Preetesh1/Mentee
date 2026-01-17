const mongoose = require('mongoose')

const mentorshipRequestSchema = new mongoose.Schema({
    // Who is requesting mentorship
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    
    // Who they want as a mentor
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    
    // Request details
    subject: {
        type: String,
        required: true,
        trim: true
    },
    
    message: {
        type: String,
        required: true,
        maxlength: 1000
    },
    
    // Areas of help needed
    helpWith: [{
        type: String,
        enum: [
            'Career Guidance',
            'Academic Help',
            'Internship Advice',
            'Interview Preparation',
            'Skill Development',
            'Project Guidance',
            'Resume Review',
            'Personal Growth',
            'Industry Insights',
            'Other'
        ]
    }],
    
    // Status tracking
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending'
    },
    
    // Response from mentor
    mentorResponse: {
        type: String,
        default: ''
    },
    
    // Meeting details (if accepted)
    meetingDetails: {
        platform: {
            type: String,
            default: ''
        },
        link: {
            type: String,
            default: ''
        },
        scheduledAt: {
            type: Date
        }
    }
}, {
    timestamps: true
})

// Index for quick queries
mentorshipRequestSchema.index({ mentee: 1, mentor: 1 })
mentorshipRequestSchema.index({ status: 1 })

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema)