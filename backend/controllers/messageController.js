const Message = require('../models/Message')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const getConversation = asyncHandler(async (req, res) => {
  const { userId1, userId2 } = req.params
  const messages = await Message.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'username profile.fullName')
    .populate('receiver', 'username profile.fullName')
    .lean()

  await Message.updateMany(
    { sender: userId2, receiver: userId1, read: false },
    { read: true }
  )
  res.json(messages)
})

const getInbox = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const inbox = await Message.aggregate([
    { $match: { $or: [{ sender: new mongoose.Types.ObjectId(userId) }, { receiver: new mongoose.Types.ObjectId(userId) }] } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: { $cond: [{ $eq: ['$sender', new mongoose.Types.ObjectId(userId)] }, '$receiver', '$sender'] },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: { $sum: { $cond: [{ $and: [{ $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] }, { $eq: ['$read', false] }] }, 1, 0] } },
      },
    },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'partner' } },
    { $unwind: '$partner' },
    { $project: { partnerId: '$_id', partnerName: '$partner.profile.fullName', partnerRole: '$partner.role', lastMessage: 1, unreadCount: 1 } },
  ])
  res.json(inbox)
})

module.exports = { getConversation, getInbox }
