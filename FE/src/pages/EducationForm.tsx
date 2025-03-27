import { useState, useEffect, FormEvent, ChangeEvent, useRef } from "react";
import { useDispatch } from "react-redux";
import { createEducation, updateEdu } from "../redux/slices/EduSlice";
import { useEduContext } from "../context/EduContext";
import { AppDispatch } from "../redux/store/store";

const EducationForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isModalOpen,
    toggleModal,
    isEditing,
    selectedEdu,
    setSelectedEdu,
    setIsEditing,
  } = useEduContext();
  const eduref = useRef(null);
  const [formData, setFormData] = useState({
    institute: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endTime: "",
    certificate: null as File | null,
  });

  useEffect(() => {
    if (isEditing && selectedEdu) {
      setFormData({
        institute: selectedEdu.institute || "",
        degree: selectedEdu.degree || "",
        fieldOfStudy: selectedEdu.fieldOfStudy || "",
        startDate: selectedEdu.startDate
          ? new Date(selectedEdu.startDate).toISOString().split("T")[0]
          : "",
        endTime: selectedEdu.endTime
          ? new Date(selectedEdu.endTime).toISOString().split("T")[0]
          : "",
        certificate: null,
      });
    } else {
      setFormData({
        institute: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endTime: "",
        certificate: null,
      });
    }
  }, [isEditing, selectedEdu]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (eduref.current && !(eduref.current as any).contains(e.target)) {
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
    formDataToSubmit.append("institute", formData.institute);
    formDataToSubmit.append("startDate", formData.startDate);

    if (isEditing && selectedEdu) {
      // Append additional fields when updating
      formDataToSubmit.append("degree", formData.degree);
      formDataToSubmit.append("fieldOfStudy", formData.fieldOfStudy);
      formDataToSubmit.append("endTime", formData.endTime);
      if (formData.certificate) {
        formDataToSubmit.append("certificate", formData.certificate);
      }
      dispatch(updateEdu({ id: selectedEdu.id, formData: formDataToSubmit }));
    } else {
      dispatch(
        createEducation({
          institute: formData.institute,
          startDate: formData.startDate,
        })
      );
    }

    setFormData({
      institute: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endTime: "",
      certificate: null,
    });
    toggleModal();
    setSelectedEdu(null);
    setIsEditing(false);
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
        <div ref={eduref} className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">
            {isEditing ? "Edit Education" : "Add Education"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Institute (Always Visible) */}
            <div>
              <label className="block font-semibold">Institute</label>
              <input
                type="text"
                name="institute"
                value={formData.institute}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Start Date (Always Visible) */}
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

            {/* Additional Fields (Only for Update) */}
            {isEditing && (
              <>
                <div>
                  <label className="block font-semibold">Degree</label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Degree</option>
                    <option value="X">X</option>
                    <option value="XII">XII</option>
                    <option value="BACHELOR">Bachelor</option>
                    <option value="MASTER">Master</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold">Field of Study</label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold">End Time</label>
                  <input
                    type="date"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                {/* Certificate Upload (Only for Update) */}
                <div>
                  <label className="block font-semibold">Certificate</label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}

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

export default EducationForm;
