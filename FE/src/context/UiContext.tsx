import { createContext, useContext, useState } from "react";

type DashboardTab = "details" | "education" | "skill" | "hobby" | "experience";

interface UiContextType {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  toggleModal: () => void;
}

const defaultUiValues: UiContextType = {
  activeTab: "details",
  setActiveTab: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  toggleModal: () => {},
};

const UiContext = createContext<UiContextType>(defaultUiValues);

export const UiProvider = ({ children }: any) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("details");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <UiContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isModalOpen,
        setIsModalOpen,
        toggleModal,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

export const useUiContext = () => {
  const ctx = useContext(UiContext);
  if (!ctx) {
    throw new Error("Error in UseUiContext!!");
  }
  return ctx;
};
