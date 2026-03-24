const Message = require('../models/Message')

const onlineUsers = new Map()

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`)

    socket.on('user:register', (userId) => {
      onlineUsers.set(userId, socket.id)
      socket.userId = userId
      io.emit('users:online', Array.from(onlineUsers.keys()))
    })

    socket.on('room:join', (partnerUserId) => {
      const room = [socket.userId, partnerUserId].sort().join(':')
      socket.join(room)
    })

    socket.on('message:send', async ({ receiverId, text, requestId }) => {
      try {
        const saved = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          text,
          requestId: requestId || null,
        })
        const populated = await Message.findById(saved._id)
          .populate('sender', 'username profile.fullName')
          .populate('receiver', 'username profile.fullName')
          .lean()

        const room = [socket.userId, receiverId].sort().join(':')
        io.to(room).emit('message:receive', populated)

        const receiverSocketId = onlineUsers.get(receiverId)
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('notification:message', {
            from: socket.userId,
            preview: text.slice(0, 60),
          })
        }
      } catch (err) {
        socket.emit('error', { message: 'Message could not be delivered' })
        console.error('[Socket] message:send error:', err)
      }
    })

    socket.on('typing:start', ({ receiverId }) => {
      const room = [socket.userId, receiverId].sort().join(':')
      socket.to(room).emit('typing:start', { userId: socket.userId })
    })

    socket.on('typing:stop', ({ receiverId }) => {
      const room = [socket.userId, receiverId].sort().join(':')
      socket.to(room).emit('typing:stop', { userId: socket.userId })
    })

    socket.on('messages:read', async ({ senderId }) => {
      await Message.updateMany(
        { sender: senderId, receiver: socket.userId, read: false },
        { read: true }
      )
      const senderSocketId = onlineUsers.get(senderId)
      if (senderSocketId) io.to(senderSocketId).emit('messages:read', { by: socket.userId })
    })

    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId)
        io.emit('users:online', Array.from(onlineUsers.keys()))
        console.log(`[Socket] Disconnected: ${socket.userId}`)
      }
    })
  })
}

module.exports = socketHandler
