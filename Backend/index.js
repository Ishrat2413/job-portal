import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";

dotenv.config({});

const app = express();

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to the API",
    timestamp: new Date().toISOString(),
    success: true,
  });
});
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOption = {
  origin: ["http://localhost:5121"],
  credentials: true,
};
app.use(cors(corsOption));

const PORT = process.env.PORT || 5001;

// ALL APIs

app.use("/api/users", userRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on Port ${PORT}`);
});
