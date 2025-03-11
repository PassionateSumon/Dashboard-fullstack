import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Validate from "./pages/Validate";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Land from "./pages/Land";
import ProtectedRoute from "./utils/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import { loadingManager } from "./utils/AxiosInstance";
import Loader from "./components/Loader";
const App = () => {
  const { isLoggedIn }: any = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location.pathname, isLoggedIn]);
  const lastRoute = localStorage.getItem("lastRoute") || "/";
  // console.log(isLoggedIn);

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe((loading) => {
      setIsLoading(loading);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <Routes>
        <Route path="/" element={<Land />} />
        <Route element={<Validate />}>
          {/* Unauthorized */}
          <Route
            path="/signin"
            element={
              !isLoggedIn ? (
                <LoginPage />
              ) : (
                <Navigate to={lastRoute || "/"} replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isLoggedIn ? <SignupPage /> : <Navigate to={"/"} replace />
            }
          />

          {/* authorized */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/home">
              <Route path="hh" element={<Dashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
