# Uber Eats Clone API - Next.js Backend

This is a Node.js backend API for the Uber Eats Clone application, built with Next.js and Prisma. It replaces the previous Python FastAPI implementation while maintaining the same functionality and database schema.

## Technologies Used

- **Next.js**: React framework with built-in API routes functionality
- **TypeScript**: For type-safe code and better developer experience
- **Prisma**: Modern ORM for database access
- **PostgreSQL**: Database (same as the original implementation)
- **JSON Web Tokens (JWT)**: For secure authentication
- **bcrypt**: For password hashing
- **TailwindCSS**: For styling the API documentation page

## Key Features

- Complete REST API for a food delivery application
- User authentication and authorization with role-based access control
- Restaurant management endpoints
- Menu item management
- Order creation and status updates
- Type safety throughout the codebase
- Comprehensive error handling
- CORS support for cross-origin requests
- API documentation UI

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (can use the same database as the previous implementation)

### Environment Setup

#### Development with SQLite

For local development, the project is configured to use SQLite which avoids the need for a PostgreSQL server. Create a `.env` file in the root of the project with the following variables:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-here-change-in-production"
SECRET_KEY="your-secret-key-here-change-in-production"
TOKEN_EXPIRY="30d"
```

#### Production with PostgreSQL

For production, you should switch to PostgreSQL by updating the `.env` file and Prisma schema:

1. Update `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ubereats_db"
JWT_SECRET="your-secure-jwt-secret"
SECRET_KEY="your-secure-secret-key"
TOKEN_EXPIRY="30d"
```

2. Update the provider in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. If needed, run database migrations:

```bash
npx prisma migrate dev
```

### Running the Server

#### Port Configuration

To avoid port collisions with other services (especially the frontend), this backend is configured to run on **port 8005** by default.

**Development mode:**

```bash
npm run dev  # Runs on http://localhost:8005
```

**Production build:**

```bash
npm run build
npm start  # Runs on http://localhost:8005
```

#### Changing the Port

If you need to change the port due to conflicts with other applications:

1. Update the port in `package.json` script commands:

```json
"scripts": {
  "dev": "next dev -p YOUR_PREFERRED_PORT",
  "start": "next start -p YOUR_PREFERRED_PORT"
}
```

2. Don't forget to also update the API base URL in the frontend's `api.js` file to match this port:

```javascript
const API_BASE_URL = 'http://localhost:YOUR_PREFERRED_PORT/api';
```

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login and get access token
- `GET /api/users/me` - Get current user information

### Restaurants

- `GET /api/restaurants` - Get all restaurants with optional filtering
- `POST /api/restaurants` - Create a new restaurant (sellers and admins only)
- `GET /api/restaurants/:restaurantId` - Get a specific restaurant
- `PUT /api/restaurants/:restaurantId` - Update a restaurant (owner or admin only)
- `DELETE /api/restaurants/:restaurantId` - Delete a restaurant (owner or admin only)

### Menu Items

- `GET /api/restaurants/:restaurantId/menu-items` - Get menu items for a restaurant
- `POST /api/restaurants/:restaurantId/menu-items` - Create a menu item for a restaurant
- `GET /api/menu-items/:itemId` - Get a specific menu item
- `PUT /api/menu-items/:itemId` - Update a menu item
- `DELETE /api/menu-items/:itemId` - Delete a menu item

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get orders (customers see their own, sellers see their restaurant orders, admins see all)
- `GET /api/orders/:orderId` - Get a specific order
- `PUT /api/orders/:orderId` - Update order status (sellers and admins only)

## Code Structure

- `src/app/` - Next.js application code
  - `api/` - API routes
  - `page.tsx` - API documentation page
- `src/lib/` - Library code
  - `prisma.ts` - Prisma client setup
- `src/utils/` - Utility functions
  - `auth.ts` - Authentication utilities
- `prisma/` - Prisma schema and migrations
  - `schema.prisma` - Database schema definition

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints, include the token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Deployment

This Next.js API can be deployed to any hosting platform that supports Node.js applications, such as:

- Vercel
- AWS
- Google Cloud
- Heroku
- Digital Ocean

## Connecting with Frontend

The original frontend can connect to this new API by updating the API endpoint URLs in the frontend code. The API maintains the same request/response structure as the original Python backend for seamless integration.
