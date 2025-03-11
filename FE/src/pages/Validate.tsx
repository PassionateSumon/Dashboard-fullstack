import { validateToken } from "../redux/slices/AuthSlice";
import { Outlet } from "react-router-dom";

const Validate = () => {
  const token = validateToken();
  return <Outlet />;
};

export default Validate;
