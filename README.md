# Course Selling Backend API

This project is a Node.js/Express backend for a course selling platform. It provides RESTful APIs for user and admin authentication, course management, and course purchase/enrollment.

## Features
- User and Admin authentication (sign up & sign in)
- Admins can create and update courses
- Users can view and enroll in courses
- MongoDB for data storage

## Project Structure
```
.
├── config.js           # Configuration (JWT secrets, etc.)
├── db.js               # Mongoose models and DB connection
├── index.js            # Main server entry point
├── middleware/
│   ├── admin.js        # Admin authentication middleware
│   └── user.js         # User authentication middleware
├── routes/
│   ├── admin.js        # Admin routes (course management)
│   ├── course.js       # Course routes (enrollment, preview)
│   └── user.js         # User routes (auth, purchases)
├── package.json        # Project dependencies
└── package-lock.json   # Dependency lock file
```

## Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Create a `.env` file in the root directory with:
     ```env
     MONGO_URL=your_mongodb_connection_string
     JWT_USER_PASSWORD=your_user_jwt_secret
     JWT_ADMIN_PASSWORD=your_admin_jwt_secret
     ```
3. **Start the server:**
   ```bash
   node index.js
   ```
   The server will run on `http://localhost:3000` by default.

## API Endpoints

### User
- `POST /api/v1/user/signup` — User registration
- `POST /api/v1/user/signin` — User login (returns JWT token)
- `GET /api/v1/user/purchases` — Get user's enrolled courses (requires token)

### Admin
- `POST /api/v1/admin/signup` — Admin registration
- `POST /api/v1/admin/signin` — Admin login (returns JWT token)
- `POST /api/v1/admin/course` — Create a course (requires admin token)
- `PUT /api/v1/admin/course` — Update a course (requires admin token)
- `GET /api/v1/admin/course/bulk` — Get all courses created by admin (requires admin token)

### Courses
- `GET /api/v1/course/preview` — List all available courses
- `POST /api/v1/course/purchase` — Enroll in a course (requires user token)

## Authentication
- Pass the JWT token in the `token` header for protected routes.

