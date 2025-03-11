import { createContext, useContext, useState } from "react";
import { Hobby } from "../redux/slices/HobbySlice";

interface HobbyContextType {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedHobby: Hobby | null;
  setSelectedHobby: (hobby: Hobby | null) => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
  toggleModal: () => void;
  openEditModal: (hobby: Hobby) => void;
}

const defaultHobbyValue = {
  isModalOpen: false,
  setIsModalOpen: () => {},
  selectedHobby: null,
  setSelectedHobby: () => {},
  isEditing: false,
  setIsEditing: () => {},
  toggleModal: () => {},
  openEditModal: () => {},
};

const HobbyContext = createContext<HobbyContextType>(defaultHobbyValue);

export const HobbyProvider = ({ children }: any) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (isModalOpen) {
      setSelectedHobby(null);
      setIsEditing(false);
    }
  };

  const openEditModal = (hobby: Hobby) => {
    setSelectedHobby(hobby);
    setIsEditing(true);
    setIsModalOpen(true);
  };
  return (
    <HobbyContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        selectedHobby,
        setSelectedHobby,
        isEditing,
        setIsEditing,
        toggleModal,
        openEditModal,
      }}
    >
      {children}
    </HobbyContext.Provider>
  );
};

export const useHobbyContext = () => {
  const ctx = useContext(HobbyContext);
  if (!ctx) {
    throw new Error("Error at useExperienceContext!!");
  }
  return ctx;
};
