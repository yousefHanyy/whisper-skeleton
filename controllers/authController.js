import { User } from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { HttpError } from '../middleware/errorHandler.js';

export async function signup(req, res, next) {
  // TODO:
  // Hint: validate already ran (see routes). Pull { username, email, password, displayName } from req.body.
  // Check duplicate email/username -> 409. Hash password with User.hashPassword, create user,
  // signToken(user), respond 201 { token, user }. toJSON strips passwordHash automatically.
  // Mongo duplicate-key errors (err.code === 11000) must also become 409.
  // See: docs/API.md "POST /api/auth/signup", tester/tests/auth.test.js
  throw new Error('not implemented');
}

export async function login(req, res, next) {
  // TODO:
  // Hint: find user by email. If missing OR comparePassword fails, 401 with a GENERIC message
  // (don't leak which half was wrong). On success return { token, user }.
  // See: docs/API.md "POST /api/auth/login", tester/tests/auth.test.js
  throw new Error('not implemented');
}

export async function me(req, res) {
  // TODO:
  // Hint: authenticate middleware has already attached the user — just return it.
  // See: docs/API.md "GET /api/auth/me", tester/tests/auth.test.js
  throw new Error('not implemented');
}
