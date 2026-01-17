import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRouter.js";
import errorMiddleware from "./middleware/error.js";
import userRouter from "./routes/userRouter.js";
// import adminRouter from "./routes/adminRouter.js";
import superAdminRoutes from "./routes/SuperAdminRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import leaderboardRoute from "./routes/leaderboardRoute.js";
import profileRouter from "./routes/profileRouter.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173","https://dev-source2-0.vercel.app/"
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("Api Working!"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
// app.use("/api/admin", adminRouter);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoute);
app.use("/api/profile", profileRouter);
app.use(errorMiddleware);

app.listen(port, () => console.log(`Server started on PORT:${port}`));
