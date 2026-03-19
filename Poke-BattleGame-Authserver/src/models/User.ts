// stores password hashes and refresh tokens

import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // prevent password from being returned in queries by default
}, { timestamps: true });

export const User = model('User', userSchema);