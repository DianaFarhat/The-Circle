import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import cartSliceReducer from "./features/cart/cartSlice";
import shopReducer from "./features/shop/shopSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },
  devTools: true,
});
