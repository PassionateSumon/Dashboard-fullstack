import { createContext, useContext, useState } from "react";
import { Education } from "../redux/slices/EduSlice";

interface EduContextType {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedEdu: Education | null;
  setSelectedEdu: (edu: Education | null) => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
  toggleModal: () => void;
  openEditModal: (edu: Education) => void;
}

const defaultEduContextValues: EduContextType = {
  isModalOpen: false,
  setIsModalOpen: () => {},
  selectedEdu: null,
  setSelectedEdu: () => {},
  isEditing: false,
  setIsEditing: () => {},
  toggleModal: () => {},
  openEditModal: () => {},
};

const EduContext = createContext<EduContextType>(defaultEduContextValues);

export const EduProvider = ({ children }: any) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (isModalOpen) {
      setSelectedEdu(null);
      setIsEditing(false);
    }
  };

  const openEditModal = (edu: Education) => {
    setSelectedEdu(edu);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <EduContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        selectedEdu,
        setSelectedEdu,
        isEditing,
        setIsEditing,
        toggleModal,
        openEditModal,
      }}
    >
      {children}
    </EduContext.Provider>
  );
};

export const useEduContext = () => {
  const ctx = useContext(EduContext);
  if (!ctx) {
    throw new Error("Error in useEduContext1");
  }
  return ctx;
};
