import { useState, useEffect, FormEvent, ChangeEvent, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { useExperienceContext } from "../context/ExperienceContext";
import { createExperience, updateExp } from "../redux/slices/ExpSlice";

const ExperienceForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isModalOpen,
    toggleModal,
    isEditing,
    selectedExp,
    setSelectedExp,
    setIsEditing,
  } = useExperienceContext();
  const expRef = useRef(null);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
    certificate: null as File | null,
  });

  useEffect(() => {
    if (isEditing && selectedExp) {
      setFormData({
        company: selectedExp.company || "",
        role: selectedExp.role || "",
        startDate: selectedExp.startDate
          ? new Date(selectedExp.startDate).toISOString().split("T")[0]
          : "",
        endDate: selectedExp.endDate
          ? new Date(selectedExp.endDate).toISOString().split("T")[0]
          : "",
        description: selectedExp.description || "",
        certificate: null,
      });
    } else {
      setFormData({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
        certificate: null,
      });
    }
  }, [isEditing, selectedExp]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (expRef.current && !(expRef.current as any).contains(e.target)) {
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

  const setLast = () => {
    toggleModal();
    setSelectedExp(null);
    setIsEditing(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("company", formData.company);
    formDataToSubmit.append("role", formData.role);
    formDataToSubmit.append("startDate", formData.startDate);
    formDataToSubmit.append("endDate", formData.endDate);
    formDataToSubmit.append("description", formData.description);
    if (formData.certificate) {
      formDataToSubmit.append("certificate", formData.certificate);
    }
    if (isEditing && selectedExp) {
      dispatch(updateExp({ id: selectedExp.id, formData: formDataToSubmit }));
      setLast();
    } else {
      if (formData.company && formData.role && formData.startDate) {
        dispatch(
          createExperience({
            formData: formDataToSubmit,
          })
        );
        setLast();
      } else {
        alert("You need to fill company, role and start date.");
      }
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
        <div ref={expRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">
            {isEditing ? "Edit Experience" : "Add Experience"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">Certificate</label>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
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

export default ExperienceForm;
