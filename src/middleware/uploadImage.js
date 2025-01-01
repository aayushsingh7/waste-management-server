import cloudinary from "cloudinary";

const uploadImage = async (req, res, next) => {
  const { image } = req.body;
  console.log({ image });
  try {
    const newImage = await cloudinary.v2.uploader.upload(image, {
      folder: "earn-more/",
      format: "webp",
      transformation: {
        quality: 80,
        fetch_format: "webp",
      },
    });

    req.body.cloudinaryImage = newImage.secure_url;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export default uploadImage;
