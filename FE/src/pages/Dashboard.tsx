import { FC } from "react";
import EducationManager from "./EducationManager";
import { DashboardTab, useUiContext } from "../context/UiContext";
import DetailsManager from "./DetailsManager";
import SkillsManager from "./SkillsManager";
import ExperiencesManager from "./ExperiencesManager";
import HobbyManager from "./HobbyManager";

const tabs: DashboardTab[] = [
  "details",
  "education",
  "experience",
  "skill",
  "hobby",
];
const Dashboard: FC = () => {
  const { activeTab, setActiveTab } = useUiContext();

  const currentIndex = tabs.indexOf(activeTab);

  const handleNext = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return <DetailsManager />;
      case "education":
        return <EducationManager />;
      case "skill":
        return <SkillsManager />;
      case "experience":
        return <ExperiencesManager />;
      case "hobby":
        return <HobbyManager />;
      default:
        return <div>Overview Tab (Summary of all sections)</div>;
    }
  };

  return (
    <div className="dashboard-container bg-white text-gray-800 p-6 border border-gray-300 rounded-lg h-screen">
      {/* Main Layout */}
      <div className="grid grid-cols-4 gap-4 h-full">
        {/* Left Sidebar (Profile) */}
        <div className="col-span-1 border border-gray-300 p-4 rounded-md bg-gray-100">
          <h2 className="text-2xl font-semibold mb-2 text-center">Profile</h2>
          <hr className="border-gray-400" />
          <div className="mt-4">Profile details go here...</div>
        </div>

        {/* Right Section (Tabs + Content) */}
        <div className="col-span-3 flex flex-col">
          {/* Tab Navigation */}
          <div className="grid grid-cols-5 gap-2 mb-4 border border-gray-300 p-2 rounded-md bg-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`py-2 text-center rounded-md font-medium cursor-pointer ${
                  activeTab === tab
                    ? "border-b-2 border-orange-500 text-orange-600"
                    : "text-gray-600 hover:text-orange-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-grow border border-gray-300 p-4 rounded-md bg-gray-50">
            {renderTabContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <button
              className={`px-6 py-2 rounded-md text-white font-medium cursor-pointer ${
                currentIndex === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              Prev
            </button>
            <button
              className={`px-6 py-2 rounded-md text-white font-medium cursor-pointer ${
                currentIndex === tabs.length - 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={handleNext}
              disabled={currentIndex === tabs.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
