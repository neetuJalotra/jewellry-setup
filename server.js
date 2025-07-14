// Jewellery Management System - Backend Server (Database-less Version)
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.VERCEL ? true : 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check route
app.get('/api/health', (req, res) => {
  console.log('Health check request received');
  res.json({ 
    success: true, 
    message: 'API is running (no database)',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL ? 'vercel' : 'local'
  });
});

// Mock registration route
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  // Simulate registration
  res.json({
    success: true,
    message: 'User registered (mock, no DB)',
    data: { userID: 1, firstName, lastName, email, role }
  });
});

// Mock login route - accepts any credentials
app.post('/api/auth/login', async (req, res) => {
  console.log('Login request received:', { 
    body: req.body, 
    headers: req.headers,
    url: req.url,
    method: req.method 
  });
  
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('Login failed: Missing email or password');
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  
  // Accept ANY email/password combination
  const token = jwt.sign({ userID: 1, email, role: 'Admin' }, JWT_SECRET, { expiresIn: '24h' });
  console.log('Login successful for:', email);
  
  res.json({
    success: true,
    message: 'Login successful (mock, no DB)',
    token,
    data: { 
      userID: 1, 
      email, 
      role: 'Admin',
      firstName: 'Admin',
      lastName: 'User'
    }
  });
});

// Mock dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      totalJewellery: 25,
      totalCustomers: 150,
      totalOrders: 89,
      totalRevenue: 12500.50
    }
  });
});

// Mock jewellery items
app.get('/api/jewellery', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Diamond Ring', category: 'Rings', price: 2500, stock: 5 },
      { id: 2, name: 'Gold Necklace', category: 'Necklaces', price: 1800, stock: 8 },
      { id: 3, name: 'Silver Bracelet', category: 'Bracelets', price: 450, stock: 12 }
    ]
  });
});

// Mock customers
app.get('/api/customers', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123-456-7890' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '098-765-4321' }
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.VERCEL ? 'Server error occurred' : error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Only start server in development
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Access the application at: http://localhost:${PORT}`);
    console.log(`🔗 API endpoints available at: http://localhost:${PORT}/api`);
  });
}

module.exports = app;
