const MentorshipRequest = require('../models/Mentorshiprequest')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Create mentorship request
// @route POST /mentorship
// @access Private
const createRequest = asyncHandler(async (req, res) => {
    const { mentee, mentor, subject, message, helpWith } = req.body

    // Validate input
    if (!mentee || !mentor || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Verify users exist
    const menteeUser = await User.findById(mentee).exec()
    const mentorUser = await User.findById(mentor).exec()

    if (!menteeUser || !mentorUser) {
        return res.status(404).json({ message: 'User not found' })
    }

    // Verify roles
    if (menteeUser.role !== 'Mentee') {
        return res.status(400).json({ message: 'Requester must be a mentee' })
    }

    if (mentorUser.role !== 'Mentor') {
        return res.status(400).json({ message: 'Recipient must be a mentor' })
    }

    // Check for duplicate pending request
    const existingRequest = await MentorshipRequest.findOne({
        mentee,
        mentor,
        status: 'Pending'
    }).lean().exec()

    if (existingRequest) {
        return res.status(409).json({ 
            message: 'You already have a pending request with this mentor' 
        })
    }

    // Create request
    const request = await MentorshipRequest.create({
        mentee,
        mentor,
        subject,
        message,
        helpWith: helpWith || []
    })

    if (request) {
        const populatedRequest = await MentorshipRequest.findById(request._id)
            .populate('mentee', 'username email profile.fullName')
            .populate('mentor', 'username email profile.fullName')
            .lean()

        res.status(201).json({
            message: 'Mentorship request sent successfully',
            request: populatedRequest
        })
    } else {
        res.status(400).json({ message: 'Invalid request data' })
    }
})

// @desc Get all mentorship requests
// @route GET /mentorship
// @access Private
const getAllRequests = asyncHandler(async (req, res) => {
    const { userId, role, status } = req.query

    let query = {}

    if (status) {
        query.status = status
    }

    // Filter by user role
    if (userId && role === 'Mentee') {
        query.mentee = userId
    } else if (userId && role === 'Mentor') {
        query.mentor = userId
    }

    const requests = await MentorshipRequest.find(query)
        .populate('mentee', 'username email profile.fullName profile.college profile.year')
        .populate('mentor', 'username email profile.fullName profile.company profile.position')
        .sort({ createdAt: -1 })
        .lean()

    res.json(requests)
})

// @desc Get single request
// @route GET /mentorship/:id
// @access Private
const getRequestById = asyncHandler(async (req, res) => {
    const request = await MentorshipRequest.findById(req.params.id)
        .populate('mentee', 'username email profile')
        .populate('mentor', 'username email profile')
        .lean()

    if (!request) {
        return res.status(404).json({ message: 'Request not found' })
    }

    res.json(request)
})

// @desc Update request status (Accept/Reject)
// @route PATCH /mentorship/:id/status
// @access Private (Mentor)
const updateRequestStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status, mentorResponse, meetingDetails } = req.body

    if (!status || !['Accepted', 'Rejected', 'Completed'].includes(status)) {
        return res.status(400).json({ 
            message: 'Valid status is required (Accepted, Rejected, Completed)' 
        })
    }

    const request = await MentorshipRequest.findById(id).exec()

    if (!request) {
        return res.status(404).json({ message: 'Request not found' })
    }

    request.status = status
    
    if (mentorResponse) {
        request.mentorResponse = mentorResponse
    }

    if (status === 'Accepted' && meetingDetails) {
        request.meetingDetails = meetingDetails
    }

    const updatedRequest = await request.save()

    const populatedRequest = await MentorshipRequest.findById(updatedRequest._id)
        .populate('mentee', 'username email profile.fullName')
        .populate('mentor', 'username email profile.fullName')
        .lean()

    res.json({
        message: `Request ${status.toLowerCase()} successfully`,
        request: populatedRequest
    })
})

// @desc Update request
// @route PATCH /mentorship/:id
// @access Private
const updateRequest = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = req.body

    const request = await MentorshipRequest.findById(id).exec()

    if (!request) {
        return res.status(404).json({ message: 'Request not found' })
    }

    // Update allowed fields
    if (updates.subject) request.subject = updates.subject
    if (updates.message) request.message = updates.message
    if (updates.helpWith) request.helpWith = updates.helpWith

    const updatedRequest = await request.save()

    const populatedRequest = await MentorshipRequest.findById(updatedRequest._id)
        .populate('mentee', 'username email profile.fullName')
        .populate('mentor', 'username email profile.fullName')
        .lean()

    res.json({
        message: 'Request updated successfully',
        request: populatedRequest
    })
})

// @desc Delete request
// @route DELETE /mentorship/:id
// @access Private
const deleteRequest = asyncHandler(async (req, res) => {
    const { id } = req.params

    const request = await MentorshipRequest.findById(id).exec()

    if (!request) {
        return res.status(404).json({ message: 'Request not found' })
    }

    await request.deleteOne()

    res.json({ 
        message: 'Mentorship request deleted successfully',
        id 
    })
})

// @desc Get request statistics for dashboard
// @route GET /mentorship/stats/:userId
// @access Private
const getRequestStats = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const { role } = req.query

    let stats = {}

    if (role === 'Mentee') {
        const total = await MentorshipRequest.countDocuments({ mentee: userId })
        const pending = await MentorshipRequest.countDocuments({ mentee: userId, status: 'Pending' })
        const accepted = await MentorshipRequest.countDocuments({ mentee: userId, status: 'Accepted' })
        const completed = await MentorshipRequest.countDocuments({ mentee: userId, status: 'Completed' })

        stats = { total, pending, accepted, completed }
    } else if (role === 'Mentor') {
        const total = await MentorshipRequest.countDocuments({ mentor: userId })
        const pending = await MentorshipRequest.countDocuments({ mentor: userId, status: 'Pending' })
        const accepted = await MentorshipRequest.countDocuments({ mentor: userId, status: 'Accepted' })
        const completed = await MentorshipRequest.countDocuments({ mentor: userId, status: 'Completed' })

        stats = { total, pending, accepted, completed }
    }

    res.json(stats)
})

module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequestStatus,
    updateRequest,
    deleteRequest,
    getRequestStats
}