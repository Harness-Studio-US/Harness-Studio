import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LoadingGate } from "./components/LoadingGate";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoadingGate>
        <App />
      </LoadingGate>
    </BrowserRouter>
  </React.StrictMode>
);
