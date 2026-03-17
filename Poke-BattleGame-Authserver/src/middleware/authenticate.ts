import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { StatusCodes } from "http-status-codes";

const e_invalidToken = { status: StatusCodes.UNAUTHORIZED };

export const authenticate: RequestHandler = (req, res, next) => {
    // In a real implementation, you would verify the JWT token here.
    // For example, you could check for the token in the Authorization header or cookies,
    // then verify it using a library like jsonwebtoken.

    // If the token is valid, call next() to proceed to the next middleware or route handler.
    // If the token is invalid or missing, respond with an appropriate error status (e.g. 401 Unauthorized).

    const token = req.cookies.accessToken; // Example: get token from cookies
    const secret: string = process.env.JWT_SECRET || 'undefined_secret'

    if (!token) {
        throw new Error('No token provided', { cause: e_invalidToken });
    }

    try {
        console.log("Authenticating token:", token);
        // Here you would verify the token and extract user information if needed.
        // For example:
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded; // Attach user info to the request object

        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
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
            return next( new Error('Invalid token', { cause: e_invalidToken }));
        }
        return next(new Error('Invalid token', { cause: e_invalidToken }));
    }
};