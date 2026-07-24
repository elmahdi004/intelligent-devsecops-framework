import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    bannerList : []
}

export const handleAddBanner = createAsyncThunk('/banner/add' , async({token,formData}) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/banner/add`,
        formData
    ,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleFetchBanners = createAsyncThunk('/banner/fetchAll' , async(token) => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/banner/fetchAll`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data; 
})

export const handleDeleteBanner = createAsyncThunk('/banner/delete' , async({token,bannerId}) => {
    const res = await axios.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/api/banner/delete/${bannerId}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data; 
})

const BannerSlice = createSlice({
    name : "banner",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(handleAddBanner.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleAddBanner.fulfilled,(state,action) => {
            state.isLoading = false;
            state.bannerList.push(action.payload?.bannerImage);
        })
        .addCase(handleAddBanner.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleDeleteBanner.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleDeleteBanner.fulfilled,(state,action) => {
            state.isLoading = false;
            const index = state.bannerList.findIndex(banner => banner._id === action.payload.banner._id);
            state.bannerList.splice(index,1);
        })
        .addCase(handleDeleteBanner.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleFetchBanners.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleFetchBanners.fulfilled,(state,action) => {
            state.isLoading = false;
            state.bannerList = action.payload?.banners || [];
        })
        .addCase(handleFetchBanners.rejected,(state,action) => {
            state.isLoading = false;
        })
    }
});

export default BannerSlice.reducer;