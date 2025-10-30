import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import superAdminRoutes from "./routes/SuperAdminRoutes.js";

const app=express();
const port=process.env.PORT||4000

connectDB();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.get('/',(req,res)=> res.send("Api Working!"));
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);
app.use("/api/superadmin", superAdminRoutes);

app.listen(port,()=>console.log(`Server started on PORT:${port}`));
