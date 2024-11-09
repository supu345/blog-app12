const cloudinary = require("cloudinary").v2;

async function uploadImage(imagePath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "blog app", // Ensure this is correct
    });

    console.log("Upload result:", result);
    return result;
  } catch (error) {
    console.log("Error during upload:", error);
    return null;
  }
}

async function deleteImagefromCloudinary(imageId) {
  try {
    await cloudinary.uploader.destroy(imageId);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { uploadImage, deleteImagefromCloudinary };
