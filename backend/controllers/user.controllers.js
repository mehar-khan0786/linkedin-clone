import { json } from "express";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";


export const getCurrentUser=async(req,res)=>{
    try{
        const userId=req.userId;
        console.log(userId)
        if(!userId){
            return res.status(400).json({message:"User does not find"})
        }
        const user=await User.findById(userId).select("-password");
        return res.status(200).json({user});

    }catch(err){
       return res.status(400).json({message:"get current user error"});
    }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, userName, headline, location, gender } = req.body;

    let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    let experience = req.body.experience ? JSON.parse(req.body.experience) : [];
    let education = req.body.education ? JSON.parse(req.body.education) : [];

    let updateData = {
      firstName,
      lastName,
      userName,
      headline,
      location,
      gender,
      experience,
      education,
      skills
    };


if (req.files?.profileImage) {
  const result = await uploadOnCloudinary(req.files.profileImage[0].path);

  console.log("Profile URL:", result); // debug

  if (result) {
    updateData.profileImage = result;   
  }
}


if (req.files?.coverImage) {
  const result = await uploadOnCloudinary(req.files.coverImage[0].path);

  console.log("Cover URL:", result); // debug

  if (result) {
    updateData.coverImage = result;   
  }
}
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({ user });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Update profile error" });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userName = req.params.userName;
    const user = await User.findOne({ userName }).select("-password");
    if(!user){
        return res.status(404).json({ message: "UserName does not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Get profile error" });
  }
};

export  const search=async(req,res)=>{
  try {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        { skills: { $in: [query] } }
      ]
    })
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Search error" });
  }
}

export const getSuggestedUser=async(req,res)=>{
  try {
    const currentUser=await User.findById(req.userId).select("connection");
   
    const suggestedUsers=await User.find({
      _id:{
        $ne:currentUser,$nin:currentUser.connection
      }
      }).select("-password");
    return res.status(200).json(suggestedUsers);
  }catch(err){
    console.log(err);
    return res.status(500).json({message:"Get suggested users error"});
  }
}