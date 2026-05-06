import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import dns from "dns"
import labtestRoutes from "./routes/labtestRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import labAdminRoutes from "./routes/labAdminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Create uploads directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads", "lab_documents");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// serve uploaded documents when using local storage
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/tests", labtestRoutes);
app.use("/api/labadmin", labAdminRoutes);
app.use("/api/patients", patientRoutes);

// payment
app.use("/api/payment",paymentRoutes);

// Global error handler for multer and other errors
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (err.name === "MulterError") {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log(`Server running on port ${PORT}`);
});