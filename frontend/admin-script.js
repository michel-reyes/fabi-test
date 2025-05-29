// ===============================================
// UBER EATS CLONE - ADMIN DASHBOARD JAVASCRIPT
// ===============================================

// MOCK DATA STRUCTURE
const mockData = {
    restaurants: [
        {
            id: 'rest-001',
            name: "Mario's Italian Kitchen",
            cuisine: 'italian',
            description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
            address: '123 Little Italy St, New York, NY 10013',
            phone: '(555) 123-4567',
            email: 'mario@italianplace.com',
            coverImage: 'https://images.unsplash.com/photo-1574615552620-54cd32a28519?w=400&h=200&fit=crop',
            isOpen: true,
            isActive: true,
            rating: 4.5,
            totalReviews: 234,
            deliveryFee: 3.99,
            minimumOrder: 15.00,
            estimatedDeliveryTime: 35
        },
        {
            id: 'rest-002',
            name: 'Bella Roma Pizzeria',
            cuisine: 'italian',
            description: 'Wood-fired pizzas and homemade pasta in the heart of the city',
            address: '456 Roma Avenue, New York, NY 10014',
            phone: '(555) 234-5678',
            email: 'giuseppe@bellaroma.com',
            coverImage: 'https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=400&h=200&fit=crop',
            isOpen: true,
            isActive: true,
            rating: 4.3,
            totalReviews: 189,
            deliveryFee: 2.99,
            minimumOrder: 12.00,
            estimatedDeliveryTime: 30
        },
        {
            id: 'rest-003',
            name: 'Dragon Palace',
            cuisine: 'chinese',
            description: 'Traditional Szechuan and Cantonese dishes with bold flavors',
            address: '789 Chinatown Ave, New York, NY 10013',
            phone: '(555) 345-6789',
            email: 'chen@dragonpalace.com',
            coverImage: 'https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg?w=400&h=200&fit=crop',
            isOpen: true,
            isActive: true,
            rating: 4.7,
            totalReviews: 312,
            deliveryFee: 4.99,
            minimumOrder: 20.00,
            estimatedDeliveryTime: 25
        },
        {
            id: 'rest-004',
            name: 'Golden Wok Express',
            cuisine: 'chinese',
            description: 'Fast and delicious Chinese takeout with generous portions',
            address: '321 Dragon Street, New York, NY 10013',
            phone: '(555) 456-7890',
            email: 'li@goldenwok.com',
            coverImage: 'https://images.unsplash.com/photo-1598444800952-884dfce6f145?w=400&h=200&fit=crop',
            isOpen: false,
            isActive: true,
            rating: 4.2,
            totalReviews: 156,
            deliveryFee: 3.49,
            minimumOrder: 10.00,
            estimatedDeliveryTime: 20
        }
    ],
    
    menuItems: [
        // Mario's Italian Kitchen Items
        {
            id: 'menu-001',
            restaurantId: 'rest-001',
            name: 'Margherita Pizza',
            description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
            price: 18.99,
            category: 'mains',
            image: 'https://images.pexels.com/photos/28528512/pexels-photo-28528512.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: true
        },
        {
            id: 'menu-002',
            restaurantId: 'rest-001',
            name: 'Spaghetti Carbonara',
            description: 'Traditional Roman pasta with eggs, pecorino cheese, and pancetta',
            price: 22.50,
            category: 'mains',
            image: 'https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: false
        },
        {
            id: 'menu-003',
            restaurantId: 'rest-001',
            name: 'Tiramisu',
            description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
            price: 8.99,
            category: 'desserts',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: true
        },
        
        // Bella Roma Pizzeria Items
        {
            id: 'menu-004',
            restaurantId: 'rest-002',
            name: 'Pepperoni Pizza',
            description: 'Classic pepperoni pizza with mozzarella and tomato sauce',
            price: 19.99,
            category: 'mains',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: false
        },
        {
            id: 'menu-005',
            restaurantId: 'rest-002',
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with parmesan, croutons, and caesar dressing',
            price: 12.99,
            category: 'appetizers',
            image: 'https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: true
        },
        
        // Dragon Palace Items
        {
            id: 'menu-006',
            restaurantId: 'rest-003',
            name: 'Kung Pao Chicken',
            description: 'Spicy Szechuan chicken with peanuts and vegetables',
            price: 16.99,
            category: 'mains',
            image: 'https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: false
        },
        {
            id: 'menu-007',
            restaurantId: 'rest-003',
            name: 'Pork Dumplings (8 pcs)',
            description: 'Steamed pork dumplings with ginger soy dipping sauce',
            price: 12.99,
            category: 'appetizers',
            image: 'https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: false
        },
        {
            id: 'menu-008',
            restaurantId: 'rest-003',
            name: 'Yang Chow Fried Rice',
            description: 'Traditional fried rice with shrimp, char siu, and eggs',
            price: 14.99,
            category: 'mains',
            image: 'https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: false
        },
        
        // Golden Wok Express Items
        {
            id: 'menu-009',
            restaurantId: 'rest-004',
            name: 'Sweet and Sour Pork',
            description: 'Crispy pork with pineapple and bell peppers in sweet and sour sauce',
            price: 15.99,
            category: 'mains',
            image: 'https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: false
        },
        {
            id: 'menu-010',
            restaurantId: 'rest-004',
            name: 'Hot and Sour Soup',
            description: 'Traditional Chinese soup with tofu, mushrooms, and bamboo shoots',
            price: 7.99,
            category: 'appetizers',
            image: 'https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: true
        }
    ],
    
    orders: [
        {
            id: 'order-001',
            customerId: 'customer-001',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            restaurantId: 'rest-001',
            restaurantName: "Mario's Italian Kitchen",
            status: 'delivering',
            items: [
                { menuItemId: 'menu-001', name: 'Margherita Pizza', quantity: 1, price: 18.99 },
                { menuItemId: 'menu-003', name: 'Tiramisu', quantity: 1, price: 8.99 }
            ],
            subtotal: 27.98,
            deliveryFee: 3.99,
            tax: 2.52,
            total: 34.49,
            orderTime: new Date('2024-01-15T12:30:00'),
            estimatedDelivery: new Date('2024-01-15T13:15:00'),
            deliveryAddress: '456 Customer St, New York, NY'
        },
        {
            id: 'order-002',
            customerId: 'customer-002',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            restaurantId: 'rest-003',
            restaurantName: 'Dragon Palace',
            status: 'preparing',
            items: [
                { menuItemId: 'menu-006', name: 'Kung Pao Chicken', quantity: 2, price: 33.98 },
                { menuItemId: 'menu-007', name: 'Pork Dumplings (8 pcs)', quantity: 1, price: 12.99 }
            ],
            subtotal: 46.97,
            deliveryFee: 4.99,
            tax: 4.67,
            total: 56.63,
            orderTime: new Date('2024-01-15T13:00:00'),
            estimatedDelivery: new Date('2024-01-15T13:45:00'),
            deliveryAddress: '789 Smith Ave, New York, NY'
        },
        {
            id: 'order-003',
            customerId: 'customer-003',
            customerName: 'Mike Johnson',
            customerEmail: 'mike@example.com',
            restaurantId: 'rest-002',
            restaurantName: 'Bella Roma Pizzeria',
            status: 'delivered',
            items: [
                { menuItemId: 'menu-004', name: 'Pepperoni Pizza', quantity: 1, price: 19.99 },
                { menuItemId: 'menu-005', name: 'Caesar Salad', quantity: 1, price: 12.99 }
            ],
            subtotal: 32.98,
            deliveryFee: 2.99,
            tax: 3.24,
            total: 39.21,
            orderTime: new Date('2024-01-15T11:45:00'),
            estimatedDelivery: new Date('2024-01-15T12:30:00'),
            actualDelivery: new Date('2024-01-15T12:28:00'),
            deliveryAddress: '321 Johnson Blvd, New York, NY'
        }
    ],
    
    customers: [
        {
            id: 'customer-001',
            name: 'John Doe',
            email: 'john@example.com',
            totalOrders: 15,
            totalSpent: 487.50,
            lastOrder: new Date('2024-01-15T12:30:00'),
            joinDate: new Date('2023-08-15T10:00:00')
        },
        {
            id: 'customer-002',
            name: 'Jane Smith',
            email: 'jane@example.com',
            totalOrders: 23,
            totalSpent: 678.90,
            lastOrder: new Date('2024-01-15T13:00:00'),
            joinDate: new Date('2023-06-20T14:30:00')
        },
        {
            id: 'customer-003',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            totalOrders: 8,
            totalSpent: 234.60,
            lastOrder: new Date('2024-01-15T11:45:00'),
            joinDate: new Date('2023-11-10T16:15:00')
        }
    ]
};

