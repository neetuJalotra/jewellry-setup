// Jewellery Management System - Backend Server
// Node.js with Express.js and MySQL

const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'root', // ⚠️ IMPORTANT: Replace with your MySQL root password
    database: 'JewelleryManagementSystem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Create connection pool
let pool;

// Initialize database connection
async function initializeDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        
        // Test connection
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('Please check your database configuration in server.js');
        process.exit(1);
    }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
};

// Authentication Routes

// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        
        // Validate input
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const connection = await pool.getConnection();
        
        try {
            // Check if email already exists
            const [existingUsers] = await connection.execute(
                'SELECT UserID FROM Users WHERE Email = ?',
                [email]
            );
            
            if (existingUsers.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }
            
            // Insert new user
            const [result] = await connection.execute(
                'CALL sp_RegisterUser(?, ?, ?, ?, ?)',
                [firstName, lastName, email, hashedPassword, role]
            );
            
            const userID = result[0][0].UserID;
            
            res.json({
                success: true,
                message: 'User registered successfully',
                data: {
                    userID,
                    firstName,
                    lastName,
                    email,
                    role
                }
            });
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        
        const connection = await pool.getConnection();
        
        try {
            // Get user by email
            const [users] = await connection.execute(
                'SELECT * FROM Users WHERE Email = ? AND IsActive = TRUE',
                [email]
            );
            
            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            
            const user = users[0];
            const validPassword = await bcrypt.compare(password, user.Password);
            
            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            
            // Update last login
            await connection.execute(
                'UPDATE Users SET LastLogin = CURRENT_TIMESTAMP WHERE UserID = ?',
                [user.UserID]
            );
            
            // Generate JWT token
            const token = jwt.sign(
                { 
                    userID: user.UserID, 
                    email: user.Email, 
                    role: user.Role 
                }, 
                JWT_SECRET, 
                { expiresIn: '24h' }
            );
            
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        userID: user.UserID,
                        firstName: user.FirstName,
                        lastName: user.LastName,
                        email: user.Email,
                        role: user.Role
                    }
                }
            });
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Jewellery Items Routes

// Get all jewellery items
app.get('/api/jewellery', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        try {
            const [items] = await connection.execute('CALL sp_GetJewelleryItems()');
            
            res.json({
                success: true,
                data: items[0]
            });
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error('Get jewellery error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch jewellery items',
            error: error.message
        });
    }
});

// Add new jewellery item
app.post('/api/jewellery', authenticateToken, async (req, res) => {
    try {
        const { name, category, material, price, stock, imageURL, description } = req.body;
        
        if (!name || !category || !material || !price || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Required fields missing'
            });
        }
        
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'CALL sp_AddJewelleryItem(?, ?, ?, ?, ?, ?, ?, ?)',
                [name, category, material, price, stock, imageURL, description, req.user.userID]
            );
            
            const itemID = result[0][0].ItemID;
            
            res.json({
                success: true,
                message: 'Jewellery item added successfully',
                data: { itemID }
            });
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error('Add jewellery error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add jewellery item',
            error: error.message
        });
    }
});

// Update jewellery item
app.put('/api/jewellery/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, material, price, stock, imageURL, description } = req.body;
        
        const connection = await pool.getConnection();
        
        try {
            await connection.execute(
                'CALL sp_UpdateJewelleryItem(?, ?, ?, ?, ?, ?, ?, ?)',
                [id, name, category, material, price, stock, imageURL, description]
            );
            
            res.json({
                success: true,
                message: 'Jewellery item updated successfully'
            });
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error('Update jewellery error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update jewellery item',
            error: error.message
        });
    }
});

// Delete jewellery item
app.delete('/api/jewellery/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const connection = await pool.getConnection();
        
        try {
            await connection.execute('CALL sp_DeleteJewelleryItem(?)', [id]);
            
            res.json({
                success: true,
                message: 'Jewellery item deleted successfully'
            });
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error('Delete jewellery error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete jewellery item',
            error: error.message
        });
    }
});

// Customer Routes

// Get all customers
app.get('/api/customers', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        try {
            const [customers] = await connection.execute(
                'SELECT * FROM Customers WHERE IsActive = TRUE ORDER BY CreatedAt DESC'
            );
            
            res.json({
                success: true,
                data: customers
            });
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            error: error.message
        });
    }
});

// Add new customer
app.post('/api/customers', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address } = req.body;
        
        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, and email are required'
            });
        }
        
        const connection = await pool.getConnection();
        
        try {
            const [result] = await connection.execute(
                'INSERT INTO Customers (FirstName, LastName, Email, Phone, Address, CreatedBy) VALUES (?, ?, ?, ?, ?, ?)',
                [firstName, lastName, email, phone, address, req.user.userID]
            );
            
            res.json({
                success: true,
                message: 'Customer added successfully',
                data: { customerID: result.insertId }
            });
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error('Add customer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add customer',
            error: error.message
        });
    }
});

// Dashboard Routes

// Get dashboard statistics
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        try {
            const [stats] = await connection.execute('CALL sp_GetDashboardStats()');
            
            res.json({
                success: true,
                data: stats[0][0]
            });
        } finally {
            connection.release();
        }
        
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});

// Serve static files (for development)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Access the application at: http://localhost:${PORT}`);
    console.log(`🔗 API endpoints available at: http://localhost:${PORT}/api`);
    
    // Initialize database connection
    await initializeDatabase();
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    if (pool) {
        await pool.end();
    }
    process.exit(0);
});

module.exports = app;
