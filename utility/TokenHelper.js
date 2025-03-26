import jwt from 'jsonwebtoken';
import {JWT_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../config/config.js'

export const EncodeToken = (email, user_id) => {
    const PAYLOAD = { email, user_id };
    return jwt.sign(PAYLOAD, JWT_SECRET, ACCESS_TOKEN_EXPIRY);
};

export const GenerateRefreshToken = (email, user_id) => {
    return jwt.sign(
        {email, user_id}, JWT_SECRET, REFRESH_TOKEN_EXPIRY);
};

export const DecodeToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};


