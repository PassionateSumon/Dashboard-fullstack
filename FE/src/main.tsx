import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.ts";
import { EduProvider } from "./context/EduContext.tsx";
import { UiProvider } from "./context/UiContext.tsx";
import { ExperienceProvider } from "./context/ExperienceContext.tsx";
import { HobbyProvider } from "./context/HobbyContext.tsx";
import { SkillProvider } from "./context/SkillContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <UiProvider>
      <SkillProvider>
        <ExperienceProvider>
          <EduProvider>
            <HobbyProvider>
              <App />
            </HobbyProvider>
          </EduProvider>
        </ExperienceProvider>
      </SkillProvider>
    </UiProvider>
  </Provider>
);
