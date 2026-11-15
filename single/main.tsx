import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "../src/App";
import { LoadingGate } from "../src/components/LoadingGate";
import { SettingsProvider } from "../src/lib/settings";
import "../src/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <SettingsProvider>
        <LoadingGate>
          <App />
        </LoadingGate>
      </SettingsProvider>
    </HashRouter>
  </React.StrictMode>
);
