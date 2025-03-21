import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { updateProfile } from "../redux/slices/ProfileSlice";
import { useDetailsContext } from "../context/DetailsContext";

const DetailsForm: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.profile);
  const { isModalOpen, toggleModal, openEditModal } = useDetailsContext();
  const detailsRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    bio: "",
    age: 0,
    gender: "",
    address: "",
    // avatar: "",
    avatar: null as File | null,
    birthDate: "",
    phone: "",
    location: "",
    portfolio: "",
  });

  useEffect(() => {
    formDataSetting();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        detailsRef.current &&
        !(detailsRef.current as any).contains(e.target)
      ) {
        toggleModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, toggleModal]);

  const formDataSetting = () => {
    if (user) {
      setFormData({
        email: user.email || "",
        name: user.name || "",
        bio: user.bio || "",
        age: user.age || 0,
        gender: user.gender || "",
        address: user.address || "",
        avatar: null,
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().split("T")[0]
          : "",
        phone: user.phone || "",
        location: user.location || "",
        portfolio: user.portfolio || "",
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, avatar: e.target.files[0] });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value ? Number(value) : 0) : value,
    }));
  };

  const handleSubmit = () => {
    // console.log(typeof formData.age)
    const formDataSubmit = new FormData();
    formDataSubmit.append("name", formData.name);
    formDataSubmit.append("bio", formData.bio);
    formDataSubmit.append("address", formData.address);
    formDataSubmit.append("email", formData.email);
    formDataSubmit.append("gender", formData.gender);
    formDataSubmit.append("age", formData.age.toString());
    formDataSubmit.append("location", formData.location);
    formDataSubmit.append("portfolio", formData.portfolio);
    if (formData.avatar) {
      formDataSubmit.append("avatar", formData.avatar);
    }
    if (formData.birthDate) {
      dispatch(updateProfile({ formData: formDataSubmit }));
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 ">
          <div
            ref={detailsRef}
            className="bg-white p-6 rounded-lg w-full max-w-2xl"
          >
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md "
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
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
                  value={formData.age || 0}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="other">other</option>
                </select>
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
                <label className="block text-sm font-medium">Avatar</label>
                <input
                  type="file"
                  accept="application/pdf, image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
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
