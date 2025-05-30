import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';
import { verifyPassword } from '@/utils/auth';

/**
 * Debug endpoint for authentication issues
 * Only for development use
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get a known test user
    const email = 'admin@ubereats.com';
    const password = 'admin123';
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Test user not found',
        email
      });
    }
    
    // Get the stored hash
    const storedHash = user.passwordHash;
    
    // Try verifying with our utility
    const isValid = await verifyPassword(password, storedHash);
    
    // Also try direct bcrypt compare
    const directCompare = await bcrypt.compare(password, storedHash);
    
    // Create a new hash with the same password
    const saltRounds = 10;
    const newHash = await bcrypt.hash(password, saltRounds);
    
    // Return debug info
    return NextResponse.json({
      success: true,
      debug: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        passwordHash: {
          stored: storedHash,
          sample: newHash,
          hashLength: storedHash.length
        },
        verification: {
          utility: isValid,
          direct: directCompare
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Auth debug error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    });
  }
}
