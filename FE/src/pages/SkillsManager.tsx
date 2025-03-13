import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSkillContext } from "../context/SkillContext";
import { AppDispatch, RootState } from "../redux/store/store";
import { deleteSingleSkill, getAllSkills } from "../redux/slices/SkillSlice";
import SkillForm from "./SkillForm";

const SkillsManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    skills = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.skill);

  const { toggleModal, openEditModal } = useSkillContext();

  useEffect(() => {
    dispatch(getAllSkills());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Skill Manager</h2>

      <button
        onClick={toggleModal}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
      >
        Add New Skill
      </button>

      {error && <p className="text-red-500">Error: {error}</p>}

      {Array.isArray(skills) && skills.length > 0 ? (
        <ul className="space-y-4 p-4 max-h-96 overflow-y-auto rounded-lg">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{skill.name || "N/A"}</h3>
                <p className="text-sm text-gray-500">
                  Degree: {skill.level || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Certificate:{" "}
                  {skill.certificate ? (
                    <a
                      href={skill.certificate}
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
                  onClick={() => openEditModal(skill)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded cursor-pointer "
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteSingleSkill(skill.id))}
                  className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer "
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="text-gray-500">No skills records found.</p>
      )}

      <SkillForm />
    </div>
  );
};

export default SkillsManager;
