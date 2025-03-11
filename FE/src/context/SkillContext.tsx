import { createContext, useContext, useState } from "react";
import { Skill } from "../redux/slices/SkillSlice";

interface SkillContextType {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedSkill: Skill | null;
  setSelectedSkill: (skill: Skill | null) => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
  toggleModal: () => void;
  openEditModal: (skill: Skill) => void;
}

const defaultSkillValue = {
  isModalOpen: false,
  setIsModalOpen: () => {},
  selectedSkill: null,
  setSelectedSkill: () => {},
  isEditing: false,
  setIsEditing: () => {},
  toggleModal: () => {},
  openEditModal: () => {},
};

const SkillContext = createContext<SkillContextType>(defaultSkillValue);

export const SkillProvider = ({ children }: any) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (isModalOpen) {
      setSelectedSkill(null);
      setIsEditing(false);
    }
  };

  const openEditModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsEditing(true);
    setIsModalOpen(true);
  };
  return (
    <SkillContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        selectedSkill,
        setSelectedSkill,
        isEditing,
        setIsEditing,
        toggleModal,
        openEditModal,
      }}
    >
      {children}
    </SkillContext.Provider>
  );
};

export const useSkillContext = () => {
  const ctx = useContext(SkillContext);
  if (!ctx) {
    throw new Error("Error at useExperienceContext!!");
  }
  return ctx;
};