// NAVIGATION FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadDashboard();
    populateRestaurantFilters();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSection = this.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.add('active');
                updatePageTitle(targetSection);
                loadSectionContent(targetSection);
            }
        });
    });
}

function updatePageTitle(section) {
    const titles = {
        dashboard: 'Dashboard Overview',
        restaurants: 'Restaurant Management',
        menu: 'Menu Management',
        orders: 'Order Management',
        analytics: 'Analytics & Reports',
        customers: 'Customer Management'
    };
    
    document.getElementById('page-title').textContent = titles[section] || 'Dashboard';
}

function loadSectionContent(section) {
    switch(section) {
        case 'restaurants':
            loadRestaurants();
            break;
        case 'menu':
            loadMenuItems();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        default:
            loadDashboard();
    }
}

// DASHBOARD FUNCTIONALITY
function loadDashboard() {
    // Dashboard is already loaded in HTML with static content
    // In a real app, this would fetch dynamic data
}

// RESTAURANT MANAGEMENT
function loadRestaurants() {
    const container = document.getElementById('restaurants-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    mockData.restaurants.forEach(restaurant => {
        const restaurantCard = createRestaurantCard(restaurant);
        container.appendChild(restaurantCard);
    });
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    
    card.innerHTML = `
        <div class="restaurant-card-header">
            <img src="${restaurant.coverImage}" alt="${restaurant.name}">
            <span class="restaurant-status ${restaurant.isOpen ? 'open' : 'closed'}">
                ${restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
        </div>
        <div class="restaurant-card-body">
            <h3 class="restaurant-card-title">${restaurant.name}</h3>
            <p class="restaurant-card-cuisine">${restaurant.cuisine} Cuisine</p>
            <p class="restaurant-card-description">${restaurant.description}</p>
            <div class="restaurant-card-footer">
                <div class="restaurant-rating">
                    <span>⭐ ${restaurant.rating}</span>
                    <span class="text-muted">(${restaurant.totalReviews} reviews)</span>
                </div>
                <div class="restaurant-actions">
                    <button class="btn-secondary btn-small" onclick="editRestaurant('${restaurant.id}')">Edit</button>
                    <button class="btn-primary btn-small" onclick="toggleRestaurantStatus('${restaurant.id}')">
                        ${restaurant.isOpen ? 'Close' : 'Open'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function toggleRestaurantStatus(restaurantId) {
    const restaurant = mockData.restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
        restaurant.isOpen = !restaurant.isOpen;
        loadRestaurants();
        showNotification(`${restaurant.name} is now ${restaurant.isOpen ? 'open' : 'closed'}`);
    }
}

function editRestaurant(restaurantId) {
    const restaurant = mockData.restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
        // In a real app, this would open an edit modal with restaurant data
        showNotification(`Edit functionality for ${restaurant.name} would open here`);
    }
}

// MENU MANAGEMENT
function loadMenuItems() {
    const container = document.getElementById('menu-items-container');
    if (!container) return;
    
    const restaurantFilter = document.getElementById('restaurant-filter');
    const selectedRestaurant = restaurantFilter ? restaurantFilter.value : '';
    
    container.innerHTML = '';
    
    let filteredItems = mockData.menuItems;
    if (selectedRestaurant) {
        filteredItems = mockData.menuItems.filter(item => item.restaurantId === selectedRestaurant);
    }
    
    filteredItems.forEach(item => {
        const restaurant = mockData.restaurants.find(r => r.id === item.restaurantId);
        const menuCard = createMenuItemCard(item, restaurant);
        container.appendChild(menuCard);
    });
}

function createMenuItemCard(item, restaurant) {
    const card = document.createElement('div');
    card.className = 'menu-item-card';
    
    card.innerHTML = `
        <div class="menu-item-header">
            <div>
                <h4 class="menu-item-name">${item.name}</h4>
                <p class="text-muted">${restaurant.name}</p>
            </div>
            <span class="menu-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <p class="menu-item-description">${item.description}</p>
        <div class="menu-item-meta">
            <span class="menu-item-category">${item.category}</span>
            <div class="menu-item-actions">
                <button class="btn-secondary btn-small" onclick="editMenuItem('${item.id}')">Edit</button>
                <button class="btn-primary btn-small" onclick="toggleMenuItemAvailability('${item.id}')">
                    ${item.isAvailable ? 'Disable' : 'Enable'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function toggleMenuItemAvailability(itemId) {
    const item = mockData.menuItems.find(i => i.id === itemId);
    if (item) {
        item.isAvailable = !item.isAvailable;
        loadMenuItems();
        showNotification(`${item.name} is now ${item.isAvailable ? 'available' : 'unavailable'}`);
    }
}

function editMenuItem(itemId) {
    const item = mockData.menuItems.find(i => i.id === itemId);
    if (item) {
        showNotification(`Edit functionality for ${item.name} would open here`);
    }
}

function populateRestaurantFilters() {
    const restaurantFilter = document.getElementById('restaurant-filter');
    const menuRestaurantSelect = document.getElementById('menu-restaurant');
    
    if (restaurantFilter) {
        restaurantFilter.innerHTML = '<option value="">All Restaurants</option>';
        mockData.restaurants.forEach(restaurant => {
            const option = document.createElement('option');
            option.value = restaurant.id;
            option.textContent = restaurant.name;
            restaurantFilter.appendChild(option);
        });
        
        restaurantFilter.addEventListener('change', loadMenuItems);
    }
    
    if (menuRestaurantSelect) {
        menuRestaurantSelect.innerHTML = '<option value="">Select Restaurant</option>';
        mockData.restaurants.forEach(restaurant => {
            const option = document.createElement('option');
            option.value = restaurant.id;
            option.textContent = restaurant.name;
            menuRestaurantSelect.appendChild(option);
        });
    }
}

// ORDER MANAGEMENT
function loadOrders() {
    const tableBody = document.getElementById('orders-table-body');
    if (!tableBody) return;
    
    const statusFilter = document.getElementById('status-filter');
    const selectedStatus = statusFilter ? statusFilter.value : '';
    
    tableBody.innerHTML = '';
    
    let filteredOrders = mockData.orders;
    if (selectedStatus) {
        filteredOrders = mockData.orders.filter(order => order.status === selectedStatus);
    }
    
    filteredOrders.forEach(order => {
        const row = createOrderRow(order);
        tableBody.appendChild(row);
    });
    
    // Add filter event listener
    if (statusFilter) {
        statusFilter.removeEventListener('change', loadOrders);
        statusFilter.addEventListener('change', loadOrders);
    }
}

function createOrderRow(order) {
    const row = document.createElement('tr');
    
    const itemsList = order.items.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const statusClass = getStatusClass(order.status);
    
    row.innerHTML = `
        <td><strong>${order.id}</strong></td>
        <td>
            <div>
                <strong>${order.customerName}</strong><br>
                <small class="text-muted">${order.customerEmail}</small>
            </div>
        </td>
        <td><strong>${order.restaurantName}</strong></td>
        <td>
            <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                ${itemsList}
            </div>
        </td>
        <td><strong>$${order.total.toFixed(2)}</strong></td>
        <td>
            <span class="order-status ${statusClass}">${order.status}</span>
        </td>
        <td>
            <div class="d-flex gap-10">
                <button class="btn-secondary btn-small" onclick="viewOrderDetails('${order.id}')">View</button>
                <button class="btn-primary btn-small" onclick="updateOrderStatus('${order.id}')">Update</button>
            </div>
        </td>
    `;
    
    return row;
}

function getStatusClass(status) {
    const statusClasses = {
        pending: 'pending',
        confirmed: 'confirmed',
        preparing: 'preparing',
        ready: 'ready',
        delivering: 'delivering',
        delivered: 'delivered',
        cancelled: 'cancelled'
    };
    return statusClasses[status] || 'pending';
}

function viewOrderDetails(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (order) {
        showNotification(`Order details for ${order.id} would open here`);
    }
}

function updateOrderStatus(orderId) {
    const order = mockData.orders.find(o => o.id === orderId);
    if (order) {
        const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
        const currentIndex = statusOptions.indexOf(order.status);
        const nextIndex = (currentIndex + 1) % statusOptions.length;
        
        order.status = statusOptions[nextIndex];
        loadOrders();
        showNotification(`Order ${order.id} status updated to ${order.status}`);
    }
}

// CUSTOMER MANAGEMENT
function loadCustomers() {
    const tableBody = document.getElementById('customers-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    mockData.customers.forEach(customer => {
        const row = createCustomerRow(customer);
        tableBody.appendChild(row);
    });
}

