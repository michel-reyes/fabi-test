import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorize, createErrorResponse } from '@/utils/auth';

type RestaurantUpdateBody = {
  name?: string;
  description?: string;
  cuisineType?: string;
  phone?: string;
  email?: string;
  streetAddress?: string;
  apartment?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  coverImageUrl?: string;
  logoUrl?: string;
  isActive?: boolean;
  isOpen?: boolean;
  deliveryFee?: number;
  minimumOrder?: number;
  estimatedDeliveryTime?: number;
  businessHours?: Record<string, any>;
};

/**
 * GET /api/restaurants/[restaurantId]
 * Get a specific restaurant by ID
 * 
 * @param request The incoming request
 * @param param0 Object containing route parameters
 * @returns Response with restaurant data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
): Promise<NextResponse> {
  try {
    const { restaurantId } = await Promise.resolve(params);
    
    if (!restaurantId) {
      return createErrorResponse('Restaurant ID is required', 400);
    }
    
    // Find the restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        menuItems: true
      }
    });
    
    if (!restaurant) {
      return createErrorResponse('Restaurant not found', 404);
    }
    
    // Transform restaurant data to match frontend expectations (snake_case)
    const transformedRestaurant = {
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description || '',
      cuisine_type: restaurant.cuisineType,
      cover_image_url: restaurant.coverImageUrl,
      logo_url: restaurant.logoUrl,
      city: restaurant.city,
      state: restaurant.state,
      street_address: restaurant.streetAddress,
      postal_code: restaurant.postalCode,
      delivery_fee: restaurant.deliveryFee || 0,
      minimum_order: restaurant.minimumOrder || 0,
      estimated_delivery_time: restaurant.estimatedDeliveryTime || 30,
      is_active: restaurant.isActive,
      is_open: restaurant.isActive, // Using isActive as a proxy for is_open
      average_rating: 4.5, // Default rating since we don't have this in the model yet
      total_reviews: 10,   // Default value since we don't have this in the model yet
      owner: restaurant.owner ? {
        id: restaurant.owner.id,
        first_name: restaurant.owner.firstName,
        last_name: restaurant.owner.lastName,
        email: restaurant.owner.email
      } : null,
      menu_items: restaurant.menuItems ? restaurant.menuItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        image_url: item.imageUrl,
        category: item.category || 'other',
        is_available: item.isAvailable,
        is_vegetarian: item.isVegetarian,
        is_vegan: item.isVegan,
        is_gluten_free: item.isGlutenFree
      })) : []
    };
    
    const response = NextResponse.json({
      success: true,
      restaurant: transformedRestaurant
    });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error(`Error fetching restaurant ${params.restaurantId}:`, error);
    return createErrorResponse('Error fetching restaurant', 500);
  }
}

/**
 * PUT /api/restaurants/[restaurantId]
 * Update a restaurant (owner or admin only)
 * 
 * @param request The incoming request with update data and authentication token
 * @param param0 Object containing route parameters
 * @returns Response with updated restaurant or error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
): Promise<NextResponse> {
  try {
    const { restaurantId } = await Promise.resolve(params);
    
    if (!restaurantId) {
      return createErrorResponse('Restaurant ID is required', 400);
    }
    
    // Find the restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId
      }
    });
    
    if (!restaurant) {
      return createErrorResponse('Restaurant not found', 404);
    }
    
    // Check authorization (only the owner or admin can update the restaurant)
    const { user, isAuthorized } = await authorize(request, ['seller', 'admin']);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }
    
    // Check if user owns the restaurant or is admin
    if (user.role !== 'admin' && restaurant.ownerId !== user.id) {
      return createErrorResponse('You can only update your own restaurants', 403);
    }
    
    const body: RestaurantUpdateBody = await request.json();
    
    // Update the restaurant
    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id: restaurantId
      },
      data: body,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      restaurant: updatedRestaurant
    });
  } catch (error) {
    console.error(`Error updating restaurant ${params.restaurantId}:`, error);
    return createErrorResponse('Error updating restaurant', 500);
  }
}

/**
 * DELETE /api/restaurants/[restaurantId]
 * Delete a restaurant (owner or admin only)
 * 
 * @param request The incoming request with authentication token
 * @param param0 Object containing route parameters
 * @returns Response with success message or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
): Promise<NextResponse> {
  try {
    const { restaurantId } = await Promise.resolve(params);
    
    if (!restaurantId) {
      return createErrorResponse('Restaurant ID is required', 400);
    }
    
    // Find the restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId
      }
    });
    
    if (!restaurant) {
      return createErrorResponse('Restaurant not found', 404);
    }
    
    // Check authorization (only the owner or admin can delete the restaurant)
    const { user, isAuthorized } = await authorize(request, ['seller', 'admin']);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }
    
    // Check if user owns the restaurant or is admin
    if (user.role !== 'admin' && restaurant.ownerId !== user.id) {
      return createErrorResponse('You can only delete your own restaurants', 403);
    }
    
    // Delete the restaurant
    await prisma.restaurant.delete({
      where: {
        id: restaurantId
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting restaurant ${params.restaurantId}:`, error);
    return createErrorResponse('Error deleting restaurant', 500);
  }
}
