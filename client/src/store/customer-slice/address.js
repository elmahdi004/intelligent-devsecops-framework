import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    addressList : []
}


export const handleAddAddress = createAsyncThunk('/address/add',async ({token,formData,userId}) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/address/add`,{...formData,userId},{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleFetchAddress = createAsyncThunk('/address/fetch',async ({token,userId}) => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/address/fetch/${userId}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleUpdateAddress = createAsyncThunk('/address/update',async ({token,userId,addressId,formData}) => {
    const res = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/api/address/update/${userId}/${addressId}`,formData,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleDeleteAddress = createAsyncThunk('/address/delete',async ({token,userId,addressId}) => {

    const res = await axios.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/api/address/delete/${userId}/${addressId}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})


const AddressSlice = createSlice({
    name : "address",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(handleAddAddress.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleAddAddress.fulfilled,(state,action) => {
            state.isLoading = false;
            state.addressList.push(action.payload?.address);
        })
        .addCase(handleAddAddress.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleFetchAddress.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleFetchAddress.fulfilled,(state,action) => {
            state.isLoading = false;
            state.addressList = action.payload?.address;
        })
        .addCase(handleFetchAddress.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleUpdateAddress.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleUpdateAddress.fulfilled,(state,action) => {
            state.isLoading = false;
            const updatedAddress = action.payload?.address;
            const addressIndex = state.addressList.findIndex((item) => item._id === updatedAddress._id);
            if(addressIndex !== -1)
            {
                state.addressList[addressIndex] = updatedAddress;
            }
        })
        .addCase(handleUpdateAddress.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleDeleteAddress.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleDeleteAddress.fulfilled,(state,action) => {
            state.isLoading = false;
            const addressIndex = state.addressList.findIndex((item) => item._id === action.payload?.address._id);
            if(addressIndex !== -1)
            {
                state.addressList.splice(addressIndex , 1);
            }
        })
        .addCase(handleDeleteAddress.rejected,(state,action) => {
            state.isLoading = false;
        })
    }
});

export default AddressSlice.reducer;