import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

/* =========================
   LOGIN USER
========================= */

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const res = await API.post("/login", userData);

      localStorage.setItem("token", res.data.token);

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

/* =========================
   REGISTER USER
========================= */

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const res = await API.post("/register", userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Register failed",
      );
    }
  },
);

/* =========================
   INITIAL STATE
========================= */

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

/* =========================
   SLICE
========================= */

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder

      /* LOGIN */

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* REGISTER */

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
