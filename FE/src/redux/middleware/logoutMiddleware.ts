import { logout } from "../slices/AuthSlice";

//@ts-ignore
export const logoutMiddleware = (store) => (next) => (action) => {
  // console.log(action.payload)
  if (action?.payload?.code === 403 || action?.payload?.code === 401) {
    store.dispatch(logout());
  }
  return next(action);
};
