import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store"; // Adjust path
import { useEffect } from "react";
import { getProfile } from "../redux/slices/ProfileSlice";
import DetailsForm from "./DetailsForm";
import { Link } from "react-router-dom";

const DetailsManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.profile
  );

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Profile Details</h2>

      {error && <p className="text-red-500">Error: {error}</p>}

      {user && !loading && !error && (
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Name:</strong> {user.name || "Not set"}
          </p>
          <p>
            <strong>Bio:</strong> {user.bio || "Not set"}
          </p>
          <p>
            <strong>Age:</strong> {user.age || "Not set"}
          </p>
          <p>
            <strong>Gender:</strong>{" "}
            {user.gender
              ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
              : "Not set"}
          </p>
          <p>
            <strong>Address:</strong> {user.address || "Not set"}
          </p>
          <p>
            <strong>Birth Date:</strong>{" "}
            {user.birthDate
              ? new Date(user.birthDate).toISOString().split("T")[0]
              : "Not set"}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone || "Not set"}
          </p>
          <p>
            <strong>Location:</strong> {user.location || "Not set"}
          </p>
          <p>
            <strong>Portfolio:</strong>{" "}
            {user.portfolio ? (
              <Link
                to={`${user.portfolio}`}
                className="text-blue-800"
                target="_blank"
              >
                View
              </Link>
            ) : (
              "Not set"
            )}
          </p>
          <p>
            <strong>Avatar:</strong>{" "}
            {user.avatar ? (
              <Link
                to={`${user.avatar}`}
                rel="noopener noreferrer"
                className="text-blue-800"
                target="_blank"
              >
                View
              </Link>
            ) : (
              "Not set"
            )}
          </p>
        </div>
      )}

      <DetailsForm />
    </div>
  );
};

export default DetailsManager;
