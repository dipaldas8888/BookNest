import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import cartReducer from "../redux/features/cartSlice";
import orderReducer from "../redux/features/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});
