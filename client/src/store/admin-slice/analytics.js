import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    sales : {},
    order : {},
    product : {}
}

export const fetchSales = createAsyncThunk('/analytics/sales',async ({token,analyticFilter}) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/admin/analytics/sales`,{
        type : "Period",
        analyticFilter
    },
    {
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const fetchOrder = createAsyncThunk('/analytics/orders',async ({token,analyticFilter}) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/admin/analytics/orders`,{
        type : "Period",
        analyticFilter
    },
    {
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const fetchProduct = createAsyncThunk('/analytics/product',async ({token,analyticFilter}) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/admin/analytics/product`,{
        type : "Period",
        analyticFilter
    },
    {
        headers: {
            Authorization : `Bearer ${token}`
        } 
    });
    return res?.data;
})


const AnalyticsSlice = createSlice({
    name : "analytics",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchSales.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchSales.fulfilled,(state,action) => {
            state.isLoading = false;
            state.sales["totalRevenue"] = action.payload.totalRevenue;
            state.sales["averageOrderValue"] = action.payload.averageOrderValue;
            state.sales["discountTotal"] = action.payload.discountTotal;
            state.sales["revenuePerItem"] = action.payload.revenuePerItem;
            state.sales["RevenueTrendData"] = action.payload.RevenueTrendData;
            state.sales["revenuePerCategory"] = action.payload.revenuePerCategory;
        })
        .addCase(fetchSales.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(fetchOrder.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchOrder.fulfilled,(state,action) => {
            state.isLoading = false;
            state.order["totalOrders"] = action.payload.totalOrders;
            state.order["completedOrders"] = action.payload.completedOrders;
            state.order["pendingOrders"] = action.payload.pendingOrders;
            state.order["averageItemsPerOrder"] = action.payload.averageItemsPerOrder;
            state.order["orderTrend"] = action.payload.orderTrend;
            state.order["orderStatusDistribution"] = action.payload.orderStatusDistribution;
        })  
        .addCase(fetchOrder.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(fetchProduct.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchProduct.fulfilled,(state,action) => {
            state.isLoading = false;
            state.product["totalProductsSold"] = action.payload.totalProductsSold;
            state.product["averageProductPrice"] = action.payload.averageProductPrice;
            state.product["popularSize"] = action.payload.popularSize;
            state.product["outOfStockProducts"] = action.payload.outOfStockProducts;
            state.product["sizeTrend"] = action.payload.sizeTrend;
            state.product["performingProducts"] = action.payload.performingProducts;
        })  
        .addCase(fetchProduct.rejected,(state,action) => {
            state.isLoading = false;
        })
    }
});

export default AnalyticsSlice.reducer;