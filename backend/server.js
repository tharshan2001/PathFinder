import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import connectDB from "./config/mongodb.js";
import http from "http";
import { initSocket } from "./controllers/message/chatController.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();

// ---------------- Middlewares ----------------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// ---------------- Routes ----------------
app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/chat", chatRoutes);

// ---------------- Error Handling ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5080;

connectDB().then(() => {
  const server = http.createServer(app);

  // Initialize Socket.IO 
  initSocket(server);

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
