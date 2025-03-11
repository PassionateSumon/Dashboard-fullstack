import { createContext, useContext, useState } from "react";
import { Experience } from "../redux/slices/ExpSlice";

interface ExperienceContextType {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedEdu: Experience | null;
  setSelectedEdu: (edu: Experience | null) => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
  toggleModal: () => void;
  openEditModal: (edu: Experience) => void;
}

const defaultExperienceValue = {
  isModalOpen: false,
  setIsModalOpen: () => {},
  selectedEdu: null,
  setSelectedEdu: () => {},
  isEditing: false,
  setIsEditing: () => {},
  toggleModal: () => {},
  openEditModal: () => {},
};

const ExperienceContext = createContext<ExperienceContextType>(
  defaultExperienceValue
);

export const ExperienceProvider = ({ children }: any) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEdu, setSelectedEdu] = useState<Experience | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (isModalOpen) {
      setSelectedEdu(null);
      setIsEditing(false);
    }
  };

  const openEditModal = (exp: Experience) => {
    setSelectedEdu(exp);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <ExperienceContext.Provider
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
    </ExperienceContext.Provider>
  );
};

export const useExperienceContext = () => {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error("Error at useExperienceContext!!");
  }
  return ctx;
};
