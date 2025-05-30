import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken, createErrorResponse } from '@/utils/auth';

type LoginRequestBody = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  error?: string;
};

/**
 * Handles user login authentication
 * 
 * @param request The incoming request with login credentials
 * @returns Response with auth token and user data or error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    let body: LoginRequestBody;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing login request body:', parseError);
      return createErrorResponse('Invalid request format', 400);
    }
    
    // Validate required fields
    const { email, password } = body;
    console.log('Login attempt for:', email); // Log without password for security
    
    if (!email || !password) {
      console.log('Login rejected: Missing email or password');
      return createErrorResponse('Email and password are required', 400);
    }

    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        console.log(`Login rejected: No user found with email ${email}`);
        return createErrorResponse('Invalid email or password', 401);
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.passwordHash);
      
      if (!isPasswordValid) {
        console.log(`Login rejected: Invalid password for ${email}`);
        return createErrorResponse('Invalid email or password', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        console.log(`Login rejected: Inactive account for ${email}`);
        return createErrorResponse('Account is deactivated. Please contact support.', 401);
      }

      // Generate JWT token
      console.log('Generating token for user:', user.id);
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      if (!token) {
        console.error(`Failed to generate token for ${email}`);
        return createErrorResponse('Authentication error', 500);
      }

      // Prepare response object
      const response: LoginResponse = {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      };

      console.log(`Login successful for ${email}`);
      
      // Add CORS headers explicitly
      const responseObj = NextResponse.json(response);
      responseObj.headers.set('Access-Control-Allow-Origin', '*');
      return responseObj;
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      return createErrorResponse('Error accessing user data', 500);
    }
  } catch (error) {
    console.error('Unexpected login error:', error);
    return createErrorResponse('Error during login', 500);
  }
}
