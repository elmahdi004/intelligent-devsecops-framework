const Review = require('../../models/Review')
const Order = require('../../models/Orders')
const Product = require('../../models/Products')

const handleAddReview = async(req,res) => {
    try
    {
        const {
            productId,
            userId,
            username,
            rating,
            comment
        } = req.body;

        const order = await Order.findOne({
            UserId : userId,
            "OrderItems.ProductId" : productId,
            OrderStatus : "Delivered"
        })

        if(!order)
        {
            return res.status(200).json({
                success : false,
                message : "Cannot review a product without purchasing it"
            })
        }

        const existingReview = await Review.find({
            UserId : userId,
            ProductId : productId
        })

        if(existingReview.length > 0)
        {
            return res.status(200).json({
                success : false,
                message : "You can only review a product once"
            })
        }

        const userReview = new Review({
            ProductId : productId,
            UserId : userId,
            Username : username,
            Rating  : rating,
            Comment : comment
        })

        await userReview.save();

        res.status(200).json({
            success : true,
            review : userReview
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : " Add Review | Internal Server Error"
        })
    }
}

const handleGetReviews = async(req,res) => {
    try
    {
        const {productId} = req.params;

        const productReviews = await Review.find({ProductId : productId})

        res.status(200).json({
            success : true,
            review : productReviews
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : " Get Reviews | Internal Server Error"
        })
    }
}

module.exports = {
    handleAddReview,
    handleGetReviews
}