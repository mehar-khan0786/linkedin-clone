import User from '../models/user.model.js';
import { io } from '../index.js';
import { userSocketMap } from '../index.js';
import Connection from '../models/connection.model.js';
import Notification from '../models/notification.model.js';

export const sendConnection=async (req,res) => {
    try{
        let {id}=req.params;
        let sender=req.userId;
        let user=await User.findById(id);
        if(sender==id){
            return res.status(400).json({message:"you cannot send connection request to yourself"});
        }
        if(user.connection.includes(sender)){
            return res.status(400).json({message:"connection request already sent"});
        }
        let existingConnection=await Connection.findOne({
            sender,
            receiver:id,
            status:"pending"
        });
        if(existingConnection){
            return res.status(400).json({message:"request already sent"});
        }

        let newRequest=await Connection.create({
            sender,
            receiver:id
        });

        let receiverSocketId = userSocketMap.get(id);
        let senderSocketId=userSocketMap.get(sender);

        if(senderSocketId){
            io.to(senderSocketId).emit("statusUpdate", {updatedUserId:id,newStatus:"pending"});
        }
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusUpdate", {updatedUserId:sender,newStatus:"received"});
        }

        
        return res.status(200).json({message:"connection request sent",request:newRequest});

    }catch(err){
        return res.status(500).json({message:`sendConnection error ${err}`});
    }
}

export const acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(400).json({ message: "connection request not found" });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({ message: "already processed" });
    }

    // update status
    connection.status = "accepted";
    await connection.save();

    // ✅ create notification
    await Notification.create({
      receiver: connection.sender,
      type: "connectionAccepted",
      relatedUser: req.userId,
    });

    // ✅ update both users
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { connection: connection.sender },
    });

    await User.findByIdAndUpdate(connection.sender, {
      $addToSet: { connection: req.userId },
    });

    // ✅ socket safe
    const receiverSocketId = userSocketMap.get(
      connection.receiver?.toString()
    );

    const senderSocketId = userSocketMap.get(
      connection.sender?.toString()
    );

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: connection.sender,
        newStatus: "disconnect",
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: req.userId,
        newStatus: "disconnect",
      });
    }

    return res.status(200).json({ message: "connection accepted" });
  } catch (err) {
    console.log("ACCEPT ERROR:", err); // 🔥 THIS WILL SHOW REAL ERROR
    return res.status(500).json({ message: err.message });
  }
};
export const rejectConnection=async (req,res)=>{
    try{
        let {connectionId}=req.params;
        let connection=await Connection.findById(connectionId);
        if(!connection){
            return res.status(400).json({message:"connection request not found"});
        }
        if(connection.status!="pending"){
            return res.status(400).json({message:"connection request already processed"});
        }


        connection.status="rejected";
        await connection.save();
        return res.status(200).json({message:"connection rejected"});

    }
    catch(err){
        return res.status(500).json({message:`rejectConnection error ${err}`});
    }
}

export const getConnectionStatus=async (req,res)=>{
    try{
        let targetUserId=req.params.userId;
        let currentUserId=req.userId;
        let currentUser=await User.findById(currentUserId);
        if(currentUser.connection.includes(targetUserId)){
            return res.status(200).json({status:"disconnected"});
        }
        let pendingRequest=await Connection.findOne({
            $or:[
                {sender:currentUserId,receiver:targetUserId},
                {sender:targetUserId,receiver:currentUserId}
            ],
            status:"pending"
        });

        if(pendingRequest){
            if(pendingRequest.sender.toString()===currentUserId.toString()){
                return res.status(200).json({status:"pending"});
            }else{
                return res.status(200).json({status:"received", requestId: pendingRequest._id});
            }
        }

        return res.status(200).json({status:"not connected"});
    } catch(err){
        return res.status(500).json({message:`getConnectionStatus error ${err}`});
    }
}

export const removeConnection=async (req,res)=>{
    try{
        let otherUserId=req.params.userId;
        let myId=req.userId;
        await User.findByIdAndUpdate(myId,{
            $pull:{connection:otherUserId}
        })
        await User.findByIdAndUpdate(otherUserId,{
            $pull:{connection:myId}
        })

        let receiverSocketId = userSocketMap.get(otherUserId);
        let senderSocketId=userSocketMap.get(myId);

       
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusUpdate", {updatedUserId:myId,newStatus:"disconnect"});
        }
         if(senderSocketId){
            io.to(senderSocketId).emit("statusUpdate", {updatedUserId:otherUserId,newStatus:"disconnect"});
        }

        return res.status(200).json({message:"connection removed"});
    }catch(err){
        return res.status(500).json({message:`removeConnection error ${err}`});
    }
}

export const getConnectionRequests=async (req,res)=>{
    try{
        let userId=req.userId;
        let requests=await Connection.find({receiver:userId,status:"pending"}).populate("sender","firstName lastName email userName profileImage headline");
        return res.status(200).json(requests);
    }catch(err){
        console.log("error in getconnectionrequests",err)
        return res.status(500).json({message:"server error"});
    }
}

export const getUserConnections=async (req,res)=>{
    try{
        let userId=req.userId;
        const user=await User.findById(userId).populate("connection","firstName lastName userName profileImage headline connections");
        return res.status(200).json(user.connection);
    }catch(err){
        console.log("error in getuserconnections controller",err)
        return res.status(500).json({message:"server error"});
    }
}

