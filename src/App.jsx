import React from "react";
import MainNavbar from "./components/navbar/MainNavbar";
import { Outlet, Routes, Route } from "react-router-dom"; // Import Outlet, Routes, dan Route dari react-router-dom
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";

function App() {
  const originalWarn = console.warn;

  console.warn = (...args) => {
    const [firstArg] = args;
    if (typeof firstArg === "string" && firstArg.includes("An aria-label or aria-labelledby prop is required for accessibility.")) {
      return;
    }

    originalWarn(...args);
  };
  return (
    <>
      <div className="">
        <ToastContainer />

        <MainNavbar />

        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
        <Outlet />
      </div>
    </>
  );
}

export default App;
