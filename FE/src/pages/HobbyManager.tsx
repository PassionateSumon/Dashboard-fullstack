import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import HobbyForm from "./HobbyForm";
import { useHobbyContext } from "../context/HobbyContext";
import { deleteSingleHobby, getAllHobbies } from "../redux/slices/HobbySlice";

const HobbyManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { hobbies = [], loading } = useSelector(
    (state: RootState) => state.hobby
  );

  const { toggleModal, openEditModal } = useHobbyContext();

  useEffect(() => {
    dispatch(getAllHobbies());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Hobby Manager</h2>

      <button
        onClick={toggleModal}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
      >
        Add New Hobby
      </button>

      {Array.isArray(hobbies) && hobbies.length > 0 ? (
        <ul className="space-y-4 p-4 max-h-96 overflow-y-auto rounded-lg">
          {hobbies.map((hob) => (
            <li
              key={hob.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{hob.name || "N/A"}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(hob)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded cursor-pointer "
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteSingleHobby(hob.id))}
                  className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer "
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="text-gray-500">No hobby records found.</p>
      )}

      <HobbyForm />
    </div>
  );
};

export default HobbyManager;
