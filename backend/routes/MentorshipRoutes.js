const express = require('express')
const router = express.Router()
const mentorshipController = require('../controllers/mentorshipController')

router.route('/')
    .get(mentorshipController.getAllRequests)
    .post(mentorshipController.createRequest)

router.get('/stats/:userId', mentorshipController.getRequestStats)

router.route('/:id')
    .get(mentorshipController.getRequestById)
    .patch(mentorshipController.updateRequest)
    .delete(mentorshipController.deleteRequest)

router.patch('/:id/status', mentorshipController.updateRequestStatus)

module.exports = router