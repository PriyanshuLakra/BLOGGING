
import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorMiddleware } from "./middlewares/error";
import  { Request, Response, NextFunction } from 'express';
import  fileUpload  from "express-fileupload"
// import blogRouter from "../src/router/blogRouter"
import userRouter from "./router/userRouter"
import blogRouter from "./router/blogRouter";


const app = express();
app.use(express.json());


app.use(cors({
    origin:[process.env.FRONTEND_URL ?? ""],
    methods:["GET" , "PUT" , "DELETE" , "POST"],
    credentials:true
}))


app.use(cookieParser())


dotenv.config({path :'./config/config.env'})

app.use(express.urlencoded({extended:true}))

app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/" // Max file size limit (5MB in this case)
    })
  );

  
app.use("/api/v1/user" , userRouter);
app.use("/api/v1/blog" , blogRouter);

// app.use(errorMiddleware);
app.use(errorMiddleware as unknown as express.ErrorRequestHandler);

export default app


