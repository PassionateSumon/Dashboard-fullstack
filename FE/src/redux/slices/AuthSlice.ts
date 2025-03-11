import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import Cookies from "js-cookie";

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/signup", { email, password });
      return "Signed up successfully. Please login...";
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Something went wrong while signup",
      });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/login", { email, password });
      return res.data;
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Something went wrong while login",
      });
    }
  }
);

export const validateToken = createAsyncThunk(
  "auth/validate",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/verify-token");
      // console.log("validate token: ", res);
      return (res.data as any);
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Something went wrong while validate token",
      });
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/refresh");
      return (res.data as any)?.newAccessToken; // later
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Something went wrong while login",
      });
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/logout");
      Cookies.remove("accessToken");
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Something went wrong while login",
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
    },
    signin: (state, action) => {
      state.isLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoggedIn = false;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.accessToken = action.payload;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // console.log(action.payload);
        const code = action.payload?.data?.status;
        if (code < 300) {
          state.isLoggedIn = true;
        } else {
          state.isLoggedIn = false;
        }
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.isLoggedIn = false;
      });
  },
});

export const { signin } = authSlice.actions;
export default authSlice;
