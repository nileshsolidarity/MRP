import jwt from 'jsonwebtoken';
import { getJwtSecret } from './config.js';

// Legacy: create token from branch object
export function createToken(branch) {
  return jwt.sign(
    { branchId: branch.id, name: branch.name, code: branch.code },
    getJwtSecret(),
    { expiresIn: '24h' }
  );
}

// New: create token for authenticated user (backward-compatible with branch fields)
export function createUserToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      userName: user.name,
      // Backward compatibility — all existing features use branchId/name/code
      branchId: 1,
      name: 'Head Office',
      code: 'HO001',
    },
    getJwtSecret(),
    { expiresIn: '24h' }
  );
}

// Purpose tokens for approval and password reset links
export function createPurposeToken(email, purpose, expiresIn = '24h') {
  return jwt.sign(
    { email, purpose },
    getJwtSecret(),
    { expiresIn }
  );
}

export function verifyPurposeToken(token, expectedPurpose) {
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (payload.purpose !== expectedPurpose) return null;
    return payload;
  } catch {
    return null;
  }
}

export function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    return jwt.verify(authHeader.split(' ')[1], getJwtSecret());
  } catch {
    return null;
  }
}

export function requireAuth(req, res) {
  const branch = verifyToken(req);
  if (!branch) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return branch;
}
