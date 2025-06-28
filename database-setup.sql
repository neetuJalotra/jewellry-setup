-- Jewellery Management System - MySQL Database Setup
-- Created for Sprint 1 - CRUD Foundation

-- Create Database
CREATE DATABASE IF NOT EXISTS JewelleryManagementSystem;
USE JewelleryManagementSystem;

-- Create Users Table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL, -- Should be hashed in production
    Role ENUM('admin', 'manager', 'staff') NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP NULL,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Jewellery Items Table
CREATE TABLE JewelleryItems (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Category ENUM('rings', 'necklaces', 'earrings', 'bracelets', 'watches') NOT NULL,
    Material VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    ImageURL VARCHAR(500) NULL,
    Description TEXT NULL,
    CreatedBy INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);

-- Create Customers Table
CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20) NULL,
    Address TEXT NULL,
    CreatedBy INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);

-- Create Orders Table
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    OrderNumber VARCHAR(20) UNIQUE NOT NULL,
    Status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    TotalAmount DECIMAL(10,2) NOT NULL,
    CreatedBy INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);

-- Create Order Items Table (Many-to-Many relationship)
CREATE TABLE OrderItems (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    ItemID INT,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ItemID) REFERENCES JewelleryItems(ItemID)
);

-- Create Inventory Transactions Table
CREATE TABLE InventoryTransactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    ItemID INT,
    TransactionType ENUM('in', 'out', 'adjustment') NOT NULL,
    Quantity INT NOT NULL,
    PreviousStock INT NOT NULL,
    NewStock INT NOT NULL,
    Reason VARCHAR(200) NULL,
    CreatedBy INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ItemID) REFERENCES JewelleryItems(ItemID),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);

-- Create Audit Log Table
CREATE TABLE AuditLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Action VARCHAR(50) NOT NULL,
    TableName VARCHAR(50) NOT NULL,
    RecordID INT NOT NULL,
    OldValues JSON NULL,
    NewValues JSON NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Create Indexes for better performance
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_JewelleryItems_Category ON JewelleryItems(Category);
CREATE INDEX IX_JewelleryItems_Name ON JewelleryItems(Name);
CREATE INDEX IX_Customers_Email ON Customers(Email);
CREATE INDEX IX_Orders_CustomerID ON Orders(CustomerID);
CREATE INDEX IX_Orders_Status ON Orders(Status);
CREATE INDEX IX_Orders_CreatedAt ON Orders(CreatedAt);
CREATE INDEX IX_OrderItems_OrderID ON OrderItems(OrderID);
CREATE INDEX IX_InventoryTransactions_ItemID ON InventoryTransactions(ItemID);

-- Insert Sample Data

-- Sample Users (Password: admin123, manager123, staff123)
INSERT INTO Users (FirstName, LastName, Email, Password, Role) VALUES
('Admin', 'User', 'admin@jms.com', 'admin123', 'admin'),
('Manager', 'User', 'manager@jms.com', 'manager123', 'manager'),
('Staff', 'User', 'staff@jms.com', 'staff123', 'staff');

-- Sample Jewellery Items
INSERT INTO JewelleryItems (Name, Category, Material, Price, Stock, Description, CreatedBy) VALUES
('Diamond Ring', 'rings', 'Gold, Diamond', 2500.00, 10, 'Beautiful diamond ring with 18K gold setting', 1),
('Gold Necklace', 'necklaces', 'Gold', 1800.00, 15, 'Elegant gold necklace with intricate design', 1),
('Silver Earrings', 'earrings', 'Silver', 450.00, 25, 'Classic silver earrings with pearl accents', 1),
('Platinum Bracelet', 'bracelets', 'Platinum', 3200.00, 8, 'Luxury platinum bracelet with diamond details', 1),
('Luxury Watch', 'watches', 'Stainless Steel', 5500.00, 5, 'Premium luxury watch with leather strap', 1);

-- Sample Customers
INSERT INTO Customers (FirstName, LastName, Email, Phone, Address, CreatedBy) VALUES
('John', 'Smith', 'john@email.com', '+1234567890', '123 Main St, City, State', 1),
('Sarah', 'Johnson', 'sarah@email.com', '+1234567891', '456 Oak Ave, City, State', 1),
('Michael', 'Brown', 'michael@email.com', '+1234567892', '789 Pine Rd, City, State', 1);

