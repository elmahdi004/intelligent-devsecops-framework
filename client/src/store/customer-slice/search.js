import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    searchResults : []
}


export const fetchSearchResults= createAsyncThunk('/search',async ({token,searchQuery}) => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/search/${searchQuery}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

const SearchSlice = createSlice({
    name : "search",
    initialState,
    reducers : {
        clearSearchResults : (state) => {
            state.searchResults = []
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchSearchResults.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(fetchSearchResults.fulfilled,(state,action) => {
            state.isLoading = false;
            state.searchResults = action.payload?.result;
        })
        .addCase(fetchSearchResults.rejected,(state,action) => {
            state.isLoading = false;
            state.searchResults = [];
        })
    }
});

export const {clearSearchResults} = SearchSlice.actions;
export default SearchSlice.reducer;