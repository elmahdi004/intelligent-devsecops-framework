const cloudinary = require("cloudinary").v2;
const multer = require("multer");

function Cloudinary_Connect()
{
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;

    if (!cloud_name || !api_key || !api_secret) {
        console.error('⚠️  WARNING: Cloudinary environment variables are not set!');
        console.error('Please set the following environment variables in your .env file:');
        console.error('  - CLOUDINARY_CLOUD_NAME');
        console.error('  - CLOUDINARY_API_KEY');
        console.error('  - CLOUDINARY_API_SECRET');
        console.error('Product image uploads will fail without these credentials.');
        return;
    }

    cloudinary.config({
        cloud_name : cloud_name,
        api_key : api_key,
        api_secret : api_secret
    });
    
    console.log('✅ Cloudinary configured successfully');
}


const storage = new multer.memoryStorage({
    filename : function(req,file,callback)
    {
        callback(null,file.originalname)
    }
});


const upload = multer({storage});

module.exports = { upload ,Cloudinary_Connect};