import React, { useEffect, useState } from "react";
import db from "../configs/firebase-config"; // Import your Firestore instance
import { getDocs, collection } from "firebase/firestore";
import { Calendar, Card, CardHeader, CardBody, Spinner, Button, Link } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Wave } from "../components/icons/Wave";
import { Wave2 } from "../components/icons/Wave2";
import { Wave3 } from "../components/icons/Wave3";
import { UserIcon } from "../components/icons/UserIcon";

function Dashboard() {
  const [mostFrequentFakultas, setMostFrequentFakultas] = useState("");
  const [mostFrequentProdi, setMostFrequentProdi] = useState("");
  const [uniqueFakultasCount, setUniqueFakultasCount] = useState(0);
  const [uniqueProdiCount, setUniqueProdiCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all documents from Firestore collection
        const querySnapshot = await getDocs(collection(db, "mahasiswa"));
        const documents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setData(documents);

        // Calculate the most frequently chosen "Fakultas" and "Prodi" value
        const fakultasCounts = {};
        const prodiCounts = {};
        const uniqueFakultas = new Set();
        const uniqueProdi = new Set();

        documents.forEach((doc) => {
          const fakultas = doc.fakultas;
          const prodi = doc.prodi;
          if (fakultas) {
            fakultasCounts[fakultas] = (fakultasCounts[fakultas] || 0) + 1;
            uniqueFakultas.add(fakultas);
          }
          if (prodi) {
            prodiCounts[prodi] = (prodiCounts[prodi] || 0) + 1;
            uniqueProdi.add(prodi);
          }
        });

        // Find the value with the highest count for Fakultas
        let maxCountFakultas = 0;
        let mostFrequentFakultasValue = "";
        Object.entries(fakultasCounts).forEach(([value, count]) => {
          if (count > maxCountFakultas) {
            maxCountFakultas = count;
            mostFrequentFakultasValue = value;
          }
        });

        // Find the value with the highest count for Prodi
        let maxCountProdi = 0;
        let mostFrequentProdiValue = "";
        Object.entries(prodiCounts).forEach(([value, count]) => {
          if (count > maxCountProdi) {
            maxCountProdi = count;
            mostFrequentProdiValue = value;
          }
        });

        setMostFrequentFakultas(mostFrequentFakultasValue);
        setMostFrequentProdi(mostFrequentProdiValue);
        setUniqueFakultasCount(uniqueFakultas.size);
        setUniqueProdiCount(uniqueProdi.size);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-row gap-9 items-start justify-center px-6 pt-6">
        <div className=" flex flex-col items-start justify-center gap-6">
          <div className="w-full">
            <Card className="pt-4 pb-0">
              <CardHeader className="pb-0 pt-2 px-7 flex-col items-start">
                <p className="text-default-500 font-semibold">{data.length}</p>
                <h4 className="font-bold text-large">Total Mahasiswa</h4>
              </CardHeader>
              <CardBody className="overflow-visible pt-2 pb-0 px-0 items-center">
                <Wave />
              </CardBody>
            </Card>
          </div>
          <div className="flex gap-6">
            <div className="flex-initial w-1/2">
              <Card className="pt-4">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-default-500 font-semibold">Fakultas dengan Mahasiswa terbanyak</p>
                  <h4 className="font-bold text-large">{mostFrequentFakultas}</h4>
                </CardHeader>
                <CardBody className="overflow-visible pt-2 pb-0 px-0">
                  <Wave2 />
                </CardBody>
              </Card>
            </div>
            <div className="flex-initial w-1/2">
              <Card className="pt-4 ">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-default-500 font-semibold">
                    Prodi dengan Mahasiswa <br></br>terbanyak
                  </p>
                  <h4 className="font-bold text-large">{mostFrequentProdi}</h4>
                </CardHeader>
                <CardBody className="overflow-visible pt-2 pb-0 px-0">
                  <Wave3 />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Card className="flex-1">
              <CardHeader className="pb-0 py-2 px-4 flex-col items-start">
                <p className="text-default-500 font-semibold">{uniqueProdiCount}</p>
                <h4 className="font-bold text-large">Prodi</h4>
              </CardHeader>
            </Card>
            <Card className="flex-1">
              <CardHeader className="pb-0 py-2 px-4 flex-col items-start">
                <p className="text-default-500 font-semibold">{uniqueFakultasCount}</p>
                <h4 className="font-bold text-large">Fakultas</h4>
              </CardHeader>
            </Card>
          </div>
          <div>
            <Calendar aria-label="Date (Read Only)" value={today(getLocalTimeZone())} isReadOnly color="primary" />
          </div>
          <div>
            <Link href="/about" className="w-full">
              <Button color="primary" startContent={<UserIcon />} className="-mt-4 w-full">
                Data Mahasiswa
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
