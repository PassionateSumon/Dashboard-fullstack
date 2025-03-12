import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../redux/slices/AuthSlice";
import { AppDispatch } from "../redux/store/store";

interface AuthProps {
  from: string;
}

interface FormData {
  email: string;
  password: string;
}

const Auth: FC<AuthProps> = ({ from }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof FormData
  ) => {
    setFormData({
      ...formData,
      [key]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (from === "signup") {
      dispatch(signup({ email: formData.email, password: formData.password }));
      navigate("/signin");
    } else if (from === "login") {
      console.log(from);
      dispatch(login({ email: formData.email, password: formData.password }));
    }
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-amber-100 to-orange-200">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          {from === "signup" ? "Sign Up" : "Login"}
        </h2>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            onChange={(e) => handleChange(e, "email")}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={formData.password}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            onChange={(e) => handleChange(e, "password")}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700 transition text-white font-semibold py-3 rounded-lg shadow-md"
        >
          Submit
        </button>
        {from === "signup" ? (
          <p>
            Already signed up? Go to{" "}
            <Link className="text-blue-900 font-bold" to="/signin">
              Login
            </Link>{" "}
          </p>
        ) : (
          <p>
            Didn't signed up? Go to{" "}
            <Link className="text-blue-900 font-bold" to="/signup">
              Signup
            </Link>{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
