import { Router } from 'express';
export const authRouter = Router();

// keeps endpint logic seperate from route destinations
import { register, login, refresh, logout } from '../controllers/index.ts';

// each endpoint has its own RequestHandler (req, res, next)
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);

// protected routes
import { authenticate } from '../middleware/authenticate.ts';
import { profile } from '../controllers/index.ts';

authRouter.post('/profile', authenticate, profile);