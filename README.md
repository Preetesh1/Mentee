> 🚫 **Important Notice**
>
> This project is publicly visible **only for demonstration and resume purposes**.
> All rights are reserved by the author. **Unauthorized use, reproduction, or distribution of this code is strictly prohibited.**
> Please do not copy, fork, or reuse this code for commercial or educational purposes without explicit permission.
>
> 🛡️ Project by Preetesh Sharma | All Rights Reserved

<p align="center">
  <img src="./assets/banner.PNG" alt="MENTEE Logo" width="400"/>
</p>

# 💡 MENTEE Backend – Powering Connections, One API at a Time

Welcome to the **MENTEE** backend — the brain behind the mentorship platform that empowers students by connecting them with alumni, seniors, and professionals for real growth and guidance.

Built with 💚 **Node.js + Express + MongoDB**, this server does all the heavy lifting for authentication, profile management, mentorship request flow, and more.

---

## 🚀 What This Backend Can Do

- 🔐 Secure JWT Authentication (Login & Signup)
- 👥 User Roles – Mentor, Mentee, Admin
- 📂 Full Profile System (with MongoDB)
- 💬 Mentorship Requests Between Users
- 🛡️ Middleware for Protected Routes
- 🌐 REST APIs You Can Plug into Any Frontend

---

## 🛠️ Tech Stack

| Tool         | Purpose                          |
|--------------|----------------------------------|
| Node.js      | Backend JavaScript runtime       |
| Express.js   | API server framework              |
| MongoDB      | NoSQL database                    |
| Mongoose     | MongoDB object modeling           |
| JWT          | Auth token system                 |
| bcryptjs     | Password hashing                  |
| dotenv       | Environment variable management   |
| CORS         | Cross-origin requests             |
| Nodemon      | Auto-reloading in dev             |

---

MENTEE-Backend/
│
├── assets/                      # Project assets (e.g. banner image)
│   └── banner.PNG
│
├── config/                      # Configuration files
│   ├── allowedOrigins.js
│   ├── corOptions.js
│   └── dbConn.js
│
├── controllers/                 # Handles route logic
│   ├── notesController.js
│   └── usersController.js
│
├── middleware/                  # Custom middleware (e.g., error handling, logging)
│   ├── errorHandler.js
│   └── logger.js
│
├── models/                      # Mongoose schemas for MongoDB
│   ├── Note.js
│   └── User.js
│
├── public/                      # Static assets
│   └── css/
│       └── style.css
│
├── routes/                      # API route definitions
│   ├── notesRoutes.js
│   ├── root.js
│   └── userRoutes.js
│
├── views/                       # HTML pages for public routes
│   ├── 404.html
│   └── index.html
│
├── .env                         # Environment variables (not committed)
├── package.json                 # Project metadata and dependencies
├── package-lock.json            # Dependency lock file
└── server.js                    # Main server entry point

---

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=for-the-badge)