import React, { useEffect, useState, useRef } from "react";
import db from "../configs/firebase-config"; // Import your Firestore instance
import { getDocs, collection, getCountFromServer } from "firebase/firestore";
import { Calendar, Card, CardHeader, CardBody, Spinner, Button } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Wave } from "../components/icons/Wave";
import { UserIcon } from "../components/icons/UserIcon";
import { Link } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function Dashboard() {
  const [prodiCounts, setProdiCounts] = useState({});
  const [desaCounts, setDesaCounts] = useState({});
  const [kecamatanCounts, setKecamatanCounts] = useState({});
  const [kotaCounts, setKotaCounts] = useState({});
  const [provinsiCounts, setProvinsiCounts] = useState({});
  const [kelasCounts, setKelasCounts] = useState({});
  const [sortedProdiCounts, setSortedProdiCounts] = useState({});
  const [sortedDesaCounts, setSortedDesaCounts] = useState({});
  const [sortedKecamatanCounts, setSortedKecamatanCounts] = useState({});
  const [sortedKotaCounts, setSortedKotaCounts] = useState({});
  const [sortedProvinsiCounts, setSortedProvinsiCounts] = useState({});
  const [totalDocs, setTotalDocs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [activeButton, setActiveButton] = useState("");

  // Refs for chart instances
  const prodiChartRef = useRef(null);
  const desaChartRef = useRef(null);
  const kecamatanChartRef = useRef(null);
  const kotaChartRef = useRef(null);
  const provinsiChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the total number of documents
        const colRef = collection(db, "mahasiswa");
        const snapshot = await getCountFromServer(colRef);
        setTotalDocs(snapshot.data().count);

        // Fetch all documents
        const querySnapshot = await getDocs(colRef);
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const counts = (field) => {
          const fieldCounts = {};
          documents.forEach((doc) => {
            const value = doc[field];
            if (value) {
              fieldCounts[value] = (fieldCounts[value] || 0) + 1;
            }
          });
          return fieldCounts;
        };

        const kelasData = counts("kelas");
        setKelasCounts(kelasData);

        const prodiData = counts("prodi");
        setProdiCounts(prodiData);
        setSortedProdiCounts(prodiData); // Set initial sorted data

        const desaData = counts("desa");
        setDesaCounts(desaData);
        setSortedDesaCounts(desaData); // Set initial sorted data

        const kecamatanData = counts("kecamatan");
        setKecamatanCounts(kecamatanData);
        setSortedKecamatanCounts(kecamatanData); // Set initial sorted data

        const kotaData = counts("kota");
        setKotaCounts(kotaData);
        setSortedKotaCounts(kotaData); // Set initial sorted data

        const provinsiData = counts("provinsi");
        setProvinsiCounts(provinsiData);
        setSortedProvinsiCounts(provinsiData); // Set initial sorted data

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveButton("");
  };

  const sortByName = (counts) => {
    return Object.fromEntries(Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])));
  };

  const sortByCount = (counts) => {
    return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1]));
  };

  const handleSortByName = (setSortedCounts, counts) => {
    setSortedCounts(sortByName(counts));
    setActiveButton("nama");
  };

  const handleSortByCount = (setSortedCounts, counts) => {
    setSortedCounts(sortByCount(counts));
    setActiveButton("jumlah");
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.2)`;
  };

  const generateChartData = (counts) => {
    const backgroundColors = Object.keys(counts).map(() => generateRandomColor());
    const borderColors = backgroundColors.map((color) => color.replace("0.2", "1"));

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          barPercentage: 1,
          label: "Data",
          data: Object.values(counts),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    indexAxis: "y",
    aspectRatio: 1.8,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: false,
        },
      },
    },
  };

  useEffect(() => {
    // Cleanup function to destroy charts before unmounting
    return () => {
      if (prodiChartRef.current) prodiChartRef.current.destroy();
      if (desaChartRef.current) desaChartRef.current.destroy();
      if (kecamatanChartRef.current) kecamatanChartRef.current.destroy();
      if (kotaChartRef.current) kotaChartRef.current.destroy();
      if (provinsiChartRef.current) provinsiChartRef.current.destroy();
    };
  }, []);

  const SortingButtons = ({ setSortedCounts, counts }) => (
    <div className="inline-flex overflow-hidden rounded">
      <button
        onClick={() => handleSortByName(setSortedCounts, counts)}
        className={`inline-flex h-12 items-center justify-center gap-2 justify-self-center whitespace-nowrap px-6 text-sm font-medium tracking-wide transition duration-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-100 disabled:text-sky-400 disabled:shadow-none
          ${
            activeButton === "nama"
              ? "bg-sky-200 text-sky-600 hover:bg-sky-200 hover:text-sky-700 focus:bg-sky-300 focus:text-sky-800"
              : "bg-sky-50 px-6 text-sm font-medium tracking-wide text-sky-500 transition duration-300 hover:bg-sky-100 hover:text-sky-600 focus:bg-sky-200 focus:text-sky-700"
          }`}
      >
        <span>Nama</span>
      </button>
      <button
        onClick={() => handleSortByCount(setSortedCounts, counts)}
        className={`inline-flex h-12 items-center justify-center gap-2 justify-self-center whitespace-nowrap px-6 text-sm font-medium tracking-wide transition duration-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-100 disabled:text-sky-400 disabled:shadow-none
          ${
            activeButton === "jumlah"
              ? "bg-sky-200 text-sky-600 hover:bg-sky-200 hover:text-sky-700 focus:bg-sky-300 focus:text-sky-800"
              : "bg-sky-50 px-6 text-sm font-medium tracking-wide text-sky-500 transition duration-300 hover:bg-sky-100 hover:text-sky-600 focus:bg-sky-200 focus:text-sky-700"
          }`}
      >
        <span>Jumlah</span>
      </button>
    </div>
  );

  return (
    <>
      <div className="w-full flex flex-col gap-9 items-start justify-center px-6 pt-6">
        <div className="w-full flex gap-4">
          <div className="basis-2/3">
            <div className="w-full">
              <Card className=" pt-4 pb-0">
                <CardHeader className="pb-0 pt-2 px-7 flex-col items-start">
                  <p className="text-default-500 font-semibold">{totalDocs}</p>
                  <h4 className="font-bold text-large">Total Mahasiswa</h4>
                </CardHeader>
                <CardBody className="overflow-visible pt-2 pb-0 px-0 items-center">
                  <Wave />
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 basis-1/3">
            <div>
              <Calendar aria-label="Date (Read Only)" visibleMonths={2} value={today(getLocalTimeZone())} isReadOnly color="primary" />
            </div>
            <div>
              <Link to="/mahasiswa" className="w-full">
                <Button type="button" color="primary" startContent={<UserIcon />} className="w-full">
                  Data Mahasiswa
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full" aria-multiselectable="false">
          <ul className="flex w-full justify-between items-center border-b border-slate-200" role="tablist">
            <li role="presentation" className="basis-1/5">
              <button
                className={`inline-flex items-center justify-center w-full h-12 gap-2 px-6 -mb-px text-sm font-medium tracking-wide transition duration-300 rounded-t focus-visible:outline-none whitespace-nowrap ${
                  activeTab === "1"
                    ? "border-b-2 border-sky-sky text-sky-sky hover:text-sky-600 focus:text-sky-700 hover:bg-sky-50 focus:bg-sky-50 hover:border-sky-600 focus:border-sky-700"
                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-600 focus:text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                }`}
                id="tab-label-1a"
                role="tab"
                aria-setsize="3"
                aria-posinset="1"
                tabIndex="0"
                aria-controls="tab-panel-1a"
                aria-selected={activeTab === "1"}
                onClick={() => handleTabClick("1")}
              >
                <span>Prodi</span>
              </button>
            </li>
            <li role="presentation" className="basis-1/5">
              <button
                className={`inline-flex items-center justify-center w-full h-12 gap-2 px-6 -mb-px text-sm font-medium tracking-wide transition duration-300 rounded-t focus-visible:outline-none whitespace-nowrap ${
                  activeTab === "2"
                    ? "border-b-2 border-sky-500 text-sky-500 hover:text-sky-600 focus:text-sky-700 hover:bg-sky-50 focus:bg-sky-50 hover:border-sky-600 focus:border-sky-700"
                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-600 focus:text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                }`}
                id="tab-label-2a"
                role="tab"
                aria-setsize="3"
                aria-posinset="2"
                tabIndex="-1"
                aria-controls="tab-panel-2a"
                aria-selected={activeTab === "2"}
                onClick={() => handleTabClick("2")}
              >
                <span>Desa</span>
              </button>
            </li>
            <li role="presentation" className="basis-1/5">
              <button
                className={`inline-flex items-center justify-center w-full h-12 gap-2 px-6 -mb-px text-sm font-medium tracking-wide transition duration-300 rounded-t focus-visible:outline-none whitespace-nowrap ${
                  activeTab === "3"
                    ? "border-b-2 border-sky-500 text-sky-500 hover:text-sky-600 focus:text-sky-700 hover:bg-sky-50 focus:bg-sky-50 hover:border-sky-600 focus:border-sky-700"
                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-600 focus:text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                }`}
                id="tab-label-3a"
                role="tab"
                aria-setsize="3"
                aria-posinset="3"
                tabIndex="-1"
                aria-controls="tab-panel-3a"
                aria-selected={activeTab === "3"}
                onClick={() => handleTabClick("3")}
              >
                <span>Kecamatan</span>
              </button>
            </li>
            <li role="presentation" className="basis-1/5">
              <button
                className={`inline-flex items-center justify-center w-full h-12 gap-2 px-6 -mb-px text-sm font-medium tracking-wide transition duration-300 rounded-t focus-visible:outline-none whitespace-nowrap ${
                  activeTab === "4"
                    ? "border-b-2 border-sky-500 text-sky-500 hover:text-sky-600 focus:text-sky-700 hover:bg-sky-50 focus:bg-sky-50 hover:border-sky-600 focus:border-sky-700"
                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-600 focus:text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                }`}
                id="tab-label-4a"
                role="tab"
                aria-setsize="3"
                aria-posinset="3"
                tabIndex="-1"
                aria-controls="tab-panel-4a"
                aria-selected={activeTab === "4"}
                onClick={() => handleTabClick("4")}
              >
                <span>Kota</span>
              </button>
            </li>
            <li role="presentation" className="basis-1/5">
              <button
                className={`inline-flex items-center justify-center w-full h-12 gap-2 px-6 -mb-px text-sm font-medium tracking-wide transition duration-300 rounded-t focus-visible:outline-none whitespace-nowrap ${
                  activeTab === "5"
                    ? "border-b-2 border-sky-500 text-sky-500 hover:text-sky-600 focus:text-sky-700 hover:bg-sky-50 focus:bg-sky-50 hover:border-sky-600 focus:border-sky-700"
                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-600 focus:text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                }`}
                id="tab-label-5a"
                role="tab"
                aria-setsize="3"
                aria-posinset="3"
                tabIndex="-1"
                aria-controls="tab-panel-5a"
                aria-selected={activeTab === "5"}
                onClick={() => handleTabClick("5")}
              >
                <span>Provinsi</span>
              </button>
            </li>
            <li role="presentation" className="basis-1/5">
              <button
                className={`inline-flex items-center justify-center w-full h-12 gap-2 px-6 -mb-px text-sm font-medium tracking-wide transition duration-300 rounded-t focus-visible:outline-none whitespace-nowrap ${
                  activeTab === "6"
                    ? "border-b-2 border-sky-500 text-sky-500 hover:text-sky-600 focus:text-sky-700 hover:bg-sky-50 focus:bg-sky-50 hover:border-sky-600 focus:border-sky-700"
                    : "border-b-2 border-transparent text-slate-500 hover:text-slate-600 focus:text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                }`}
                id="tab-label-6a"
                role="tab"
                aria-setsize="3"
                aria-posinset="3"
                tabIndex="-1"
                aria-controls="tab-panel-6a"
                aria-selected={activeTab === "6"}
                onClick={() => handleTabClick("6")}
              >
                <span>Kelas</span>
              </button>
            </li>
          </ul>
          <div>
            <div className={`px-6 py-4 ${activeTab === "1" ? "" : "hidden"}`} id="tab-panel-1a" aria-hidden="false" role="tabpanel" aria-labelledby="tab-label-1a" tabIndex="-1">
              <div className="w-full">
                <h4 className="font-bold text-large">Jumlah Mahasiswa per Prodi</h4>
                <div className="w-full max-h-[800px] overflow-y-auto">
                  <SortingButtons setSortedCounts={setSortedProdiCounts} counts={prodiCounts} />
                  <Bar ref={prodiChartRef} data={generateChartData(sortedProdiCounts)} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className={`px-6 py-4 ${activeTab === "2" ? "" : "hidden"}`} id="tab-panel-2a" aria-hidden="true" role="tabpanel" aria-labelledby="tab-label-2a" tabIndex="-1">
              <div className="w-full max-h-[4000px] ">
                <h4 className="font-bold text-large">Jumlah Mahasiswa per Desa</h4>
                <div className="w-full max-h-[4000px] overflow-y-auto">
                  <SortingButtons setSortedCounts={setSortedDesaCounts} counts={desaCounts} />
                  <Bar ref={desaChartRef} data={generateChartData(sortedDesaCounts)} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className={`px-6 py-4 ${activeTab === "3" ? "" : "hidden"}`} id="tab-panel-3a" aria-hidden="true" role="tabpanel" aria-labelledby="tab-label-3a" tabIndex="-1">
              <div className="w-full max-h-[1000px]">
                <h4 className="font-bold text-large">Jumlah Mahasiswa per Kecamatan</h4>
                <div className="w-full max-h-[1000px] overflow-y-auto">
                  <SortingButtons setSortedCounts={setSortedKecamatanCounts} counts={kecamatanCounts} />
                  <Bar ref={kecamatanChartRef} data={generateChartData(sortedKecamatanCounts)} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className={`px-6 py-4 ${activeTab === "4" ? "" : "hidden"}`} id="tab-panel-4a" aria-hidden="true" role="tabpanel" aria-labelledby="tab-label-4a" tabIndex="-1">
              <div className="w-full max-h-[1000px]">
                <h4 className="font-bold text-large">Jumlah Mahasiswa per Kota</h4>
                <div className="w-full max-h-[1000px] overflow-y-auto">
                  <SortingButtons setSortedCounts={setSortedKotaCounts} counts={kotaCounts} />
                  <Bar ref={kotaChartRef} data={generateChartData(sortedKotaCounts)} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className={`px-6 py-4 ${activeTab === "5" ? "" : "hidden"}`} id="tab-panel-5a" aria-hidden="true" role="tabpanel" aria-labelledby="tab-label-5a" tabIndex="-1">
              <div className="w-full max-h-[1200px]">
                <h4 className="font-bold text-large">Jumlah Mahasiswa per Provinsi</h4>
                <div className="w-full max-h-[1200px] overflow-y-auto">
                  <SortingButtons setSortedCounts={setSortedProvinsiCounts} counts={provinsiCounts} />
                  <Bar ref={provinsiChartRef} data={generateChartData(sortedProvinsiCounts)} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className={`px-6 py-4 ${activeTab === "6" ? "" : "hidden"}`} id="tab-panel-6a" aria-hidden="true" role="tabpanel" aria-labelledby="tab-label-6a" tabIndex="-1">
              <div className="w-full max-h-[400px]">
                <h4 className="font-bold text-large">Jumlah Mahasiswa Kelas Pagi/Sore</h4>
                <div className="flex justify-center w-full max-h-[400px] overflow-y-auto">
                  <Doughnut data={generateChartData(kelasCounts)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
