import { createSlice } from "@reduxjs/toolkit";

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
  certificate?: string;
}

interface ExpState {
  experiences: Experience[] | null;
}

const initialState: ExpState = {
  experiences: null,
};

const eduSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {},
});

export default eduSlice;
