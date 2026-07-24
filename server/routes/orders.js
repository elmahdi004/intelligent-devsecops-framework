const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Mock database (Replace with actual DB logic)
const orders = [];

router.post("/", async (req, res) => {
  const { userId, cartId, cartProducts, addressInfo, totalAmount } = req.body;

  if (!userId || !cartProducts.length || !addressInfo) {
    return res.status(400).json({ success: false, message: "Invalid order data" });
  }

  // Store order (Replace with actual database logic)
  const newOrder = { id: orders.length + 1, userId, cartId, cartProducts, addressInfo, totalAmount, status: "Pending" };
  orders.push(newOrder);

  // Send email notification to store owner
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com", // Replace with your email
        pass: "your-email-password", // Use environment variables for security
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: "store-owner@example.com", // Replace with the store owner's email
      subject: "New Order Received",
      html: `
        <h2>New Order Received</h2>
        <p><strong>Customer Name:</strong> ${userId}</p>
        <p><strong>Address:</strong> ${addressInfo.Address}, ${addressInfo.City} - ${addressInfo.Pincode}</p>
        <p><strong>Contact:</strong> ${addressInfo.Contact}</p>
        <h3>Order Details:</h3>
        <ul>
          ${cartProducts
            .map(
              (item) =>
                `<li>${item.Quantity} x ${item.Name} - ${item.SalePrice > 0 ? item.SalePrice : item.Price} MAD</li>`
            )
            .join("")}
        </ul>
        <p><strong>Total Amount:</strong> ${totalAmount} MAD</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Order placed successfully and email sent." });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

module.exports = router;
