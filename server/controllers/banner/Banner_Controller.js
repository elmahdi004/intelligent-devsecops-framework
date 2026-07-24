const cloudinary = require("cloudinary").v2;
const Banner = require("../../models/Banners");

const addBanner = async (req, res) => {
  try 
  {
    const image = req.file;

    if(!image || image === undefined)
    {
      return res.status(400).json({
        success : false,
        message : "Invalid File"
      });
    }

    const base64EncodedFile = (image.buffer).toString('base64');
    const url = "data:" + image.mimetype + ";base64," + base64EncodedFile;
    let result = await cloudinary.uploader.upload(url,{
        resource_type : "auto",
        folder : "Banners"
    });

    const imageURL = result.secure_url;

    const bannerImage = new Banner({
      BannerImage : imageURL
    });

    await bannerImage.save();

    res.status(200).json({
      success: true,
      bannerImage,
    });

  }
  catch (e)
  {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Add Banner | Internal Server Error",
    });
  }
};

const deleteBanner = async(req,res) => {
  const {bannerId} = req.params;

  const bannerToBeDeleted = await Banner.findOneAndDelete({_id : bannerId});

  if(!bannerToBeDeleted)
  {
    return res.status(400).json({
      success : false,
      message : "Banner Not Found"
    });
  }

  res.status(200).json({
    success : true,
    banner : bannerToBeDeleted
  })
};

const getBannerImages = async (req, res) => {
  try
  {
    const banners = await Banner.find({});

    res.status(200).json({
      success: true,
      banners,
    });
  }
  catch (e)
  {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Fetch Banners | Internal Server Error",
    });
  }
};

module.exports = { 
  addBanner,
  getBannerImages,
  deleteBanner
};