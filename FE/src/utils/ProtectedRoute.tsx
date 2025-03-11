import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ isLoggedIn }: any) {
  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  } else return <Outlet />;
}

export default ProtectedRoute;
