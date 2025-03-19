import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ isLoggedIn }: any) {
  // console.log("Protected route - 4 ",isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }  
  return <Outlet />;
}

export default ProtectedRoute;
