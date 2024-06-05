import React from "react";
import { collection, getDocs, doc, deleteDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import db from "../configs/firebase-config";
import MahasiswaForm from "../components/form/MahasiswaForm";
import TableComponent from "../components/table/Table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from "../components/icons/PlusIcon";

export default function Mahasiswa() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // mahasiswa ref dari collection mahasiswa
        const mahasiswaRef = collection(db, "mahasiswa");

        // query untuk order data
        const q = query(mahasiswaRef, orderBy("__name__", "desc"));

        // fetch dokumen/data
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // query untuk real-time update data ke data terbaru
    const q = query(collection(db, "mahasiswa"), orderBy("__name__", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(updatedData);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      const mahasiswaData = doc(db, "mahasiswa", id);
      await deleteDoc(mahasiswaData);
      toast.success("Data berhasil dihapus!");
    } catch (error) {
      toast.error("Gagal menghapus data!");
      console.error("Error deleting data:", error);
    }
  };

  const filteredMahasiswa = data?.filter((mahasiswa) => {
    const namaQuery = mahasiswa.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const desaQuery = mahasiswa.desa.toLowerCase().includes(searchQuery.toLowerCase());
    const kecamatanQuery = mahasiswa.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());
    const prodiQuery = mahasiswa.prodi.toLowerCase().includes(searchQuery.toLowerCase());
    const fakultasQuery = mahasiswa.fakultas.toLowerCase().includes(searchQuery.toLowerCase());

    return namaQuery || desaQuery || kecamatanQuery || prodiQuery || fakultasQuery;
  });

  return (
    <>
      <div className="top-content flex px-4 justify-between mb-4 mt-6 items-center">
        <div className="flex justify-between gap-4 items-center">
          <div className="relative flex-1 w-72">
            <input
              id="id-s03"
              type="search"
              name="id-s03"
              placeholder="Cari Mahasiswa"
              aria-label="Search content"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="peer relative h-10 w-full rounded border border-slate-200 px-4 pr-12 text-sm text-slate-500 outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-4 top-2.5 h-5 w-5 cursor-pointer stroke-slate-400 peer-disabled:cursor-not-allowed"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
              aria-label="Search icon"
              role="graphics-symbol"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div>
            <span title="Jumlah Mahasiswa" className="inline-flex items-center justify-center gap-1 rounded bg-sky-500 px-1.5 text-sm text-white">
              {filteredMahasiswa.length}
            </span>
          </div>
        </div>
        <div className="add">
          <Button endContent={<PlusIcon />} color="primary" onPress={onOpen}>
            Add New
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-col px-4 gap-5">
        <div className="table-container grow">
          <TableComponent data={filteredMahasiswa} handleDelete={handleDelete} />
        </div>
      </div>
      <MahasiswaForm isOpen={isOpen} onClose={onClose} />
    </>
  );
}
