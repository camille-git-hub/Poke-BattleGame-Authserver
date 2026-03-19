import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { StatusCodes } from "http-status-codes";
import { JWT_SECRET } from '../services/tokenService.ts';

const e_invalidToken = { status: StatusCodes.UNAUTHORIZED };

export const authenticate: RequestHandler = (req, res, next) => {
    // In a real implementation, you would verify the JWT token here.
    // For example, you could check for the token in the Authorization header or cookies,
    // then verify it using a library like jsonwebtoken.
s
    // If the token is valid, call next() to proceed to the next middleware or route handler.
    // If the token is invalid or missing, respond with an appropriate error status (e.g. 401 Unauthorized).

    const token = req.cookies.accessToken; // Example: get token from cookies

    if (!token) {
        throw new Error('No token provided', { cause: e_invalidToken });
    }

    if (typeof token !== 'string') {
        res.clearCookie('accessToken');
        return next(new Error('Invalid token type, please login again', { cause: e_invalidToken }));
    }

    // Basic JWT shape guard. Prevents trying to verify stale non-JWT strings.
    if (!token.includes('.')) {
        res.clearCookie('accessToken');
        return next(new Error('Malformed token, please login again', { cause: e_invalidToken }));
    }

    try {
        console.log("Authenticating token:", token);
        
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        console.log("Decoded token:", decoded);

        const user = {
            id: decoded.id,
            email: decoded.email,
        }

        req.user = user; // Attach user info to the request object

        console.log("Authenticated user:", user);

        next(); // Token is valid, proceed to the next middleware or route handler
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return next( new Error('Invalid token (JSW)', { cause: e_invalidToken }));
        }
        return next(new Error('Invalid token (General)', { cause: e_invalidToken }));
    }
};