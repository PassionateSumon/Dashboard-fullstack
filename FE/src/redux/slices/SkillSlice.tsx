import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";
import { updateSkill } from "./ProfileSlice";

enum SkillLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  certificate: string;
}

interface SkillState {
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillState = {
  skills: [],
  loading: false,
  error: null,
};

const getAllSkills = createAsyncThunk(
  "user/get-all-skill",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.get("get-all-skills");
      dispatch(updateSkill(res.data as any));
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const createSkill = createAsyncThunk(
  "user/create-skill",
  async (inputSkill: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.post("create-skill", inputSkill);
      dispatch(getAllSkills());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const updateOneSkill = createAsyncThunk(
  "user/update-skill",
  async ({ id, inputSkill }: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.put(`update-skill/${id}`, inputSkill);
      dispatch(getAllSkills());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const deleteSingleSkill = createAsyncThunk(
  "user/delete-one-skill",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete(`delete-single-skill/${id}`);
      dispatch(getAllSkills());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const deleteAllSkills = createAsyncThunk(
  "user/delete-all-skills",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete(`delete-all-skills`);
      dispatch(getAllSkills());
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSkills.fulfilled, (state, action: any) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(getAllSkills.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSkill.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSkill.fulfilled, (state, action: any) => {
        state.loading = false;
        state.skills = [...state.skills, action.payload];
      })
      .addCase(createSkill.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOneSkill.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOneSkill.fulfilled, (state, action: any) => {
        state.loading = false;
        const ind = state.skills.findIndex((e) => e.id === action.payload?.id);
        if (ind !== -1) {
          state.skills[ind] = action.payload;
        }
      })
      .addCase(updateOneSkill.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSingleSkill.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSingleSkill.fulfilled, (state, action: any) => {
        state.loading = false;
        state.skills = state.skills.filter((e) => e.id !== action.payload?.id);
      })
      .addCase(deleteSingleSkill.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAllSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllSkills.fulfilled, (state) => {
        state.loading = false;
        state.skills = [];
      })
      .addCase(deleteAllSkills.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default skillSlice;
