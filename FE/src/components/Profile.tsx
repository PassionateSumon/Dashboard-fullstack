import { FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { logout } from "../redux/slices/AuthSlice";

const Profile: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get user data from Redux store
  const user = useSelector((state: any) => state.profile.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="max-w-sm max-h-screen mx-auto bg-white p-6 space-y-5 rounded-lg shadow-md text-center">
      <div>
        <label className="text-xl font-bold">Name</label>
        <h2 className="text-lg mb-2 break-words w-full ">
          {user?.name || "No Name"}
        </h2>
      </div>

      <div>
        <label className="text-xl font-bold">Email</label>
        <p className="text-gray-600 text-lg ">{user?.email || "No Email"}</p>
      </div>
      <div>
        <label className="text-xl font-bold">DOB</label>
        <p className="text-gray-500 text-lg">
          {user?.birthDate
            ? new Date(user.birthDate).toLocaleDateString()
            : "No DOB"}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
