import express from "express";
import { createPost,getpost,like,comment } from "../controllers/post.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";


const postRouter=express.Router();

postRouter.post("/create",isAuth,upload.single("image"),createPost);
postRouter.get("/getPost",isAuth,getpost);
postRouter.get("/like/:id",isAuth,like);
postRouter.post("/comment/:id",isAuth,comment);


export default postRouter;