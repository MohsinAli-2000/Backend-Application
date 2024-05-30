import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath || typeof localFilePath !== 'string') {
      console.error('Invalid localFilePath:', localFilePath);
      return null;
    }

    // Uploading file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded to Cloudinary
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    if (localFilePath && typeof localFilePath === 'string') {
      fs.unlinkSync(localFilePath); // This will remove the locally uploaded file if operation fails
    }
    return null;
  }
};

export { uploadOnCloudinary };