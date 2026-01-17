const User = require('../models/User')
const MentorshipRequest = require('../models/Mentorshiprequest')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Register new user
// @route POST /users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' })
    }

    // Check for duplicate username or email
    const duplicateUsername = await User.findOne({ username }).lean().exec()
    if (duplicateUsername) {
        return res.status(409).json({ message: 'Username already exists' })
    }

    const duplicateEmail = await User.findOne({ email }).lean().exec()
    if (duplicateEmail) {
        return res.status(409).json({ message: 'Email already exists' })
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = {
        username,
        email,
        password: hashedPwd,
        role: role || 'Mentee'
    }

    // Create user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } else {
        res.status(400).json({ message: 'Invalid user data' })
    }
})

// @desc Login user
// @route POST /users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email }).exec()

    if (!user || !user.active) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Return user data (in production, return JWT token)
    res.json({
        message: 'Login successful',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile: user.profile
        }
    })
})

// @desc Get all users
// @route GET /users
// @access Public
const getAllUsers = asyncHandler(async (req, res) => {
    const { role } = req.query
    
    let query = { active: true }
    if (role) {
        query.role = role
    }

    const users = await User.find(query)
        .select('-password')
        .lean()
        
    res.json(users)
})

// @desc Get user by ID
// @route GET /users/:id
// @access Public
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password')
        .lean()
        
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    
    res.json(user)
})

// @desc Get all mentors
// @route GET /users/mentors
// @access Public
const getAllMentors = asyncHandler(async (req, res) => {
    const mentors = await User.find({ 
        role: 'Mentor', 
        active: true,
        'profile.availability': true 
    })
        .select('-password')
        .lean()
        
    res.json(mentors)
})

// @desc Update user profile
// @route PATCH /users/profile/:id
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = req.body

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    // Update profile fields
    if (updates.profile) {
        user.profile = { ...user.profile, ...updates.profile }
    }

    // Update basic fields if provided
    if (updates.username) user.username = updates.username
    if (updates.email) user.email = updates.email
    if (updates.role) user.role = updates.role

    const updatedUser = await user.save()

    res.json({
        message: 'Profile updated successfully',
        user: {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            profile: updatedUser.profile
        }
    })
})

// @desc Update user password
// @route PATCH /users/password/:id
// @access Private
const updatePassword = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new password are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    // Verify current password
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) {
        return res.status(401).json({ message: 'Current password is incorrect' })
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.json({ message: 'Password updated successfully' })
})

// @desc Delete user
// @route DELETE /users/:id
// @access Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params

    // Check for mentorship requests
    const requests = await MentorshipRequest.findOne({
        $or: [{ mentee: id }, { mentor: id }]
    }).lean().exec()

    if (requests) {
        return res.status(400).json({ 
            message: 'Cannot delete user with active mentorship requests' 
        })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    await user.deleteOne()

    res.json({ message: `User ${user.username} deleted successfully` })
})

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    getAllMentors,
    updateProfile,
    updatePassword,
    deleteUser
}