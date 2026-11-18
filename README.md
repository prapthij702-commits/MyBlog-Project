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

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MySQL
- JWT
- bcryptjs

## Project Structure

```text
blog/
│
├── backend/
│   ├── node_modules/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
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

### 2. Open the Project Folder

```bash
cd MyBlog-Project
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create or update the `.env` file inside the backend folder.

Add your own database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blog_db
JWT_SECRET=your_secret_key
```

Do not upload your `.env` file to GitHub.

### 5. Start the Backend Server

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Run the Frontend

Open the `frontend/index.html` file using the VS Code Live Server extension.

## Database

The application uses MySQL to store user accounts and blog posts.

Make sure MySQL is running and the database and required tables are configured.

## GitHub Repository

https://github.com/prapthij702-commits/MyBlog-Project

## Author

Developed as part of the Codomax Digital Solutions Internship Program.