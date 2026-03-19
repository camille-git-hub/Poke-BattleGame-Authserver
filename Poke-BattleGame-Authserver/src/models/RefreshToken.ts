import { Schema, model } from 'mongoose';

function expiresAt(): Date {
    const REFRESH_TOKEN_TTL = parseInt(process.env.REFRESH_TOKEN_TTL || '604800000');
    // default to 7 days in milliseconds
    
    return new Date(Date.now() + REFRESH_TOKEN_TTL);
}

const refreshTokenSchema = new Schema({
    token: { type: String },
    userId: { type: Schema.ObjectId, ref: 'User' },
    expiresAt: { type: Date, default: expiresAt },
}, { timestamps: true });


const ASCENDING = 1; // MongoDB convention for ascending index

const indexFields = { expiresAt: ASCENDING } as const;  // Sort ascending by expiration date
const indexOptions = { expireAfterSeconds: 0 } as const;  // Delete immediately when expired

refreshTokenSchema.index(indexFields, indexOptions);

export const RefreshToken = model('RefreshToken', refreshTokenSchema);