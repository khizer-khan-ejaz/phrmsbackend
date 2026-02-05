import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ConnectDB } from "./utils/connectDB.js";
import { router as Router } from "./routes/route.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

// Set up CORS
app.use(cors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// Middleware for parsing requests
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

// Connect to the database
ConnectDB();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define API routes
app.use("/api", Router);

// Serve the frontend build files
const __dirname = path.resolve(); // Ensures correct dirname usage for ES Modules
const buildPath = path.join(__dirname, "/frontend/build");
app.use(express.static(buildPath));

// Catch-all route to serve index.html for client-side routing (React Router)
app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
