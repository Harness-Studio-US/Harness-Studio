import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "../src/App";
import { LoadingGate } from "../src/components/LoadingGate";
import "../src/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <LoadingGate>
        <App />
      </LoadingGate>
    </HashRouter>
  </React.StrictMode>
);
