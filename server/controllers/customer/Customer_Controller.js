const Product = require("../../models/Products")

const getProducts = async(req,res) => {

    const category = req.query.Category;
    const brand = req.query.Brand;
    const sortId = req.query.sort;

    // Parse page and pageLimit as integers with defaults
    const page = parseInt(req.query.page) || 1;
    const pageLimit = parseInt(req.query.pageLimit) || 10;

    let filterQuery = {} ;
    let sortQuery = {};

    if(category && category.length > 0)
    {
        filterQuery.Category = { $in : category.split(",") };
    }
    if(brand && brand.length > 0)
    {
        filterQuery.Brand = { $in : brand.split(",") };
    }

    switch(sortId)
    {
        case "price_L_to_H" : sortQuery.Price = 1; break;
        case "price_H_to_L" : sortQuery.Price = -1; break;
        case "product_A_to_Z" : sortQuery.Title = 1; break;
        case "product_Z_to_A" : sortQuery.Title = -1; break;
        default : sortQuery.createdAt = -1; break;
    }

    
    try
    {
        const [products,productCount] = await Promise.all([
            Product.find(filterQuery).sort(sortQuery).skip((page-1)*pageLimit).limit(pageLimit),
            Product.countDocuments(filterQuery)
        ]);
        
        res.status(200).json({
            success : true,
            products : products,
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

const getProductDetails = async(req,res) => {
    const productID = req.query.id;
    try
    {
        const requestedProduct = await Product.find({_id : productID});
        if(!requestedProduct)
        {
            return res.status(404).json({
                success : false,
                message : "Product Not Found"
            })
        }

        res.status(200).json({
            success : true,
            product : requestedProduct
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Fetch Product Details | Internal Server Error"
        })
    }
}

const getSimilarProducts = async(req,res) => {
    const productID = req.query.id;
    try
    {
        const requestedProduct = await Product.findById(productID);

        if(!requestedProduct)
        {
            return res.status(404).json({
                success : false,
                message : "Product Not Found"
            })
        }

        const similarProducts = await Product.find(
            {
                _id : {$ne : productID},
                $or : 
                [
                    { Category : requestedProduct?.Category },
                    { Brand : requestedProduct?.Brand }
                ]
            }
        ).limit(6);

        res.status(200).json({
            success : true,
            similarProducts
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Fetch Similar Products | Internal Server Error"
        })
    }
}

const getFeaturedandLatest = async(req,res) => {
    try
    {
        const [featuredProducts , latestProducts] = await Promise.all([
            Product.find({Featured : "Yes"}).sort({createdAt : -1}).limit(6),
            Product.find().sort({createdAt : -1}).limit(6)
        ]);

        res.status(200).json({
            success : true,
            featuredProducts,
            latestProducts
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(400).json({
            success : false,
            message : "Fetch Featured and Latest Products | Internal Server Error"
        })
    }
}

module.exports = {
    getProducts,
    getProductDetails,
    getSimilarProducts,
    getFeaturedandLatest
}