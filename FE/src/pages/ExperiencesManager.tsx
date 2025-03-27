import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { useExperienceContext } from "../context/ExperienceContext";
import {
  deleteSingleExperience,
  getAllExperiences,
} from "../redux/slices/ExpSlice";
import ExperienceForm from "./ExperienceForm";

const ExperiencesManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    experiences = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.experience);

  const { toggleModal, openEditModal } = useExperienceContext();

  useEffect(() => {
    dispatch(getAllExperiences());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Experience Manager</h2>

      <button
        onClick={toggleModal}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
      >
        Add New Experience
      </button>

      {error && <p className="text-red-500">Error: {error}</p>}

      {Array.isArray(experiences) && experiences.length > 0 ? (
        <ul className="space-y-4 p-4 max-h-96 overflow-y-auto rounded-lg">
          {experiences.map((exp) => (
            <li
              key={exp.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{exp.company || "N/A"}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(exp.startDate).toISOString().split("T")[0] || "N/A"}{" "}
                  -{" "}
                  {exp.endDate
                    ? new Date(exp.endDate).toISOString().split("T")[0]
                    : "Present"}
                </p>
                <p className="text-sm text-gray-500">
                  Role: {exp.role || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Description: {exp.description || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Certificate:{" "}
                  {exp.certificate ? (
                    <a
                      href={exp.certificate}
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
                  onClick={() => openEditModal(exp)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded cursor-pointer "
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteSingleExperience(exp.id))}
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

      <ExperienceForm />
    </div>
  );
};

export default ExperiencesManager;
