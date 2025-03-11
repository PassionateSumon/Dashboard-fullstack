import { createContext, useContext, useState } from "react";
import { Experience } from "../redux/slices/ExpSlice";

interface ExperienceContextType {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedExp: Experience | null;
  setSelectedExp: (exp: Experience | null) => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
  toggleModal: () => void;
  openEditModal: (exp: Experience) => void;
}

const defaultExperienceValue = {
  isModalOpen: false,
  setIsModalOpen: () => {},
  selectedExp: null,
  setSelectedExp: () => {},
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
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (isModalOpen) {
      setSelectedExp(null);
      setIsEditing(false);
    }
  };

  const openEditModal = (exp: Experience) => {
    setSelectedExp(exp);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <ExperienceContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        selectedExp,
        setSelectedExp,
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
