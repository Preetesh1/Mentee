const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipRequest', default: null },
  text: { type: String, required: true, maxlength: 2000 },
  read: { type: Boolean, default: false },
}, { timestamps: true })

messageSchema.index({ sender: 1, receiver: 1 })
messageSchema.index({ requestId: 1 })

module.exports = mongoose.model('Message', messageSchema)
