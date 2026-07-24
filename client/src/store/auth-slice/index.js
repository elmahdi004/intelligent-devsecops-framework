import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated : false,
    isLoading : true,
    user : null
}

export const userSignup = createAsyncThunk('/auth/signup',
    async(formData) => {
        const BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5000';
        console.log('[auth] VITE_SERVER_BASE_URL =>', import.meta.env.VITE_SERVER_BASE_URL);
        const url = `${BASE}/api/auth/signup`;
        console.log('[auth] signup URL =>', url, 'payload =>', formData);
        const res = await axios.post(url, formData, {
            withCredentials : true
        });
        return res.data;
    }
)

export const userLogin = createAsyncThunk('/auth/login',
    async(formData) => {
        const BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5000';
        console.log('[auth] VITE_SERVER_BASE_URL =>', import.meta.env.VITE_SERVER_BASE_URL);
        const url = `${BASE}/api/auth/login`;
        console.log('[auth] login URL =>', url, 'payload =>', formData);
        const res = await axios.post(url, formData, {
            withCredentials : true
        });
        return res.data;
    }
)

export const verifyAuth = createAsyncThunk('/auth/verifyAuth',
    async(token) => {
        const BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5000';
        console.log('[auth] VITE_SERVER_BASE_URL =>', import.meta.env.VITE_SERVER_BASE_URL);
        const url = `${BASE}/api/auth/verifyAuth`;
        console.log('[auth] verifyAuth URL =>', url, 'token =>', !!token);
        const res = await axios.get(url,{
            withCredentials : true,
            headers : {
            Authorization : `Bearer ${token}`,
            "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
            }
        });
        return res.data;
    }
)

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        resetAuthentication : (state) => {
            state.isAuthenticated = false,
            state.user = null,
            state.isLoading = false,
            localStorage.removeItem("flint_token")
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(userSignup.pending , (state) => {
            state.isLoading = true
        })
        .addCase(userSignup.fulfilled , (state,action) => {
            state.isAuthenticated = false
            state.isLoading = false,
            state.user = null
        })
        .addCase(userSignup.rejected , (state) => {
            state.isAuthenticated = false
            state.isLoading = false,
            state.user = null
        })
        .addCase(userLogin.pending , (state) => {
            state.isLoading = true
        })
        .addCase(userLogin.fulfilled , (state,action) => {
            state.isAuthenticated = action.payload.success ? true : false
            localStorage.setItem("flint_token",action.payload?.token)
            state.isLoading = false,
            state.user = action.payload.success ? action.payload.user : null
        })
        .addCase(userLogin.rejected , (state) => {
            state.isAuthenticated = false
            state.isLoading = false,
            state.user = null
        })
        .addCase(verifyAuth.pending , (state) => {
            state.isLoading = true
        })
        .addCase(verifyAuth.fulfilled , (state,action) => {
            state.isAuthenticated = action.payload.success ? true : false
            state.isLoading = false,
            state.user = action.payload.success ? action.payload.user : null
        })
        .addCase(verifyAuth.rejected , (state) => {
            state.isAuthenticated = false
            state.isLoading = false,
            state.user = null
        })
    }
})

export const {resetAuthentication} = authSlice.actions;
export default authSlice.reducer;