// ===============================================
// UBER EATS CLONE - ADMIN DASHBOARD (BACKEND INTEGRATION)
// ===============================================

// INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    initializeNavigation();
    checkAdminAccess();
    loadDashboard();
    populateRestaurantFilters();
});

function checkAdminAccess() {
    if (!currentUser || (currentUser.role !== 'seller' && currentUser.role !== 'admin')) {
        showNotification('Access denied. Please sign in as a seller or admin.', 'error');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);
        return;
    }
}

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

async function loadSectionContent(section) {
    try {
        switch(section) {
            case 'restaurants':
                await loadRestaurantsAdmin();
                break;
            case 'menu':
                await loadMenuItemsAdmin();
                break;
            case 'orders':
                await loadOrdersAdmin();
                break;
            case 'customers':
                await loadCustomersAdmin();
                break;
            case 'analytics':
                loadAnalytics();
                break;
            default:
                loadDashboard();
        }
    } catch (error) {
        console.error('Error loading section content:', error);
        showNotification('Failed to load section content', 'error');
    }
}

// DASHBOARD FUNCTIONALITY
function loadDashboard() {
    // Dashboard static content is already in HTML
    // In a real implementation, this would fetch dynamic data
}

// RESTAURANT MANAGEMENT WITH BACKEND
async function loadRestaurantsAdmin() {
    const container = document.getElementById('restaurants-grid');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Loading restaurants...</div>';
        
        let restaurants;
        if (currentUser.role === 'admin') {
            restaurants = await loadRestaurants(); // Load all restaurants
        } else {
            restaurants = await getMyRestaurants(); // Load only user's restaurants
        }
        
        container.innerHTML = '';
        
        if (restaurants.length === 0) {
            container.innerHTML = '<div class="no-restaurants">No restaurants found. <button class="btn-primary" onclick="openAddRestaurantModal()">Add Your First Restaurant</button></div>';
            return;
        }
        
        restaurants.forEach(restaurant => {
            const restaurantCard = createRestaurantCardAdmin(restaurant);
            container.appendChild(restaurantCard);
        });
    } catch (error) {
        container.innerHTML = '<div class="error">Failed to load restaurants</div>';
        console.error('Error loading restaurants:', error);
    }
}

