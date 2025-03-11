import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/AuthSlice";
import { AppDispatch } from "../redux/store/store";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleClick = () => {
    dispatch(logout());
  };
  return (
    <div>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
};

export default Dashboard;
