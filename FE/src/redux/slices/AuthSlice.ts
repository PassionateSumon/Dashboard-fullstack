import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";

interface AuthState {
  accessToken: string | null;
  isLoggedin: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  isLoggedin: false,
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
    } catch (error) {
      return rejectWithValue(error);
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
      const res = await axiosInstance.post("/signup", { email, password });
      return (res.data as any).accessToken;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const validateToken = createAsyncThunk(
  "auth/validate",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/verify-token");
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/refresh");
      return (res.data as any)?.newAccessToken; // later
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await axiosInstance.post("/logout");
});

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
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.accessToken = action.payload;
        state.isLoggedin = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoggedin = false;
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
        if (action.payload?.code < 300) {
          state.isLoggedin = true;
        } else {
          state.isLoggedin = false;
        }
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedin = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.isLoggedin = false;
      });
  },
});

export default authSlice;
