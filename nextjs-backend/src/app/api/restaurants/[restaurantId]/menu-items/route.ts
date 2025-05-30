import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorize, createErrorResponse } from '@/utils/auth';

/**
 * Type definition for menu item creation request
 */
type MenuItemCreateBody = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: number;
  calories?: number;
  prepTime?: number;
  category?: string;
  customizationOptions?: Record<string, any>;
  sortOrder?: number;
};

/**
 * GET /api/restaurants/[restaurantId]/menu-items
 * Get all menu items for a restaurant
 * 
 * @param request The incoming request
 * @param param0 Object containing route parameters
 * @returns Response with menu items or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
): Promise<NextResponse> {
  try {
    const { restaurantId } = await Promise.resolve(params);
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    if (!restaurantId) {
      return createErrorResponse('Restaurant ID is required', 400);
    }
    
    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId
      }
    });
    
    if (!restaurant) {
      return createErrorResponse('Restaurant not found', 404);
    }
    
    // Build the where clause for filtering
    const whereClause: any = {
      restaurantId
    };
    
    if (category) {
      whereClause.category = category;
    }
    
    // Get menu items
    const menuItems = await prisma.menuItem.findMany({
      where: whereClause,
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });
    
    // Transform menu items to snake_case for frontend compatibility
    const transformedMenuItems = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      image_url: item.imageUrl || '',
      category: item.category || 'other',
      is_available: item.isAvailable !== false, // Default to true if not specified
      is_vegetarian: item.isVegetarian || false,
      is_vegan: item.isVegan || false,
      is_gluten_free: item.isGlutenFree || false,
      spice_level: item.spiceLevel || 0,
      calories: item.calories || null,
      prep_time: item.prepTime || null,
      customization_options: item.customizationOptions || null
    }));
    
    const response = NextResponse.json({
      success: true,
      count: transformedMenuItems.length,
      menuItems: transformedMenuItems
    });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error(`Error fetching menu items for restaurant ${params.restaurantId}:`, error);
    return createErrorResponse('Error fetching menu items', 500);
  }
}

/**
 * POST /api/restaurants/[restaurantId]/menu-items
 * Create a new menu item for a restaurant (owner or admin only)
 * 
 * @param request The incoming request with menu item data and authentication token
 * @param param0 Object containing route parameters
 * @returns Response with created menu item or error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
): Promise<NextResponse> {
  try {
    const { restaurantId } = await Promise.resolve(params);
    
    if (!restaurantId) {
      return createErrorResponse('Restaurant ID is required', 400);
    }
    
    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId
      }
    });
    
    if (!restaurant) {
      return createErrorResponse('Restaurant not found', 404);
    }
    
    // Check authorization (only the owner or admin can add menu items)
    const { user, isAuthorized } = await authorize(request, ['seller', 'admin']);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }
    
    // Check if user owns the restaurant or is admin
    if (user.role !== 'admin' && restaurant.ownerId !== user.id) {
      return createErrorResponse('You can only add menu items to your own restaurants', 403);
    }
    
    const body: MenuItemCreateBody = await request.json();
    
    // Validate required fields
    const { name, price } = body;
    
    if (!name || typeof price !== 'number' || price <= 0) {
      return createErrorResponse('Name and a valid price are required', 400);
    }
    
    // Create menu item
    const newMenuItem = await prisma.menuItem.create({
      data: {
        restaurantId,
        name,
        description: body.description,
        price,
        imageUrl: body.imageUrl,
        isAvailable: body.isAvailable,
        isVegetarian: body.isVegetarian,
        isVegan: body.isVegan,
        isGlutenFree: body.isGlutenFree,
        spiceLevel: body.spiceLevel,
        calories: body.calories,
        prepTime: body.prepTime,
        category: body.category,
        customizationOptions: body.customizationOptions as any,
        sortOrder: body.sortOrder
      }
    });
    
    return NextResponse.json({
      success: true,
      menuItem: newMenuItem
    }, { status: 201 });
  } catch (error) {
    console.error(`Error creating menu item for restaurant ${params.restaurantId}:`, error);
    return createErrorResponse('Error creating menu item', 500);
  }
}
