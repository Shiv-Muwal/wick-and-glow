import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export function signUserToken(userId, email) {
  return jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

export function verifyUserToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
