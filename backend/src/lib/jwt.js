import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';

export function signUserToken(userId, email) {
  return jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyUserToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
