import { login } from "../slices/AuthSlice";

export const loginMiddleware = (store: any) => (next: any) => (action: any) => {
  if (
    action.type === "auth/login/fulfilled" ||
    action.type === "auth/validate/fulfilled"
  ) {
    if (action.payload.code === 200) {
      store.dispatch(login(action?.payload));
    }
  }
  return next(action);
};
