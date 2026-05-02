import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectionRouter from './routes/connection.routes.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import http from 'http';
import { Server } from 'socket.io';
import notificationRouter from './routes/notification.routes.js';
dotenv.config();


let port=process.env.PORT||5000;
export const userSocketMap=new Map();

let app=express();
let server=http.createServer(app);
export const io=new Server(server,{
    cors:{
        origin:"https://linkedin-frontend-qq7g.onrender.com",
        credentials:true
    }
});



app.use(cookieParser());
app.use(express.json());
app.use(cors({origin:"https://linkedin-frontend-qq7g.onrender.com",credentials:true}));


app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/post",postRouter);
app.use("/api/connection",connectionRouter); 
app.use("/api/notification",notificationRouter); 


io.on("connection",(socket)=>{

    socket.on("register",(userId)=>{
        console.log("Registered User:",userId); // add this
        userSocketMap.set(userId,socket.id);
    });

    socket.on("disconnect",()=>{
       console.log("user disconnected");
    });

});


connectDb().then(()=>{
    server.listen(port,()=>{
    console.log("server started on port " + port);
})
});
