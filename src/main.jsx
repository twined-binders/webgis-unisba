import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./configs/routing-rule/AppsRouting"; // Ensure this path is correct
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <Router>
        <AppRoutes />
      </Router>
    </NextUIProvider>
  </React.StrictMode>
);
