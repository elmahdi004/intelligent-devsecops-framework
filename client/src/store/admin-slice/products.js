import { createAsyncThunk, createSlice,current } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    products : [],
    pageCount : 1
}

export const addProduct = createAsyncThunk('/products/add',async ({token,formData}) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/admin/products/create`,formData,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const editProduct = createAsyncThunk('/products/edit',async ({token,id,MultipartData}) => {
    const res = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/api/admin/products/edit/${id}`,MultipartData,
        {
            headers : {
            Authorization : `Bearer ${token}`,
            'Content-Type' : 'application/json'
            }
        }
    );
    return res?.data;
})

export const removeProduct = createAsyncThunk('/products/remove',async ({token,id}) => {
    const res = await axios.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/api/admin/products/remove/${id}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const fetchProducts = createAsyncThunk('/products/fetch',async ({token,productCategory,productBrand,productStock,currentProductPage}) => {
    const query = new URLSearchParams({
        Category : productCategory,
        Brand : productBrand,
        Stock  : productStock,
        pageLimit  : 10,
        page : currentProductPage
    });
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/admin/products/fetchAll?${query}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

const AdminProductSlice = createSlice({
    name : "adminProduct",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchProducts.pending,(state) => {
            state.isLoading = true;
        })
        .addCase(fetchProducts.fulfilled,(state,action) => {
            state.isLoading = false;
            state.products = action.payload.data;
            state.pageCount = action.payload.pageCount;
        })
        .addCase(fetchProducts.rejected,(state) => {
            state.isLoading = false;
            state.products = [];
        })
        .addCase(editProduct.pending,(state) => {
            state.isLoading = true;
        })
        .addCase(editProduct.fulfilled,(state,action) => {
            state.isLoading = false;
            const index = state.products.findIndex(product => product._id === action.payload.data._id);
            if(index != -1)
            {
                state.products[index] = {
                    ...state.products[index],
                    ...action.payload.data,
                }
            }
        })
        .addCase(editProduct.rejected,(state) => {
            state.isLoading = false;
        })
        .addCase(removeProduct.pending,(state) => {
            state.isLoading = true;
        })
        .addCase(removeProduct.fulfilled,(state,action) => {
            state.isLoading = false;
            const index = state.products.findIndex(product => product._id === action.payload.removedProduct._id);
            state.products.splice(index,1);
        })
        .addCase(removeProduct.rejected,(state) => {
            state.isLoading = false;
        })
        .addCase(addProduct.pending,(state) => {
            state.isLoading = true;
        })
        .addCase(addProduct.fulfilled,(state,action) => {
            state.isLoading = false;
            state.products.unshift(action.payload.data);
        })
        .addCase(addProduct.rejected,(state) => {
            state.isLoading = false;
        })
    }
});

export default AdminProductSlice.reducer;