import React, { useEffect, useState } from "react";
import db from "../configs/firebase-config"; // Import your Firestore instance
import { getDocs, collection } from "firebase/firestore";
import { Calendar, Card, CardHeader, CardBody, Spinner, Button } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Wave } from "../components/icons/Wave";
import { Wave2 } from "../components/icons/Wave2";
import { Wave3 } from "../components/icons/Wave3";
import { UserIcon } from "../components/icons/UserIcon";
import { Link } from "react-router-dom";

function Dashboard() {
  const [mostFrequentProdi, setMostFrequentProdi] = useState("");
  const [mostFrequentProdiCount, setMostFrequentProdiCount] = useState(0);
  const [mostFewestProdi, setMostFewestProdi] = useState("");
  const [mostFewestProdiCount, setMostFewestProdiCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all documents from Firestore collection
        const querySnapshot = await getDocs(collection(db, "mahasiswa"));
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(documents);

        const prodiCounts = {};
        documents.forEach((doc) => {
          const prodi = doc.prodi;
          if (prodi) {
            prodiCounts[prodi] = (prodiCounts[prodi] || 0) + 1;
          }
        });

        let maxCount = -1;
        let minCount = Infinity;
        let mostFrequentProdiValue = "";
        let mostFewestProdiValue = "";
        Object.entries(prodiCounts).forEach(([value, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostFrequentProdiValue = value;
          }
          if (count < minCount) {
            minCount = count;
            mostFewestProdiValue = value;
          }
        });

        setMostFrequentProdi(mostFrequentProdiValue);
        setMostFrequentProdiCount(maxCount);
        setMostFewestProdi(mostFewestProdiValue);
        setMostFewestProdiCount(minCount);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // if (isLoading) {
  //   return (
  //     <div className="text-center">
  //       <Spinner label="Loading..." />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="w-full flex flex-row gap-9 items-start justify-center px-6 pt-6">
        <div className=" flex flex-col items-start justify-center gap-6 basis-2/3">
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
          <div className="w-full flex gap-6">
            <div className="w-1/2">
              <Card className="pt-4 ">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-default-500 font-semibold">
                    Prodi dengan Mahasiswa <br></br>tersedikit
                  </p>
                  <h4 className="font-bold text-large">
                    {mostFewestProdi} : {mostFewestProdiCount}
                  </h4>
                </CardHeader>
                <CardBody className="overflow-visible pt-2 pb-0 px-0">
                  <Wave2 />
                </CardBody>
              </Card>
            </div>
            <div className="flex-initial w-1/2">
              <Card className="pt-4">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-default-500 font-semibold">
                    Prodi dengan Mahasiswa <br></br>terbanyak
                  </p>
                  <h4 className="font-bold text-large">
                    {mostFrequentProdi} : {mostFrequentProdiCount}
                  </h4>
                </CardHeader>
                <CardBody className="overflow-visible pt-2 pb-0 px-0">
                  <Wave3 />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 basis-1/3">
          <div>
            <Calendar aria-label="Date (Read Only)" visibleMonths={2} value={today(getLocalTimeZone())} isReadOnly color="primary" />
          </div>
          <div>
            <Link to="/mahasiswa" className="w-full">
              <Button color="primary" startContent={<UserIcon />} className="w-full">
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
