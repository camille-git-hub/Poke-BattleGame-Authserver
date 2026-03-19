// all JWt logic, including rotation

import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';

import { RefreshToken } from '../models/index.ts';


export const JWT_SECRET: string = process.env.JWT_SECRET || 'undefined_secret';
const JWT_expiresIn = '8h'; // Token expiry time (e.g., 8 hours)

export async function signAccessToken(payload: object): Promise<string> {

    const token = jwt.sign(
        payload, JWT_SECRET, {
        expiresIn: JWT_expiresIn
    }
    );
    return token;
};

export async function rotateRefreshToken(userId: Types.ObjectId): Promise<string> {

    try {
        // delete old refresh tokens for this user
        await RefreshToken.deleteMany({ userId: userId });

        // creating new
        const newRefershToken = crypto.randomUUID();
        await RefreshToken.create(
            { token: newRefershToken, userId: userId }
        );
    
        return newRefershToken;
    } catch (error) {
        console.error('Error deleting old refresh tokens:', error);
        throw new Error('Failed to rotate refresh token');
    } finally {
        console.log("rotateRefreshToken finalised")
    }
}

export async function clearRefreshToken(refreshToken: string) {
    await RefreshToken.deleteOne({ token: refreshToken });
}