function createRestaurantCardAdmin(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    
    card.innerHTML = `
        <div class="restaurant-card-header">
            <img src="${restaurant.cover_image_url || 'https://images.unsplash.com/photo-1574615552620-54cd32a28519?w=400&h=200&fit=crop'}" alt="${restaurant.name}">
            <span class="restaurant-status ${restaurant.is_open ? 'open' : 'closed'}">
                ${restaurant.is_open ? 'Open' : 'Closed'}
            </span>
        </div>
        <div class="restaurant-card-body">
            <h3 class="restaurant-card-title">${restaurant.name}</h3>
            <p class="restaurant-card-cuisine">${restaurant.cuisine_type} Cuisine</p>
            <p class="restaurant-card-description">${restaurant.description}</p>
            <div class="restaurant-card-footer">
                <div class="restaurant-rating">
                    <span>⭐ ${restaurant.average_rating.toFixed(1)}</span>
                    <span class="text-muted">(${restaurant.total_reviews} reviews)</span>
                </div>
                <div class="restaurant-actions">
                    <button class="btn-secondary btn-small" onclick="editRestaurantAdmin('${restaurant.id}')">Edit</button>
                    <button class="btn-primary btn-small" onclick="toggleRestaurantStatusAdmin('${restaurant.id}', ${!restaurant.is_open})">
                        ${restaurant.is_open ? 'Close' : 'Open'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

async function toggleRestaurantStatusAdmin(restaurantId, newStatus) {
    try {
        await updateRestaurant(restaurantId, { is_open: newStatus });
        showNotification(`Restaurant status updated to ${newStatus ? 'open' : 'closed'}`);
        await loadRestaurantsAdmin();
    } catch (error) {
        console.error('Error updating restaurant status:', error);
        showNotification('Failed to update restaurant status', 'error');
    }
}

function editRestaurantAdmin(restaurantId) {
    showNotification('Edit functionality coming soon...');
}

// MENU MANAGEMENT WITH BACKEND
async function loadMenuItemsAdmin() {
    const container = document.getElementById('menu-items-container');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Loading menu items...</div>';
        
        // Get selected restaurant filter
        const restaurantFilter = document.getElementById('restaurant-filter');
        const selectedRestaurant = restaurantFilter ? restaurantFilter.value : '';
        
        let restaurants;
        if (currentUser.role === 'admin') {
            restaurants = await loadRestaurants();
        } else {
            restaurants = await getMyRestaurants();
        }
        
        let menuItems = [];
        
        if (selectedRestaurant) {
            // Load menu items for specific restaurant
            const response = await apiCall(`/restaurants/${selectedRestaurant}/menu-items`);
            // Extract menuItems array from response
            const items = response.menuItems || [];
            menuItems = items.map(item => ({
                ...item,
                restaurant: restaurants.find(r => r.id === selectedRestaurant)
            }));
        } else {
            // Load menu items for all user's restaurants
            for (const restaurant of restaurants) {
                try {
                    const response = await apiCall(`/restaurants/${restaurant.id}/menu-items`);
                    const items = response.menuItems || [];
                    menuItems.push(...items.map(item => ({
                        ...item,
                        restaurant: restaurant
                    })));
                } catch (error) {
                    console.error(`Error loading menu items for ${restaurant.name}:`, error);
                }
            }
        }
        
        container.innerHTML = '';
        
        if (menuItems.length === 0) {
            container.innerHTML = '<div class="no-menu-items">No menu items found. <button class="btn-primary" onclick="openAddMenuItemModal()">Add Your First Menu Item</button></div>';
            return;
        }
        
        menuItems.forEach(item => {
            const menuCard = createMenuItemCardAdmin(item);
            container.appendChild(menuCard);
        });
    } catch (error) {
        container.innerHTML = '<div class="error">Failed to load menu items</div>';
        console.error('Error loading menu items:', error);
    }
}

function createMenuItemCardAdmin(item) {
    const card = document.createElement('div');
    card.className = 'menu-item-card';
    
    card.innerHTML = `
        <div class="menu-item-header">
            <div>
                <h4 class="menu-item-name">${item.name}</h4>
                <p class="text-muted">${item.restaurant.name}</p>
            </div>
            <span class="menu-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <p class="menu-item-description">${item.description}</p>
        <div class="menu-item-meta">
            <span class="menu-item-category">${item.category}</span>
            <div class="menu-item-actions">
                <button class="btn-secondary btn-small" onclick="editMenuItemAdmin('${item.id}')">Edit</button>
                <button class="btn-primary btn-small" onclick="toggleMenuItemAvailabilityAdmin('${item.id}', ${!item.is_available})">
                    ${item.is_available ? 'Disable' : 'Enable'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

async function toggleMenuItemAvailabilityAdmin(itemId, newStatus) {
    try {
        await updateMenuItem(itemId, { is_available: newStatus });
        showNotification(`Menu item ${newStatus ? 'enabled' : 'disabled'}`);
        await loadMenuItemsAdmin();
    } catch (error) {
        console.error('Error updating menu item:', error);
        showNotification('Failed to update menu item', 'error');
    }
}

function editMenuItemAdmin(itemId) {
    showNotification('Edit functionality coming soon...');
}

async function populateRestaurantFilters() {
    try {
        const restaurantFilter = document.getElementById('restaurant-filter');
        const menuRestaurantSelect = document.getElementById('menu-restaurant');
        
        let restaurants;
        if (currentUser && (currentUser.role === 'seller' || currentUser.role === 'admin')) {
            if (currentUser.role === 'admin') {
                restaurants = await loadRestaurants();
            } else {
                restaurants = await getMyRestaurants();
            }
            
            if (restaurantFilter) {
                restaurantFilter.innerHTML = '<option value="">All Restaurants</option>';
                restaurants.forEach(restaurant => {
                    const option = document.createElement('option');
                    option.value = restaurant.id;
                    option.textContent = restaurant.name;
                    restaurantFilter.appendChild(option);
                });
                
                restaurantFilter.addEventListener('change', loadMenuItemsAdmin);
            }
            
            if (menuRestaurantSelect) {
                menuRestaurantSelect.innerHTML = '<option value="">Select Restaurant</option>';
                restaurants.forEach(restaurant => {
                    const option = document.createElement('option');
                    option.value = restaurant.id;
                    option.textContent = restaurant.name;
                    menuRestaurantSelect.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error populating restaurant filters:', error);
    }
}

// ORDER MANAGEMENT WITH BACKEND
async function loadOrdersAdmin() {
    const tableBody = document.getElementById('orders-table-body');
    if (!tableBody) return;
    
    try {
        tableBody.innerHTML = '<tr><td colspan="7" class="loading">Loading orders...</td></tr>';
        
        const statusFilter = document.getElementById('status-filter');
        const selectedStatus = statusFilter ? statusFilter.value : null;
        
        const orders = await loadOrders(selectedStatus);
        
        tableBody.innerHTML = '';
        
        if (orders.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No orders found</td></tr>';
            return;
        }
        
        orders.forEach(order => {
            const row = createOrderRowAdmin(order);
            tableBody.appendChild(row);
        });
        
        // Add filter event listener
        if (statusFilter) {
            statusFilter.removeEventListener('change', loadOrdersAdmin);
            statusFilter.addEventListener('change', loadOrdersAdmin);
        }
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="7" class="error">Failed to load orders</td></tr>';
        console.error('Error loading orders:', error);
    }
}

function createOrderRowAdmin(order) {
    const row = document.createElement('tr');
    
    const itemsList = order.order_items.map(item => `${item.menu_item.name} (x${item.quantity})`).join(', ');
    const statusClass = getStatusClass(order.status);
    
    row.innerHTML = `
        <td><strong>${order.id.substring(0, 8)}...</strong></td>
        <td>
            <div>
                <strong>${order.customer.first_name} ${order.customer.last_name}</strong><br>
                <small class="text-muted">${order.customer.email}</small>
            </div>
        </td>
        <td><strong>${order.restaurant.name}</strong></td>
        <td>
            <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                ${itemsList}
            </div>
        </td>
        <td><strong>$${order.total_amount.toFixed(2)}</strong></td>
        <td>
            <span class="order-status ${statusClass}">${order.status}</span>
        </td>
        <td>
            <div class="d-flex gap-10">
                <button class="btn-secondary btn-small" onclick="viewOrderDetailsAdmin('${order.id}')">View</button>
                <button class="btn-primary btn-small" onclick="updateOrderStatusAdmin('${order.id}')">Update</button>
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

function viewOrderDetailsAdmin(orderId) {
    showNotification(`Order details for ${orderId} would open here`);
}

async function updateOrderStatusAdmin(orderId) {
    try {
        const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
        const currentOrder = await apiCall(`/orders/${orderId}`);
        const currentIndex = statusOptions.indexOf(currentOrder.status);
        const nextIndex = (currentIndex + 1) % statusOptions.length;
        const nextStatus = statusOptions[nextIndex];
        
        await updateOrderStatus(orderId, nextStatus);
        showNotification(`Order status updated to ${nextStatus}`);
        await loadOrdersAdmin();
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('Failed to update order status', 'error');
    }
}

// CUSTOMER MANAGEMENT
async function loadCustomersAdmin() {
    const tableBody = document.getElementById('customers-table-body');
    if (!tableBody) return;
    
    // This would require a new API endpoint to get customer data
    // For now, show placeholder
    tableBody.innerHTML = '<tr><td colspan="6">Customer management coming soon...</td></tr>';
}

// ANALYTICS
function loadAnalytics() {
    // Analytics are static for now
    // In a real app, this would fetch dynamic analytics data
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

// FORM SUBMISSIONS WITH BACKEND
document.addEventListener('DOMContentLoaded', function() {
    const addRestaurantForm = document.getElementById('add-restaurant-form');
    const addMenuItemForm = document.getElementById('add-menu-item-form');
    
    if (addRestaurantForm) {
        addRestaurantForm.addEventListener('submit', handleAddRestaurant);
    }
    
    if (addMenuItemForm) {
        addMenuItemForm.addEventListener('submit', handleAddMenuItem);
    }
});

async function handleAddRestaurant(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('restaurant-name').value,
        cuisine_type: document.getElementById('restaurant-cuisine').value,
        description: document.getElementById('restaurant-description').value,
        street_address: document.getElementById('restaurant-address').value,
        city: 'New York', // Default for demo
        state: 'NY',
        postal_code: '10001',
        phone: document.getElementById('restaurant-phone').value
    };
    
    try {
        const restaurant = await createRestaurant(formData);
        closeModal('add-restaurant-modal');
        await loadRestaurantsAdmin();
        await populateRestaurantFilters();
        showNotification(`${formData.name} has been added successfully!`);
        
        // Reset form
        document.getElementById('add-restaurant-form').reset();
    } catch (error) {
        console.error('Error adding restaurant:', error);
        showNotification('Failed to add restaurant', 'error');
    }
}

async function handleAddMenuItem(event) {
    event.preventDefault();
    
    const restaurantId = document.getElementById('menu-restaurant').value;
    const formData = {
        name: document.getElementById('menu-item-name').value,
        description: document.getElementById('menu-item-description').value,
        price: parseFloat(document.getElementById('menu-item-price').value),
        category: document.getElementById('menu-item-category').value
    };
    
    if (!restaurantId) {
        showNotification('Please select a restaurant', 'error');
        return;
    }
    
    try {
        await createMenuItem(restaurantId, formData);
        closeModal('add-menu-item-modal');
        await loadMenuItemsAdmin();
        showNotification(`${formData.name} has been added to the menu!`);
        
        // Reset form
        document.getElementById('add-menu-item-form').reset();
    } catch (error) {
        console.error('Error adding menu item:', error);
        showNotification('Failed to add menu item', 'error');
    }
}

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