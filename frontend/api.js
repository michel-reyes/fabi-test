// ===============================================
// UBER EATS CLONE - BACKEND INTEGRATION
// ===============================================

// API Configuration
const API_BASE_URL = 'http://localhost:8002';

// Global state
let currentUser = null;
let authToken = null;

// Utility function to make API calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        ...options
    };
    
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Authentication functions
async function loginUser(email, password) {
    try {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        
        const response = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Invalid email or password');
        }
        
        const tokenData = await response.json();
        authToken = tokenData.access_token;
        localStorage.setItem('authToken', authToken);
        
        // Get user info
        currentUser = await apiCall('/users/me');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        return currentUser;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

async function registerUser(userData) {
    try {
        const user = await apiCall('/register', {
            method: 'POST',
            body: userData
        });
        
        // Auto-login after registration
        await loginUser(userData.email, userData.password);
        
        return user;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}

function logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    location.reload();
}

// Initialize auth state from localStorage
function initializeAuth() {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

// Restaurant API functions
async function loadRestaurants(cuisineType = null, sortBy = 'rating') {
    try {
        let endpoint = '/restaurants?';
        const params = new URLSearchParams();
        
        if (cuisineType && cuisineType !== 'all') {
            params.append('cuisine_type', cuisineType);
        }
        
        endpoint += params.toString();
        const restaurants = await apiCall(endpoint);
        
        // Sort restaurants client-side for now
        return sortRestaurants(restaurants, sortBy);
    } catch (error) {
        console.error('Failed to load restaurants:', error);
        showNotification('Failed to load restaurants', 'error');
        return [];
    }
}

async function loadRestaurantDetails(restaurantId) {
    try {
        const restaurant = await apiCall(`/restaurants/${restaurantId}`);
        const menuItems = await apiCall(`/restaurants/${restaurantId}/menu-items`);
        
        return { restaurant, menuItems };
    } catch (error) {
        console.error('Failed to load restaurant details:', error);
        throw error;
    }
}

// Menu API functions
async function createMenuItem(restaurantId, itemData) {
    try {
        return await apiCall(`/restaurants/${restaurantId}/menu-items`, {
            method: 'POST',
            body: itemData
        });
    } catch (error) {
        console.error('Failed to create menu item:', error);
        throw error;
    }
}

async function updateMenuItem(itemId, updateData) {
    try {
        return await apiCall(`/menu-items/${itemId}`, {
            method: 'PUT',
            body: updateData
        });
    } catch (error) {
        console.error('Failed to update menu item:', error);
        throw error;
    }
}

async function deleteMenuItem(itemId) {
    try {
        return await apiCall(`/menu-items/${itemId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Failed to delete menu item:', error);
        throw error;
    }
}

// Restaurant management functions
async function createRestaurant(restaurantData) {
    try {
        return await apiCall('/restaurants', {
            method: 'POST',
            body: restaurantData
        });
    } catch (error) {
        console.error('Failed to create restaurant:', error);
        throw error;
    }
}

async function updateRestaurant(restaurantId, updateData) {
    try {
        return await apiCall(`/restaurants/${restaurantId}`, {
            method: 'PUT',
            body: updateData
        });
    } catch (error) {
        console.error('Failed to update restaurant:', error);
        throw error;
    }
}

async function getMyRestaurants() {
    try {
        return await apiCall('/my-restaurants');
    } catch (error) {
        console.error('Failed to load my restaurants:', error);
        return [];
    }
}

// Order API functions
async function createOrder(orderData) {
    try {
        return await apiCall('/orders', {
            method: 'POST',
            body: orderData
        });
    } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
    }
}

async function loadOrders(status = null) {
    try {
        let endpoint = '/orders';
        if (status) {
            endpoint += `?status=${status}`;
        }
        
        return await apiCall(endpoint);
    } catch (error) {
        console.error('Failed to load orders:', error);
        return [];
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        return await apiCall(`/orders/${orderId}`, {
            method: 'PUT',
            body: { status }
        });
    } catch (error) {
        console.error('Failed to update order status:', error);
        throw error;
    }
}

// Utility functions
function sortRestaurants(restaurants, sortBy) {
    return [...restaurants].sort((a, b) => {
        switch(sortBy) {
            case 'rating':
                return b.average_rating - a.average_rating;
            case 'delivery-time':
                return a.estimated_delivery_time - b.estimated_delivery_time;
            case 'price':
                return a.delivery_fee - b.delivery_fee;
            default:
                return 0;
        }
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#00D262'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function updateAuthUI() {
    const headerActions = document.querySelector('.header-actions');
    
    if (currentUser) {
        headerActions.innerHTML = `
            <span>Hello, ${currentUser.first_name}!</span>
            <span class="user-role">${currentUser.role}</span>
            <button class="btn-secondary" onclick="logout()">Sign Out</button>
            ${currentUser.role === 'customer' ? `
                <div class="cart-icon" onclick="openCart()">
                    🛒
                    <span class="cart-count" id="cart-count">0</span>
                </div>
            ` : ''}
        `;
        
        // Show role-specific navigation
        if (currentUser.role === 'seller' || currentUser.role === 'admin') {
            showSellerDashboardLink();
        }
    }
}

function showSellerDashboardLink() {
    const existingLink = document.getElementById('seller-dashboard-link');
    if (!existingLink) {
        const dashboardLink = document.createElement('a');
        dashboardLink.id = 'seller-dashboard-link';
        dashboardLink.href = '/admin-dashboard.html';
        dashboardLink.textContent = 'Dashboard';
        dashboardLink.className = 'btn-primary';
        dashboardLink.style.marginRight = '15px';
        
        const headerActions = document.querySelector('.header-actions');
        headerActions.insertBefore(dashboardLink, headerActions.firstChild);
    }
}

// Export functions for global use
window.apiCall = apiCall;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logout = logout;
window.loadRestaurants = loadRestaurants;
window.loadRestaurantDetails = loadRestaurantDetails;
window.createMenuItem = createMenuItem;
window.updateMenuItem = updateMenuItem;
window.deleteMenuItem = deleteMenuItem;
window.createRestaurant = createRestaurant;
window.updateRestaurant = updateRestaurant;
window.getMyRestaurants = getMyRestaurants;
window.createOrder = createOrder;
window.loadOrders = loadOrders;
window.updateOrderStatus = updateOrderStatus;
window.showNotification = showNotification;
window.initializeAuth = initializeAuth;