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
import { BrowserRouter as Router } from "react-router-dom";
import { DetailsProvider } from "./context/DetailsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <UiProvider>
        <DetailsProvider>
          <SkillProvider>
            <ExperienceProvider>
              <EduProvider>
                <HobbyProvider>
                  <App />
                </HobbyProvider>
              </EduProvider>
            </ExperienceProvider>
          </SkillProvider>
        </DetailsProvider>
      </UiProvider>
    </Router>
  </Provider>
);
