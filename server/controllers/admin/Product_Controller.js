const cloudinary = require("cloudinary").v2;
const Product = require('../../models/Products');

const handleAddProduct = async(req,res) =>
{
    try
    {
        const {
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            featured,
            sizes,
        } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1,image2,image3,image4].filter((item) => item !== undefined);

        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
            return res.status(500).json({
                success : false,
                message : "Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file"
            })
        }

        let imageURL = await Promise.all(
            images.map(async(item) => {
                const base64EncodedFile = (item.buffer).toString('base64');
                const url = "data:" + item.mimetype + ";base64," + base64EncodedFile;
                let result = await cloudinary.uploader.upload(url,{
                    resource_type : "auto",
                    folder : "Products"
                });
                return result.secure_url;
            })
        )



        const newProduct = new Product({
            Image : imageURL,
            Title : title,
            Description : description,
            Category : category,
            Brand : brand,
            Price : price,
            SalePrice : salePrice,
            Featured : featured,
            Size : JSON.parse(sizes),
        })
        await newProduct.save()

        return res.status(200).json({
            success : true,
            message : "Product Created Successfully",
            data : newProduct
        })
    }
    catch(e)
    {
        console.log(e);
        if(e.code === 11000)
        {
            return res.status(404).json({
                success : false,
                message : "Product with the same name already exists"
            })
        }
        
        // Check if it's a Cloudinary error
        if(e.message && e.message.includes('api_key')) {
            return res.status(500).json({
                success : false,
                message : "Cloudinary configuration error. Please check your .env file and ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set."
            })
        }
        
        return res.status(500).json({
            success : false,
            message : "Add Product | Internal Server error",
            error : e.message
        })
    }
}

const handleEditProduct = async(req,res) =>
{
    try
    {
        const {id} = req.params;
        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            featured,
            sizes,
        } = req.body;

        const productToBeEdited = await Product.findById(id);
        if(!productToBeEdited)
        {
            res.status(404).json({
                success : false,
                message : "Product Not Found"
            })
        }

        productToBeEdited.Image = image || productToBeEdited.Image;
        productToBeEdited.Title = title || productToBeEdited.Title;
        productToBeEdited.Description = description || productToBeEdited.Description;
        productToBeEdited.Category = category || productToBeEdited.Category;
        productToBeEdited.Brand = brand || productToBeEdited.Brand;
        productToBeEdited.Price = price === "" ? 0 : price || productToBeEdited.Price;
        if (salePrice !== "null" && salePrice !== null && salePrice !== undefined) {
            productToBeEdited.SalePrice = salePrice;
        }
        productToBeEdited.Featured = featured || productToBeEdited.Featured;
        productToBeEdited.Size = JSON.parse(sizes) || productToBeEdited.Size;
        
        await productToBeEdited.save();
        return res.status(200).json({
            success : true,
            message : "Product edited successfully",
            data : productToBeEdited
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Edit Product | Internal Server error"
        })
    }
}

const handleRemoveProduct = async(req,res) =>
{
    try
    {
        const {id} = req.params;
        const productToBeRemoved = await Product.findByIdAndDelete(id);
        if(!productToBeRemoved)
        {
            res.status(404).json({
                success : false,
                message : "Product Not Found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Product removed successfully",
            removedProduct : productToBeRemoved
        })

    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Remove Product | Internal Server error"
        })
    }
}

const handleGetProducts = async(req,res) =>
{
    try
    {
        const {Category , Brand , Stock = "true", page = 1, pageLimit = 10} = req.query;
        
        let query = {};
        if(Category && Category !== "")
        {
            query["Category"] = Category;
        }
        if(Brand && Brand !== "")
        {
            query["Brand"] = Brand;
        }
        if(Stock && Stock === "Out of Stock")
        {
            query["Size.quantity"] = 0;
        }

      
        const [allProducts,productCount] = await Promise.all([
            Product.find(query).sort({createdAt : -1}).skip((page-1)*pageLimit).limit(pageLimit),
            Product.countDocuments(query)
        ]);


        res.status(200).json({
            success : true,
            data : allProducts,
            pageCount : Math.ceil(productCount / pageLimit)
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Fetch Products | Internal Server error"
        })
    }
}

module.exports = {
    handleAddProduct,
    handleEditProduct,
    handleRemoveProduct,
    handleGetProducts
}