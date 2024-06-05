import React, { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Logo } from "../brand/Logo";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../../configs/firebase-config";

export default function MainNavbar() {
  const location = useLocation();
  const handleClickHome = () => {
    window.history.pushState(null, "", "/");
    window.location.reload();
  };

  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userQuery = query(collection(db, "users"), where("email", "==", user.email));
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setRole(userData.role);
          } else {
            console.log("No user data found for the current user");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setRole(null);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <>
      <Navbar className="flex justify-center">
        <NavbarBrand onClick={handleClickHome} className="hidden sm:block grow-0">
          <div className="cursor-pointer flex flex-row justify-center items-center">
            <Logo />
            <p className="font-bold text-inherit">WebGis</p>
          </div>
        </NavbarBrand>
        <NavbarContent className="flex gap-4" justify="center">
          <NavbarItem isActive={location.pathname === "/"} className="sm:w-16 md:w-auto">
            <Link href="/" aria-current="page">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === "/dashboard"} className="sm:w-16 md:w-auto">
            <Link href="/dashboard">Dashboard</Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === "/mahasiswa"} className="sm:w-16 md:w-auto">
            <Link href="/mahasiswa">Mahasiswa</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="flex gap-4" justify="center">
          <NavbarItem>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button color="primary">{currentUser.email}</Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    {role === "admin" && (
                      <DropdownItem key="users">
                        <Link href="/users">Manage Users</Link>
                      </DropdownItem>
                    )}
                    <DropdownItem key="delete" className="text-danger" color="danger" onClick={handleLogout}>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}
