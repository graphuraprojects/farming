import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "general";

    if (file.fieldname === "images") folder = "machines";
    if (file.fieldname === "ownership_proof") folder = "ownership_proofs";

    return {
      folder,
      resource_type: "image"
    };
  }
});

const upload = multer({ storage });

export default upload;
