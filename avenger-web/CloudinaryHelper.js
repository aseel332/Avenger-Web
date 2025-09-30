

import axios from "axios";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

// Initialize Cloudinary instance
const cloudName = "dhnnmlnk6"; 
const uploadPreset = "my_unsigned_preset"; 

const cld = new Cloudinary({
  cloud: {
    cloudName,
  },
});


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


export { cld, AdvancedImage };
