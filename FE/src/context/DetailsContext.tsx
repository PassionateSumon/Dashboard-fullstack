import { createContext, useContext, useState } from "react";

export interface User {
  email: string;
  name?: string;
  bio?: string;
  age?: number;
  gender?: string;
  address?: string;
  avatar?: string;
  birthDate?: string;
  phone?: string;
  location?: string;
  portfolio?: string;
}

interface DetailsContextType {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
  toggleModal: () => void;
  openEditModal: () => void;
}

const defaultDetailsContextValues: DetailsContextType = {
  isModalOpen: false,
  setIsModalOpen: () => {},
  isEditing: false,
  setIsEditing: () => {},
  toggleModal: () => {},
  openEditModal: () => {},
};

const DetailsContext = createContext<DetailsContextType>(defaultDetailsContextValues);


export const DetailsProvider = ({ children }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (isModalOpen) {
      setIsEditing(false);
    }
  };

  const openEditModal = () => {
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <DetailsContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        isEditing,
        setIsEditing,
        toggleModal,
        openEditModal,
      }}
    >
      {children}
    </DetailsContext.Provider>
  );
};

export const useDetailsContext = () => {
  const ctx = useContext(DetailsContext);
  if (!ctx) {
    throw new Error("useDetailsContext must be used within a DetailsProvider");
  }
  return ctx;
};