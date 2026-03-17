import { Router } from 'express';

// keeps endpint logic seperate from route destinations
import { register, login, refresh, logout } from '../controllers';

const authRouter = Router();

authRouter.post('/register', register); // passing the (req, res)
authRouter.post('/login', login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);

// authRouter.post('/profile', authenticateToken, profile);
// authRouter.get('/protected', authenticateToken, (req, res) => {
//     res.json({ message: 'This is a protected route' });
// });

export default authRouter;