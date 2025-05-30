// ===============================================
// UBER EATS CLONE - BACKEND INTEGRATION
// ===============================================

// API Configuration
const API_BASE_URL = 'http://localhost:8005/api';

// Global state
let currentUser = null;
let authToken = null;

// Utility function to make API calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Create a properly typed fetch request configuration
    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
            ...(options.headers || {})
        }
    };
    
    // Handle body separately
    if (options.body) {
        config.body = typeof options.body === 'object' ? 
            JSON.stringify(options.body) : options.body;
    }
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            // Adjust error handling for Next.js API response format
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            } catch (e) {
                // If response isn't JSON
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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
        // New API uses JSON request body instead of form data
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        
        if (!response.ok) {
            throw new Error('Invalid email or password');
        }
        
        const data = await response.json();
        if (!data.success || !data.token) {
            throw new Error('Authentication failed');
        }
        
        // Store the token
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        
        // User info is included in response, but fetch from /users/me as backup
        if (data.user) {
            currentUser = data.user;
        } else {
            // Get user info
            currentUser = await apiCall('/users/me');
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        return currentUser;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

async function registerUser(userData) {
    try {
        // Send registration request to new Next.js backend
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                firstName: userData.first_name || userData.firstName, // Support both naming conventions
                lastName: userData.last_name || userData.lastName,
                phone: userData.phone,
                role: userData.role || 'customer'
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }
        
        const data = await response.json();
        
        // Auto-login after registration
        await loginUser(userData.email, userData.password);
        
        return data.user;
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
        const response = await apiCall(endpoint);
        const restaurantsArray = response.restaurants || [];
        
        // Sort restaurants client-side for now
        return sortRestaurants(restaurantsArray, sortBy);
    } catch (error) {
        console.error('Failed to load restaurants:', error);
        showNotification('Failed to load restaurants', 'error');
        return [];
    }
}

async function loadRestaurantDetails(restaurantId) {
    try {
        const restaurantResponse = await apiCall(`/restaurants/${restaurantId}`);
        const menuItemsResponse = await apiCall(`/restaurants/${restaurantId}/menu-items`);
        
        // Extract the restaurant and menuItems from the response objects
        const restaurant = restaurantResponse.restaurant || {};
        const menuItems = menuItemsResponse.menuItems || [];
        
        // Ensure numeric fields needed for toFixed() exist
        if (restaurant) {
            restaurant.average_rating = restaurant.average_rating || 0;
            restaurant.delivery_fee = restaurant.delivery_fee || 0;
            restaurant.minimum_order = restaurant.minimum_order || 0;
            restaurant.total_reviews = restaurant.total_reviews || 0;
        }
        
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
        const response = await apiCall('/my-restaurants');
        return response.restaurants || [];
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
        
        const response = await apiCall(endpoint);
        return response.orders || [];
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
    
    // Return early if headerActions doesn't exist in the DOM
    if (!headerActions) return;
    
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
        if (headerActions) {
            headerActions.insertBefore(dashboardLink, headerActions.firstChild);
        }
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