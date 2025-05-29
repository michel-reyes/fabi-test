// ===============================================
// UBER EATS CLONE - CUSTOMER INTERFACE JAVASCRIPT
// ===============================================

// GLOBAL STATE
let cart = [];
let currentRestaurant = null;
let currentUser = null;

// MOCK DATA (Same as admin data)
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
        {
            id: 'menu-004',
            restaurantId: 'rest-001',
            name: 'Bruschetta Trio',
            description: 'Three pieces of toasted bread with different toppings',
            price: 12.99,
            category: 'appetizers',
            image: 'https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: true
        },
        
        // Bella Roma Pizzeria Items
        {
            id: 'menu-005',
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
            id: 'menu-006',
            restaurantId: 'rest-002',
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with parmesan, croutons, and caesar dressing',
            price: 12.99,
            category: 'appetizers',
            image: 'https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: true
        },
        {
            id: 'menu-007',
            restaurantId: 'rest-002',
            name: 'Quattro Stagioni Pizza',
            description: 'Pizza with four sections: mushrooms, ham, artichokes, and olives',
            price: 24.99,
            category: 'mains',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: false
        },
        
        // Dragon Palace Items
        {
            id: 'menu-008',
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
            id: 'menu-009',
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
            id: 'menu-010',
            restaurantId: 'rest-003',
            name: 'Yang Chow Fried Rice',
            description: 'Traditional fried rice with shrimp, char siu, and eggs',
            price: 14.99,
            category: 'mains',
            image: 'https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: false
        },
        {
            id: 'menu-011',
            restaurantId: 'rest-003',
            name: 'Hot and Sour Soup',
            description: 'Traditional Chinese soup with tofu, mushrooms, and bamboo shoots',
            price: 8.99,
            category: 'appetizers',
            image: 'https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: true
        },
        {
            id: 'menu-012',
            restaurantId: 'rest-003',
            name: 'Mango Pudding',
            description: 'Smooth and creamy mango pudding with fresh fruit',
            price: 6.99,
            category: 'desserts',
            image: 'https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: true
        },
        
        // Golden Wok Express Items
        {
            id: 'menu-013',
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
            id: 'menu-014',
            restaurantId: 'rest-004',
            name: 'Beef and Broccoli',
            description: 'Tender beef strips with fresh broccoli in brown sauce',
            price: 16.99,
            category: 'mains',
            image: 'https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: false
        },
        {
            id: 'menu-015',
            restaurantId: 'rest-004',
            name: 'Vegetable Spring Rolls (4 pcs)',
            description: 'Crispy spring rolls filled with fresh vegetables',
            price: 7.99,
            category: 'appetizers',
            image: 'https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop',
            isAvailable: true,
            isVegetarian: true
        }
    ]
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    loadRestaurants();
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
            loadRestaurants(this.value);
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

// RESTAURANT LOADING
function loadRestaurants(sortBy = 'rating') {
    const container = document.getElementById('restaurants-grid');
    if (!container) return;
    
    // Get current cuisine filter
    const activeCategory = document.querySelector('.category-card.active');
    const cuisineFilter = activeCategory ? activeCategory.getAttribute('data-cuisine') : 'all';
    
    // Filter restaurants
    let filteredRestaurants = mockData.restaurants;
    if (cuisineFilter !== 'all') {
        filteredRestaurants = mockData.restaurants.filter(restaurant => 
            restaurant.cuisine === cuisineFilter
        );
    }
    
    // Sort restaurants
    filteredRestaurants = sortRestaurants(filteredRestaurants, sortBy);
    
    // Clear container
    container.innerHTML = '';
    
    // Render restaurants
    filteredRestaurants.forEach(restaurant => {
        const restaurantCard = createRestaurantCard(restaurant);
        container.appendChild(restaurantCard);
    });
}

