import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axios";
import endpoints from "../../api/endpoints";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const res = await API.post(endpoints.orders.create, orderData);
      console.log(res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Order failed");
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    success: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
