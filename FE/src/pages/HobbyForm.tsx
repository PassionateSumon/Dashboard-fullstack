import { useState, useEffect, FormEvent, ChangeEvent, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { useHobbyContext } from "../context/HobbyContext";
import { createHobby, updateHob } from "../redux/slices/HobbySlice";

const HobbyForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isModalOpen,
    toggleModal,
    isEditing,
    selectedHobby,
    setSelectedHobby,
    setIsEditing,
  } = useHobbyContext();
  const hobbyRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (isEditing && selectedHobby) {
      setFormData({
        name: selectedHobby.name || "",
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [isEditing, selectedHobby]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (hobbyRef.current && !(hobbyRef.current as any).contains(e.target)) {
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedHobby) {
      dispatch(updateHob({ id: selectedHobby.id, name: formData.name }));
    } else {
      dispatch(
        createHobby({
          name: formData.name,
        })
      );
    }

    toggleModal();
    setSelectedHobby(null);
    setIsEditing(false);
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
        <div ref={hobbyRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">
            {isEditing ? "Edit Hobby" : "Add Hobby"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer "
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer "
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default HobbyForm;
