import cloudinary from "@/config/cloudinary";

export const uploadImage = (file: Express.Multer.File) => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "menu-items" }, (error, result) => {
      if (error) {
        console.error("Cloudinary error:", error); // 👈 log đúng
        return reject(error);
      }

      resolve(result);
    });

    stream.end(file.buffer);
  });
};

export const deleteImage = (publicId: string) => cloudinary.uploader.destroy(publicId);
