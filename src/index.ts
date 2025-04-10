import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", indexRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
