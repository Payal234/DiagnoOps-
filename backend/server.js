import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import dns from "dns"
import labtestRoutes from "./routes/labtestRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import labAdminRoutes from "./routes/labAdminRoutes.js";


dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded documents when using local storage
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/tests", labtestRoutes);
app.use("/api/labadmin", labAdminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log(`Server running on port ${PORT}`);
});