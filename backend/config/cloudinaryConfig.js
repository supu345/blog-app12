const cloudinary = require("cloudinary").v2;

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const signUpload = async () => {
  const timestamp = Math.round(newDate() / 1000);
  const params = {
    timestamp: timestamp,
  };
  const signature = await cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET
  );
  return { timestamp, signature };
};

module.exports = cloudinaryConfig;
