import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Validate from "./pages/Validate";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Land from "./pages/Land";
import ProtectedRoute from "./utils/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
const App = () => {
  const { isLoggedIn }: any = useSelector((state: RootState) => state.auth);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Land />} />
        <Route path="/" element={<Validate />}>
          <Route
            path="/signin"
            element={
              !isLoggedIn ? <LoginPage /> : <Navigate to={"/"} replace />
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
            <Route path="/home" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