-- Sample Orders
INSERT INTO Orders (CustomerID, OrderNumber, Status, TotalAmount, CreatedBy) VALUES
(1, 'ORD-001', 'delivered', 2500.00, 1),
(2, 'ORD-002', 'processing', 1800.00, 1),
(3, 'ORD-003', 'pending', 450.00, 1);

-- Sample Order Items
INSERT INTO OrderItems (OrderID, ItemID, Quantity, UnitPrice, TotalPrice) VALUES
(1, 1, 1, 2500.00, 2500.00),
(2, 2, 1, 1800.00, 1800.00),
(3, 3, 1, 450.00, 450.00);

-- Create Stored Procedures

-- Procedure to get user by email and password
DELIMITER //
CREATE PROCEDURE sp_AuthenticateUser(IN p_Email VARCHAR(100), IN p_Password VARCHAR(255))
BEGIN
    SELECT UserID, FirstName, LastName, Email, Role, IsActive
    FROM Users
    WHERE Email = p_Email AND Password = p_Password AND IsActive = TRUE;
END //
DELIMITER ;

-- Procedure to register new user
DELIMITER //
CREATE PROCEDURE sp_RegisterUser(
    IN p_FirstName VARCHAR(50),
    IN p_LastName VARCHAR(50),
    IN p_Email VARCHAR(100),
    IN p_Password VARCHAR(255),
    IN p_Role ENUM('admin', 'manager', 'staff')
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO Users (FirstName, LastName, Email, Password, Role)
    VALUES (p_FirstName, p_LastName, p_Email, p_Password, p_Role);
    
    SELECT LAST_INSERT_ID() AS UserID;
    
    COMMIT;
END //
DELIMITER ;

-- Procedure to get all jewellery items
DELIMITER //
CREATE PROCEDURE sp_GetJewelleryItems()
BEGIN
    SELECT ItemID, Name, Category, Material, Price, Stock, ImageURL, Description, CreatedAt
    FROM JewelleryItems
    WHERE IsActive = TRUE
    ORDER BY CreatedAt DESC;
END //
DELIMITER ;

-- Procedure to add new jewellery item
DELIMITER //
CREATE PROCEDURE sp_AddJewelleryItem(
    IN p_Name VARCHAR(100),
    IN p_Category ENUM('rings', 'necklaces', 'earrings', 'bracelets', 'watches'),
    IN p_Material VARCHAR(100),
    IN p_Price DECIMAL(10,2),
    IN p_Stock INT,
    IN p_ImageURL VARCHAR(500),
    IN p_Description TEXT,
    IN p_CreatedBy INT
)
BEGIN
    INSERT INTO JewelleryItems (Name, Category, Material, Price, Stock, ImageURL, Description, CreatedBy)
    VALUES (p_Name, p_Category, p_Material, p_Price, p_Stock, p_ImageURL, p_Description, p_CreatedBy);
    
    SELECT LAST_INSERT_ID() AS ItemID;
END //
DELIMITER ;

-- Procedure to update jewellery item
DELIMITER //
CREATE PROCEDURE sp_UpdateJewelleryItem(
    IN p_ItemID INT,
    IN p_Name VARCHAR(100),
    IN p_Category ENUM('rings', 'necklaces', 'earrings', 'bracelets', 'watches'),
    IN p_Material VARCHAR(100),
    IN p_Price DECIMAL(10,2),
    IN p_Stock INT,
    IN p_ImageURL VARCHAR(500),
    IN p_Description TEXT
)
BEGIN
    UPDATE JewelleryItems
    SET Name = p_Name,
        Category = p_Category,
        Material = p_Material,
        Price = p_Price,
        Stock = p_Stock,
        ImageURL = p_ImageURL,
        Description = p_Description,
        UpdatedAt = CURRENT_TIMESTAMP
    WHERE ItemID = p_ItemID;
END //
DELIMITER ;

-- Procedure to delete jewellery item (soft delete)
DELIMITER //
CREATE PROCEDURE sp_DeleteJewelleryItem(IN p_ItemID INT)
BEGIN
    UPDATE JewelleryItems
    SET IsActive = FALSE, UpdatedAt = CURRENT_TIMESTAMP
    WHERE ItemID = p_ItemID;
END //
DELIMITER ;

-- Procedure to get dashboard statistics
DELIMITER //
CREATE PROCEDURE sp_GetDashboardStats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM JewelleryItems WHERE IsActive = TRUE) AS TotalJewellery,
        (SELECT COUNT(*) FROM Customers WHERE IsActive = TRUE) AS TotalCustomers,
        (SELECT COUNT(*) FROM Orders WHERE IsActive = TRUE) AS TotalOrders,
        (SELECT COALESCE(SUM(TotalAmount), 0) FROM Orders WHERE IsActive = TRUE) AS TotalRevenue;
