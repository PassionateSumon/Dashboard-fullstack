import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.ts";
import { EduProvider } from "./context/EduContext.tsx";
import { UiProvider } from "./context/UiContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <UiProvider>
      <EduProvider>
        <App />
      </EduProvider>
    </UiProvider>
  </Provider>
);
