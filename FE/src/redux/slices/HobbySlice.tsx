import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import { updateHobby } from "./ProfileSlice";

export interface Hobby {
  id: string;
  name: string;
}

interface HobbyState {
  hobbies: Hobby[];
  loading: boolean;
  error: string | null;
}

const initialState: HobbyState = {
  hobbies: [],
  loading: false,
  error: null,
};

export const getAllHobbies = createAsyncThunk(
  "user/get-all-hob",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.get("get-all-hobbies");
      dispatch(updateHobby(res.data as any));
      return (res.data as any)?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createHobby = createAsyncThunk(
  "user/create-hob",
  async ({ name }: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.post("create-hobby", {
        name,
      });
      dispatch(getAllHobbies());
      return (res.data as any)?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateHob = createAsyncThunk(
  "user/update-hob",
  async ({ id, name }: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.put(`update-hobby/${id}`, {
        name,
      });
      dispatch(getAllHobbies());
      return (res.data as any)?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteSingleHobby = createAsyncThunk(
  "user/delete-one-hob",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete(`delete-single-hobby/${id}`);
      dispatch(getAllHobbies());
      return (res.data as any)?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAllHobbies = createAsyncThunk(
  "user/delete-all-hobs",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete(`delete-all-hobbies`);
      dispatch(getAllHobbies());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const hobbySlice = createSlice({
  name: "hobby",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllHobbies.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllHobbies.fulfilled, (state, action: any) => {
        state.loading = false;
        state.hobbies = action.payload;
      })
      .addCase(getAllHobbies.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createHobby.pending, (state) => {
        state.loading = true;
      })
      .addCase(createHobby.fulfilled, (state, action: any) => {
        state.loading = false;
        state.hobbies = [...state.hobbies, action.payload];
      })
      .addCase(createHobby.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHob.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHob.fulfilled, (state, action: any) => {
        state.loading = false;
        const ind = state.hobbies.findIndex((e) => e.id === action.payload?.id);
        if (ind !== -1) {
          state.hobbies[ind] = action.payload;
        }
      })
      .addCase(updateHob.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSingleHobby.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSingleHobby.fulfilled, (state, action: any) => {
        state.loading = false;
        state.hobbies = state.hobbies.filter(
          (e) => e.id !== action.payload?.id
        );
      })
      .addCase(deleteSingleHobby.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAllHobbies.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllHobbies.fulfilled, (state) => {
        state.loading = false;
        state.hobbies = [];
      })
      .addCase(deleteAllHobbies.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hobbySlice;
