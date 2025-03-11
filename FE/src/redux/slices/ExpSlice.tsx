import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import { updateExperience } from "./ProfileSlice";

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
  certificate?: string;
}

interface ExpState {
  experiences: Experience[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpState = {
  experiences: [],
  loading: false,
  error: null,
};

const getAllExperiences = createAsyncThunk(
  "user/get-all-exp",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.get("get-all-experiences");
      dispatch(updateExperience(res.data as any));
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const createExperience = createAsyncThunk(
  "user/create-exp",
  async (
    { company, role, startDate, endDate, description, certificate }: any,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await axiosInstance.post("create-experience", {
        company,
        role,
        startDate,
        endDate,
        description,
        certificate,
      });
      dispatch(getAllExperiences());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const updateExp = createAsyncThunk(
  "user/update-exp",
  async (
    { id, company, role, startDate, endDate, description, certificate }: any,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await axiosInstance.put(`update-experience/${id}`, {
        company,
        role,
        startDate,
        endDate,
        description,
        certificate,
      });
      dispatch(getAllExperiences());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const deleteSingleExperience = createAsyncThunk(
  "user/delete-one-exp",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete(`delete-single-experience/${id}`);
      dispatch(getAllExperiences());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const deleteAllExperiences = createAsyncThunk(
  "user/delete-one-exp",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete(`delete-all-experience`);
      dispatch(getAllExperiences());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const eduSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllExperiences.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllExperiences.fulfilled, (state, action: any) => {
        state.loading = false;
        state.experiences = action.payload;
      })
      .addCase(getAllExperiences.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExperience.fulfilled, (state, action: any) => {
        state.loading = false;
        state.experiences = [...state.experiences, action.payload];
      })
      .addCase(createExperience.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExp.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExp.fulfilled, (state, action: any) => {
        state.loading = false;
        const ind = state.experiences.findIndex(
          (e) => e.id === action.payload?.id
        );
        if (ind !== -1) {
          state.experiences[ind] = action.payload;
        }
      })
      .addCase(updateExp.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSingleExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSingleExperience.fulfilled, (state, action: any) => {
        state.loading = false;
        state.experiences = state.experiences.filter(
          (e) => e.id !== action.payload?.id
        );
      })
      .addCase(deleteSingleExperience.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAllExperiences.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllExperiences.fulfilled, (state) => {
        state.loading = false;
        state.experiences = [];
      })
      .addCase(deleteAllExperiences.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eduSlice;
