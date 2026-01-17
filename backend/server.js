require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const { logEvents } = require('./middleware/logger')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

// Connect to MongoDB
connectDB()

// Middleware
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// Serve static files
app.use('/', express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/mentorship', require('./routes/mentorshipRoutes'))

// 404 Handler
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// Error handler
app.use(errorHandler)

// Start server once MongoDB is connected
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`🚀 MENTEE Backend running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})