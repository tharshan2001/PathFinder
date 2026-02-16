import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";
import jobAlertRoutes from "./routes/jobAlertRoutes.js";
import jobCategoryRoutes from "./routes/jobCategoryRoutes.js";
import trendingSkillsRoutes from "./routes/trendingSkillsRoutes.js";



dotenv.config();

const app = express();

// ---------------- Middlewares ----------------
app.use(cors());
app.use(express.json());

// ---------------- Routes ----------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", jobApplicationRoutes);
app.use("/api/alerts", jobAlertRoutes);
app.use("/api/categories", jobCategoryRoutes);
app.use("/api/trending-skills", trendingSkillsRoutes);


// ---------------- Error Handling ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
