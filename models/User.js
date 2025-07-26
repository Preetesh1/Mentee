const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true,
        // unique: true,
        // trim: true
    },
    password: {
        type: String,
        required: true,
        // minlength: 6
    },
    roles: [{
        type: String,
        default: 'Employee',
    }],
    active: {
        type: boolean,
        default: true
    }
})

module.exports = mongoose.model('User', userSchema)