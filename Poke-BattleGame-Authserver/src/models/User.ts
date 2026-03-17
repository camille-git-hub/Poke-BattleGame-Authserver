// stores password hashes and refresh tokens

import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // prevent password from being returned in queries by default
    age: { type: Number },
    //refreshToken: { type: String },
}, { timestamps: true });

export const User = model('User', userSchema);