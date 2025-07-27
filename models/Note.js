const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new mongoose.Schema({ 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true, // Automatically add createdAt and updatedAt fields
}
)

noteSchema.plugin(AutoIncrement, {
     inc_field: 'ticket',
     id: 'ticketNums',
     start_seq: 500
}) // Auto-increment field for noteId

module.exports = mongoose.model('Note', noteSchema)