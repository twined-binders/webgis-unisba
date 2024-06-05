import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ErrorPage from "../../pages/errorPage";
import Mahasiswa from "../../pages/Mahasiswa";
import Dashboard from "../../pages/Dashboard";
import SignInPage from "../../pages/SignInPage";
import UsersTable from "../../../src/components/table/UsersTable";
import WaitApprovalPage from "../../pages/WaitApproval";
import ApprovedRoute from "./ApprovedRoute";
import AdminRoute from "./AdminRoute";
import AccessDenied from "../../pages/accessDenied";
import SignInRule from "./SignInRule";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SignInRule>
        <App />
      </SignInRule>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: (
          <ApprovedRoute>
            <Dashboard />
          </ApprovedRoute>
        ),
      },
      {
        path: "mahasiswa",
        element: (
          <ApprovedRoute>
            <Mahasiswa />
          </ApprovedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <AdminRoute>
            <UsersTable />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <SignInPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/wait-approval",
    element: (
      <SignInRule>
        <WaitApprovalPage />
      </SignInRule>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/akses-ditolak",
    element: <AccessDenied />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
