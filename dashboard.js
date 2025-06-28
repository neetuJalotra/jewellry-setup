// Jewellery Management System - Dashboard JavaScript

// Global variables
let currentUser = null;
let jewelleryItems = [];
let customers = [];
let orders = [];
let inventory = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboardData();
});

// Initialize the application
function initializeApp() {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(user);
    document.getElementById('userName').textContent = currentUser.name || 'Admin User';
    
    // Load data from localStorage
    loadDataFromStorage();
    
    // Initialize navigation
    initializeNavigation();
}

// Setup event listeners
function setupEventListeners() {
    // Menu toggle for mobile
    document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
    
    // Search functionality
    document.getElementById('jewellerySearch').addEventListener('input', filterJewellery);
    document.getElementById('customerSearch').addEventListener('input', filterCustomers);
    document.getElementById('orderSearch').addEventListener('input', filterOrders);
    document.getElementById('inventorySearch').addEventListener('input', filterInventory);
    
    // Filter functionality
    document.getElementById('jewelleryCategory').addEventListener('change', filterJewellery);
    document.getElementById('orderStatus').addEventListener('change', filterOrders);
    
    // Form submissions
    document.getElementById('jewelleryForm').addEventListener('submit', handleJewellerySubmit);
    document.getElementById('customerForm').addEventListener('submit', handleCustomerSubmit);
    document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);
    
    // Modal close on outside click
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });
}

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            showPage(page);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageName + '-page').classList.add('active');
    document.getElementById('pageTitle').textContent = getPageTitle(pageName);
    
    // Load page-specific data
    switch(pageName) {
        case 'jewellery':
            loadJewelleryData();
            break;
        case 'customers':
            loadCustomerData();
            break;
        case 'orders':
            loadOrderData();
            break;
        case 'inventory':
            loadInventoryData();
            break;
        case 'reports':
            loadReportData();
            break;
    }
}

function getPageTitle(pageName) {
    const titles = {
        'dashboard': 'Dashboard',
        'jewellery': 'Jewellery Items',
        'customers': 'Customers',
        'orders': 'Orders',
        'inventory': 'Inventory',
        'reports': 'Reports & Analytics'
    };
    return titles[pageName] || 'Dashboard';
}

// Data Management
function loadDataFromStorage() {
    jewelleryItems = JSON.parse(localStorage.getItem('jewelleryItems')) || [];
    customers = JSON.parse(localStorage.getItem('customers')) || [];
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    inventory = JSON.parse(localStorage.getItem('inventory')) || [];
}

