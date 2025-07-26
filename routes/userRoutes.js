const express = require('express')
const router = express.Router()
const UserController = require('../controllers/usersController')

router .route('/')
    .get(usersController.getAllUsers)
    .post(usersController.CreateNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.DeleteUser)

    module.exports = router