# My Blog Application

A full-stack Blog Application developed using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.

This application allows users to register, log in securely, and manage their own blog posts.

## Features

- User Registration
- User Login
- JWT Authentication and Authorization
- Secure Password Hashing
- Create Blog Posts
- View Blog Posts
- Edit Blog Posts
- Delete Blog Posts
- Search Blogs by Title
- View Individual Blog Details
- User-specific Blog Management
- Logout Functionality

## Technologies Used

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MySQL

**Authentication**
- JSON Web Token (JWT)
- bcryptjs

## Project Structure

```text
blog/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   └── blog-details.html
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/prapthij702-commits/MyBlog-Project.git
```

### 2. Navigate to Backend

```bash
cd MyBlog-Project/backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder.

Add the following variables using your own MySQL credentials and a secure JWT secret:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blog_db
JWT_SECRET=your_secure_jwt_secret
```

**Important:** Do not upload your `.env` file to GitHub.

### 5. Start the Backend Server

```bash
node server.js
```

The backend server runs at:

```text
http://localhost:5000
```

### 6. Open the Frontend

Open the `frontend/index.html` file using the VS Code Live Server extension.

## GitHub Repository

[My Blog Application - GitHub](https://github.com/prapthij702-commits/MyBlog-Project)

## Project Status

Developed as part of my Full Stack Web Development Internship at Codomax