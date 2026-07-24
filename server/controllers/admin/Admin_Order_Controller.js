const Order = require("../../models/Orders")

const fetchAllOrders = async (req,res) => {
    try
    {
        const {status , page = 1, pageLimit = 10} = req.query;

        let query = {};

        if(status && status.trim() !== "All")
        {
            query["OrderStatus"] = status;
        }

        const [orders,orderCount] = await Promise.all([
            Order.find(query).sort({OrderCreationDate : -1}).skip((page-1)*pageLimit).limit(pageLimit),
            Order.countDocuments(query)
        ]);

        res.status(200).json({
            success : true,
            orders,
            pageCount : Math.ceil(orderCount / pageLimit)
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Fetch Orders | Internal Server Error"
        })
    }
}

const updateOrderStatus = async (req,res) => {
    try
    {

        const {orderId} = req.params;
        const {orderStatus} = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                OrderStatus : orderStatus
            },
            {
                new : true
            }
        )

        if(!updatedOrder)
        {
            return res.status(404).json({
                success : false,
                message : "Order not found"
            })
        }

        res.status(200).json({
            success : true,
            updatedOrder
        })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Update Order Status | Internal Server Error"
        })
    }
}

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Delete Order | Internal Server Error",
        });
    }
};

module.exports = {
    fetchAllOrders,
    updateOrderStatus,
    deleteOrder
}