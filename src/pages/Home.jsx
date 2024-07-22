import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import db from "../configs/firebase-config";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import MapComponent from "../components/map/Map";

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [nama, setNama] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [mapResults, setMapResults] = useState([]);
  const [isStudentSearch, setIsStudentSearch] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mahasiswa"));
        const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(fetchedData);
        setFilteredData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setNama(searchTerm);

    if (isStudentSearch) {
      const filteredMahasiswa = data.filter((mahasiswa) => mahasiswa.nama.toLowerCase().includes(searchTerm));
      setFilteredData(filteredMahasiswa);
      setSelectedStudent(null);
    } else {
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json?access_token=${import.meta.env.VITE_MAPBOX_API_TOKEN}`);
        const data = await response.json();

        setMapResults(data.features || []);
      } catch (error) {
        console.error("Error fetching geocoding data:", error);
        setMapResults([]);
      }
    }
  };

  const handleSelectResult = (result) => {
    setSelectedResult(result);
  };

  return (
    <>
      <div className="m-2">
        <MapComponent data={data} selectedStudent={selectedStudent} selectedResult={selectedResult} />
        <div className="flex gap-3 my-6 absolute z-100 top-16 left-10">
          <div>
            <input
              id="id-s03"
              type="search"
              name="id-s03"
              placeholder="Cari"
              aria-label="Search content"
              value={nama}
              onChange={handleSearch}
              className="peer h-10 w-80 rounded border border-slate-200 px-4 pr-12 text-sm text-slate-500 outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
            {/* <svg
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
            </svg> */}
          </div>
          <div className="">
            <div className="flex items-center">
              <button onClick={() => setIsStudentSearch(true)} className={`mr-2 ${isStudentSearch ? "bg-sky-500 text-white" : "bg-sky-100 text-black"} px-4 py-2 rounded`}>
                Mahasiswa
              </button>
              <button onClick={() => setIsStudentSearch(false)} className={`${!isStudentSearch ? "bg-sky-500 text-white" : "bg-sky-100 text-black"} px-4 py-2 rounded`}>
                Lokasi
              </button>
            </div>
          </div>

          {isStudentSearch && nama && (
            <Table className="w-80 text-left absolute z-100 top-11 " hideHeader color="primary">
              <TableHeader>
                <TableColumn>NAMA</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((mahasiswa) => (
                    <TableRow key={mahasiswa.id} onClick={() => setSelectedStudent(mahasiswa)}>
                      <TableCell className="hover:bg-sky-500 rounded-lg cursor-pointer">{mahasiswa.nama}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No results found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {!isStudentSearch && mapResults.length > 0 && (
            <div className="w-80 text-left absolute z-100 top-11 bg-white rounded-lg shadow-lg">
              <ul>
                {mapResults.map((result, index) => (
                  <li key={index} className="p-2 hover:bg-sky-500 rounded-lg cursor-pointer" onClick={() => handleSelectResult(result)}>
                    {result.place_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
