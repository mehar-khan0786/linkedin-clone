import Notification from "../models/notification.model.js"

export const getNotifications=async(req,res)=>{
    try {
        let notification=await Notification.find({receiver:req.userId}).populate("relatedUser","firstName lastName userName profileImage").populate("relatedPost","image description");
        return res.status(200).json(notification)

    } catch (error) {
        return res.status(400).json({message:"get notification error"})
    }
}


export const deleteNotification=async(req,res)=>{
    try {
        let {id}=req.params;
        let notification=await Notification.findByIdAndDelete(
        {
            _id:id,
            receiver:req.userId
        });
        return res.status(200).json({message:"Notification deleted successfully"})
    } catch (error) {
        return res.status(400).json({message:"Error deleting notification"})
    }
}


export const clearAllNotification=async(req,res)=>{
    try {
        let notification=await Notification.deleteMany(
        {
            receiver:req.userId
        });
        return res.status(200).json({message:"All Notification deleted successfully"})
    } catch (error) {
        return res.status(400).json({message:"Error all deleting notification"})
    }
}