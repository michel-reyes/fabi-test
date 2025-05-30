import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, createErrorResponse } from '@/utils/auth';

/**
 * Retrieves the current authenticated user's profile information
 * 
 * @param request The incoming request with authentication token
 * @returns Response with the user profile data or error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the authenticated user from the request
    const user = await getCurrentUser(request);
    
    if (!user) {
      return createErrorResponse('Authentication required', 401);
    }

    // Return user data (excluding sensitive information)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return createErrorResponse('Error retrieving user profile', 500);
  }
}