function sortRestaurants(restaurants, sortBy) {
    return [...restaurants].sort((a, b) => {
        switch(sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'delivery-time':
                return a.estimatedDeliveryTime - b.estimatedDeliveryTime;
            case 'price':
                return a.deliveryFee - b.deliveryFee;
            default:
                return 0;
        }
    });
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.onclick = () => openRestaurantModal(restaurant.id);
    
    card.innerHTML = `
        <div class="restaurant-card-image">
            <img src="${restaurant.coverImage}" alt="${restaurant.name}">
            <span class="restaurant-status ${restaurant.isOpen ? 'open' : 'closed'}">
                ${restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
            <span class="delivery-time">${restaurant.estimatedDeliveryTime} min</span>
        </div>
        <div class="restaurant-card-content">
            <div class="restaurant-card-header">
                <div>
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <p class="restaurant-cuisine">${restaurant.cuisine} Cuisine</p>
                </div>
                <div class="restaurant-rating">
                    <span>⭐ ${restaurant.rating}</span>
                    <span class="text-muted">(${restaurant.totalReviews})</span>
                </div>
            </div>
            <p class="restaurant-description">${restaurant.description}</p>
            <div class="restaurant-footer">
                <div class="delivery-info">
                    <span class="delivery-fee">$${restaurant.deliveryFee.toFixed(2)} delivery</span>
                    <span class="text-muted"> • $${restaurant.minimumOrder.toFixed(2)} min</span>
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
    loadRestaurants();
}

// RESTAURANT MODAL
function openRestaurantModal(restaurantId) {
    const restaurant = mockData.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    currentRestaurant = restaurant;
    
    // Update modal content
    updateRestaurantModalContent(restaurant);
    
    // Show modal
    document.getElementById('restaurant-modal').style.display = 'block';
}

function closeRestaurantModal() {
    document.getElementById('restaurant-modal').style.display = 'none';
    currentRestaurant = null;
}

function updateRestaurantModalContent(restaurant) {
    // Update header
    const headerContainer = document.getElementById('restaurant-header');
    headerContainer.innerHTML = `
        <img src="${restaurant.coverImage}" alt="${restaurant.name}">
        <div class="restaurant-header-overlay">
            <h1 class="restaurant-title">${restaurant.name}</h1>
            <div class="restaurant-details">
                <span>⭐ ${restaurant.rating} (${restaurant.totalReviews} reviews)</span>
                <span>🚚 ${restaurant.estimatedDeliveryTime} min</span>
                <span>💰 $${restaurant.deliveryFee.toFixed(2)} delivery</span>
            </div>
        </div>
    `;
    
    // Update info section
    const infoContainer = document.getElementById('restaurant-info');
    infoContainer.innerHTML = `
        <div class="restaurant-stats">
            <div class="stat-item">
                <span class="stat-value">⭐ ${restaurant.rating}</span>
                <span class="stat-label">Rating</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${restaurant.estimatedDeliveryTime} min</span>
                <span class="stat-label">Delivery Time</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">$${restaurant.deliveryFee.toFixed(2)}</span>
                <span class="stat-label">Delivery Fee</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">$${restaurant.minimumOrder.toFixed(2)}</span>
                <span class="stat-label">Minimum</span>
            </div>
        </div>
        <p>${restaurant.description}</p>
    `;
    
    // Load menu
    loadRestaurantMenu(restaurant.id);
}

function loadRestaurantMenu(restaurantId) {
    const menuItems = mockData.menuItems.filter(item => item.restaurantId === restaurantId);
    
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
            <img src="${item.image}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-info">
                <h4 class="menu-item-name">${item.name}</h4>
                <p class="menu-item-description">${item.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
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

// CART FUNCTIONALITY
function addToCart(menuItemId) {
    const menuItem = mockData.menuItems.find(item => item.id === menuItemId);
    if (!menuItem || !currentRestaurant) return;
    
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
            id: menuItemId,
            name: menuItem.name,
            price: menuItem.price,
            image: menuItem.image,
            restaurantId: currentRestaurant.id,
            restaurantName: currentRestaurant.name,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showNotification(`${menuItem.name} added to cart!`);
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartContent = document.getElementById('cart-content');
    const cartFooter = document.getElementById('cart-footer');
    const emptyCart = document.getElementById('empty-cart');
    
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
    const restaurant = mockData.restaurants.find(r => r.id === cart[0]?.restaurantId);
    const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + deliveryFee + tax;
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-delivery-fee').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

function openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
}

// CHECKOUT FUNCTIONALITY
function checkout() {
    if (cart.length === 0) return;
    
    // Pre-fill checkout form
    const deliveryAddress = document.getElementById('delivery-address').value;
    document.getElementById('delivery-address-checkout').value = deliveryAddress;
    
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
    const restaurant = mockData.restaurants.find(r => r.id === cart[0]?.restaurantId);
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
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

function placeOrder() {
    // Validate form
    const form = document.getElementById('checkout-form');
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerEmail = document.getElementById('customer-email').value;
    const deliveryAddress = document.getElementById('delivery-address-checkout').value;
    
    if (!customerName || !customerPhone || !customerEmail || !deliveryAddress) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Create order object
    const restaurant = mockData.restaurants.find(r => r.id === cart[0]?.restaurantId);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;
    
    const order = {
        id: `order-${Date.now()}`,
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items: [...cart],
        subtotal,
        deliveryFee,
        tax,
        total,
        orderTime: new Date(),
        estimatedDelivery: new Date(Date.now() + restaurant.estimatedDeliveryTime * 60000),
        status: 'pending'
    };
    
    // Show order confirmation
    showOrderConfirmation(order);
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    saveCartToStorage();
    
    // Close checkout modal
    closeCheckoutModal();
}

function showOrderConfirmation(order) {
    const detailsContainer = document.getElementById('order-confirmation-details');
    
    detailsContainer.innerHTML = `
        <div class="order-summary">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Restaurant:</strong> ${order.restaurantName}</p>
            <p><strong>Estimated Delivery:</strong> ${formatTime(order.estimatedDelivery)}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        </div>
    `;
    
    document.getElementById('order-confirmation-modal').style.display = 'block';
}

function closeOrderConfirmation() {
    document.getElementById('order-confirmation-modal').style.display = 'none';
}

// AUTHENTICATION
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

function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    // Mock authentication
    currentUser = {
        email,
        name: email.split('@')[0]
    };
    
    closeSignInModal();
    showNotification(`Welcome back, ${currentUser.name}!`);
    
    // Update UI to show user is logged in
    updateAuthUI();
}

function handleSignUp(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Mock registration
    currentUser = {
        email,
        name
    };
    
    closeSignUpModal();
    showNotification(`Welcome, ${currentUser.name}! Your account has been created.`);
    
    // Update UI to show user is logged in
    updateAuthUI();
}

function updateAuthUI() {
    const headerActions = document.querySelector('.header-actions');
    
    if (currentUser) {
        headerActions.innerHTML = `
            <span>Hello, ${currentUser.name}</span>
            <button class="btn-secondary" onclick="signOut()">Sign Out</button>
            <div class="cart-icon" onclick="openCart()">
                🛒
                <span class="cart-count" id="cart-count">0</span>
            </div>
        `;
        updateCartDisplay();
    }
}

function signOut() {
    currentUser = null;
    location.reload();
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

// Add notification animations
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
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 5px 0;
    }
    
    .summary-item.total {
        font-weight: 700;
        font-size: 18px;
        border-top: 2px solid #e9ecef;
        padding-top: 15px;
        margin-top: 15px;
    }
    
    .order-summary-restaurant {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 2px solid #e9ecef;
    }
    
    .order-summary-restaurant h4 {
        font-size: 18px;
        font-weight: 700;
        color: #1a1a1a;
    }
`;
document.head.appendChild(style);