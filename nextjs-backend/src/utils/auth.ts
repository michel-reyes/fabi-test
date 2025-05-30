import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

// Type definitions
export type JwtPayload = {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Verify if a password matches its hash
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a JWT token for authenticated user
 */
export const generateToken = (user: { id: string; email: string; role: string }): string => {
  const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';
  const expiresIn = process.env.TOKEN_EXPIRY || '30d';

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn }
  );
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';
    return jwt.verify(token, jwtSecret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Extract the token from the Authorization header
 */
export const extractTokenFromHeader = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
};

/**
 * Middleware to get the current authenticated user
 */
export const getCurrentUser = async (request: NextRequest): Promise<User | null> => {
  const token = extractTokenFromHeader(request);
  
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  return user;
};

/**
 * Middleware for authorization by role
 */
export const authorize = async (
  request: NextRequest,
  allowedRoles: string[] = []
): Promise<{ user: User | null; isAuthorized: boolean }> => {
  const user = await getCurrentUser(request);

  if (!user) {
    return { user: null, isAuthorized: false };
  }

  // If no specific roles are required, just being authenticated is enough
  if (!allowedRoles.length) {
    return { user, isAuthorized: true };
  }

  // Check if the user's role is in the list of allowed roles
  const isAuthorized = allowedRoles.includes(user.role);
  return { user, isAuthorized };
};

/**
 * Helper to create error responses
 */
export const createErrorResponse = (
  message: string,
  status: number = 400
): NextResponse => {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
};
