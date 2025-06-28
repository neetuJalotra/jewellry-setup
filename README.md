# 💎 Jewellery Management System

A comprehensive web-based jewellery management system with user registration, authentication, and full CRUD operations for jewellery items, customers, orders, and inventory management.

## 🚀 Features

### ✅ Sprint 1 - Foundation (Completed)
- **User Registration & Authentication**
  - Self-registration system with role-based access
  - Secure login with password validation
  - User roles: Admin, Manager, Staff
  - Session management and remember me functionality

- **Jewellery Items Management**
  - Add, edit, delete jewellery items
  - Categories: Rings, Necklaces, Earrings, Bracelets, Watches
  - Track materials, prices, stock levels
  - Image upload support
  - Search and filter functionality

- **Customer Management**
  - Complete customer database
  - Add, edit, delete customer records
  - Contact information management
  - Customer order history

- **Order Management**
  - Create and manage orders
  - Order status tracking (Pending, Processing, Shipped, Delivered, Cancelled)
  - Multiple items per order
  - Order numbering system
  - Total calculation

- **Inventory Management**
  - Stock level tracking
  - Inventory transactions
  - Low stock alerts
  - Stock adjustment history

- **Dashboard & Reports**
  - Real-time statistics
  - Recent activities
  - Top selling items
  - Revenue tracking
  - Visual charts and graphs

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Dynamic functionality
- **Font Awesome** - Icons
- **LocalStorage** - Client-side data persistence

### Backend (Planned)
- **Node.js** with Express.js (recommended)
- **MySQL** - Database (free and open-source)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 📁 Project Structure

```
ist folder/
├── index.html              # Login page
├── register.html           # Registration page
├── dashboard.html          # Main dashboard
├── styles.css              # Login/Register styles
├── dashboard.css           # Dashboard styles
├── script.js               # Login functionality
├── register.js             # Registration functionality
├── dashboard.js            # Dashboard functionality
├── database-setup.sql      # MySQL database schema
├── api-structure.md        # API documentation
├── server.js               # Node.js backend server
├── package.json            # Node.js dependencies
├── SETUP-GUIDE.md          # Setup instructions
├── README.md               # This file
└── design/
    └── Project Title jeweller.docx  # Project documentation
```

## 🚀 Getting Started

### Option 1: Current Setup (Client-Side Only)
1. **Start the server:**
   ```bash
   python -m http.server 8000
   ```

2. **Access the application:**
   - Open your browser and go to `http://localhost:8000`
   - Register a new account at `http://localhost:8000/register.html`
   - Login with your credentials

### Option 2: MySQL Integration (Recommended)

#### Prerequisites
- MySQL Community Server (free)
- Node.js (for backend API)
- npm or yarn

#### Database Setup
1. **Install MySQL:**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP: https://www.apachefriends.org/

2. **Run the database script:**
   ```sql
   -- Execute database-setup.sql in MySQL
   -- This creates the database, tables, and sample data
   ```

3. **Install backend dependencies:**
   ```bash
   npm install
   ```

4. **Configure database connection:**
   - Update `dbConfig` in `server.js` with your MySQL credentials
   - Set up environment variables for production

5. **Start the backend server:**
   ```bash
   npm start
   ```

6. **Update frontend API calls:**
   - Replace localStorage operations with API calls
   - Use the provided `api.js` service

## 👤 User Registration System

### Registration Process
1. Navigate to `http://localhost:8000/register.html`
2. Fill in the registration form:
   - First Name and Last Name
   - Email address (unique)
   - Password (minimum 6 characters)
   - Confirm password
   - Select role (Admin, Manager, Staff)
   - Agree to terms and conditions

3. Click "Create Account"
4. You'll be redirected to login page
5. Login with your new credentials

### User Roles
- **Admin**: Full access to all features
- **Manager**: Can manage items, customers, and orders
- **Staff**: Basic access to view and create orders

## 🔐 Authentication

### Current System (Client-Side)
- User data stored in browser localStorage
- Session management with automatic redirect
- Password validation and error handling

### Planned System (MySQL)
- JWT token-based authentication
- Secure password hashing with bcrypt
- Role-based access control
- Session timeout and refresh tokens

## 📊 Database Schema

### Core Tables
- **Users** - User accounts and authentication
- **JewelleryItems** - Product catalog
- **Customers** - Customer information
- **Orders** - Order management
- **OrderItems** - Order line items
- **InventoryTransactions** - Stock tracking
- **AuditLog** - Activity logging

### Key Features
- Foreign key relationships
- Indexes for performance
- Stored procedures for common operations
- Triggers for audit logging
- Sample data included

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Jewellery Management
- `GET /api/jewellery` - Get all items
- `POST /api/jewellery` - Add new item
- `PUT /api/jewellery/:id` - Update item
- `DELETE /api/jewellery/:id` - Delete item

### Customer Management
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Add new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Order Management
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/recent` - Get recent activities

## 🎨 UI/UX Features

### Modern Design
- Clean, professional interface
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive navigation

### User Experience
- Real-time form validation
- Loading states and feedback
- Error handling and notifications
- Keyboard shortcuts
- Search and filter capabilities

## 🔒 Security Features

### Current Implementation
- Input validation and sanitization
- Password strength requirements
- Session management
- XSS protection

### Planned Implementation
- JWT token authentication
- Password hashing with bcrypt
- SQL injection prevention
- CORS configuration
- Rate limiting
- HTTPS enforcement

## 📈 Future Enhancements

### Sprint 2 (Planned)
- Advanced reporting and analytics
- Email notifications
- Barcode scanning
- Multi-language support
- Mobile app development

### Sprint 3 (Planned)
- E-commerce integration
- Payment processing
- Customer portal
- Advanced inventory forecasting
- Supplier management

## 🐛 Troubleshooting

### Common Issues

1. **Login not working:**
   - Clear browser localStorage
   - Register a new account
   - Check browser console for errors

2. **Data not persisting:**
   - Ensure localStorage is enabled
   - Check browser storage limits
   - Clear browser cache

3. **Database connection issues:**
   - Verify MySQL is running
   - Check database credentials
   - Ensure firewall allows connections

### Support
For technical support or questions, please refer to the project documentation in the `design/` folder.

## 📝 License

This project is developed for educational and demonstration purposes. Feel free to modify and extend according to your needs.

---

**Developed with ❤️ for Jewellery Management Excellence** 