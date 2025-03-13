import { Link } from "react-router-dom";

const Land = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-center text-white w-80">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Profile Dashboard
        </h1>
        <p className="text-sm mb-6">
          Join today and maintain your profile and all details✅
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Land;
