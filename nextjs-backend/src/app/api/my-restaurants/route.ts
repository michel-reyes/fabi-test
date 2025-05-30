import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorize, createErrorResponse } from '@/utils/auth';

/**
 * GET /api/my-restaurants
 * Get restaurants owned by the current logged-in user
 * 
 * @param request The incoming request with authentication token
 * @returns Response with user's restaurants or error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authorize request (seller or admin only)
    const { user, isAuthorized } = await authorize(request, ['seller', 'admin']);
    
    if (!user || !isAuthorized) {
      return createErrorResponse('Authentication required', 401);
    }
    
    // Get restaurants owned by the user
    // Admins can see all restaurants
    const restaurants = await prisma.restaurant.findMany({
      where: user.role === 'admin' ? {} : {
        ownerId: user.id
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    // Transform restaurant data to match frontend expectations (snake_case)
    const transformedRestaurants = restaurants.map(restaurant => ({
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
      } : null
    }));
    
    const response = NextResponse.json({
      success: true,
      count: transformedRestaurants.length,
      restaurants: transformedRestaurants
    });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error('Error fetching my restaurants:', error);
    return createErrorResponse('Error fetching my restaurants', 500);
  }
}

/**
 * OPTIONS /api/my-restaurants
 * Handle CORS preflight requests
 */
export async function OPTIONS(): Promise<NextResponse> {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}
