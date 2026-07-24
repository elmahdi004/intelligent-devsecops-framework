import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    cartId : null,
    cartProducts : []
}

export const syncLocalCart = createAsyncThunk(
    '/carts/sync',
    async ({ token, userId }, { rejectWithValue }) => {
      try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
        if (cartItems.length > 0) {
          // Send each item to the backend
          await Promise.all(
            cartItems.map((item) =>
              axios.post(
                `${import.meta.env.VITE_SERVER_BASE_URL}/api/cart/add`,
                { userId, productId: item.productId, size: item.size, quantity: item.quantity },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
            )
          );
  
          // Clear local storage after syncing
          localStorage.removeItem('cartItems');
          return { message: 'Local cart synced with backend' };
        }
  
        return { message: 'No local cart items to sync' };
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to sync cart');
      }
    }
  );


  export const handleAddtoCart = createAsyncThunk(
    '/carts/add',
    async ({ token, userId, productId, size, quantity }, { getState }) => {
      const { auth } = getState();
      const { user } = auth;
  
      if (!user) {
        // Handle unauthenticated users: Store cart items in local storage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const newItem = { productId, size, quantity };
        cartItems.push(newItem);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        return { message: 'Item added to local cart' };
      }
  
      // Handle authenticated users: Send request to backend
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/cart/add`,
          { userId, productId, size, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return res?.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add item to cart');
      }
    }
  );

export const handleFetchCartItems = createAsyncThunk('/carts/fetch',async ({token,userId}) => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/cart/fetch/${userId}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleUpdateCartItems = createAsyncThunk('/carts/update',async ({token,userId,productId,size,quantity}) => {
    const res = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/api/cart/update`,{
        userId,
        productId,
        size,
        quantity
    },{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})

export const handleDeleteCartItems = createAsyncThunk('/carts/delete',async ({token,userId,productId,size}) => {

    const res = await axios.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/api/cart/delete/${userId}/${productId}/${size}`,{
        headers: {
            Authorization : `Bearer ${token}`
        } 
      });
    return res?.data;
})


const ShoppingCartSlice = createSlice({
    name : "shoppingCart",
    initialState,
    reducers : {
        clearCart: (state) => {
            state.cartProducts = [];
            state.cartId = null;
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(handleAddtoCart.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleAddtoCart.fulfilled,(state,action) => {
            state.isLoading = false;
          state.cartProducts = action.payload?.data?.populatedItems || [];
          state.cartId = action.payload?.data?._id || state.cartId;
        })
        .addCase(handleAddtoCart.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleFetchCartItems.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleFetchCartItems.fulfilled,(state,action) => {
            state.isLoading = false;
          state.cartProducts = action.payload?.data?.populatedItems || [];
          state.cartId = action.payload?.data?._id || state.cartId;
        })
        .addCase(handleFetchCartItems.rejected,(state,action) => {
            state.isLoading = false;
            state.cartProducts = [];
        })
        .addCase(handleUpdateCartItems.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleUpdateCartItems.fulfilled,(state,action) => {
            state.isLoading = false;
            state.cartProducts = action.payload?.data?.populatedItems ?? state.cartProducts;
            state.cartId = action.payload?.data?._id ?? state.cartId;
        })
        .addCase(handleUpdateCartItems.rejected,(state,action) => {
            state.isLoading = false;
        })
        .addCase(handleDeleteCartItems.pending,(state,action) => {
            state.isLoading = true;
        })
        .addCase(handleDeleteCartItems.fulfilled,(state,action) => {
            state.isLoading = false;
          state.cartProducts = action.payload?.data?.populatedItems || [];
          state.cartId = action.payload?.data?._id || state.cartId;
        })
        .addCase(handleDeleteCartItems.rejected,(state,action) => {
            state.isLoading = false;
        })
    }
});

export const { clearCart } = ShoppingCartSlice.actions;
export default ShoppingCartSlice.reducer;