function saveDataToStorage() {
    localStorage.setItem('jewelleryItems', JSON.stringify(jewelleryItems));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Dashboard functionality
function loadDashboardData() {
    updateDashboardStats();
    loadRecentActivities();
}

function updateDashboardStats() {
    document.getElementById('totalJewellery').textContent = jewelleryItems.length;
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('totalOrders').textContent = orders.length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
}

function loadRecentActivities() {
    // Recent jewellery items
    const recentJewellery = jewelleryItems.slice(-5).reverse();
    const recentJewelleryContainer = document.getElementById('recentJewellery');
    recentJewelleryContainer.innerHTML = recentJewellery.length ? 
        recentJewellery.map(item => `
            <div class="recent-item">
                <div class="recent-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.category} - $${item.price}</p>
                </div>
                <div class="recent-item-meta">
                    Stock: ${item.stock}
                </div>
            </div>
        `).join('') : '<p>No jewellery items yet</p>';
    
    // Recent orders
    const recentOrders = orders.slice(-5).reverse();
    const recentOrdersContainer = document.getElementById('recentOrders');
    recentOrdersContainer.innerHTML = recentOrders.length ?
        recentOrders.map(order => `
            <div class="recent-item">
                <div class="recent-item-info">
                    <h4>Order #${order.id}</h4>
                    <p>${order.customerName} - $${order.total}</p>
                </div>
                <div class="recent-item-meta">
                    ${order.status}
                </div>
            </div>
        `).join('') : '<p>No orders yet</p>';
}

// Jewellery Management
function loadJewelleryData() {
    const tbody = document.getElementById('jewelleryTableBody');
    tbody.innerHTML = jewelleryItems.map(item => `
        <tr>
            <td>
                ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : '<div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image" style="color: #999;"></i></div>'}
            </td>
            <td>${item.name}</td>
            <td><span class="badge badge-${item.category}">${item.category}</span></td>
            <td>${item.material}</td>
            <td>$${item.price}</td>
            <td>${item.stock}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editJewellery('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteJewellery('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddJewelleryModal() {
    document.getElementById('jewelleryModalTitle').textContent = 'Add New Jewellery Item';
    document.getElementById('jewelleryForm').reset();
    document.getElementById('jewelleryModal').classList.add('active');
}

function editJewellery(id) {
    const item = jewelleryItems.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('jewelleryModalTitle').textContent = 'Edit Jewellery Item';
    document.getElementById('jewelleryName').value = item.name;
    document.getElementById('jewelleryCategorySelect').value = item.category;
    document.getElementById('jewelleryMaterial').value = item.material;
    document.getElementById('jewelleryPrice').value = item.price;
    document.getElementById('jewelleryStock').value = item.stock;
    document.getElementById('jewelleryImage').value = item.image || '';
    document.getElementById('jewelleryDescription').value = item.description || '';
    
    // Store the item ID for update
    document.getElementById('jewelleryForm').dataset.editId = id;
    document.getElementById('jewelleryModal').classList.add('active');
}

function handleJewellerySubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('jewelleryName').value,
        category: document.getElementById('jewelleryCategorySelect').value,
        material: document.getElementById('jewelleryMaterial').value,
        price: parseFloat(document.getElementById('jewelleryPrice').value),
        stock: parseInt(document.getElementById('jewelleryStock').value),
        image: document.getElementById('jewelleryImage').value,
        description: document.getElementById('jewelleryDescription').value
    };
    
    const editId = e.target.dataset.editId;
    
    if (editId) {
        // Update existing item
        const index = jewelleryItems.findIndex(item => item.id === editId);
        if (index !== -1) {
            jewelleryItems[index] = { ...jewelleryItems[index], ...formData };
        }
        delete e.target.dataset.editId;
    } else {
        // Add new item
        formData.id = generateId();
        formData.createdAt = new Date().toISOString();
        jewelleryItems.push(formData);
    }
    
    saveDataToStorage();
    closeModal('jewelleryModal');
    loadJewelleryData();
    updateDashboardStats();
    showNotification('Jewellery item saved successfully!', 'success');
}

function deleteJewellery(id) {
    showDeleteConfirmation('jewellery', id, 'Are you sure you want to delete this jewellery item?');
}

// Customer Management
function loadCustomerData() {
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.firstName} ${customer.lastName}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address || 'N/A'}</td>
            <td>${getCustomerOrderCount(customer.id)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editCustomer('${customer.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteCustomer('${customer.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddCustomerModal() {
    document.getElementById('customerModalTitle').textContent = 'Add New Customer';
    document.getElementById('customerForm').reset();
    document.getElementById('customerModal').classList.add('active');
}

function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    
    document.getElementById('customerModalTitle').textContent = 'Edit Customer';
    document.getElementById('customerFirstName').value = customer.firstName;
    document.getElementById('customerLastName').value = customer.lastName;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerAddress').value = customer.address || '';
    
    document.getElementById('customerForm').dataset.editId = id;
    document.getElementById('customerModal').classList.add('active');
}

function handleCustomerSubmit(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('customerFirstName').value,
        lastName: document.getElementById('customerLastName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        address: document.getElementById('customerAddress').value
    };
    
    const editId = e.target.dataset.editId;
    
    if (editId) {
        const index = customers.findIndex(c => c.id === editId);
        if (index !== -1) {
            customers[index] = { ...customers[index], ...formData };
        }
        delete e.target.dataset.editId;
    } else {
        formData.id = generateId();
        formData.createdAt = new Date().toISOString();
        customers.push(formData);
    }
    
    saveDataToStorage();
    closeModal('customerModal');
    loadCustomerData();
    updateDashboardStats();
    showNotification('Customer saved successfully!', 'success');
}

function deleteCustomer(id) {
    showDeleteConfirmation('customer', id, 'Are you sure you want to delete this customer?');
}

// Order Management
function loadOrderData() {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.items.length} items</td>
            <td>$${order.total}</td>
            <td><span class="badge badge-${order.status}">${order.status}</span></td>
            <td>${formatDate(order.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteOrder('${order.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddOrderModal() {
    document.getElementById('orderModalTitle').textContent = 'Create New Order';
    document.getElementById('orderForm').reset();
    
    // Populate customer dropdown
    const customerSelect = document.getElementById('orderCustomer');
    customerSelect.innerHTML = '<option value="">Select Customer</option>' +
        customers.map(c => `<option value="${c.id}">${c.firstName} ${c.lastName}</option>`).join('');
    
    // Populate item dropdowns
    populateOrderItemDropdowns();
    
    document.getElementById('orderModal').classList.add('active');
}

function populateOrderItemDropdowns() {
    const itemSelects = document.querySelectorAll('.order-item-select');
    itemSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Item</option>' +
            jewelleryItems.map(item => `<option value="${item.id}" data-price="${item.price}">${item.name} - $${item.price}</option>`).join('');
    });
}

function addOrderItem() {
    const orderItems = document.getElementById('orderItems');
    const newItem = document.createElement('div');
    newItem.className = 'order-item';
    newItem.innerHTML = `
        <select class="order-item-select" required>
            <option value="">Select Item</option>
            ${jewelleryItems.map(item => `<option value="${item.id}" data-price="${item.price}">${item.name} - $${item.price}</option>`).join('')}
        </select>
        <input type="number" class="order-item-quantity" placeholder="Qty" min="1" required>
        <button type="button" class="remove-item-btn" onclick="removeOrderItem(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    orderItems.appendChild(newItem);
    
    // Add event listener for price calculation
    const select = newItem.querySelector('.order-item-select');
    const quantity = newItem.querySelector('.order-item-quantity');
    select.addEventListener('change', calculateOrderTotal);
    quantity.addEventListener('input', calculateOrderTotal);
}

function removeOrderItem(button) {
    button.parentElement.remove();
    calculateOrderTotal();
}

function calculateOrderTotal() {
    let total = 0;
    const items = document.querySelectorAll('.order-item');
    
    items.forEach(item => {
        const select = item.querySelector('.order-item-select');
        const quantity = item.querySelector('.order-item-quantity');
        
        if (select.value && quantity.value) {
            const price = parseFloat(select.selectedOptions[0].dataset.price);
            const qty = parseInt(quantity.value);
            total += price * qty;
        }
    });
    
    document.getElementById('orderTotal').textContent = `Total: $${total.toFixed(2)}`;
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    const customerId = document.getElementById('orderCustomer').value;
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        showNotification('Please select a customer', 'error');
        return;
    }
    
    const orderItems = [];
    const items = document.querySelectorAll('.order-item');
    
    items.forEach(item => {
        const select = item.querySelector('.order-item-select');
        const quantity = item.querySelector('.order-item-quantity');
        
        if (select.value && quantity.value) {
            const jewelleryItem = jewelleryItems.find(j => j.id === select.value);
            if (jewelleryItem) {
                orderItems.push({
                    id: jewelleryItem.id,
                    name: jewelleryItem.name,
                    price: jewelleryItem.price,
                    quantity: parseInt(quantity.value)
                });
            }
        }
    });
    
    if (orderItems.length === 0) {
        showNotification('Please add at least one item to the order', 'error');
        return;
    }
    
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
        customerId: customerId,
        customerName: `${customer.firstName} ${customer.lastName}`,
        items: orderItems,
        total: total,
        status: document.getElementById('orderStatusSelect').value,
        createdAt: new Date().toISOString()
    };
    
    orderData.id = generateId();
    orders.push(orderData);
    
    // Update inventory
    orderItems.forEach(item => {
        const jewelleryItem = jewelleryItems.find(j => j.id === item.id);
        if (jewelleryItem) {
            jewelleryItem.stock -= item.quantity;
        }
    });
    
    saveDataToStorage();
    closeModal('orderModal');
    loadOrderData();
    updateDashboardStats();
    showNotification('Order created successfully!', 'success');
}

