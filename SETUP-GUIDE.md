# 🚀 Setup Guide - Jewellery Management System (MySQL)

## Quick Start Options

### Option 1: Test Registration System (Immediate)
1. **Start the server:**
   ```bash
   python -m http.server 8000
   ```

2. **Access registration:**
   - Go to: `http://localhost:8000/register.html`
   - Create your own account
   - Login at: `http://localhost:8000`

3. **Test all features:**
   - Add jewellery items
   - Manage customers
   - Create orders
   - View dashboard

### Option 2: Full MySQL Integration

## Prerequisites

### 1. Install MySQL
- Download MySQL Community Server (free): https://dev.mysql.com/downloads/mysql/
- Or use XAMPP (includes MySQL): https://www.apachefriends.org/
- Install with default settings
- Note down your root password

### 2. Install MySQL Workbench (Optional but Recommended)
- Download MySQL Workbench: https://dev.mysql.com/downloads/workbench/
- Install and connect to your MySQL server

### 3. Install Node.js
- Download Node.js: https://nodejs.org/
- Install LTS version (recommended)

## Database Setup

### Step 1: Create Database
1. Open MySQL Command Line Client or MySQL Workbench
2. Connect to your MySQL server
3. Open `database-setup.sql` file
4. Execute the entire script
5. Verify database `JewelleryManagementSystem` is created

### Step 2: Verify Tables
Check that these tables are created:
- Users
- JewelleryItems
- Customers
- Orders
- OrderItems
- InventoryTransactions
- AuditLog

## Backend Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Database Connection
Edit `server.js` and update the database configuration:

```javascript
const dbConfig = {
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'your_password', // Replace with your MySQL password
    database: 'JewelleryManagementSystem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
```

### Step 3: Start Backend Server
```bash
npm start
```

You should see:
```
🚀 Server running on port 3000
📱 Access the application at: http://localhost:3000
🔗 API endpoints available at: http://localhost:3000/api
✅ Connected to MySQL database
```

## Frontend Integration

### Step 1: Update API Configuration
Create `api.js` file with the API service (see `api-structure.md` for details)

### Step 2: Update Frontend Files
Replace localStorage operations with API calls in:
- `script.js` (login)
- `register.js` (registration)
- `dashboard.js` (CRUD operations)

### Step 3: Test Integration
1. Register a new user via API
2. Login with credentials
3. Test all CRUD operations

## Troubleshooting

### Database Connection Issues
1. **Error: "Access denied for user"**
   - Check username/password in `server.js`
   - Verify MySQL user permissions
   - Try connecting with root user first

2. **Error: "Cannot connect to server"**
   - Verify MySQL service is running
   - Check host and port in connection string
   - Ensure firewall allows connections

3. **Error: "Database does not exist"**
   - Run `database-setup.sql` script
   - Verify database name in connection string

### Node.js Issues
1. **Error: "Cannot find module"**
   - Run `npm install` to install dependencies
   - Check Node.js version (requires 14+)

2. **Error: "Port already in use"**
   - Change port in `server.js`
   - Kill existing process on port 3000

### Frontend Issues
1. **CORS errors**
   - Ensure CORS middleware is enabled in `server.js`
   - Check API endpoint URLs

2. **Authentication errors**
   - Verify JWT token is being sent
   - Check token expiration

## MySQL Installation Guide

### Windows
1. Download MySQL Installer from official website
2. Run installer and choose "Developer Default"
3. Set root password during installation
4. Start MySQL service

### macOS
1. Download MySQL DMG file
2. Install and follow setup wizard
3. Set root password
4. Start MySQL service

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
sudo systemctl start mysql
sudo systemctl enable mysql
```

## Security Considerations

### Production Deployment
1. **Environment Variables**
   ```bash
   # Create .env file
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_secure_secret
   ```

2. **HTTPS**
   - Use SSL certificates
   - Configure HTTPS in production

3. **Database Security**
   - Use strong passwords
   - Create dedicated database user
   - Configure firewall rules

## Testing Checklist

### Registration System
- [ ] User can register with valid data
- [ ] Email validation works
- [ ] Password confirmation works
- [ ] Role selection works
- [ ] Terms agreement required
- [ ] Duplicate email prevention

### Authentication
- [ ] User can login with registered credentials
- [ ] Invalid credentials rejected
- [ ] JWT token generated
- [ ] Session management works
- [ ] Logout functionality

### CRUD Operations
- [ ] Add jewellery items
- [ ] Edit jewellery items
- [ ] Delete jewellery items
- [ ] View all items
- [ ] Search and filter

### Dashboard
- [ ] Statistics display correctly
- [ ] Recent activities shown
- [ ] Charts render properly
- [ ] Real-time updates

## MySQL Commands Reference

### Connect to MySQL
```bash
mysql -u root -p
```

### Show Databases
```sql
SHOW DATABASES;
```

### Use Database
```sql
USE JewelleryManagementSystem;
```

### Show Tables
```sql
SHOW TABLES;
```

### Check Table Structure
```sql
DESCRIBE Users;
```

### Backup Database
```bash
mysqldump -u root -p JewelleryManagementSystem > backup.sql
```

### Restore Database
```bash
mysql -u root -p JewelleryManagementSystem < backup.sql
```

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure database connection is working
4. Review the troubleshooting section above

## Next Steps

After successful setup:
1. Customize the UI/UX
2. Add more features (reports, analytics)
3. Implement advanced security
4. Deploy to production environment

---

**Happy Coding! 🎉** 