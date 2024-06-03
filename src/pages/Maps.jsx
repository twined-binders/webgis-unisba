import React from "react";
import csv from "csvtojson";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import db from "../configs/firebase-config";

export default function Maps() {
  const [data, setData] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      const jsonArray = await readCSVFile(file);
      setData(jsonArray);
    } catch (error) {
      console.error("Error importing data:", error);
    }
  };

  const readCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const text = reader.result;
          const jsonArray = await csv().fromString(text);
          resolve(jsonArray);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const submitToFirestore = async () => {
    try {
      const batch = [];
      const collectionRef = collection(db, "mahasiswa");

      data.forEach((item) => {
        batch.push(addDoc(collectionRef, item));
      });

      await Promise.all(batch);
      console.log("Data submitted to Firestore successfully!");
    } catch (error) {
      console.error("Error submitting data to Firestore:", error);
    }
  };

  return (
    <div>
      <h1>CSV Importer</h1>
      <input type="file" onChange={handleFileUpload} accept=".csv" />
      <button onClick={submitToFirestore}>Submit to Firestore</button>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}
