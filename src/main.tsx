import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LoadingGate } from "./components/LoadingGate";
import { SettingsProvider } from "./lib/settings";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <LoadingGate>
          <App />
        </LoadingGate>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
