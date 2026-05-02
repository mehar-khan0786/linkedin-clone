import cloudinary from "cloudinary";
import fs from "fs";

const uploadOnCloudinary=async(filePath)=>{
    
           cloudinary.config({
              cloud_name: process.env.CLOUD_NAME,
              api_key: process.env.CLOUD_API_KEY,
              api_secret: process.env.CLOUD_API_SECRET
            });
    try{
        if(!filePath){
            return null;
        }

    const UploadResult = await cloudinary.uploader.upload(filePath);
     if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return UploadResult.secure_url;

    }catch(err){
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
       }
        console.log(err);
        return null;
    }
}


export default uploadOnCloudinary;