import { signin } from "../slices/AuthSlice";

export const loginMiddleware = (store: any) => (next: any) => (action: any) => {
  // console.log("action error: ", action.error);
  if (action.type === "auth/validate/fulfilled") {
    store.dispatch(signin(action?.payload));
  }
  // console.log(action)

  return next(action);
};
