import { useDispatch } from "react-redux";
import { validateToken } from "../redux/slices/AuthSlice";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { AppDispatch } from "../redux/store/store";

const Validate = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // console.log("here -- 11")
    dispatch(validateToken());
  }, [dispatch]);

  return <Outlet />;
};

export default Validate;
