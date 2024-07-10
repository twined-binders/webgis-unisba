import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import db from "../firebase-config";
import { auth } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Spinner } from "@nextui-org/react";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
        try {
          const userQuery = query(collection(db, "users"), where("email", "==", user.email));
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setIsAdmin(userData.role === "admin");
          } else {
            console.log("Data user tidak ditemukan");
          }
        } catch (error) {
          console.error("Gagal mendapatkan data:", error);
        }
      }

      setLoading(false);
    };

    fetchUserRole();
  }, []);

  // useEffect(() => {
  //   console.log(loading);
  // }, [loading]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner label="Loading" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to={"/akses-ditolak"} />;
  }

  return children;
};

export default AdminRoute;
