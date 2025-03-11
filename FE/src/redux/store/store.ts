import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/AuthSlice";
import profileSlice from "../slices/ProfileSlice";
import { loginMiddleware } from "../middleware/loginMiddleware";
import { logoutMiddleware } from "../middleware/logoutMiddleware";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    profile: profileSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(loginMiddleware, logoutMiddleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
