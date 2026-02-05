import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ConnectDB } from "./utils/connectDB.js";
import { router as Router } from "./routes/route.js";
import { v2 as cloudinary } from "cloudinary";
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors({
    origin: [
        "*",
       
    ],
    credentials: true
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

ConnectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api", Router);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend running on port ${PORT}`);
});
