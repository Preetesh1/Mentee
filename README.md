![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=for-the-badge)

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

### 📁 Project Structure

```bash
MENTEE-Backend/
│
├── assets/                      # Project assets (e.g. banner image)
│   └── banner.PNG
│
├── config/                      # Configuration files
│   ├── allowedOrigins.js
│   ├── corsOptions.js
│   └── dbConn.js
│
├── controllers/                 # Handles route logic
│   ├── mentorshipController.js
│   └── usersController.js
│
├── middleware/                  # Custom middleware (e.g., error handling, logging)
│   ├── errorHandler.js
│   └── logger.js
│
├── models/                      # Mongoose schemas for MongoDB
│   ├── Mentorshiprequest.js
│   └── User.js
│
├── public/                      # Static assets
│   └── css/
│       └── style.css
│
├── routes/                      # API route definitions
│   ├── MentorshipRoutes.js
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
```

--- 

## ⚙️ Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/MENTEE-Backend.git
cd MENTEE-Backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a .env file in the root directory and add:
```bash
PORT=3500
MONGO_URI=your_mongodb_connection_string
```
### 4. Start the server
```bash
npm run dev
```
**The server will start on `http://localhost:3500`**

---

### 📌 Features

- 🔐 User Registration and Login
- 👥 Role-based access control (Admin, Mentor, Mentee)
- 📝 Create, Read, Update, and Delete Notes
- 🌐 CORS & Security Middleware
- 📄 Static file serving and HTML views
- 🧩 Modular codebase for easy scaling
- 🧪 Environment-based configuration

---

### 📡 API Endpoints Overview

#### 👤 User Routes (`/users`)
| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| GET    | `/users`         | Get all users (Admin only)|
| POST   | `/users`         | Register a new user       |

#### 📝 Notes Routes (`/notes`)
| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| GET    | `/notes`         | Get all notes             |
| POST   | `/notes`         | Create a new note         |
| PATCH  | `/notes`         | Update an existing note   |
| DELETE | `/notes`         | Delete a note             |

#### 🏠 Root Routes (`/`)
| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| GET    | `/`              | Root route — serves index |
| GET    | `/*`             | Handles 404 via HTML page |

---

> 🚫 **Important Notice**
>
> This project is publicly visible **only for demonstration and resume purposes**.
> All rights are reserved by the author. **Unauthorized use, reproduction, or distribution of this code is strictly prohibited.**
> Please do not copy, fork, or reuse this code for commercial or educational purposes without explicit permission.
>
> 🛡️ Project by Preetesh Sharma | All Rights Reserved