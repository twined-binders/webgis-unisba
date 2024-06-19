import { useEffect, useState } from "react";
import db from "../configs/firebase-config";
import { getDocs, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import UsersTable from "../components/table/UsersTable";
import { toast } from "react-toastify";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const toggleApprovalStatus = async (userId, currentStatus) => {
    const userDocRef = doc(db, "users", userId);
    try {
      await updateDoc(userDocRef, {
        approved: !currentStatus,
      });
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, approved: !currentStatus } : user)));
    } catch (error) {
      console.error("Error updating approval status: ", error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const userDocRef = doc(db, "users", userId);
    try {
      await updateDoc(userDocRef, {
        role: newRole,
      });
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
    } catch (error) {
      console.error("Error updating role: ", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      toast.success("Berhasil Menghapus Pengguna");
    } catch (error) {
      toast.error("Gagal Menghapus Data", error);
    }
  };

  return (
    <>
      <UsersTable users={users} toggleApprovalStatus={toggleApprovalStatus} handleRoleChange={handleRoleChange} handleDelete={handleDelete} />
    </>
  );
}
