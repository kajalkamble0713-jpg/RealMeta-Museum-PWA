import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppError } from './errorHandler';

interface AuthRequest extends Request {
  adminAuth?: {
    isAdmin: boolean;
  };
}

export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'demo123';
  
  // In production, store hashed password in database
  // For now, simple comparison
  return password === adminPassword;
};

export const generateAdminToken = (): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(
    { isAdmin: true, timestamp: Date.now() },
    secret,
    { expiresIn: '24h' }
  );
};

export const verifyAdminToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }
    
    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, secret) as { isAdmin: boolean };
    
    if (!decoded.isAdmin) {
      throw new AppError('Unauthorized', 403);
    }
    
    req.adminAuth = { isAdmin: true };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401));
    }
    next(error);
  }
};

