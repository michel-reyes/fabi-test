import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorize, createErrorResponse } from '@/utils/auth';

/**
 * Type definition for order update request
 */
type OrderUpdateBody = {
  status?: string;
  specialInstructions?: string;
  deliveryInstructions?: string;
  actualDeliveryTime?: Date;
};

/**
 * GET /api/orders/[orderId]
 * Get a specific order by ID
 * 
 * @param request The incoming request with authentication token
 * @param param0 Object containing route parameters
 * @returns Response with order data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
): Promise<NextResponse> {
  try {
    const { orderId } = await Promise.resolve(params);
    
    if (!orderId) {
      return createErrorResponse('Order ID is required', 400);
    }
    
    // Get the order with related data
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
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
            ownerId: true,
            streetAddress: true,
            city: true,
            state: true,
            postalCode: true,
            phone: true
          }
        },
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });
    
    if (!order) {
      return createErrorResponse('Order not found', 404);
    }
    
    // Check permissions based on user role
    const { user } = await authorize(request);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }
    
    // Only allow access to the customer who placed the order,
    // the restaurant owner, or an admin
    if (
      user.role === 'customer' && order.customerId !== user.id ||
      user.role === 'seller' && order.restaurant.ownerId !== user.id
    ) {
      return createErrorResponse('You do not have permission to view this order', 403);
    }
    
    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(`Error fetching order ${params.orderId}:`, error);
    return createErrorResponse('Error fetching order', 500);
  }
}

/**
 * PUT /api/orders/[orderId]
 * Update an order (primarily for status updates by restaurant owners and admins)
 * 
 * @param request The incoming request with update data and authentication token
 * @param param0 Object containing route parameters
 * @returns Response with updated order or error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
): Promise<NextResponse> {
  try {
    const { orderId } = await Promise.resolve(params);
    
    if (!orderId) {
      return createErrorResponse('Order ID is required', 400);
    }
    
    // Get the order
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      },
      include: {
        restaurant: {
          select: {
            ownerId: true
          }
        }
      }
    });
    
    if (!order) {
      return createErrorResponse('Order not found', 404);
    }
    
    // Check permissions (only sellers who own the restaurant and admins can update orders)
    const { user } = await authorize(request, ['seller', 'admin']);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }
    
    // Customers cannot update order status
    if (user.role === 'customer') {
      return createErrorResponse('Customers cannot update order status', 403);
    }
    
    // If seller, check if they own the restaurant
    if (user.role === 'seller' && order.restaurant.ownerId !== user.id) {
      return createErrorResponse('You can only update orders for your restaurants', 403);
    }
    
    const body: OrderUpdateBody = await request.json();
    
    // Validate status if provided
    if (body.status) {
      const validStatuses = [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'picked_up',
        'delivering',
        'delivered',
        'cancelled'
      ];
      
      if (!validStatuses.includes(body.status)) {
        return createErrorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }
      
      // If status is 'delivered', set actual delivery time if not already set
      if (body.status === 'delivered' && !body.actualDeliveryTime) {
        body.actualDeliveryTime = new Date();
      }
    }
    
    // Update the order
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: body,
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
            phone: true
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
      order: updatedOrder
    });
  } catch (error) {
    console.error(`Error updating order ${params.orderId}:`, error);
    return createErrorResponse('Error updating order', 500);
  }
}