END //
DELIMITER ;

-- Create Views

-- View for recent activities
CREATE VIEW vw_RecentActivities AS
SELECT 'Jewellery' AS Type, Name AS Title, Category AS Subtitle, CreatedAt
FROM JewelleryItems
WHERE IsActive = TRUE
UNION ALL
SELECT 'Order' AS Type, CONCAT('Order #', OrderNumber) AS Title, Status AS Subtitle, CreatedAt
FROM Orders
WHERE IsActive = TRUE;

-- View for top selling items
CREATE VIEW vw_TopSellingItems AS
SELECT 
    ji.Name,
    ji.Category,
    SUM(oi.Quantity) AS TotalSold,
    SUM(oi.TotalPrice) AS TotalRevenue
FROM JewelleryItems ji
JOIN OrderItems oi ON ji.ItemID = oi.ItemID
JOIN Orders o ON oi.OrderID = o.OrderID
WHERE ji.IsActive = TRUE AND o.IsActive = TRUE
GROUP BY ji.ItemID, ji.Name, ji.Category
ORDER BY TotalSold DESC;

-- Create Triggers for Audit Log

-- Trigger for Users table
DELIMITER //
CREATE TRIGGER tr_Users_Audit_Insert
AFTER INSERT ON Users
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (UserID, Action, TableName, RecordID, NewValues)
    VALUES (NEW.UserID, 'INSERT', 'Users', NEW.UserID, JSON_OBJECT('email', NEW.Email, 'role', NEW.Role));
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER tr_Users_Audit_Update
AFTER UPDATE ON Users
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (UserID, Action, TableName, RecordID, OldValues, NewValues)
    VALUES (NEW.UserID, 'UPDATE', 'Users', NEW.UserID, 
            JSON_OBJECT('email', OLD.Email, 'role', OLD.Role),
            JSON_OBJECT('email', NEW.Email, 'role', NEW.Role));
END //
DELIMITER ;

-- Trigger for JewelleryItems table
DELIMITER //
CREATE TRIGGER tr_JewelleryItems_Audit_Insert
AFTER INSERT ON JewelleryItems
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (UserID, Action, TableName, RecordID, NewValues)
    VALUES (NEW.CreatedBy, 'INSERT', 'JewelleryItems', NEW.ItemID, 
            JSON_OBJECT('name', NEW.Name, 'category', NEW.Category, 'price', NEW.Price));
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER tr_JewelleryItems_Audit_Update
AFTER UPDATE ON JewelleryItems
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (UserID, Action, TableName, RecordID, OldValues, NewValues)
    VALUES (NEW.CreatedBy, 'UPDATE', 'JewelleryItems', NEW.ItemID,
            JSON_OBJECT('name', OLD.Name, 'category', OLD.Category, 'price', OLD.Price),
            JSON_OBJECT('name', NEW.Name, 'category', NEW.Category, 'price', NEW.Price));
END //
DELIMITER ;

-- Create Functions

-- Function to generate order number
DELIMITER //
CREATE FUNCTION fn_GenerateOrderNumber()
RETURNS VARCHAR(20)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_OrderNumber VARCHAR(20);
    DECLARE v_NextID INT;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(OrderNumber, 5) AS UNSIGNED)), 0) + 1 INTO v_NextID
    FROM Orders;
    
    SET v_OrderNumber = CONCAT('ORD-', LPAD(v_NextID, 6, '0'));
    
    RETURN v_OrderNumber;
END //
DELIMITER ;

SELECT 'Database setup completed successfully!' AS Message;
SELECT 'Sample data has been inserted.' AS Message;
SELECT 'You can now connect your application to this database.' AS Message;
