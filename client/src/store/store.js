import { configureStore } from "@reduxjs/toolkit"
import authReducer from './auth-slice'
import adminProductsReducer from './admin-slice/products'
import AdminOrderSlice from './admin-slice/admin_orders'
import customerProductReducer from './customer-slice/products'
import shoppingCartReducer from "./customer-slice/cart"
import addressReducer from "./customer-slice/address"
import orderReducer from "./customer-slice/orders"
import searchReducer from "./customer-slice/search"
import ReviewReducer from "./customer-slice/review"
import BannerReducer from "./banner-slice/index"
import AnalyticsReducer from "./admin-slice/analytics"

const store = configureStore({
    reducer : {
        auth : authReducer,
        adminProduct : adminProductsReducer,
        adminOrder : AdminOrderSlice,
        customerProduct : customerProductReducer,
        shoppingCart : shoppingCartReducer,
        address : addressReducer,
        order : orderReducer,
        search : searchReducer,
        review : ReviewReducer,
        banner : BannerReducer,
        analytics : AnalyticsReducer
    }
})

export default store;