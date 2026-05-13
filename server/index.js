import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"

dotenv.config({ path: new URL('./.env', import.meta.url).pathname });

import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"

const app = express()

// Trust proxy if you are behind a load balancer/reverse proxy like Render
app.set("trust proxy", 1);

// Security Headers
app.use(helmet());

// Rate Limiting (100 requests per 15 mins)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
    origin: corsOrigins,
    credentials: true,
}))

app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }))
app.use(cookieParser())

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview", apiLimiter, interviewRouter) // Protect expensive OpenRouter AI limits
app.use("/api/payment" , paymentRouter)

import path from "path";

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// V2 Deploy: Serve Frontend Locally from Express in Production environments
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    // Tell express where the React compiled bundle lives
    app.use(express.static(path.join(__dirname, "../client/dist")));

    // Forward all non-API routes to the React Router DOM
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
    });
}

// Start server only after DB is connected
(async () => {
    try {
        await connectDb();
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
})();

// Ensures nodemon watches correctly
