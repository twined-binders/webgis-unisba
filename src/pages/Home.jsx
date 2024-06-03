import Map from "../components/map/Map";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import db from "../configs/firebase-config";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

export default function Home() {
  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the "mahasiswa" collection
        const querySnapshot = await getDocs(collection(db, "mahasiswa"));
        const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const filteredMahasiswa = data?.filter((mahasiswa) => {
    return mahasiswa.nama.toLowerCase().includes(nama.toLowerCase());
  });

  return (
    <>
      <div className="px-4 relative">
        <Map data={data} />
        <div className="my-6 absolute z-100 top-0.5 left-10">
          <input
            id="id-s03"
            type="search"
            name="id-s03"
            placeholder="Cari Mahasiswa"
            aria-label="Search content"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="peer h-10 w-80 rounded border border-slate-200 px-4 pr-12 text-sm text-slate-500 outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 "
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

        {nama && (
          <Table className="w-80 text-left  absolute z-100 top-20 left-9" hideHeader selectionMode="single" defaultSelectedKeys={["0"]} color="primary">
            <TableHeader>
              <TableColumn>NAMA</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredMahasiswa?.length > 0 ? (
                // Render filtered data if available
                filteredMahasiswa.map((mahasiswa) => (
                  <TableRow key={mahasiswa.id}>
                    <TableCell>{mahasiswa.nama}</TableCell>
                  </TableRow>
                ))
              ) : (
                // Render empty result cell
                <TableRow>
                  <TableCell>No results found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
