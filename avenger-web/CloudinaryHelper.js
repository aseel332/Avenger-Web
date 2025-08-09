// cloudinaryHelper.js

import axios from "axios";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

// Initialize Cloudinary instance
const cloudName = "dhnnmlnk6"; // Replace with your Cloudinary cloud name
const uploadPreset = "my_unsigned_preset"; // Replace with your unsigned upload preset

const cld = new Cloudinary({
  cloud: {
    cloudName,
  },
});

/**
 * Upload an image to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - URL of the uploaded image
 */
export async function uploadImageToCloudinary(file) {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  );

  return response.data.secure_url;
}

/**
 * Get a transformed Cloudinary image by public ID
 * @param {string} publicId - The public ID of the image (e.g. from the Cloudinary URL)
 * @param {object} options - Optional transformations (width, height, etc.)
 * @returns {CloudinaryImage} - A CloudinaryImage instance to use with AdvancedImage
 */
export function getCloudinaryImage(publicId, options = {}) {
  let img = cld.image(publicId).format("auto").quality("auto");

  if (options.width || options.height) {
    img = img.resize(
      auto()
        .width(options.width || undefined)
        .height(options.height || undefined)
        .gravity(autoGravity())
    );
  }

  return img;
}

// Optional: export the Cloudinary instance and AdvancedImage for manual use
export { cld, AdvancedImage };
