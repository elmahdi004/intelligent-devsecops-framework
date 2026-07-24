const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const path = require('path');
const Product = require("./models/Products");
const Banner = require("./models/Banners");
const User = require("./models/User");
const users = require('./sample/users.js');
const products = require('./sample/products.js');
const banners = require('./sample/banners.js');
const { Cloudinary_Connect } = require("./utility/cloudinary");
const cloudinary = require('cloudinary').v2;
const DB_Connect = require("./db");
require('dotenv').config();

const encryptPassword = (password) => {
    const encryptedPassword = bcrypt.hashSync(password,Number(process.env.HASH_SALT));
    return encryptedPassword;
}

const encryptUsers = (users) => {
    return users.map((user) => {
        if(user.Password)
        {
            const hashedPassword = encryptPassword(user.Password);
            user.Password = hashedPassword;
        }
        return user;
    })
}

async function productUploadCloudinary(products)
{
    let updatedProducts = [];

    updatedProducts = await Promise.all(
      products.map(async (product) => {
        const uploadedImages = [];
        
        if (product.Image && Array.isArray(product.Image)) {
          
          for (const image of product.Image) {
            const imageUrl = path.join(__dirname, '..', 'media', image);
            
            try {
              const result = await cloudinary.uploader.upload(imageUrl, {
                resource_type: "auto",  
                folder: "Sample-Products",  
              });
  
              uploadedImages.push(result.secure_url);
            } catch (e) {
              console.error(e); 
              process.exit(1); 
            }
          }
        } else {
          console.log('Products must be in the form of an array');
          process.exit(1);
        }
  
        return { ...product, Image: uploadedImages };
      })
    );
  
    return updatedProducts;
}

async function bannerUploadCloudinary(banners)
{
    let updatedBanners = [];

    updatedBanners = await Promise.all(banners.map(async (banner) => {
        let uploadedImage = "";
        const imageUrl = path.join(__dirname, '..', 'media', banner.BannerImage);
        try
        {
            const result = await cloudinary.uploader.upload(imageUrl, {
                resource_type : "auto",
                folder : "Sample-Banners"
            });
            uploadedImage = result.secure_url;

        }
        catch(e)
        {
            console.error(`Failed to upload image: ${imageUrl}`, e);
            process.exit(1);
        }
        return {...banner,BannerImage : uploadedImage}
    }))

    return updatedBanners;
}

async function seeder()
{
    try
    {
        //Delete existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Banner.deleteMany();

        //Populate Products
        const updatedProducts = await productUploadCloudinary(products);
        await Product.insertMany(updatedProducts);

        //Populate Banners
        const updatedBanners = await bannerUploadCloudinary(banners);
        await Banner.insertMany(updatedBanners);

        //Populate Users
        console.log("User Credentials \n ------------------------------------")
        users.map((user) => 
            console.log(`${user.Role}: \n Email: ${user.Email} \n Password: ${user.Password} \n ------------------------------------`)
        )
        const updatedUsers = encryptUsers(users);
        await User.insertMany(updatedUsers);

        console.log("DB populated successfully!")
        console.log("Admin analytics are empty until you have any orders \n");

        process.exit();
    }
    catch(e)
    {
        console.log(e);
        process.exit(1);
    }

}

DB_Connect();
Cloudinary_Connect();
seeder();