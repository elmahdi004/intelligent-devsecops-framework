import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    orderList : [],
    pageCount : 1
}

export const handleFetchAllAdminOrders = createAsyncThunk('/adminOrder/fetchAll',async ({token,currentOrderPage,filterStatus}) => {
    const query = new URLSearchParams({
        page : currentOrderPage,
        pageLimit : 10,
        status : filterStatus
    });
    
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/admin/orders/fetchAll?${query}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleUpdateAdminOrders = createAsyncThunk('/adminOrder/update',async ({token,orderId,orderStatus}) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/admin/orders/updateStatus/${orderId}`,{orderStatus},{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleDeleteOrder = createAsyncThunk(
    'adminOrders/deleteOrder',
    async (orderId, { rejectWithValue, dispatch }) => {
        try {
            const token = localStorage.getItem('flint_token') ? localStorage.getItem('flint_token') : 'Invalid';
            const response = await axios.delete(
                `${import.meta.env.VITE_SERVER_BASE_URL}/api/admin/orders/delete/${orderId}`, // Use the correct backend URL
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.data.success) {
                dispatch(handleFetchAllAdminOrders({ token, currentOrderPage: 1, filterStatus: 'All' })); // Refresh the order list
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const AdminOrderSlice = createSlice({
    name : "adminOrder",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(handleFetchAllAdminOrders.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleFetchAllAdminOrders.fulfilled,(state,action) => {
            state.isLoading = false;
            state.orderList = action.payload?.orders;
            state.pageCount = action.payload?.pageCount;
        })
        .addCase(handleFetchAllAdminOrders.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleUpdateAdminOrders.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleUpdateAdminOrders.fulfilled,(state,action) => {
            state.isLoading = false;
            const indexToBeUpdated = state.orderList.findIndex((order) => order._id === action.payload.updatedOrder._id);
            state.orderList[indexToBeUpdated] = action.payload?.updatedOrder;
        })
        .addCase(handleUpdateAdminOrders.rejected,(state,action) => {
            state.isLoading = false;
        })
    }
});

export default AdminOrderSlice.reducer;