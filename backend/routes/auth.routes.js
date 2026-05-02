import express from "express";
import { signup } from "../controllers/auth.controllers.js";
import { login } from "../controllers/auth.controllers.js";
import { logout } from "../controllers/auth.controllers.js";
let authRouter=express.Router();

authRouter.post("/signup",signup);

authRouter.post("/login",login);

authRouter.get("/logout",logout);

export default authRouter;