import express from 'express';

// CORS (Cross-Origin Resource Sharing) is Express middleware that controls
// which browser origins are allowed to call this API.
//
// Why this is needed:
// Browsers block cross-origin requests by default (same-origin policy).
// If your frontend runs on a different origin (e.g. Vite on localhost:5173)
// than this auth server (e.g. localhost:5000), requests will fail unless
// the server explicitly allows that origin via CORS headers.
import cors from 'cors';

import { authRoutes } from './routes/authRoutes';

// init
const app = express();
const port = process.env.PORT || 5000;

// Allows parsing incoming JSON request bodies
app.use(express.json());

// app.use("/docs", express.static("docs"));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} ${ new Date().toISOString() }`);
    next();
});

// Testing
const posts = [ 
    { id: 1, title: "First Post", content: "This is the first post." },
    { id: 2, title: "Second Post", content: "This is the second post." }
]

// Testing route to verify server is working
app.get("/posts", (req, res) => {
    res.json(posts);
});

// app.use(cors({
//     origin: 'http://localhost:5173', // allow requests from this origin
//     credentials: true, // allow cookies to be sent
// }));


app.use("/auth", authRoutes);

app.get("/test", (req, res) => {
    res.json({ message: "Hello from the auth server!" });
});

app.get("/login", (req, res) => {
    res.json({ message: "Login endpoint" });
});

app.listen(port, () => {
    console.log(`Auth server running on http://localhost:${port}`);
});