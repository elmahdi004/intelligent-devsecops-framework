const express = require('express')
require('dotenv').config();
const cors = require('cors')
const cookieParser = require('cookie-parser')
const DB_Connect = require('./db.js');
const app = express()
const PORT = process.env.PORT || 5000;
const AuthRouter = require('./routes/auth/Auth_Routes.js')
const ProductRouter = require('./routes/admin/Product_Routes.js')
const CustomerRouter = require('./routes/customer/Customer_Routes.js');
const CartRouter = require("./routes/customer/Cart_Routes.js")
const AddressRouter = require("./routes/customer/Address_Routes.js")
const OrderRouter = require("./routes/customer/Order_Routes.js")
const AdminOrderRouter = require("./routes/admin/Admin_Order_Routes.js")
const SearchRouter = require("./routes/customer/Search_Routes.js")
const ReviewRouter = require("./routes/customer/Review_Routes.js")
const BannerRouter = require("./routes/banner/Banner_Routes.js")
const AnalyticsRouter = require("./routes/admin/Analytics_Routes.js")

const { Cloudinary_Connect } = require('./utility/cloudinary.js');
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://e-com-flint.netlify.app"
];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods : ['GET','POST','PUT','DELETE'],
        allowedHeaders : [
            "Content-Type",
            "Authorization",
            "Expires",
            "Cache-Control",
            "Pragma"
        ],
        credentials : true
    })
);
app.use(cookieParser());
app.use(express.json());
DB_Connect();
Cloudinary_Connect();

app.use('/api/auth',AuthRouter);

app.use('/api/admin/products',ProductRouter);
app.use('/api/admin/orders',AdminOrderRouter);
app.use("/api/admin/analytics",AnalyticsRouter);

app.use('/api/shop/products',CustomerRouter);
app.use('/api/cart',CartRouter);
app.use('/api/address',AddressRouter);
app.use('/api/order',OrderRouter);
app.use('/api/search',SearchRouter);
app.use('/api/review',ReviewRouter);

app.use('/api/banner',BannerRouter);

app.listen(PORT,() => console.log(`Backend server running at port ${PORT}`));