import { signin } from "../slices/AuthSlice";

export const loginMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.type === "auth/validate/fulfilled") {
    store.dispatch(signin(action?.payload));
  }
  // console.log(action)

  // if (action.type === "auth/validate/fulfilled") {
  //   const state = store.getState();
  //   const currentAccess = state.auth.accessToken; // Assuming `user` holds authentication data

  //   // Prevent unnecessary re-dispatch if the user is already logged in
  //   if (!currentAccess) {
  //     store.dispatch(login(action.payload));
  //   }
  // }

  return next(action);
};
