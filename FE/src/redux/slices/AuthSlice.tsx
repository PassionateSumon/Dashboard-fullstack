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
  isLoggedIn: !!Cookies.get("accessToken"),
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
      await axiosInstance.post("/signup", { email, password });
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
      return (res.data as any)?.data;
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Something went wrong while login",
        status: error.response?.status || 500,
      });
    }
  }
);

export const validateToken = createAsyncThunk(
  "auth/validate",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get("accessToken");
    // console.log("Validate token -- 60 -- ", token)
    // console.log("Validate token -- 61 -- ", !!Cookies.get("accessToken"))
    if (!token) {
      console.log("here -- 63");
      return false;
    }
    try {
      const res = await axiosInstance.get("/verify-token");
      // console.log(res);
      return res.data as any;
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Something went wrong while validating token",
      });
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/refresh");
      return (res.data as any)?.newAccessToken;
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Something went wrong while refreshing token",
      });
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/logout");
      localStorage.clear();
      return true;
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Something went wrong while logging out",
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
      state.isLoggedIn = false;
    },
    signin: (state) => {
      // console.log("125 -- signin reducer --");
      state.isLoggedIn = true;
      // console.log("127 -- signin reducer -- isLoggedIn -- ", state.isLoggedIn);
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
        if (action.payload) {
          state.accessToken = action.payload;
          Cookies.set("accessToken", action.payload);
          state.isLoggedIn = true;
        }
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
        // console.log(action.payload)
        // const code = action.payload?.data?.statusCode;
        const code = action.payload?.statusCode;
        const newLoginState = code < 300;
        // console.log(newLoginState)
        // console.log(code)

        if (state.isLoggedIn !== newLoginState) {
          state.isLoggedIn = newLoginState;
        }
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        // console.log("validate token rejected")
        state.isLoggedIn = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = null;
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      });
  },
});

export const { signin } = authSlice.actions;
export default authSlice;
