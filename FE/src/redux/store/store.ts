import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/AuthSlice";
import profileSlice from "../slices/ProfileSlice";
import { loginMiddleware } from "../middleware/loginMiddleware";
import { logoutMiddleware } from "../middleware/logoutMiddleware";
import eduSlice from "../slices/EduSlice";
import expSlice from "../slices/ExpSlice";
import hobbySlice from "../slices/HobbySlice";
import skillSlice from "../slices/SkillSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    profile: profileSlice.reducer,
    education: eduSlice.reducer,
    experience: expSlice.reducer,
    hobby: hobbySlice.reducer,
    skill: skillSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(loginMiddleware, logoutMiddleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
