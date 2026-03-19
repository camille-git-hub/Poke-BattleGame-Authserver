// keeps endpint logic seperate from route destinations

import { type RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '../models/index.ts';
import { RefreshToken } from '../models/index.ts';

// services
import { setAuthCookies, clearAuthCookies } from '../services/cookieService.ts';
import { signAccessToken, rotateRefreshToken, clearRefreshToken } from '../services/tokenService.ts';

// temp
import bcrypt from 'bcrypt';
import type { Types } from 'mongoose';

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
        const hash: string = await bcrypt.hash(password, 10);
        // 10 is the salt rounds, which determines the computational cost of hashing. 
        // Higher is more secure but slower.

        // if does not exist, create a new user
        const newUser = await User.create({ email: email, password: hash });

        // include any user info you want in the token payload
        const payload = { email: newUser.email, id: newUser._id };
        // In production, use a secure secret and store it in environment variables

        const accessToken = await signAccessToken(payload);
        const refreshToken = await rotateRefreshToken(newUser._id);

        setAuthCookies(res, accessToken, refreshToken);

        // Send ONE response with success
        res.status(StatusCodes.CREATED).json({
            message: 'User registered successfully',
            accessToken,
            user: { id: newUser._id, email: newUser.email }
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

        const user = await User
            .findOne({ email })
            .select('+password'); // explicitly include password hash in the query result

        if (!user) {
            throw new Error('User not found', { cause: e_notFound });
        }

        // compare the provided pass with the stored hash
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new Error('Invalid credentials', { cause: e_unauthorized });
        }

        const payload = {
            email: user.email,
            id: user._id
        };

        const accessToken = await signAccessToken(payload);
        const refreshToken = await rotateRefreshToken(user._id);

        setAuthCookies(res, accessToken, refreshToken);

        // Send ONE response with success
        res.status(200).json({
            message: 'User logged in successfully',
            accessToken,
            user: { id: user._id, email: user.email }
        });

        // what do we do with them cookie?
        // send it to the middleware that verifies it on protected routes

        /// ...

    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    } finally {
        console.log("RequestHandler: login completed");
    }
} 

const e_refreshTokenError = new Error('Refresh token missing', { cause: e_unauthorized });
const e_storedTokenError = new Error('Invalid refresh token', { cause: e_unauthorized });

export const refresh: RequestHandler = async (req, res, next) => {
    try {

        const { refreshToken } = req.cookies;
        if (!refreshToken) { throw e_refreshTokenError };

        const storedToken = await RefreshToken
            .findOne({ token: refreshToken })
            .populate('userId'); // gets user

        if (!storedToken) { throw e_storedTokenError };

        const user = await User.findById(storedToken.userId);
        if (!user) { throw e_notFound }

        await storedToken.deleteOne();
        // === await RefreshToken.findByIdAndDelete(storedToken._id);

        
        const payload = { email: user.email, id: user._id };
        const accessToken = await signAccessToken(payload);

        const userId = storedToken.userId as Types.ObjectId;
        const newRefershToken = await rotateRefreshToken(userId);

        // In production, use a secure secret and store it in environment variables

        setAuthCookies(res, accessToken, newRefershToken);
        res.status(201).json(storedToken);

    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    } finally {
        console.log("RequestHandler: refresh completed");
    }
}

export const logout: RequestHandler = async (req, res, next) => {
    try {
        await clearRefreshToken(req.cookies.refreshToken);
        await clearAuthCookies(res);
        res.end();
    } catch (error) {
        next(error);
    } finally {
        console.log("Logged out!");
    }
};

export const profile: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findById(req.user?.id);
        res.json(user);

    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    } finally {
        console.log("RequestHandler: profile finished");
    }
}