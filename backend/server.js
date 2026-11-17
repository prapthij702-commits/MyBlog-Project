
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

// Check required environment settings
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing from the .env file.');
    process.exit(1);
}

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. Please login.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Invalid or expired token.'
            });
        }

        req.user = user;
        next();
    });
}

// USER REGISTRATION API
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must contain at least 8 characters'
            });
        }

        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: result.insertId,
                name,
                email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Registration failed'
        });
    }
});

// USER LOGIN API - Generate JWT
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const [users] = await db.execute(
            'SELECT * FROM users WHERE LOWER(email) = LOWER(?)',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        const user = users[0];

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Incorrect password'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Login failed'
        });
    }
});

// GET LOGGED-IN USER PROFILE
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, name, email FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'Profile fetched successfully',
            user: users[0]
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            message: 'Could not fetch profile'
        });
    }
});

// GET API - Display only the logged-in user's blogs
app.get('/api/blogs', authenticateToken, async (req, res) => {
    try {
        const [blogs] = await db.execute(
            'SELECT * FROM blogs WHERE user_id = ? ORDER BY id DESC',
            [req.user.id]
        );

        res.json(blogs);
    } catch (error) {
        console.error('View blogs error:', error);
        res.status(500).json({
            message: 'Could not fetch blogs'
        });
    }
});

// POST API - Create a blog for the logged-in user
app.post('/api/blogs', authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: 'Title and content are required'
            });
        }

        const [result] = await db.execute(
            'INSERT INTO blogs (title, content, user_id) VALUES (?, ?, ?)',
            [title, content, req.user.id]
        );

        const newBlog = {
            id: result.insertId,
            title,
            content,
            user_id: req.user.id
        };

        res.status(201).json({
            message: 'Blog created successfully',
            blog: newBlog
        });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({
            message: 'Could not create blog'
        });
    }
});

// PUT API - Update only the logged-in user's blog
app.put('/api/blogs/:id', authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, content } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid blog ID'
            });
        }

        if (title === undefined && content === undefined) {
            return res.status(400).json({
                message: 'Provide a title or content to update'
            });
        }

        const [existingBlogs] = await db.execute(
            'SELECT id FROM blogs WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (existingBlogs.length === 0) {
            return res.status(404).json({
                message: 'Blog not found'
            });
        }

        await db.execute(
            `UPDATE blogs
             SET title = COALESCE(?, title),
                 content = COALESCE(?, content)
             WHERE id = ? AND user_id = ?`,
            [title ?? null, content ?? null, id, req.user.id]
        );

        const [updatedBlogs] = await db.execute(
            'SELECT * FROM blogs WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        res.json({
            message: 'Blog updated successfully',
            blog: updatedBlogs[0]
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            message: 'Could not update blog'
        });
    }
});

// DELETE API - Delete only the logged-in user's blog
app.delete('/api/blogs/:id', authenticateToken, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid blog ID'
            });
        }

        const [result] = await db.execute(
            'DELETE FROM blogs WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Blog not found'
            });
        }

        res.json({
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            message: 'Could not delete blog'
        });
    }
});

// Start server after checking MySQL connection
async function startServer() {
    try {
        const connection = await db.getConnection();

        console.log('MySQL database connected successfully!');

        connection.release();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('MySQL connection failed:', error.message);
        process.exit(1);
    }
}

startServer();
