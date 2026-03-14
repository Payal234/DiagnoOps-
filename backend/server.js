import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
<<<<<<< HEAD
import labtestRoutes from "./routes/labtestRoutes.js";
=======
import superAdminRoutes from "./routes/superAdminRoutes.js";
>>>>>>> 3e4aeb936478211e0c9c603a5818a2986be56ab3

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/api/auth", authRoutes);
<<<<<<< HEAD
app.use("/api/labtests", labtestRoutes);
=======
app.use("/api/superadmin", superAdminRoutes);
>>>>>>> 3e4aeb936478211e0c9c603a5818a2986be56ab3

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log(`Server running on port ${PORT}`);
});