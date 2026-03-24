const express = require('express')
const router = express.Router()
const { getConversation, getInbox } = require('../controllers/messageController')

router.get('/inbox/:userId', getInbox)
router.get('/:userId1/:userId2', getConversation)

module.exports = router
