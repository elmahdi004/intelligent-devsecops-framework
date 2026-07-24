const mongoose = require('mongoose')
const Cart = require("../../models/Carts")
const Product = require("../../models/Products")

const handleAddToCart = async(req,res) => {
    try
    {
        const {userId,productId,size,quantity} = req.body;

        if(!userId || !productId || !size || quantity <= 0)
        {
            return res.status(400).json({
                success : false,
                message : "Incorrect Data"
            })
        }

        const product = await Product.findById(productId);

        if(!product)
        {
            return res.status(404).json({
                success : false,
                message : "Product not found"
            })
        }

        let cart = await Cart.findOneAndUpdate(
            {
                UserId : userId,
                'Items.ProductId' : productId,
                'Items.Size' : size
            },
            {
                $inc : {'Items.$.Quantity' : 1}
            },
            {
                new : true
            }
        ).populate({
            path : "Items.ProductId",
            select : "Image Title Category Price SalePrice"
        });

        if(!cart)
        {
            cart = await Cart.findOneAndUpdate(
                {
                    UserId : userId
                },
                {
                    $push : {
                        Items : {
                            ProductId :productId,
                            Size : size,
                            Quantity : 1
                        }
                    }
                },
                {
                    new : true,
                    upsert : true
                }
            ).populate({
                path : "Items.ProductId",
                select : "Image Title Category Price SalePrice"
            });
        }

        const validItems = cart.Items.filter((item) => item.ProductId);

        if(validItems.length < cart.Items.length)
        {
            cart.Items = validItems;
            await cart.save()
        }

        const populateCartItems = validItems.map((item) => ({
            ProductId : item.ProductId._id,
            Image : item.ProductId.Image,
            Title : item.ProductId.Title,
            Category : item.ProductId.Category,
            Price : item.ProductId.Price,
            SalePrice : item.ProductId.SalePrice,
            Size : item.Size,
            Quantity : item.Quantity
        }))

        res.status(200).json({
            success : true,
            data  :{
                ...cart._doc,
                populatedItems : populateCartItems
            }
        })
    }
    catch(e)
    {
        console.log(e)
        res.status(500).json({
            success : false,
            message : "Add to Cart | Internal Server Error"
        })
    }
}

const handleUpdateCartItem = async(req,res) => {
    try
    {
        const {userId,productId,size,quantity} = req.body;

        if(!userId || !productId || !size || quantity <= 0)
        {
            return res.status(400).json({
                success : false,
                message : "Incorrect Data"
            })
        }

        const targetProduct = await Product.findOne({
            _id : productId , "Size.size" : size
        },{"Size.$"  :1});

        if(targetProduct.Size[0].quantity < quantity)
        {
            return res.status(200).json({
                success : false,
                message : `Only ${targetProduct.Size[0].quantity} items are currently available in stock.`
            })
        }

        let cart = await Cart.findOneAndUpdate(
            {
                UserId : userId,
                'Items.ProductId' : productId,
                'Items.Size' : size
            },
            {
                $set : { 'Items.$.Quantity' : quantity }
            },
            {
                new : true
            }
        ).populate({
            path : "Items.ProductId",
            select : "Image Title Category Price SalePrice"
        });

        if(!cart)
        {
            return res.status(404).json({
                success : false,
                message : "Cart not found"
            })
        }
        else
        {
                const validItems = cart.Items.filter((item) => item.ProductId);

                if(validItems.length < cart.Items.length)
                {
                    cart.Items = validItems;
                    await cart.save()
                }

                const populateCartItems = validItems.map((item) => ({
                    ProductId : item.ProductId._id,
                    Image : item.ProductId.Image,
                    Title : item.ProductId.Title,
                    Category : item.ProductId.Category,
                    Price : item.ProductId.Price,
                    SalePrice : item.ProductId.SalePrice,
                    Size : item.Size,
                    Quantity : item.Quantity
                }))

                res.status(200).json({
                    success : true,
                    data  :{
                        ...cart._doc,
                        populatedItems : populateCartItems
                    }
                })
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Update Cart Item | Internal Server Error"
        })
    }
}

const handleDeleteCartItem = async(req,res) => {
    try
    {
        const {userId,productId,size} = req.params;

        if(!userId || !productId || !size)
        {
            return res.status(400).json({
                success : false,
                message : "Incorrect Data"
            })
        }

        let cart = await Cart.findOneAndUpdate(
            {
                UserId : userId,
                'Items.ProductId' : productId,
                'Items.Size' : size
            },
            {
                $pull : { Items : {ProductId : productId , Size : size} }
            },
            {
                new : true
            }
        ).populate({
            path : "Items.ProductId",
            select : "Image Title Category Price SalePrice"
        });

        if(!cart)
        {
            return res.status(404).json({
                success : false,
                message : "Cart not found"
            })
        }
        else
        {
                const validItems = cart.Items.filter((item) => item.ProductId);

                if(validItems.length < cart.Items.length)
                {
                    cart.Items = validItems;
                    await cart.save()
                }

                const populateCartItems = validItems.map((item) => ({
                    ProductId : item.ProductId._id,
                    Image : item.ProductId.Image,
                    Title : item.ProductId.Title,
                    Category : item.ProductId.Category,
                    Price : item.ProductId.Price,
                    SalePrice : item.ProductId.SalePrice,
                    Size : item.Size,
                    Quantity : item.Quantity
                }))

                res.status(200).json({
                    success : true,
                    data  :{
                        ...cart._doc,
                        populatedItems : populateCartItems
                    }
                })
        }
    }
    catch(e)
    {
        res.status(500).json({
            success : false,
            message : "Delete Cart Items | Internal Server Error"
        })
    }
}

const handleFetchCartItems = async(req,res) => {
    try
    {
        const {userId} = req.params;

        if(!userId)
        {
            return res.status(400).json({
                success : false,
                message : "Invalid User"
            })
        }

        const cart = await Cart.findOne({UserId : userId}).populate({
            path : "Items.ProductId",
            select : "Image Title Category Price SalePrice"
        });

        if(!cart)
        {
            return res.status(404).json({
                success : false,
                message : "Cart not found"
            })
        }

        const validItems = cart.Items.filter((item) => item.ProductId);

        if(validItems.length < cart.Items.length)
        {
            cart.Items = validItems;
            await cart.save()
        }

        const populateCartItems = validItems.map((item) => ({
            ProductId : item.ProductId._id,
            Image : item.ProductId.Image,
            Title : item.ProductId.Title,
            Category : item.ProductId.Category,
            Price : item.ProductId.Price,
            SalePrice : item.ProductId.SalePrice,
            Size : item.Size,
            Quantity : item.Quantity
        }))

        res.status(200).json({
            suceess : true,
            data  :{
                ...cart._doc,
                populatedItems : populateCartItems
            }
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Fetch Cart Items | Internal Server Error"
        })
    }
}

module.exports = {
    handleAddToCart,
    handleUpdateCartItem,
    handleDeleteCartItem,
    handleFetchCartItems
}