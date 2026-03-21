export function adminAuth(req, res, next) {
  const key = process.env.ADMIN_API_KEY || 'dev-admin-key';
  const header = req.headers.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null;
  const apiKey = req.headers['x-api-key'] || bearer;
  if (!apiKey || apiKey !== key) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
