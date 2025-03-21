import { useState, useEffect, FormEvent, ChangeEvent, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { useSkillContext } from "../context/SkillContext";
import { createSkill, updateOneSkill } from "../redux/slices/SkillSlice";

const SkillForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isModalOpen,
    toggleModal,
    isEditing,
    selectedSkill,
    setSelectedSkill,
    setIsEditing,
  } = useSkillContext();
  const skillRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    certificate: null as File | null,
  });

  useEffect(() => {
    if (isEditing && selectedSkill) {
      setFormData({
        name: selectedSkill.name || "",
        level: selectedSkill.level || "",
        certificate: null,
      });
    } else {
      setFormData({
        name: "",
        level: "",
        certificate: null,
      });
    }
  }, [isEditing, selectedSkill]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (skillRef.current && !(skillRef.current as any).contains(e.target)) {
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, certificate: e.target.files[0] });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("level", formData.level);
    if (formData.certificate) {
      formDataToSubmit.append("certificate", formData.certificate);
    }
    if (isEditing && selectedSkill) {
      dispatch(
        updateOneSkill({ id: selectedSkill.id, formData: formDataToSubmit })
      );
    } else {
      dispatch(
        createSkill({
          formData: formDataToSubmit,
        })
      );
    }

    toggleModal();
    setSelectedSkill(null);
    setIsEditing(false);
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
        <div ref={skillRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">
            {isEditing ? "Edit Skill" : "Add Skill"}
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
            <div>
              <label className="block font-semibold">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Level</option>
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Certificate</label>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded cursor-pointer"
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

export default SkillForm;
