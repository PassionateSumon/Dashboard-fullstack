import { createSlice } from "@reduxjs/toolkit";

enum SkillLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED"
  }
  

export interface Skill {
  name: string;
  level: SkillLevel;
  certificate: string;
}

interface SkillState {
  skills: Skill[] | null;
}

const initialState: SkillState = {
  skills: null,
};

const eduSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {},
});

export default eduSlice;
