import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from './routers/user.routers.js';

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser());

app.use('/api/v1/users/', userRouter)

export default app;
