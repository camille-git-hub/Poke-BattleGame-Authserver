// keeps endpint logic seperate from route destinations

import { type RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '../models/index.ts';

// temp
import bcrypt from 'bcrypt';

// signing the token
import jwt from 'jsonwebtoken';

// errors
const e_notFound = { status: StatusCodes.NOT_FOUND }
const e_unauthorized = { status: StatusCodes.UNAUTHORIZED }
const e_alreadyExists = { status: StatusCodes.CONFLICT }

export const register: RequestHandler = async (req, res, next) => {
    try {

        // getting the info we need from the request body
        const { email, password } = req.body; // === const { body: { email, password } } = req;

        // checking if user already exists in the database
        const found = await User.exists({ email });

        if (found) { throw new Error('User already exists', { cause: e_alreadyExists }); }

        // hashing session
        const hash = await bcrypt.hash(password, 10);
        // 10 is the salt rounds, which determines the computational cost of hashing. 
        // Higher is more secure but slower.

        res.json({ hash }); // for testing, remove later

        // if does not exist, create a new user
        const newUser = await User.create({ email, hash });

        // include any user info you want in the token payload
        const payload = { email: newUser.email, id: newUser._id };
        // In production, use a secure secret and store it in environment variables

        const secret: string = process.env.JWT_SECRET || 'undefined_secret';

        const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // token expires in 1 hour

        res.json({ token }); // for testing, remove later

        // respond with success message
        // res.status(StatusCodes.CREATED).json({ message: 'User registered successfully' });

        // return res.json({ hash });

        // Set the access token as an HTTP-only cookie
        // An access token is a credential that proves the user is authenticated.
        // It's sent with each subsequent request to authorize protected endpoints.
        // Storing it in a cookie (rather than localStorage) protects against XSS attacks
        // because JavaScript cannot access httpOnly cookies.
        res.cookie("accessToken", token, {
            httpOnly: true, // prevents JavaScript access to the cookie, mitigating XSS attacks
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // prevents the browser from sending this cookie along with cross-site requests
            maxAge: '1h', // cookie expires in 1 hour
        });

    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    } finally {
        console.log("RequestHandler: register completed");
    }
}

export const login: RequestHandler = async (req, res, next) => {
    try {
        
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password'); 
        // explicitly include password hash in the query result

        res.json({ user }); // for testing, remove later
        
        if (!user) {
            throw new Error('User not found', { cause: e_notFound });
        }

        // compare the provided password with the stored hash
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new Error('Invalid credentials', { cause: e_unauthorized });
        }

        const payload = { email: user.email, id: user._id };
        const secret: string = process.env.JWT_SECRET || 'undefined_secret';

        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        res.json({ token }); // for testing, remove later

        // Set the access token as an HTTP-only cookie
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            // maxAge: 3600000, // 1 hour in milliseconds
        });

        res.json({ message: 'User logged in successfully' });

        // what do we do with them cookie?
        // send it to the middleware that checks for it and verifies it on protected routes

    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    } finally {
        console.log("RequestHandler: login completed");
    }
}

export const refresh: RequestHandler = async (req, res, next) => {
    // token refresh logic here
    try {
        res.json({ message: 'Token refreshed successfully' });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    } finally {
        console.log("RequestHandler: refresh completed");
    }
}

export const logout: RequestHandler = async (req, res, next) => {
    // logout logic here
    try {
        res.json({ message: 'User logged out successfully' });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    } finally {
        console.log("RequestHandler: logout completed");
    }
}