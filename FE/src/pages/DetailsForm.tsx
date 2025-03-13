import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { updateProfile } from "../redux/slices/ProfileSlice";
import { User } from "../redux/slices/ProfileSlice";
import { useDetailsContext } from "../context/DetailsContext";

const DetailsForm: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.profile);
  const { isModalOpen, toggleModal, openEditModal } = useDetailsContext();

  const [formData, setFormData] = useState<User>({
    email: "",
    name: "",
    bio: "",
    age: undefined,
    gender: "",
    address: "",
    avatar: "",
    birthDate: "",
    phone: "",
    location: "",
    portfolio: "",
  });

  useEffect(() => {
    formDataSetting();
  }, [user]);

  const formDataSetting = () => {
    if (user) {
      setFormData({
        email: user.email || "",
        name: user.name || "",
        bio: user.bio || "",
        age: user.age || undefined,
        gender: user.gender || "",
        address: user.address || "",
        avatar: user.avatar || "",
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        phone: user.phone || "",
        location: user.location || "",
        portfolio: user.portfolio || "",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = () => {
    if (formData.birthDate) {
      dispatch(updateProfile({ formData }));
      toggleModal();
    } else {
      alert("Please select a birth date.");
    }
  };

  const handleCancel = () => {
    formDataSetting();
    toggleModal();
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={openEditModal}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition"
      >
        Edit Profile
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Avatar URL</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Birth Date <span className="text-red-700">*</span>{" "}
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Portfolio</label>
                <input
                  type="text"
                  name="portfolio"
                  value={formData.portfolio || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-md hover:bg-green-700 transition"
              >
                {loading ? "Updating..." : "Update"}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 cursor-pointer text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsForm;
