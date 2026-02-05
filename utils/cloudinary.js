import {v2 as cloudinary} from "cloudinary";
import fs from "fs";


  export const uploadOnCloudinary = async (localFilePath) =>{
    try{


        if(!localFilePath){
            console.log("could not find the path");
            return null;
        }
            // uploading
            const result = await cloudinary.uploader.upload(localFilePath , { resource_type : "auto"})
            // file has been uploaded successfully

            return result;

    }catch(error){
        console.log(error.message);
        fs.unlinkSync(localFilePath);
    }
  }

  