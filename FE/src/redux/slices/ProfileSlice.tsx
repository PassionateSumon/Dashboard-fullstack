import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Education } from "./EduSlice";
import { Experience } from "./ExpSlice";
import { Hobby } from "./HobbySlice";
import { Skill } from "./SkillSlice";
import axiosInstance from "../../utils/AxiosInstance";

export interface User {
  email: string;
  name?: string;
  bio?: string;
  age?: number;
  gender?: string;
  address?: string;
  avatar?: string;
  birthDate?: string;
  phone?: string;
  location?: string;
  portfolio?: string;
  education?: Education[];
  experience?: Experience[];
  hobbies?: Hobby[];
  skills?: Skill[];
}

interface ProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
};

export const getProfile = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("get-profile");
      return (res.data as any)?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/update-profile",
  async ({formData}: any, { rejectWithValue }) => {
    console.log(formData)
    try {
      const res = await axiosInstance.put("update-profile", formData);
      return (res.data as any)?.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateEducation: (state, action: PayloadAction<Education[]>) => {
      if (state.user) state.user.education = action.payload;
    },
    updateExperience: (state, action: PayloadAction<Experience[]>) => {
      if (state.user) state.user.experience = action.payload;
    },
    updateSkill: (state, action: PayloadAction<Skill[]>) => {
      if (state.user) state.user.skills = action.payload;
    },
    updateHobby: (state, action: PayloadAction<Hobby[]>) => {
      if (state.user) state.user.hobbies = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action: any) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateEducation, updateExperience, updateHobby, updateSkill } =
  profileSlice.actions;
export default profileSlice;
