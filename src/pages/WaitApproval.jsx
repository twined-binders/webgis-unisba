import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../configs/firebase-config";
import { auth } from "../configs/firebase-config";
import { Card, CardHeader, CardBody, Image, Spinner, CardFooter } from "@nextui-org/react";

const WaitApprovalPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the currently logged-in user
        const currentUser = auth.currentUser;

        if (currentUser) {
          // If user is logged in, fetch user data
          const userQuery = query(
            collection(db, "users"),
            where("email", "==", currentUser.email) // Filter documents by user's email
          );
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            // If documents are found, set user data
            const userData = querySnapshot.docs[0].data();
            setUserData(userData);
          } else {
            console.log(currentUser);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Dependency array is empty, so this effect runs only once on component mount

  if (!userData) {
    return <Spinner />;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="py-4 ">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny font-bold">{userData.email}</p>
          <small className="text-default-500">{userData.role}</small>
          <h4 className="font-bold text-large">{userData.approved ? <p className="text-emerald-500">Approved</p> : <p className="text-red-500">Not Approved</p>}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image alt="Card background" className="object-cover rounded-xl " src="https://nextui.org/images/hero-card-complete.jpeg" width={270} />
        </CardBody>
        <CardFooter>{userData.approved ? <small>Akun Anda telah disetujui oleh Admin</small> : <small>Akun Anda sedang menunggu persetujuan Admin</small>}</CardFooter>
      </Card>
    </div>
  );
};

export default WaitApprovalPage;
