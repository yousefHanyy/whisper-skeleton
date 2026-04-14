import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { HttpError } from './errorHandler.js';

export async function authenticate(req, _res, next) {
  // TODO:
  // Hint: read Authorization: Bearer <token>. Verify with jwt.verify(token, JWT_SECRET).
  // Load User.findById(payload.sub). Attach to req.user. Any failure -> 401.
  // See: docs/API.md "Authentication", tester/tests/auth.test.js
  throw new Error('not implemented');
}

export function signToken(user) {
  // TODO:
  // Hint: jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || '7d' })
  throw new Error('not implemented');
}
