// ===============================================
// UBER EATS CLONE - CUSTOMER INTERFACE (BACKEND INTEGRATION)
// ===============================================

// GLOBAL STATE
let cart = [];
let currentRestaurant = null;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    loadRestaurantsFromAPI();
    setupEventListeners();
    loadCartFromStorage();
    updateCartDisplay();
});

function setupEventListeners() {
    // Search functionality
    document.getElementById('hero-address').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchRestaurants();
        }
    });
    
    // Sort filter
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            loadRestaurantsFromAPI(null, this.value);
        });
    }
    
    // Auth forms
    const signInForm = document.getElementById('signin-form');
    const signUpForm = document.getElementById('signup-form');
    
    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
    }
    
    if (signUpForm) {
        signUpForm.addEventListener('submit', handleSignUp);
    }
    
    // Close modals on outside click
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// RESTAURANT LOADING WITH BACKEND
async function loadRestaurantsFromAPI(cuisineType = null, sortBy = 'rating') {
    const container = document.getElementById('restaurants-grid');
    if (!container) return;
    
    try {
        // Show loading state
        container.innerHTML = '<div class="loading">Loading restaurants...</div>';
        
        // Get current cuisine filter if not specified
        if (cuisineType === null) {
            const activeCategory = document.querySelector('.category-card.active');
            cuisineType = activeCategory ? activeCategory.getAttribute('data-cuisine') : 'all';
        }
        
        // Load restaurants from API
        const restaurants = await loadRestaurants(cuisineType === 'all' ? null : cuisineType, sortBy);
        
        // Clear container
        container.innerHTML = '';
        
        // Render restaurants
        if (restaurants.length === 0) {
            container.innerHTML = '<div class="no-restaurants">No restaurants found</div>';
            return;
        }
        
        restaurants.forEach(restaurant => {
            const restaurantCard = createRestaurantCard(restaurant);
            container.appendChild(restaurantCard);
        });
    } catch (error) {
        container.innerHTML = '<div class="error">Failed to load restaurants. Please try again.</div>';
        console.error('Error loading restaurants:', error);
    }
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.onclick = () => openRestaurantModal(restaurant.id);
    
    card.innerHTML = `
        <div class="restaurant-card-image">
            <img src="${restaurant.cover_image_url || 'https://images.unsplash.com/photo-1574615552620-54cd32a28519?w=400&h=200&fit=crop'}" alt="${restaurant.name}">
            <span class="restaurant-status ${restaurant.is_open ? 'open' : 'closed'}">
                ${restaurant.is_open ? 'Open' : 'Closed'}
            </span>
            <span class="delivery-time">${restaurant.estimated_delivery_time} min</span>
        </div>
        <div class="restaurant-card-content">
            <div class="restaurant-card-header">
                <div>
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <p class="restaurant-cuisine">${restaurant.cuisine_type} Cuisine</p>
                </div>
                <div class="restaurant-rating">
                    <span>⭐ ${restaurant.average_rating.toFixed(1)}</span>
                    <span class="text-muted">(${restaurant.total_reviews})</span>
                </div>
            </div>
            <p class="restaurant-description">${restaurant.description}</p>
            <div class="restaurant-footer">
                <div class="delivery-info">
                    <span class="delivery-fee">$${restaurant.delivery_fee.toFixed(2)} delivery</span>
                    <span class="text-muted"> • $${restaurant.minimum_order.toFixed(2)} min</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// CUISINE FILTERING
function filterByCuisine(cuisine) {
    // Update active category
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    
    document.querySelector(`[data-cuisine="${cuisine}"]`).classList.add('active');
    
    // Reload restaurants with filter
    loadRestaurantsFromAPI(cuisine);
}

// RESTAURANT MODAL WITH BACKEND
async function openRestaurantModal(restaurantId) {
    try {
        // Show loading state
        document.getElementById('restaurant-modal').style.display = 'block';
        document.getElementById('restaurant-header').innerHTML = '<div class="loading">Loading restaurant...</div>';
        
        // Load restaurant details from API
        const { restaurant, menuItems } = await loadRestaurantDetails(restaurantId);
        
        currentRestaurant = restaurant;
        
        // Update modal content
        updateRestaurantModalContent(restaurant, menuItems);
    } catch (error) {
        console.error('Error loading restaurant details:', error);
        showNotification('Failed to load restaurant details', 'error');
        closeRestaurantModal();
    }
}

function updateRestaurantModalContent(restaurant, menuItems) {
    // Update header
    const headerContainer = document.getElementById('restaurant-header');
    headerContainer.innerHTML = `
        <img src="${restaurant.cover_image_url || 'https://images.unsplash.com/photo-1574615552620-54cd32a28519?w=400&h=200&fit=crop'}" alt="${restaurant.name}">
        <div class="restaurant-header-overlay">
            <h1 class="restaurant-title">${restaurant.name}</h1>
            <div class="restaurant-details">
                <span>⭐ ${restaurant.average_rating.toFixed(1)} (${restaurant.total_reviews} reviews)</span>
                <span>🚚 ${restaurant.estimated_delivery_time} min</span>
                <span>💰 $${restaurant.delivery_fee.toFixed(2)} delivery</span>
            </div>
        </div>
    `;
    
    // Update info section
    const infoContainer = document.getElementById('restaurant-info');
    infoContainer.innerHTML = `
        <div class="restaurant-stats">
            <div class="stat-item">
                <span class="stat-value">⭐ ${restaurant.average_rating.toFixed(1)}</span>
                <span class="stat-label">Rating</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${restaurant.estimated_delivery_time} min</span>
                <span class="stat-label">Delivery Time</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">$${restaurant.delivery_fee.toFixed(2)}</span>
                <span class="stat-label">Delivery Fee</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">$${restaurant.minimum_order.toFixed(2)}</span>
                <span class="stat-label">Minimum</span>
            </div>
        </div>
        <p>${restaurant.description}</p>
    `;
    
    // Load menu
    loadRestaurantMenuFromAPI(menuItems);
}

function loadRestaurantMenuFromAPI(menuItems) {
    // Group by category
    const categories = {};
    menuItems.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    });
    
    // Update categories sidebar
    const categoriesContainer = document.getElementById('menu-categories');
    categoriesContainer.innerHTML = '';
    
    Object.keys(categories).forEach((category, index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = `menu-category ${index === 0 ? 'active' : ''}`;
        categoryDiv.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryDiv.onclick = () => scrollToCategory(category);
        categoriesContainer.appendChild(categoryDiv);
    });
    
    // Update menu items
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = '';
    
    Object.entries(categories).forEach(([category, items]) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'menu-section';
        sectionDiv.id = `category-${category}`;
        
        sectionDiv.innerHTML = `
            <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            ${items.map(item => createMenuItemHTML(item)).join('')}
        `;
        
        menuContainer.appendChild(sectionDiv);
    });
}

function createMenuItemHTML(item) {
    return `
        <div class="menu-item">
            <img src="${item.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop'}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-info">
                <h4 class="menu-item-name">${item.name}</h4>
                <p class="menu-item-description">${item.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                    ${item.is_available ? `
                        <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">
                            Add to Cart
                        </button>
                    ` : `
                        <span class="unavailable">Unavailable</span>
                    `}
                </div>
                ${item.is_vegetarian ? '<span class="dietary-tag">🌱 Vegetarian</span>' : ''}
                ${item.is_vegan ? '<span class="dietary-tag">🌿 Vegan</span>' : ''}
            </div>
        </div>
    `;
}

function closeRestaurantModal() {
    document.getElementById('restaurant-modal').style.display = 'none';
    currentRestaurant = null;
}

function scrollToCategory(category) {
    // Update active category
    document.querySelectorAll('.menu-category').forEach(cat => {
        cat.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Scroll to category
    const categoryElement = document.getElementById(`category-${category}`);
    if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// CART FUNCTIONALITY (Enhanced with backend data)
function addToCart(menuItemId) {
    if (!currentRestaurant) return;
    
    // Find the menu item in the current restaurant's menu
    const menuItemsContainer = document.getElementById('menu-items');
    const menuItemElements = menuItemsContainer.querySelectorAll('.menu-item');
    
    let menuItem = null;
    for (let element of menuItemElements) {
        const addButton = element.querySelector(`[onclick="addToCart('${menuItemId}')"]`);
        if (addButton) {
            const nameEl = element.querySelector('.menu-item-name');
            const priceEl = element.querySelector('.menu-item-price');
            const imageEl = element.querySelector('.menu-item-image');
            
            menuItem = {
                id: menuItemId,
                name: nameEl.textContent,
                price: parseFloat(priceEl.textContent.replace('$', '')),
                image: imageEl.src,
                restaurantId: currentRestaurant.id,
                restaurantName: currentRestaurant.name
            };
            break;
        }
    }
    
    if (!menuItem) return;
    
    // Check if cart has items from different restaurant
    if (cart.length > 0 && cart[0].restaurantId !== currentRestaurant.id) {
        if (!confirm('Your cart contains items from a different restaurant. Would you like to clear it and add this item?')) {
            return;
        }
        cart = [];
    }
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === menuItemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...menuItem,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showNotification(`${menuItem.name} added to cart!`);
}

// Enhanced cart functions
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartContent = document.getElementById('cart-content');
    const cartFooter = document.getElementById('cart-footer');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartCount) return; // User not logged in or cart not available
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartFooter.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartFooter.style.display = 'block';
    
    // Update cart content
    cartContent.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
    
    // Update totals
    updateCartTotals();
}

function createCartItemHTML(item) {
    return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', 1)">+</button>
            </div>
        </div>
    `;
}

function updateCartItemQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(cartItem => cartItem.id !== itemId);
    }
    
    updateCartDisplay();
    saveCartToStorage();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Get restaurant delivery fee (assuming current restaurant)
    const deliveryFee = currentRestaurant ? currentRestaurant.delivery_fee : 3.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + deliveryFee + tax;
    
    const subtotalEl = document.getElementById('cart-subtotal');
    const deliveryFeeEl = document.getElementById('cart-delivery-fee');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `$${deliveryFee.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
}

// CHECKOUT WITH BACKEND
async function checkout() {
    if (cart.length === 0) return;
    
    if (!currentUser) {
        showNotification('Please sign in to place an order', 'error');
        openSignInModal();
        return;
    }
    
    // Pre-fill checkout form
    const deliveryAddress = document.getElementById('delivery-address').value;
    document.getElementById('delivery-address-checkout').value = deliveryAddress;
    document.getElementById('customer-name').value = `${currentUser.first_name} ${currentUser.last_name}`;
    document.getElementById('customer-email').value = currentUser.email;
    document.getElementById('customer-phone').value = currentUser.phone || '';
    
    // Update checkout order summary
    updateCheckoutOrderSummary();
    
    // Show checkout modal
    closeCart();
    document.getElementById('checkout-modal').style.display = 'block';
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function updateCheckoutOrderSummary() {
    const summaryContainer = document.getElementById('checkout-order-summary');
    const restaurant = currentRestaurant;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = restaurant ? restaurant.delivery_fee : 3.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;
    
    summaryContainer.innerHTML = `
        <div class="order-summary-restaurant">
            <h4>${restaurant?.name || 'Restaurant'}</h4>
        </div>
        ${cart.map(item => `
            <div class="summary-item">
                <span>${item.quantity}x ${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('')}
        <hr>
        <div class="summary-item">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Delivery Fee</span>
            <span>$${deliveryFee.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Tax</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <hr>
        <div class="summary-item total">
            <strong>Total: $${total.toFixed(2)}</strong>
        </div>
    `;
    
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
}

async function placeOrder() {
    // Validate form
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerEmail = document.getElementById('customer-email').value;
    const deliveryAddress = document.getElementById('delivery-address-checkout').value;
    const deliveryInstructions = document.getElementById('delivery-instructions').value;
    
    if (!customerName || !customerPhone || !customerEmail || !deliveryAddress) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please sign in to place an order', 'error');
        return;
    }
    
    try {
        // Create order object for API
        const orderData = {
            restaurant_id: cart[0].restaurantId,
            delivery_address: deliveryAddress,
            delivery_instructions: deliveryInstructions,
            items: cart.map(item => ({
                menu_item_id: item.id,
                quantity: item.quantity
            }))
        };
        
        // Place order via API
        const order = await createOrder(orderData);
        
        // Show order confirmation
        showOrderConfirmation(order);
        
        // Clear cart
        cart = [];
        updateCartDisplay();
        saveCartToStorage();
        
        // Close checkout modal
        closeCheckoutModal();
        
    } catch (error) {
        console.error('Order placement failed:', error);
        showNotification('Failed to place order. Please try again.', 'error');
    }
}

