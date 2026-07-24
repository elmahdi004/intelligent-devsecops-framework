const nodemailer = require("nodemailer");

const sendOrderEmail = async (orderData) => {
  try {
    // Create a transporter object using the email service (e.g., Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Email address used to send the email
        pass: process.env.EMAIL_PASS, // Password for the email account
      },
    });

    // Define the email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to: process.env.STORE_OWNER_EMAIL, // Store owner's email address (recipient)
      subject: "New Order Received", // Email subject
      html: `
        <h2>New Order Received</h2>
        <p><strong>Customer Name:</strong> ${orderData.userId}</p>
        <p><strong>Address:</strong> ${orderData.addressInfo.Address}, ${orderData.addressInfo.City} - ${orderData.addressInfo.Pincode}</p>
        <p><strong>Contact:</strong> ${orderData.addressInfo.Contact}</p>
        <h3>Order Details:</h3>
        <ul>
          ${orderData.cartProducts
            .map(
              (item) =>
                `<li>${item.Quantity} x ${item.Name} - ${item.SalePrice > 0 ? item.SalePrice : item.Price} MAD</li>`
            )
            .join("")}
        </ul>
        <p><strong>Total Amount:</strong> ${orderData.totalAmount} MAD</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Order email sent successfully.");
  } catch (error) {
    console.error("Error sending order email:", error);
  }
};

module.exports = sendOrderEmail;
