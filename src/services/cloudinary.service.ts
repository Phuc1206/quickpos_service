import cloudinary from "@/config/cloudinary";

export const uploadImage = (file: Express.Multer.File) => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "menu-items" }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });

    stream.end(file.buffer);
  });
};
