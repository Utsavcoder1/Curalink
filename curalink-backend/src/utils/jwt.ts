// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  const secret = process.env['JWT_SECRET'];
  if (!secret) throw new Error('JWT_SECRET is required');

  return jwt.sign(
    { userId }, 
    secret, 
    { expiresIn: process.env['JWT_EXPIRE'] || '30d' } as any
  );
};

export const verifyToken = (token: string): any => {
  const secret = process.env['JWT_SECRET'];
  if (!secret) throw new Error('JWT_SECRET is required');

  return jwt.verify(token, secret);
};