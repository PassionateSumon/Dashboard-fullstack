// import { signin } from "../slices/AuthSlice";
import { getProfile } from "../slices/ProfileSlice";

export const loginMiddleware = (store: any) => (next: any) => (action: any) => {
  // console.log("action error: ", action.error);
  if (action.type === "auth/validate/fulfilled") {
    store.dispatch(getProfile(action?.payload));
  }
  // console.log(action)

  return next(action);
};
