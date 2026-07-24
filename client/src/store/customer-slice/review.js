import { createAsyncThunk, createSlice,current } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    reviewList : []
}


export const addReview = createAsyncThunk('/reviews/add',async ({token,reviewData}) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/review/add`,reviewData,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const fetchProductReviews = createAsyncThunk('/reviews/fetch',async ({token,productId}) => {
    
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/review/fetch/${productId}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

const ReviewSlice = createSlice({
    name : "reviews",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(addReview.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(addReview.fulfilled,(state,action) => {
            state.isLoading = false;
            action.payload?.review && state.reviewList.push(action.payload?.review);
        })
        .addCase(addReview.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(fetchProductReviews.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchProductReviews.fulfilled,(state,action) => {
            state.isLoading = false;
            state.reviewList = action.payload?.review;
        })
        .addCase(fetchProductReviews.rejected,(state,action) => {
            state.isLoading = false;
            state.reviewList = [];
        })
    }
});

export default ReviewSlice.reducer;