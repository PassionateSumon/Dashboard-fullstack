import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import { updateEducation } from "./ProfileSlice";

enum Degree {
  X = "X",
  XII = "XII",
  BACHELOR = "BACHELOR",
  MASTER = "MASTER",
  PhD = "PhD",
}

export interface Education {
  id: string;
  institute: string;
  degree?: Degree;
  fieldOfStudy?: string;
  startDate: string;
  endTime?: string;
  certificate?: string;
}

interface EduState {
  educations: Education[];
  loading: boolean;
  error: string | null;
}

const initialState: EduState = {
  educations: [],
  loading: false,
  error: null,
};

export const getAllEducations = createAsyncThunk(
  "user/get-all-edu",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.get("get-all-educations");
      dispatch(updateEducation(res.data as any));
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createEducation = createAsyncThunk(
  "user/create-edu",
  async ({ institute, startDate }: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.post("create-education", {
        institute,
        startDate,
      });
      dispatch(getAllEducations());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateEdu = createAsyncThunk(
  "user/update-edu",
  async (
    {
      id,
      institute,
      degree,
      fieldOfStudy,
      startDate,
      endTime,
      certificate,
    }: any,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await axiosInstance.put(`update-education/${id}`, {
        institute,
        degree,
        fieldOfStudy,
        startDate,
        endTime,
        certificate,
      });
      dispatch(getAllEducations());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteSingleEducation = createAsyncThunk(
  "user/delete-one-edu",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete(`delete-single-education/${id}`);
      dispatch(getAllEducations());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAllEducations = createAsyncThunk(
  "user/delete-all-edus",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete(`delete-all-educations`);
      dispatch(getAllEducations());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const eduSlice = createSlice({
  name: "education",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllEducations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEducations.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = null;
        state.educations = action.payload;
      })
      .addCase(getAllEducations.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEducation.fulfilled, (state, action: any) => {
        state.loading = false;
        state.educations = [...state.educations, action.payload];
      })
      .addCase(createEducation.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEdu.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEdu.fulfilled, (state, action: any) => {
        state.loading = false;
        const ind = state.educations.findIndex(
          (e) => e.id === action.payload?.id
        );
        if (ind !== -1) {
          state.educations[ind] = action.payload;
        }
      })
      .addCase(updateEdu.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSingleEducation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSingleEducation.fulfilled, (state, action: any) => {
        state.loading = false;
        state.educations = state.educations.filter(
          (e) => e.id !== action.payload?.id
        );
      })
      .addCase(deleteSingleEducation.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAllEducations.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllEducations.fulfilled, (state) => {
        state.loading = false;
        state.educations = [];
      })
      .addCase(deleteAllEducations.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eduSlice;
