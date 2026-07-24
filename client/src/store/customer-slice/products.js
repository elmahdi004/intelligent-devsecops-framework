import { createAsyncThunk, createSlice,current } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    products : [],
    productDetail : [],
    pageCount : 1,
    similarProducts : [],
    featuredProducts : [],
    latestProducts : []
}


export const fetchFilteredProducts = createAsyncThunk('/products/fetch',async ({token,filter,sort,currentPage}) => {
    const query = new URLSearchParams({
        ...filter,
        sort,
        pageLimit  : import.meta.env.VITE_PRODUCTS_PER_PAGE,
        page : currentPage
    });

    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/shop/products/fetch?${query}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const fetchProductDetails = createAsyncThunk('/products/fetchDetail',async ({token,id}) => {
    
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/shop/products/fetchProduct?id=${id}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const fetchSimilarProducts = createAsyncThunk('/products/similarProducts',async ({token,id}) => {
    
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/shop/products/similarProducts?id=${id}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const fetchFeaturedandLatest = createAsyncThunk('/products/featured-latest',async (token) => {
    
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/shop/products/featured-latest`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

const CustomerProductSlice = createSlice({
    name : "customerProduct",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchFilteredProducts.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchFilteredProducts.fulfilled,(state,action) => {
            state.isLoading = false;
            state.products = action.payload?.products;
            state.pageCount = action.payload?.pageCount;
        })
        .addCase(fetchFilteredProducts.rejected,(state,action) => {
            state.isLoading = false;
            state.products = [];
        })
        .addCase(fetchProductDetails.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchProductDetails.fulfilled,(state,action) => {
            state.isLoading = false;
            state.productDetail = action.payload?.product;
        })
        .addCase(fetchProductDetails.rejected,(state,action) => {
            state.isLoading = false;
            state.productDetail = [];
        })
        .addCase(fetchSimilarProducts.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchSimilarProducts.fulfilled,(state,action) => {
            state.isLoading = false;
            state.similarProducts = action.payload?.similarProducts;
        })
        .addCase(fetchSimilarProducts.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(fetchFeaturedandLatest.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchFeaturedandLatest.fulfilled,(state,action) => {
            state.isLoading = false;
            state.featuredProducts = action.payload?.featuredProducts || [];
            state.latestProducts = action.payload?.latestProducts || [];
        })
        .addCase(fetchFeaturedandLatest.rejected,(state,action) => {
            state.isLoading = false;
        })
    }
});

export default CustomerProductSlice.reducer;