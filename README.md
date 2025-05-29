# 🍽️ Uber Eats Clone

A complete food delivery platform replica built with HTML, CSS, and JavaScript, featuring both customer and admin interfaces.

## 📋 Features

### 🛍️ Customer Interface (`index.html`)
- **Restaurant Discovery**: Browse restaurants by cuisine (Italian & Chinese)
- **Advanced Filtering**: Sort by rating, delivery time, and price
- **Restaurant Details**: View menus, ratings, and restaurant information
- **Shopping Cart**: Add/remove items with quantity controls
- **Checkout Process**: Complete order placement (no payment integration)
- **User Authentication**: Sign in/up functionality
- **Responsive Design**: Works on desktop and mobile devices

### 👨‍💼 Admin Dashboard (`admin-dashboard.html`)
- **Dashboard Overview**: Key metrics and recent orders
- **Restaurant Management**: Add, edit, and manage restaurant status
- **Menu Management**: Create and manage menu items by category
- **Order Management**: Track and update order statuses
- **Customer Management**: View customer data and order history
- **Analytics**: Revenue trends and performance metrics

## 🗄️ Database Schema

Complete PostgreSQL schema included in `database_schema.sql` with:
- User management (customers, sellers, admins)
- Restaurant and menu management
- Order processing workflow
- Reviews and ratings system
- Cart persistence
- Address management

## 🏗️ Architecture

### Frontend Structure
```
frontend/
├── index.html              # Customer interface
├── customer-styles.css     # Customer styling
├── customer-script.js      # Customer functionality
├── admin-dashboard.html    # Admin interface
├── admin-styles.css        # Admin styling
└── admin-script.js         # Admin functionality
```

### Key Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox/Grid, animations
- **Vanilla JavaScript**: Full functionality without frameworks
- **Local Storage**: Cart persistence
- **Mock Data**: Realistic restaurant and menu data

## 🎨 Design Features

### Visual Design
- **Uber Eats-inspired**: Black and white primary colors, green accents
- **Typography**: Inter font family with proper hierarchy
- **Images**: Professional food and restaurant photography
- **Animations**: Smooth transitions and hover effects

### User Experience
- **Intuitive Navigation**: Clear menu structure and breadcrumbs
- **Real-time Updates**: Cart updates and order status changes
- **Modal Interactions**: Restaurant details and checkout process
- **Responsive Layout**: Mobile-first design approach

## 🚀 Getting Started

### Quick Start
1. Open `frontend/index.html` for the customer interface
2. Open `frontend/admin-dashboard.html` for the admin dashboard
3. No server setup required - runs directly in browser

### Mock Data Included
- **4 Restaurants**: 2 Italian, 2 Chinese establishments
- **15+ Menu Items**: Authentic dishes with descriptions and pricing
- **Sample Orders**: Realistic order data for testing
- **Customer Profiles**: Mock user accounts and order history

## 🔧 Functionality

### Customer Features
- Browse restaurants by location and cuisine
- View detailed restaurant pages with full menus
- Add items to cart with quantity controls
- Complete checkout process with delivery information
- User authentication (mock implementation)
- Order tracking and history

### Admin Features
- Dashboard with key performance metrics
- Restaurant management (add, edit, status changes)
- Menu item management with categories
- Order processing and status updates
- Customer data overview
- Basic analytics and reporting

## 💾 Data Persistence

- **Cart Data**: Stored in localStorage for session persistence
- **User Sessions**: Basic authentication state management
- **Mock Database**: Structured data mimicking real backend responses

## 🛡️ Future Enhancements

### Planned Features
- **Payment Integration**: Stripe or PayPal integration
- **Real-time Tracking**: Live order status updates
- **Advanced Analytics**: Detailed reporting dashboard
- **Multi-language Support**: Internationalization
- **Push Notifications**: Order updates and promotions

### Technical Improvements
- **Backend Integration**: Node.js/Express API
- **Database Connection**: PostgreSQL implementation
- **Authentication**: JWT-based security
- **Image Upload**: Restaurant and menu item photo management

## 📱 Responsive Design

- **Mobile-first**: Optimized for smartphone usage
- **Tablet Support**: Enhanced experience for medium screens
- **Desktop Layout**: Full-featured desktop interface
- **Touch-friendly**: Large buttons and intuitive gestures

## 🎯 Key Highlights

1. **Pixel-perfect Uber Eats Design**: Authentic visual replication
2. **Complete User Flows**: End-to-end customer and admin journeys
3. **Professional Code Structure**: Clean, maintainable, and documented
4. **Realistic Data**: Authentic restaurant and menu information
5. **Production-ready**: Scalable architecture for future development

## 📄 File Overview

- `database_schema.sql`: Complete PostgreSQL database structure
- `frontend/index.html`: Customer-facing food ordering interface
- `frontend/customer-styles.css`: Customer interface styling
- `frontend/customer-script.js`: Customer functionality and interactions
- `frontend/admin-dashboard.html`: Restaurant admin management interface
- `frontend/admin-styles.css`: Admin dashboard styling
- `frontend/admin-script.js`: Admin functionality and data management

---

**Note**: This is a frontend-only implementation with mock data. Payment processing is not integrated and all data is stored locally. For production use, integrate with a backend API and payment processor.