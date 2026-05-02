import express from "express";
import isAuth  from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import { getCurrentUser } from "../controllers/user.controllers.js";
import {updateProfile} from "../controllers/user.controllers.js";
let userRouter=express.Router();
import {getProfile} from "../controllers/user.controllers.js";
import { search } from "../controllers/user.controllers.js";
import { getSuggestedUser } from "../controllers/user.controllers.js";

userRouter.get("/Currentuser",isAuth,getCurrentUser);
userRouter.put("/updateProfile",isAuth,upload.fields([
    {name:"profileImage",maxCount:1},
    {name:"coverImage",maxCount:1}
]),updateProfile);
userRouter.get("/profile/:userName",isAuth,getProfile);
userRouter.get("/search",isAuth,search);
userRouter.get("/suggestedusers",isAuth,getSuggestedUser);
export default userRouter;