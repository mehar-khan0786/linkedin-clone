import express from "express";
import { getNotifications } from "../controllers/notification.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { deleteNotification } from "../controllers/notification.controllers.js";
import { clearAllNotification } from "../controllers/notification.controllers.js";
let notificationRouter=express.Router();

notificationRouter.get("/get",isAuth,getNotifications)
notificationRouter.delete("/deleteOne/:id",isAuth,deleteNotification)
notificationRouter.delete("/",isAuth,clearAllNotification)

export default notificationRouter;