// Inventory Management
function loadInventoryData() {
    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = jewelleryItems.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>${item.stock < 5 ? '<span style="color: red;">Low Stock</span>' : 'OK'}</td>
            <td>${formatDate(item.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="updateStock('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Reports
function loadReportData() {
    // This would typically involve charts and analytics
    // For now, we'll show basic statistics
    const newCustomers = customers.filter(c => {
        const created = new Date(c.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
    
    const repeatCustomers = customers.filter(c => getCustomerOrderCount(c.id) > 1).length;
    const avgOrderValue = orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0;
    
    document.getElementById('newCustomers').textContent = newCustomers;
    document.getElementById('repeatCustomers').textContent = repeatCustomers;
    document.getElementById('avgOrderValue').textContent = `$${avgOrderValue.toFixed(2)}`;
    
    // Load top items
    const topItems = getTopSellingItems();
    const topItemsContainer = document.getElementById('topItemsList');
    topItemsContainer.innerHTML = topItems.map(item => `
        <div class="top-item">
            <span>${item.name}</span>
            <span>${item.totalSold} sold</span>
        </div>
    `).join('');
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function getCustomerOrderCount(customerId) {
    return orders.filter(order => order.customerId === customerId).length;
}

function getTopSellingItems() {
    const itemSales = {};
    
    orders.forEach(order => {
        order.items.forEach(item => {
            if (itemSales[item.id]) {
                itemSales[item.id].totalSold += item.quantity;
            } else {
                itemSales[item.id] = {
                    name: item.name,
                    totalSold: item.quantity
                };
            }
        });
    });
    
    return Object.values(itemSales)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5);
}

// Filter Functions
function filterJewellery() {
    const searchTerm = document.getElementById('jewellerySearch').value.toLowerCase();
    const categoryFilter = document.getElementById('jewelleryCategory').value;
    
    const filtered = jewelleryItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                            item.material.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    displayFilteredJewellery(filtered);
}

function displayFilteredJewellery(items) {
    const tbody = document.getElementById('jewelleryTableBody');
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>
                ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : '<div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image" style="color: #999;"></i></div>'}
            </td>
            <td>${item.name}</td>
            <td><span class="badge badge-${item.category}">${item.category}</span></td>
            <td>${item.material}</td>
            <td>$${item.price}</td>
            <td>${item.stock}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editJewellery('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteJewellery('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
    const filtered = customers.filter(customer => 
        customer.firstName.toLowerCase().includes(searchTerm) ||
        customer.lastName.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredCustomers(filtered);
}

function displayFilteredCustomers(customers) {
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.firstName} ${customer.lastName}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address || 'N/A'}</td>
            <td>${getCustomerOrderCount(customer.id)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editCustomer('${customer.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteCustomer('${customer.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('orderStatus').value;
    
    const filtered = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm) ||
                            order.customerName.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    displayFilteredOrders(filtered);
}

function displayFilteredOrders(orders) {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.items.length} items</td>
            <td>$${order.total}</td>
            <td><span class="badge badge-${order.status}">${order.status}</span></td>
            <td>${formatDate(order.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteOrder('${order.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterInventory() {
    const searchTerm = document.getElementById('inventorySearch').value.toLowerCase();
    const filtered = jewelleryItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredInventory(filtered);
}

function displayFilteredInventory(items) {
    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>${item.stock < 5 ? '<span style="color: red;">Low Stock</span>' : 'OK'}</td>
            <td>${formatDate(item.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="updateStock('${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Modal Functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showDeleteConfirmation(type, id, message) {
    document.getElementById('deleteMessage').textContent = message;
    document.getElementById('deleteModal').classList.add('active');
    document.getElementById('deleteModal').dataset.deleteType = type;
    document.getElementById('deleteModal').dataset.deleteId = id;
}

function confirmDelete() {
    const modal = document.getElementById('deleteModal');
    const type = modal.dataset.deleteType;
    const id = modal.dataset.deleteId;
    
    switch(type) {
        case 'jewellery':
            jewelleryItems = jewelleryItems.filter(item => item.id !== id);
            break;
        case 'customer':
            customers = customers.filter(customer => customer.id !== id);
            break;
        case 'order':
            orders = orders.filter(order => order.id !== id);
            break;
    }
    
    saveDataToStorage();
    closeModal('deleteModal');
    
    // Reload current page data
    const activePage = document.querySelector('.page.active').id.replace('-page', '');
    switch(activePage) {
        case 'jewellery':
            loadJewelleryData();
            break;
        case 'customers':
            loadCustomerData();
            break;
        case 'orders':
            loadOrderData();
            break;
    }
    
    updateDashboardStats();
    showNotification('Item deleted successfully!', 'success');
}

// UI Functions
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        text-transform: capitalize;
    }
    
    .badge-rings { background: #e3f2fd; color: #1976d2; }
    .badge-necklaces { background: #f3e5f5; color: #7b1fa2; }
    .badge-earrings { background: #e8f5e8; color: #388e3c; }
    .badge-bracelets { background: #fff3e0; color: #f57c00; }
    .badge-watches { background: #fce4ec; color: #c2185b; }
    
    .badge-pending { background: #fff3cd; color: #856404; }
    .badge-processing { background: #d1ecf1; color: #0c5460; }
    .badge-shipped { background: #d4edda; color: #155724; }
    .badge-delivered { background: #d1e7dd; color: #0f5132; }
    .badge-cancelled { background: #f8d7da; color: #721c24; }
`;
document.head.appendChild(style); 