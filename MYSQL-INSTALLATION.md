# 🗄️ MySQL Installation Guide

## Why MySQL?

- ✅ **Free and Open Source** - No licensing costs
- ✅ **Cross-platform** - Works on Windows, macOS, Linux
- ✅ **Easy to install** - Simple setup process
- ✅ **Great performance** - Fast and reliable
- ✅ **Large community** - Plenty of support and resources

## Installation Options

### Option 1: MySQL Community Server (Recommended)

#### Windows
1. **Download MySQL Installer:**
   - Go to: https://dev.mysql.com/downloads/installer/
   - Download "MySQL Installer for Windows"

2. **Run Installer:**
   - Choose "Developer Default" setup type
   - Follow the installation wizard
   - Set a root password (remember this!)
   - Complete installation

3. **Verify Installation:**
   - Open Command Prompt
   - Run: `mysql -u root -p`
   - Enter your password
   - You should see MySQL prompt

#### macOS
1. **Download MySQL:**
   - Go to: https://dev.mysql.com/downloads/mysql/
   - Download DMG file for macOS

2. **Install:**
   - Open DMG file
   - Run installer package
   - Follow setup wizard
   - Set root password

3. **Start MySQL:**
   - Go to System Preferences
   - Find MySQL and start service

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install MySQL
sudo apt install mysql-server

# Secure installation
sudo mysql_secure_installation

# Start and enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Connect to MySQL
sudo mysql -u root -p
```

### Option 2: XAMPP (All-in-one package)

#### Download XAMPP
- Go to: https://www.apachefriends.org/
- Download for your operating system
- Install with default settings

#### Start MySQL
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. MySQL will be available on localhost:3306

## Database Setup

### Step 1: Connect to MySQL
```bash
mysql -u root -p
```

### Step 2: Create Database
```sql
-- Run the database setup script
source /path/to/your/database-setup.sql;
```

Or manually:
```sql
CREATE DATABASE JewelleryManagementSystem;
USE JewelleryManagementSystem;
```

### Step 3: Verify Tables
```sql
SHOW TABLES;
```

You should see:
- Users
- JewelleryItems
- Customers
- Orders
- OrderItems
- InventoryTransactions
- AuditLog

## Configuration

### Update Backend Configuration
Edit `server.js` and update the database settings:

```javascript
const dbConfig = {
    host: 'localhost',
    user: 'root',           // Your MySQL username
    password: 'your_password', // Your MySQL password
    database: 'JewelleryManagementSystem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
```

### Create Environment Variables (Optional)
Create a `.env` file:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=JewelleryManagementSystem
JWT_SECRET=your_secret_key
```

## Testing Connection

### Test from Command Line
```bash
mysql -u root -p -e "SELECT 'Hello from MySQL!' as message;"
```

### Test from Node.js
```bash
npm start
```

You should see:
```
🚀 Server running on port 3000
✅ Connected to MySQL database
```

## Common Issues & Solutions

### Issue 1: "Access denied for user"
**Solution:**
```sql
-- Connect as root and create user
CREATE USER 'jms_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON JewelleryManagementSystem.* TO 'jms_user'@'localhost';
FLUSH PRIVILEGES;
```

### Issue 2: "Can't connect to MySQL server"
**Solutions:**
1. Check if MySQL is running
2. Verify port (default: 3306)
3. Check firewall settings

### Issue 3: "Database doesn't exist"
**Solution:**
```sql
CREATE DATABASE IF NOT EXISTS JewelleryManagementSystem;
```

## MySQL Workbench (Optional)

### Install MySQL Workbench
- Download from: https://dev.mysql.com/downloads/workbench/
- Install and connect to your MySQL server

### Benefits
- Visual database management
- Query editor
- Database design tools
- Import/export functionality

## Backup & Restore

### Backup Database
```bash
mysqldump -u root -p JewelleryManagementSystem > backup.sql
```

### Restore Database
```bash
mysql -u root -p JewelleryManagementSystem < backup.sql
```

## Security Best Practices

### 1. Change Default Password
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_strong_password';
```

### 2. Create Dedicated User
```sql
CREATE USER 'jms_app'@'localhost' IDENTIFIED BY 'app_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON JewelleryManagementSystem.* TO 'jms_app'@'localhost';
```

### 3. Remove Anonymous Users
```sql
DELETE FROM mysql.user WHERE User='';
FLUSH PRIVILEGES;
```

### 4. Restrict Network Access
```sql
-- Only allow local connections
DELETE FROM mysql.user WHERE Host NOT IN ('localhost', '127.0.0.1');
FLUSH PRIVILEGES;
```

## Performance Tuning

### Basic Configuration
Edit `my.cnf` (Linux) or `my.ini` (Windows):

```ini
[mysqld]
# Increase buffer sizes
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M

# Connection settings
max_connections = 200
wait_timeout = 600

# Query cache
query_cache_size = 32M
query_cache_type = 1
```

## Next Steps

After MySQL installation:
1. ✅ Run the database setup script
2. ✅ Update backend configuration
3. ✅ Test database connection
4. ✅ Start the application
5. ✅ Register your first user

## Support Resources

- **MySQL Documentation:** https://dev.mysql.com/doc/
- **MySQL Community Forums:** https://forums.mysql.com/
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/mysql

---

**Happy Database Management! 🗄️** 