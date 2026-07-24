const mongoose = require("mongoose");
const Order = require("../../models/Orders");
const Cart = require("../../models/Carts");
const Product = require("../../models/Products");
const sendOrderEmail = require('../../utility/sendEmail');

const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartId,
            cartProducts,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderCreationDate,
            orderUpdationDate,
        } = req.body;

        // Save the new order to the database
        const newOrder = await Order({
            UserId: userId,
            CartId: cartId,
            OrderItems: cartProducts,
            OrderAddress: addressInfo,
            OrderStatus: orderStatus,
            PaymentMethod: paymentMethod,
            PaymentStatus: paymentStatus,
            OrderTotal: totalAmount,
            OrderCreationDate: orderCreationDate,
            OrderUpdationDate: orderUpdationDate,
        });

        await newOrder.save();

        // Clear the cart after order is created (for Cash on Delivery)
        if (cartId) {
            await Cart.findByIdAndDelete(cartId);
        }

        // Prepare the order data for the email
        const orderData = {
            userId, // Client's user ID
            cartProducts, // List of ordered items
            addressInfo, // Delivery address
            totalAmount, // Total order amount
        };

        // Send an email to the store owner
        await sendOrderEmail(orderData);

        // Respond to the client
        res.status(200).json({
            success: true,
            orderId: newOrder._id,
            message: 'Order created successfully and cart cleared'
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Create Order | Internal Server Error',
        });
    }
};

const paymentValidator = async (req, res) => {
    const transactionSession = await mongoose.startSession();
    transactionSession.startTransaction();

    try {
        const { status, order_Id } = req.body;

        if (status === "success") {
            const order = await Order.findByIdAndUpdate(order_Id, {
                OrderStatus: "Confirmed",
                PaymentStatus: "Paid"
            }, { session: transactionSession });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found",
                });
            }

            for (let item of order.OrderItems) {
                const { ProductId, Size, Quantity } = item;

                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        _id: ProductId,
                        "Size.size": Size
                    },
                    {
                        $inc: { "Size.$.quantity": -Quantity }
                    },
                    { new: true, session: transactionSession }
                );

                if (!updatedProduct) {
                    throw new Error("Product with the requested size not available");
                }
            }

            await Cart.findByIdAndDelete(order.CartId, { session: transactionSession });

            await transactionSession.commitTransaction();
            transactionSession.endSession();

            res.status(200).json({
                success: true,
                message: "Order created and Cart emptied"
            });
        } else {
            await Order.findByIdAndDelete(order_Id, { session: transactionSession });

            await transactionSession.commitTransaction();
            transactionSession.endSession();

            res.status(200).json({
                success: false,
                message: "Order not created"
            });
        }

    } catch (e) {
        await transactionSession.abortTransaction();
        transactionSession.endSession();
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Payment Validation | Internal Server Error"
        });
    }
};

const fetchAllOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ UserId: userId }).sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No orders for this user yet"
            });
        }

        res.status(200).json({
            success: true,
            orders
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Fetch Orders | Internal Server Error"
        });
    }
};

const fetchOrderDetail = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Fetch Order Details | Internal Server Error"
        });
    }
};

module.exports = {
    createOrder,
    paymentValidator,
    fetchAllOrders,
    fetchOrderDetail
};