function showOrderConfirmation(order) {
    const detailsContainer = document.getElementById('order-confirmation-details');
    
    detailsContainer.innerHTML = `
        <div class="order-summary">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Restaurant:</strong> ${order.restaurant.name}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> $${order.total_amount.toFixed(2)}</p>
            <p><strong>Estimated Delivery:</strong> ${order.estimated_delivery_time ? new Date(order.estimated_delivery_time).toLocaleTimeString() : 'TBD'}</p>
        </div>
    `;
    
    document.getElementById('order-confirmation-modal').style.display = 'block';
}

function closeOrderConfirmation() {
    document.getElementById('order-confirmation-modal').style.display = 'none';
}

// AUTHENTICATION WITH BACKEND
function openSignInModal() {
    document.getElementById('signin-modal').style.display = 'block';
}

function closeSignInModal() {
    document.getElementById('signin-modal').style.display = 'none';
}

function openSignUpModal() {
    document.getElementById('signup-modal').style.display = 'block';
}

function closeSignUpModal() {
    document.getElementById('signup-modal').style.display = 'none';
}

function switchToSignUp() {
    closeSignInModal();
    openSignUpModal();
}

function switchToSignIn() {
    closeSignUpModal();
    openSignInModal();
}

async function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    try {
        const user = await loginUser(email, password);
        
        closeSignInModal();
        showNotification(`Welcome back, ${user.first_name}!`);
        
        updateAuthUI();
        updateCartDisplay();
        
        // Reset form
        document.getElementById('signin-form').reset();
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function handleSignUp(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('signup-name').value.split(' ')[0];
    const lastName = document.getElementById('signup-name').value.split(' ').slice(1).join(' ') || firstName;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    try {
        const userData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            role: "customer"
        };
        
        await registerUser(userData);
        
        closeSignUpModal();
        showNotification(`Welcome, ${firstName}! Your account has been created.`);
        
        updateAuthUI();
        updateCartDisplay();
        
        // Reset form
        document.getElementById('signup-form').reset();
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// SEARCH FUNCTIONALITY
function searchRestaurants() {
    const address = document.getElementById('hero-address').value;
    if (address.trim()) {
        document.getElementById('delivery-address').value = address;
        showNotification(`Searching restaurants near ${address}`);
        
        // Scroll to restaurants section
        document.querySelector('.restaurants-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// STORAGE FUNCTIONALITY
function saveCartToStorage() {
    localStorage.setItem('ubereats-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('ubereats-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// UTILITY FUNCTIONS
function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(new Date(date));
}