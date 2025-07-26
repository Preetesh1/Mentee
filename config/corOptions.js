const allowedOrigins = require('./allowedOrigins')  

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true) // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')) // Reject the request
        }
    },
    credentials : true, // Allow cookies to be sent with requests
    optionsSuccessStatus: 200, // For legacy browser support
}

module.exports = corsOptions;