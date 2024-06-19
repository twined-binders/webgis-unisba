import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase-config";
import db from "../firebase-config";
import { Spinner } from "@nextui-org/react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const SignInRule = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      setCurrentUser(user);

      if (user) {
        const userRef = query(collection(db, "users"), where("email", "==", user.email));
        const snapshot = await getDocs(userRef);

        if (!snapshot.empty) {
          setIsEmailVerified(true);
        } else {
          setIsEmailVerified(false);
        }
      } else {
        setIsEmailVerified(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner label="Loading" />
      </div>
    );
  }

  if (!currentUser || !isEmailVerified) {
    toast("harap login dengan data yang valid");
    return <Navigate to="/login" />;
  }

  return children;
};

export default SignInRule;
