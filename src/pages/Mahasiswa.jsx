import React from "react";
import { collection, getDocs, doc, deleteDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import db from "../configs/firebase-config";
import MahasiswaForm from "../components/form/MahasiswaForm";
import TableComponent from "../components/table/Table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from "../components/icons/PlusIcon";
import * as XLSX from "xlsx";
import { writeBatch } from "firebase/firestore";

export default function Mahasiswa() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState([]);
  const [showSubmit, setShowSubmit] = useState(false);
  const [fileName, setFileName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSorfField] = useState("nama");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // mahasiswa ref dari collection mahasiswa
        const mahasiswaRef = collection(db, "mahasiswa");

        // query untuk order data
        const q = query(mahasiswaRef);

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
    const q = query(collection(db, "mahasiswa"), orderBy(sortField, sortDirection));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(updatedData);
    });

    return () => unsubscribe();
  }, [sortField, sortDirection]);

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (confirmation) {
      try {
        const mahasiswaData = doc(db, "mahasiswa", id);
        await deleteDoc(mahasiswaData);
        toast.success("Data berhasil dihapus!");
      } catch (error) {
        toast.error("Gagal menghapus data!");
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredMahasiswa = data?.filter((mahasiswa) => {
    const namaQuery = mahasiswa.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const desaQuery = mahasiswa.desa?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const kecamatanQuery = mahasiswa.kecamatan?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const prodiQuery = mahasiswa.prodi?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    // const fakultasQuery = mahasiswa.fakultas?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    // setCurrentPage(1);
    return namaQuery || desaQuery || kecamatanQuery || prodiQuery;
  });

  const onRowsPerPageChange = React.useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const sortFieldChange = React.useCallback((e) => {
    setSorfField(e.target.value);
  }, []);

  const sortDirectionChange = React.useCallback((e) => {
    setSortDirection(e.target.value);
  }, []);
  console.log(sortField);

  //Untuk input data dari file excell
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setShowSubmit(true);

      const reader = new FileReader();

      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setInput(jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const performBatchWrite = async () => {
    const batch = writeBatch(db);
    const collectionRef = collection(db, "mahasiswa");

    input.forEach((item) => {
      const docRef = doc(collectionRef);
      const dataWithTimestamp = {
        ...item,
        createdTime: serverTimestamp(), // Add the current timestamp
      };
      batch.set(docRef, dataWithTimestamp);
    });

    try {
      await batch.commit();
      console.log("Batch write successful!");
      toast.success("Berhasil menambah data!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setFileName("");
      setShowSubmit(false);
    } catch (error) {
      console.error("Error performing batch write: ", error);
    }
  };

  return (
    <>
      <div className="top-content flex px-4 justify-between mb-1 mt-6 items-center">
        <div className="flex justify-between gap-4 items-center">
          <div className="relative flex-1 w-72">
            <input
              id="id-s03"
              type="search"
              name="id-s03"
              placeholder="Cari Mahasiswa"
              aria-label="Search content"
              value={searchQuery}
              onChange={handleSearchChange}
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
          <div className="flex gap-2">
            <div className="relative my-6 md:w-44">
              <select
                id="sortfield"
                name="sortfield"
                required
                value={sortField}
                onChange={sortFieldChange}
                className="peer relative h-10 w-full appearance-none rounded border border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition-all autofill:bg-white focus:border-sky-500 focus-visible:outline-none focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="" disabled></option>
                <option value="nama">Nama</option>
                <option value="nim">Nim</option>
                <option value="createdTime">Waktu ditambahkan</option>
              </select>
              <label
                htmlFor="sortfield"
                className="pointer-events-none absolute top-2.5 left-2 z-[1] px-2 text-sm text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
              >
                Urutkan berdasarkan
              </label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute top-2.5 right-2 h-5 w-5 fill-slate-400 transition-all peer-focus:fill-sky-500 peer-disabled:cursor-not-allowed"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-labelledby="title-04 description-04"
                role="graphics-symbol"
              >
                <title id="title-04">Arrow Icon</title>
                <desc id="description-04">Arrow icon of the select list.</desc>
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="relative my-6 md:w-28">
              <select
                id="sortdirection"
                name="sortdirection"
                required
                value={sortDirection}
                onChange={sortDirectionChange}
                className="peer relative h-10 w-full appearance-none rounded border border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition-all autofill:bg-white focus:border-sky-500 focus-visible:outline-none focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="" disabled></option>
                <option value="asc">Naik</option>
                <option value="desc">Menurun</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute top-2.5 right-2 h-5 w-5 fill-slate-400 transition-all peer-focus:fill-sky-500 peer-disabled:cursor-not-allowed"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-labelledby="title-04 description-04"
                role="graphics-symbol"
              >
                <title id="title-04">Arrow Icon</title>
                <desc id="description-04">Arrow icon of the select list.</desc>
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative my-6 md:w-36">
            <select
              id="itemsperpage"
              name="itemsperpage"
              required
              value={itemsPerPage}
              onChange={onRowsPerPageChange}
              className="peer relative h-10 w-full appearance-none rounded border border-slate-200 bg-white px-4 text-sm text-slate-500 outline-none transition-all autofill:bg-white focus:border-sky-500 focus-visible:outline-none focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="" disabled></option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
            <label
              htmlFor="itemsperpage"
              className="pointer-events-none absolute top-2.5 left-2 z-[1] px-2 text-sm text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Data perhalaman
            </label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute top-2.5 right-2 h-5 w-5 fill-slate-400 transition-all peer-focus:fill-sky-500 peer-disabled:cursor-not-allowed"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-labelledby="title-04 description-04"
              role="graphics-symbol"
            >
              <title id="title-04">Arrow Icon</title>
              <desc id="description-04">Arrow icon of the select list.</desc>
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="add">
            <Button endContent={<PlusIcon />} color="primary" onPress={onOpen}>
              Tambah
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col px-4 gap-5">
        <div className="table-container grow">
          <TableComponent data={filteredMahasiswa} handleDelete={handleDelete} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} />
        </div>
      </div>
      <MahasiswaForm isOpen={isOpen} onClose={onClose} />

      <div className="relative px-4">
        <input id="id-dropzone01" name="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
        <label htmlFor="id-dropzone01" className="relative flex cursor-pointer flex-col items-center gap-4 rounded border border-dashed border-slate-300 px-3 py-6 text-center text-sm font-medium transition-colors">
          <span className="inline-flex h-12 items-center justify-center self-center rounded-full bg-slate-100/70 px-3 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" aria-label="File input icon" role="graphics-symbol" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
          </span>
          <span className="text-slate-500">
            Tarik dan lepas
            <span className="text-emerald-500"> atau upload sebuah file</span>
          </span>
        </label>
        {fileName && <div className="mt-4 text-center text-slate-500">Selected file: {fileName}</div>}
        {showSubmit && (
          <div className="mt-4 text-center">
            <Button onClick={performBatchWrite} color="primary">
              Tambah
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
