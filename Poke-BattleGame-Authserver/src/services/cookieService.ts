import { type Response } from 'express';

const t_ONE_HOUR = 60 * 60 * 1000;
const t_ONE_WEEK = 7 * 24 * t_ONE_HOUR;

export function setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
) {

    // Set the access token as an HTTP-only cookie
    // An access token is a credential that proves the user is authenticated.
    // It's sent with each subsequent request to authorize protected endpoints.
    // Storing it in a cookie (rather than localStorage) protects against XSS attacks
    // because JavaScript cannot access httpOnly cookies.
    res.cookie("accessToken", accessToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * t_ONE_HOUR,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevents JavaScript access to the cookie, mitigating XSS attacks
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // prevents the browser from sending this cookie along with cross-site requests
        maxAge: t_ONE_WEEK,
    });
}

export async function clearAuthCookies(res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
}