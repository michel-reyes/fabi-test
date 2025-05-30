import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorize, createErrorResponse } from '@/utils/auth';

/**
 * Type definition for order item in creation request
 */
type OrderItemCreate = {
  menuItemId: string;
  quantity: number;
  customizations?: Record<string, any>;
  specialInstructions?: string;
};

/**
 * Type definition for order creation request
 */
type OrderCreateBody = {
  restaurantId: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  specialInstructions?: string;
  tipAmount?: number;
  paymentMethod?: string;
  items: OrderItemCreate[];
};

/**
 * GET /api/orders
 * Get orders based on user role:
 * - Customers see their own orders
 * - Sellers see orders for their restaurants
 * - Admins see all orders
 * 
 * @param request The incoming request with authentication and optional query parameters
 * @returns Response with orders or error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get authenticated user
    const { user, isAuthorized } = await authorize(request);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }
    
    const searchParams = request.nextUrl.searchParams;
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status');
    
    // Build query filters based on user role
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (user.role === 'customer') {
      // Customers can only see their own orders
      whereClause.customerId = user.id;
    } else if (user.role === 'seller') {
      // Sellers can see orders for their restaurants
      // First, get all restaurants owned by the seller
      const sellerRestaurants = await prisma.restaurant.findMany({
        where: { ownerId: user.id },
        select: { id: true }
      });
      
      const restaurantIds = sellerRestaurants.map(restaurant => restaurant.id);
      
      whereClause.restaurantId = {
        in: restaurantIds
      };
    }
    // For admin role, no additional filters (can see all orders)
    
    // Get orders
    const orders = await prisma.order.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            streetAddress: true,
            city: true,
            state: true
          }
        },
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return createErrorResponse('Error fetching orders', 500);
  }
}

/**
 * POST /api/orders
 * Create a new order
 * 
 * @param request The incoming request with order data and authentication token
 * @returns Response with created order or error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get authenticated user
    const { user, isAuthorized } = await authorize(request);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }
    
    const body: OrderCreateBody = await request.json();
    
    // Validate required fields
    const { restaurantId, deliveryAddress, items } = body;
    
    if (!restaurantId || !deliveryAddress || !items || !items.length) {
      return createErrorResponse('Missing required fields: restaurantId, deliveryAddress, items', 400);
    }
    
    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });
    
    if (!restaurant) {
      return createErrorResponse('Restaurant not found', 404);
    }
    
    // Check if restaurant is active and open
    if (!restaurant.isActive) {
      return createErrorResponse('Restaurant is not active', 400);
    }
    
    if (!restaurant.isOpen) {
      return createErrorResponse('Restaurant is currently closed', 400);
    }
    
    // Validate all menu items and calculate totals
    const menuItemIds = items.map(item => item.menuItemId);
    
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId: restaurantId
      }
    });
    
    // Check if all menu items exist and belong to the restaurant
    if (menuItems.length !== menuItemIds.length) {
      return createErrorResponse('One or more menu items not found or don\'t belong to this restaurant', 400);
    }
    
    // Check if all menu items are available
    const unavailableItems = menuItems.filter(item => !item.isAvailable);
    if (unavailableItems.length > 0) {
      return createErrorResponse(`The following items are unavailable: ${unavailableItems.map(item => item.name).join(', ')}`, 400);
    }
    
    // Create order items and calculate totals
    const orderItemsData = items.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId)!;
      const unitPrice = menuItem.price;
      const totalPrice = unitPrice * item.quantity;
      
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        customizations: item.customizations,
        specialInstructions: item.specialInstructions
      };
    });
    
    // Calculate order totals
    const subtotal = orderItemsData.reduce((sum, item) => sum + item.totalPrice, 0);
    const deliveryFee = restaurant.deliveryFee || 2.99;
    const taxRate = 0.08; // 8% tax rate (this could be stored in a config)
    const taxAmount = subtotal * taxRate;
    const tipAmount = body.tipAmount || 0;
    const totalAmount = subtotal + deliveryFee + taxAmount + tipAmount;
    
    // Check if order meets minimum order amount
    if (restaurant.minimumOrder && subtotal < restaurant.minimumOrder) {
      return createErrorResponse(`Order does not meet minimum amount of $${restaurant.minimumOrder.toFixed(2)}`, 400);
    }
    
    // Calculate estimated delivery time
    const now = new Date();
    const restaurantPrepTime = restaurant.estimatedDeliveryTime || 30; // in minutes
    const estimatedDeliveryTime = new Date(now.getTime() + restaurantPrepTime * 60000);
    
    // Create the order with all items
    const newOrder = await prisma.order.create({
      data: {
        customerId: user.id,
        restaurantId,
        deliveryAddress,
        deliveryInstructions: body.deliveryInstructions,
        specialInstructions: body.specialInstructions,
        subtotal,
        deliveryFee,
        taxAmount,
        tipAmount,
        totalAmount,
        estimatedDeliveryTime,
        paymentMethod: body.paymentMethod,
        orderItems: {
          create: orderItemsData
        }
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        restaurant: {
          select: {
            name: true,
            phone: true,
            streetAddress: true,
            city: true,
            state: true
          }
        },
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });
    
    // Update restaurant order count
    await prisma.restaurant.update({
      where: {
        id: restaurantId
      },
      data: {
        totalOrders: {
          increment: 1
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      order: newOrder
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return createErrorResponse('Error creating order', 500);
  }
}
