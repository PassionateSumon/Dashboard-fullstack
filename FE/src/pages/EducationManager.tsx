import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEducations,
  deleteSingleEducation,
} from "../redux/slices/EduSlice";
import { useEduContext } from "../context/EduContext";
import { AppDispatch, RootState } from "../redux/store/store";
import EducationForm from "./EducationForm";

const EducationManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    educations = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.education);

  const { toggleModal, openEditModal } = useEduContext();

  useEffect(() => {
    dispatch(getAllEducations());
  }, [dispatch]);

  console.log(educations[0])

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Education Manager</h2>

      <button
        onClick={toggleModal}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
      >
        Add New Education
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {Array.isArray(educations) && educations.length > 0 ? (
        <ul className="space-y-4 p-4 max-h-96 overflow-y-auto rounded-lg">
          {educations.map((edu) => (
            <li
              key={edu.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                {/* console.log(edu) */}
                <h3 className="font-semibold">{edu.institute || "N/A"}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(edu.startDate).toISOString().split("T")[0] || "N/A"}{" "}
                  -{" "}
                  {edu.endTime
                    ? new Date(edu.endTime).toISOString().split("T")[0]
                    : "Present"}
                </p>
                <p className="text-sm text-gray-500">
                  Degree: {edu.degree || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Field of Study: {edu.fieldOfStudy || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Certificate:{" "}
                  {edu.certificate ? (
                    <a
                      href={edu.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Certificate
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(edu)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded cursor-pointer "
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteSingleEducation(edu.id))}
                  className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer "
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="text-gray-500">No education records found.</p>
      )}

      <EducationForm />
    </div>
  );
};

export default EducationManager;
