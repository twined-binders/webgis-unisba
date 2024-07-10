import React from "react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import db from "../firebase-config";
import { auth } from "../firebase-config";
import { where, query, getDocs, collection } from "firebase/firestore";
import { Spinner } from "@nextui-org/react";

const ApprovedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      const user = auth.currentUser;

      if (user) {
        setCurrentUser(user);
        try {
          const userQuery = query(collection(db, "users"), where("email", "==", user.email));
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setApproved(userData.approved);
          } else {
            console.log("Data user tidak ditemukan");
          }
        } catch (error) {
          console.error("Gagal mendapatkan data:", error);
        }
      }

      setLoading(false);
    };

    fetchApprovalStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center ">
        <Spinner label="Loading" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!approved) {
    return <Navigate to="/wait-approval" />;
  }

  return children;
};

export default ApprovedRoute;
