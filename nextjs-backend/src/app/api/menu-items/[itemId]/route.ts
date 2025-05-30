import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorize, createErrorResponse } from '@/utils/auth';

/**
 * Type definition for menu item update request
 */
type MenuItemUpdateBody = {
  name?: string;
  description?: string;
  price?: number;
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
 * Retrieves a specific menu item by its ID
 * 
 * @param request The incoming request
 * @param param0 Object containing route parameters
 * @returns Response with menu item data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
): Promise<NextResponse> {
  try {
    const { itemId } = await Promise.resolve(params);
    
    if (!itemId) {
      return createErrorResponse('Menu item ID is required', 400);
    }
    
    // Find the menu item
    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: itemId
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            cuisineType: true
          }
        }
      }
    });
    
    if (!menuItem) {
      return createErrorResponse('Menu item not found', 404);
    }
    
    return NextResponse.json({
      success: true,
      menuItem
    });
  } catch (error) {
    console.error(`Error fetching menu item ${params.itemId}:`, error);
    return createErrorResponse('Error fetching menu item', 500);
  }
}

/**
 * Updates a specific menu item (owner or admin only)
 * 
 * @param request The incoming request with update data and authentication token
 * @param param0 Object containing route parameters
 * @returns Response with updated menu item or error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
): Promise<NextResponse> {
  try {
    const { itemId } = await Promise.resolve(params);
    
    if (!itemId) {
      return createErrorResponse('Menu item ID is required', 400);
    }
    
    // Find the menu item
    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: itemId
      },
      include: {
        restaurant: true
      }
    });
    
    if (!menuItem) {
      return createErrorResponse('Menu item not found', 404);
    }
    
    // Check authorization (only the restaurant owner or admin can update menu items)
    const { user, isAuthorized } = await authorize(request, ['seller', 'admin']);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }
    
    // Check if user owns the restaurant or is admin
    if (user.role !== 'admin' && menuItem.restaurant.ownerId !== user.id) {
      return createErrorResponse('You can only update menu items from your own restaurants', 403);
    }
    
    const body: MenuItemUpdateBody = await request.json();
    
    // Validate price if provided
    if (body.price !== undefined && (typeof body.price !== 'number' || body.price <= 0)) {
      return createErrorResponse('Price must be a positive number', 400);
    }
    
    // Update the menu item
    const updatedMenuItem = await prisma.menuItem.update({
      where: {
        id: itemId
      },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
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
      menuItem: updatedMenuItem
    });
  } catch (error) {
    console.error(`Error updating menu item ${params.itemId}:`, error);
    return createErrorResponse('Error updating menu item', 500);
  }
}

/**
 * Deletes a specific menu item (owner or admin only)
 * 
 * @param request The incoming request with authentication token
 * @param param0 Object containing route parameters
 * @returns Response with success message or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
): Promise<NextResponse> {
  try {
    const { itemId } = await Promise.resolve(params);
    
    if (!itemId) {
      return createErrorResponse('Menu item ID is required', 400);
    }
    
    // Find the menu item
    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: itemId
      },
      include: {
        restaurant: true
      }
    });
    
    if (!menuItem) {
      return createErrorResponse('Menu item not found', 404);
    }
    
    // Check authorization (only the restaurant owner or admin can delete menu items)
    const { user, isAuthorized } = await authorize(request, ['seller', 'admin']);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }
    
    // Check if user owns the restaurant or is admin
    if (user.role !== 'admin' && menuItem.restaurant.ownerId !== user.id) {
      return createErrorResponse('You can only delete menu items from your own restaurants', 403);
    }
    
    // Delete the menu item
    await prisma.menuItem.delete({
      where: {
        id: itemId
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting menu item ${params.itemId}:`, error);
    return createErrorResponse('Error deleting menu item', 500);
  }
}
