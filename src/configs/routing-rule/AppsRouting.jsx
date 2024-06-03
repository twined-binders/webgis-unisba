import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../../App";
import ErrorPage from "../../pages/errorPage";
import About from "../../pages/About";
import Dashboard from "../../pages/Dashboard";
import SignInPage from "../../pages/SignInPage";
import UsersTable from "../../../src/components/table/UsersTable";
import WaitApprovalPage from "../../pages/WaitApproval";
import ApprovedRoute from "./ApprovedRoute";
import AdminRoute from "./AdminRoute";
import AccessDenied from "../../pages/accessDenied";
import SignInRule from "./SignInRule";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SignInRule>
            <App />
          </SignInRule>
        }
        errorElement={<ErrorPage />}
      >
        <Route
          path="dashboard"
          element={
            <ApprovedRoute>
              <Dashboard />
            </ApprovedRoute>
          }
        />
        <Route
          path="about"
          element={
            <ApprovedRoute>
              <About />
            </ApprovedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <UsersTable />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="/login" element={<SignInPage />} />

      <Route
        path="/wait-approval"
        element={
          <SignInRule>
            <WaitApprovalPage />
          </SignInRule>
        }
      />
      <Route path="/akses-ditolak" element={<AccessDenied />} />
    </Routes>
  );
};

export default AppRoutes;
