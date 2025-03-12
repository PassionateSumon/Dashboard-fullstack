import { signin } from "../slices/AuthSlice";

export const loginMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.type === "auth/validate/fulfilled") {
    store.dispatch(signin(action?.payload));
  }
  // console.log(action)

  return next(action);
};
