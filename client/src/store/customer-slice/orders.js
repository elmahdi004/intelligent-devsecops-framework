import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    orderList : [],
    orderDetails : null
}


export const handleCreateOrder = createAsyncThunk('/order/create',async ({token,orderData}) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/order/create`,orderData,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleOrderValidation = createAsyncThunk('/order/validate',async ({token,status , order_Id , session_Id}) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/order/validate`,{status , order_Id , session_Id},{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleFetchAllOrders = createAsyncThunk('/order/fetchAll',async ({token,userId}) => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/order/fetchAll/${userId}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleFetchOrderDetails = createAsyncThunk('/order/details',async ({token,orderId}) => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/order/details/${orderId}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})


const OrderSlice = createSlice({
    name : "order",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(handleCreateOrder.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleCreateOrder.fulfilled,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleCreateOrder.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleFetchAllOrders.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleFetchAllOrders.fulfilled,(state,action) => {
            state.isLoading = false;
            state.orderList = action.payload?.orders.reverse();
        })
        .addCase(handleFetchAllOrders.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleFetchOrderDetails.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleFetchOrderDetails.fulfilled,(state,action) => {
            state.isLoading = false;
            state.orderDetails = action.payload?.order;
        })
        .addCase(handleFetchOrderDetails.rejected,(state,action) => {
            state.isLoading = false;
        })
    }
});

export default OrderSlice.reducer;