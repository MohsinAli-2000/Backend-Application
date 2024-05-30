import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// setting up cross origin sharing configuration

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//setting up json data configuration
app.use(express.json({ limit: "16kb" }));

//setting up url data configuration
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//setting static files folder
app.use(express.static("public"));

//setting up cookies parser configuration
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);

// Route handler for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to SecureLink 360!");
});

export default app;
