import { jest } from '@jest/globals';

describe('Auth Middleware - Unit Tests', () => {
  describe('authenticateJWT', () => {
    let authenticateJWT;
    let jwt;

    beforeEach(async () => {
      jest.resetModules();
      jwt = await import('jsonwebtoken');
      const authModule = await import('../../middleware/auth.js');
      authenticateJWT = authModule.authenticateJWT;
    });

    it('should return 401 if no token provided', () => {
      const req = { cookies: {}, headers: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      authenticateJWT(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', () => {
      const req = {
        cookies: { token: 'invalid-token' },
        headers: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      authenticateJWT(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next for valid token from cookie', () => {
      const token = jwt.default.sign({ id: 'user123', role: 'user' }, 'changeme');
      
      const req = {
        cookies: { token },
        headers: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      authenticateJWT(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe('user123');
    });

    it('should accept Bearer token from Authorization header', () => {
      const token = jwt.default.sign({ id: 'user456', role: 'admin' }, 'changeme');
      
      const req = {
        cookies: {},
        headers: { authorization: `Bearer ${token}` }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      authenticateJWT(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user.role).toBe('admin');
    });
  });

  describe('authorizeRoles', () => {
    let authorizeRoles;

    beforeEach(async () => {
      jest.resetModules();
      const authModule = await import('../../middleware/auth.js');
      authorizeRoles = authModule.authorizeRoles;
    });

    it('should return 401 if user not authenticated', () => {
      const req = { user: null };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      const middleware = authorizeRoles('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authenticated' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not have required role', () => {
      const req = { user: { id: 'user123', role: 'user' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      const middleware = authorizeRoles('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user has required role', () => {
      const req = { user: { id: 'admin123', role: 'admin' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      const middleware = authorizeRoles('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow multiple roles', () => {
      const req = { user: { id: 'recruiter123', role: 'recruiter' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      const middleware = authorizeRoles('admin', 'recruiter');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorizeSelfOrRoles', () => {
    let authorizeSelfOrRoles;

    beforeEach(async () => {
      jest.resetModules();
      const authModule = await import('../../middleware/auth.js');
      authorizeSelfOrRoles = authModule.authorizeSelfOrRoles;
    });

    it('should return 401 if user not authenticated', () => {
      const req = { user: null, params: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      const middleware = authorizeSelfOrRoles('userId', 'admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow user to access own resource', () => {
      const req = {
        user: { id: 'user123', role: 'user' },
        params: { userId: 'user123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      const middleware = authorizeSelfOrRoles('userId', 'admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow admin to access any resource', () => {
      const req = {
        user: { id: 'admin123', role: 'admin' },
        params: { userId: 'otherUser' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      const middleware = authorizeSelfOrRoles('userId', 'admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access to other users resources', () => {
      const req = {
        user: { id: 'user123', role: 'user' },
        params: { userId: 'otherUser' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      const middleware = authorizeSelfOrRoles('userId', 'admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireAuth', () => {
    let requireAuth;

    beforeEach(async () => {
      jest.resetModules();
      const authModule = await import('../../middleware/auth.js');
      requireAuth = authModule.requireAuth;
    });

    it('should return 401 if no user on request', () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authenticated' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user exists', () => {
      const req = { user: { id: 'user123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const next = jest.fn();

      requireAuth(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
