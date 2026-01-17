const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

// Auth routes
router.post('/register', usersController.registerUser)
router.post('/login', usersController.loginUser)

// User routes
router.get('/', usersController.getAllUsers)
router.get('/mentors', usersController.getAllMentors)
router.get('/:id', usersController.getUserById)

// Profile management
router.patch('/profile/:id', usersController.updateProfile)
router.patch('/password/:id', usersController.updatePassword)

// Admin routes
router.delete('/:id', usersController.deleteUser)

module.exports = router