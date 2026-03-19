import express from 'express';

const app = express();
app.use(express.json()); // Allows parsing incoming JSON request bodies

import cookieParser from 'cookie-parser';
app.use(cookieParser()); // Middleware to parse cookies from incoming requests

// connect to the database (runs the code in db/index.ts, which connects to MongoDB)
import { connectDB } from "./db/index.ts";

// CORS (Cross-Origin Resource Sharing) is Express middleware that controls
// which browser origins are allowed to call this API.
//
// Why this is needed:
// Browsers block cross-origin requests by default (same-origin policy).
// If your frontend runs on a different origin (e.g. Vite on localhost:5173)
// than this auth server (e.g. localhost:5000), requests will fail unless
// the server explicitly allows that origin via CORS headers.
// import cors from 'cors';

import { authRouter } from './routes/index.ts';
app.use("/auth", authRouter);

// init
const port = process.env.PORT ?? 3000;


// app.use("/docs", express.static("docs"));

app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url} ${new Date()}`);
    next();
});

// app.use(cors({
//     origin: 'http://localhost:5173', // allow requests from this origin
//     credentials: true, // allow cookies to be sent
// }));

// Start server after DB connection
(async () => {
    await connectDB();
    
    app.listen(port, () => {
        console.log(`App running on http://localhost:${port}`);
    });
})();