function createCustomerRow(customer) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><strong>${customer.id}</strong></td>
        <td><strong>${customer.name}</strong></td>
        <td>${customer.email}</td>
        <td>${customer.totalOrders}</td>
        <td><strong>$${customer.totalSpent.toFixed(2)}</strong></td>
        <td>${formatDate(customer.lastOrder)}</td>
    `;
    
    return row;
}

// ANALYTICS
function loadAnalytics() {
    // Analytics are already loaded in HTML with static content
    // In a real app, this would fetch and display dynamic analytics data
}

// MODAL FUNCTIONALITY
function openAddRestaurantModal() {
    document.getElementById('add-restaurant-modal').style.display = 'block';
}

function openAddMenuItemModal() {
    document.getElementById('add-menu-item-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// FORM SUBMISSIONS
document.addEventListener('DOMContentLoaded', function() {
    const addRestaurantForm = document.getElementById('add-restaurant-form');
    const addMenuItemForm = document.getElementById('add-menu-item-form');
    
    if (addRestaurantForm) {
        addRestaurantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddRestaurant();
        });
    }
    
    if (addMenuItemForm) {
        addMenuItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddMenuItem();
        });
    }
});

function handleAddRestaurant() {
    const formData = {
        name: document.getElementById('restaurant-name').value,
        cuisine: document.getElementById('restaurant-cuisine').value,
        description: document.getElementById('restaurant-description').value,
        address: document.getElementById('restaurant-address').value,
        phone: document.getElementById('restaurant-phone').value
    };
    
    // In a real app, this would send data to backend
    const newRestaurant = {
        id: `rest-${Date.now()}`,
        ...formData,
        email: `${formData.name.toLowerCase().replace(/\s+/g, '')}@restaurant.com`,
        coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop',
        isOpen: true,
        isActive: true,
        rating: 0,
        totalReviews: 0,
        deliveryFee: 3.99,
        minimumOrder: 15.00,
        estimatedDeliveryTime: 30
    };
    
    mockData.restaurants.push(newRestaurant);
    closeModal('add-restaurant-modal');
    loadRestaurants();
    populateRestaurantFilters();
    showNotification(`${formData.name} has been added successfully!`);
    
    // Reset form
    document.getElementById('add-restaurant-form').reset();
}

function handleAddMenuItem() {
    const formData = {
        restaurantId: document.getElementById('menu-restaurant').value,
        name: document.getElementById('menu-item-name').value,
        description: document.getElementById('menu-item-description').value,
        price: parseFloat(document.getElementById('menu-item-price').value),
        category: document.getElementById('menu-item-category').value
    };
    
    // In a real app, this would send data to backend
    const newMenuItem = {
        id: `menu-${Date.now()}`,
        ...formData,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop',
        isAvailable: true,
        isVegetarian: false
    };
    
    mockData.menuItems.push(newMenuItem);
    closeModal('add-menu-item-modal');
    loadMenuItems();
    showNotification(`${formData.name} has been added to the menu!`);
    
    // Reset form
    document.getElementById('add-menu-item-form').reset();
}

// UTILITY FUNCTIONS
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #00D262;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 210, 98, 0.3);
        z-index: 3000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// SEARCH FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
});

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    // In a real app, this would filter content based on search term
    if (searchTerm.length > 2) {
        showNotification(`Searching for: ${searchTerm}`);
    }
}