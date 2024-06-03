import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import db from "../../configs/firebase-config";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Switch, Select, SelectItem } from "@nextui-org/react";

export default function UsersTable() {
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

  return (
    <>
      <div className="px-4">
        <Table>
          <TableHeader>
            <TableColumn>No</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn className="min-w-40">Role</TableColumn>
            <TableColumn className="min-w-48 pl-11">Status</TableColumn>
            <TableColumn>Persetujuan</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <select
                    aria-label="Pilih Role"
                    id="role"
                    name="role"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    required
                    className="relative w-2/4 h-10 px-4 text-sm transition-all bg-white border rounded outline-none appearance-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white focus:border-sky-500 focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="admin" disabled>
                      Admin
                    </option>
                    <option value="user">User</option>
                    <option value="operator">Operator</option>
                  </select>
                </TableCell>
                <TableCell>
                  {user.approved ? (
                    <div className="w-1/3 text-center px-4 py-3 text-sm border rounded border-emerald-100 bg-emerald-50 text-emerald-500" role="alert">
                      <p>Aprroved</p>
                    </div>
                  ) : (
                    <div className="w-2/4 text-center px-4 py-3 text-sm border rounded border-pink-100 bg-pink-50 text-pink-500" role="alert">
                      <p>Not Aprroved</p>
                    </div>
                  )}
                </TableCell>

                <TableCell className="px-6">
                  <Switch isSelected={user.approved} onChange={() => toggleApprovalStatus(user.id, user.approved)} color="primary" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
