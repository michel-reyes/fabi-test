import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createErrorResponse } from '@/utils/auth';

type RegisterRequestBody = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
};

/**
 * Handles user registration
 * 
 * @param request The incoming request with user registration data
 * @returns Response with the created user or error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RegisterRequestBody = await request.json();
    
    // Validate required fields
    const { email, password, firstName, lastName, phone, role = 'customer' } = body;
    
    if (!email || !password || !firstName || !lastName) {
      return createErrorResponse('Missing required fields: email, password, firstName, lastName');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return createErrorResponse('Email already registered', 400);
    }

    // Validate role
    const validRoles = ['customer', 'seller', 'admin'];
    if (!validRoles.includes(role)) {
      return createErrorResponse(`Invalid role. Must be one of: ${validRoles.join(', ')}`, 400);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName, 
        lastName,
        phone,
        role
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        profileImageUrl: true,
        createdAt: true,
        updatedAt: true,
        // Exclude passwordHash from response
      }
    });

    return NextResponse.json({
      success: true,
      user: newUser
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return createErrorResponse('Error registering user', 500);
  }
}
