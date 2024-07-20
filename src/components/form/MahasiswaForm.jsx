import db from "../../configs/firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export default function MahasiswaForm({ isOpen, onClose }) {
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [fakultas, setFakultas] = useState("");
  const [prodi, setProdi] = useState("");
  const [email, setEmail] = useState("");
  const [kelas, setKelas] = useState("");
  const [alamat, setAlamat] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [dusun, setDusun] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [desa, setDesa] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kota, setKota] = useState("");
  const [provinsi, setProvinsi] = useState("");
  // const [latitude, setLatitude] = useState("");
  // const [longitude, setLongitude] = useState("");

  const timestamp = serverTimestamp();
  const nimNumber = parseInt(nim); // Convert nim to a number
  // const latitudeNumber = parseFloat(latitude); // Convert latitude to a number
  // const longitudeNumber = parseFloat(longitude);

  const resetFormFields = () => {
    setNama("");
    setNim("");
    setFakultas("");
    setProdi("");
    setEmail("");
    setKelas("");
    setAlamat("");
    setDesa("");
    setDusun("");
    setKecamatan("");
    setKodePos("");
    setKota("");
    setProvinsi("");
    setRt("");
    setRw("");
    // setLatitude("");
    // setLongitude("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    if (!nama || !nim || !fakultas || !prodi || !email || !kelas || !alamat || !rt || !rw || !dusun || !kodePos || !desa || !kecamatan || !kota || !provinsi) {
      toast.error("Semua field harus diisi!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Email tidak valid!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      await addDoc(collection(db, "mahasiswa"), {
        nama: nama,
        nim: nim,
        fakultas: fakultas,
        prodi: prodi,
        email: email,
        kelas: kelas,
        alamat: alamat,
        rt: rt,
        rw: rw,
        dusun: dusun,
        kodePos: kodePos,
        desa: desa,
        kecamatan: kecamatan,
        kota: kota,
        provinsi: provinsi,
        createdTime: timestamp,
        // latitude: latitude,
        // longitude: longitude,
      });
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
      onClose();
      resetFormFields();
    } catch (err) {
      console.error("Error adding document: ", err);
      if (err.code === "permission-denied") {
        toast.error("Gagal menambahkan data: Anda tidak memiliki izin untuk menambah data.");
      } else if (err.code === "unavailable") {
        toast.error("Gagal menambahkan data: Koneksi jaringan tidak tersedia.");
      } else {
        toast.error("Gagal menambahkan data: Terjadi kesalahan dalam menambahkan data.");
      }
    }
  };

  const handleClose = () => {
    resetFormFields();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full" size="5xl">
      <ModalContent className="w-[900px]">
        <ModalHeader>Tambah Data</ModalHeader>
        <ModalBody>
          <div className="w-full">
            <div className="flex w-full gap-3">
              <div className="flex flex-col basis-1/2">
                <div className="relative">
                  <input
                    aria-label="Masukkan Nama"
                    type="text"
                    id="nama"
                    name="nama"
                    required
                    value={nama}
                    placeholder="Nama"
                    onChange={(e) => setNama(e.target.value)}
                    className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="nama"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Nama
                  </label>
                </div>

                <div className="relative my-2">
                  <input
                    aria-label="Masukkan NIM"
                    type="number"
                    id="nim"
                    name="nim"
                    required
                    value={nim}
                    placeholder="NIM"
                    onChange={(e) => setNim(e.target.value)}
                    className="relative w-full h-10 px-4 pr-12 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="nim"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    NIM
                  </label>
                </div>

                <div className="relative my-2 md:w-full">
                  <select
                    aria-label="Pilih Fakultas"
                    id="fakultas"
                    name="fakultas"
                    value={fakultas}
                    onChange={(e) => setFakultas(e.target.value)}
                    required
                    className="relative w-full h-10 px-4 text-sm transition-all bg-white border rounded outline-none appearance-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white focus:border-sky-500 focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="" disabled></option>
                    <option value="Agama Islam">Agama Islam</option>
                    <option value="Ekonomi">Ekonomi</option>
                    <option value="Ilmu Keguruan dan Ilmu Pendidikan">Ilmu Keguruan dan Ilmu Pendidikan</option>
                    <option value="Ilmu Sosial dan Politik">Ilmu Sosial dan Politik</option>
                    <option value="Hukum">Hukum</option>
                    <option value="Teknik">Teknik</option>
                    <option value="Teknologi Informasi">Teknologi Informasi</option>
                    <option value="Pertanian dan Peternakan">Pertanian dan Peternakan</option>
                  </select>
                  <label
                    htmlFor="fakultas"
                    className="pointer-events-none absolute top-2.5 left-2 z-[1] px-2 text-sm text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Pilih Fakultas
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
              </div>

              <div className="flex flex-col basis-1/2">
                <div className="relative ">
                  <select
                    aria-label="Pilih Kelas"
                    id="kelas"
                    name="kelas"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    required
                    className="relative w-full h-10 px-4 text-sm transition-all bg-white border rounded outline-none appearance-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white focus:border-sky-500 focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="" disabled></option>
                    <option value="Pagi">Pagi</option>
                    <option value="Sore">Sore</option>
                  </select>
                  <label
                    htmlFor="kelas"
                    className="pointer-events-none absolute top-2.5 left-2 z-[1] px-2 text-sm text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Pilih Kelas
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

                <div className="relative my-2">
                  <input
                    aria-label="Masukkan Email"
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative w-full h-10 px-4 pr-12 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Email
                  </label>
                </div>
                <div className="relative my-2 md:w-full">
                  <select
                    aria-label="Pilih Prodi"
                    id="prodi"
                    name="prodi"
                    value={prodi}
                    onChange={(e) => setProdi(e.target.value)}
                    required
                    className="relative w-full h-10 px-4 text-sm transition-all bg-white border rounded outline-none appearance-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white focus:border-sky-500 focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="" disabled></option>
                    <option value="Agribisnis">Agribisnis</option>
                    <option value="Agroteknologi">Agroteknologi</option>
                    <option value="Akuntansi">Akuntansi</option>
                    <option value="Bimbingan Konseling Islam">Bimbingan Konseling Islam</option>
                    <option value="Ilmu Administrasi Negara">Ilmu Administrasi Negara</option>
                    <option value="Ilmu Administrasi Niaga">Ilmu Administrasi Niaga</option>
                    <option value="Ilmu Hukum">Ilmu Hukum</option>
                    <option value="Ilmu Komunikasi">Ilmu Komunikasi</option>
                    <option value="Ilmu Ternak">Ilmu Ternak</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Manajemen Pendidikan Islam">Manajemen Pendidikan Islam</option>
                    <option value="Pendidikan Bahasa Inggris">Pendidikan Bahasa Inggris</option>
                    <option value="Pendidikan Biologi">Pendidikan Biologi</option>
                    <option value="Pendidikan Guru Sekolah Dasar">Pendidikan Guru Sekolah Dasar</option>
                    <option value="Pendidikan Pancasila dan Kewarganegaraan">Pendidikan Pancasila dan Kewarganegaraan</option>
                    <option value="Perbankan Syariah">Perbankan Syariah</option>
                    <option value="Sistem Komputer">Sistem Komputer</option>
                    <option value="Sosiologi">Sosiologi</option>
                    <option value="Teknik Elektro">Teknik Elektro</option>
                    <option value="Teknik Informatika">Teknik Informatika</option>
                    <option value="Teknik Sipil">Teknik Sipil</option>
                  </select>
                  <label
                    htmlFor="prodi"
                    className="pointer-events-none absolute top-2.5 left-2 z-[1] px-2 text-sm text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Pilih Program Studi
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
              </div>
            </div>

            <div className="my-2">
              <div className="relative">
                <input
                  aria-label="Masukkan Alamat Lengkap"
                  type="text"
                  id="alamat"
                  name="alamat"
                  required
                  value={alamat}
                  placeholder="Alamat"
                  onChange={(e) => setAlamat(e.target.value)}
                  className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
                <label
                  htmlFor="alamat"
                  className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                >
                  Alamat
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col basis-1/3">
                <div className="relative my-2">
                  <input
                    aria-label="Masukkan RT"
                    type="number"
                    id="rt"
                    name="rt"
                    required
                    value={rt}
                    placeholder="RT"
                    onChange={(e) => setRt(e.target.value)}
                    className="relative w-full h-10 px-4 pr-12 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="rt"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    RT
                  </label>
                </div>
                <div className="relative my-2">
                  <input
                    aria-label="Masukkan RW"
                    type="number"
                    id="rw"
                    name="rw"
                    required
                    value={rw}
                    placeholder="RW"
                    onChange={(e) => setRw(e.target.value)}
                    className="relative w-full h-10 px-4 pr-12 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="rw"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    RW
                  </label>
                </div>
              </div>

              <div className="flex flex-col basis-1/3">
                <div className="relative my-2">
                  <input
                    aria-label="Masukkan Dusun"
                    type="text"
                    id="dusun"
                    name="dusun"
                    required
                    value={dusun}
                    placeholder="Dusun"
                    onChange={(e) => setDusun(e.target.value)}
                    className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="dusun"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Dusun
                  </label>
                </div>
                <div className="relative my-2">
                  <input
                    aria-label="Masukkan Kode Pos"
                    type="number"
                    id="kodePos"
                    name="kodePos"
                    required
                    value={kodePos}
                    placeholder=""
                    onChange={(e) => setKodePos(e.target.value)}
                    className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="kodePos"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Kode Pos
                  </label>
                </div>
              </div>
              <div className="flex flex-col basis-1/3">
                <div className="relative my-2">
                  <input
                    aria-label="Masukkan Desa"
                    type="text"
                    id="desa"
                    name="desa"
                    required
                    value={desa}
                    placeholder="Desa"
                    onChange={(e) => setDesa(e.target.value)}
                    className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="desa"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Desa/Kelurahan
                  </label>
                </div>

                <div className="relative my-2">
                  <input
                    aria-label="Masukkan Kecamatan"
                    type="text"
                    id="kecamatan"
                    name="kecamatan"
                    required
                    value={kecamatan}
                    placeholder="Kecamatan"
                    onChange={(e) => setKecamatan(e.target.value)}
                    className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <label
                    htmlFor="kecamatan"
                    className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                  >
                    Kecamatan
                  </label>
                </div>
              </div>
            </div>
            <div className="flex mt-2 gap-3">
              <div className="relative w-full">
                <input
                  aria-label="Masukkan Kota"
                  type="text"
                  id="kota"
                  name="kota"
                  required
                  value={kota}
                  placeholder="Dusun"
                  onChange={(e) => setKota(e.target.value)}
                  className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
                <label
                  htmlFor="kota"
                  className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                >
                  Kota
                </label>
              </div>
              {/* <div className="relative basis-1/3">
                <input
                  aria-label="Masukkan Latitude"
                  type="number"
                  id="latitude"
                  name="latitude"
                  required
                  value={latitude}
                  placeholder="Latitude"
                  onChange={(e) => setLatitude(e.target.value)}
                  className="relative w-full h-10 px-4 pr-12 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
                <label
                  htmlFor="latitude"
                  className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                >
                  Latitude
                </label>
              </div> */}
            </div>
            <div className="flex mt-2 gap-3">
              <div className="relative w-full">
                <input
                  aria-label="Masukkan Provinsi"
                  type="text"
                  id="provinsi"
                  name="provinsi"
                  required
                  value={provinsi}
                  placeholder="Provinsi"
                  onChange={(e) => setProvinsi(e.target.value)}
                  className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
                <label
                  htmlFor="provinsi"
                  className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                >
                  Provinsi
                </label>
              </div>
              {/* <div className="relative basis-1/3">
                <input
                  aria-label="Masukkan Longitude"
                  type="number"
                  id="longitude"
                  name="longitude"
                  required
                  value={longitude}
                  placeholder="Longitude"
                  onChange={(e) => setLongitude(e.target.value)}
                  className="relative w-full h-10 px-4 pr-12 text-sm placeholder-transparent transition-all border rounded outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-sky-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
                <label
                  htmlFor="longitude"
                  className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-sky-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
                >
                  Longitude
                </label>
              </div> */}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onClick={handleClose}>
            Tutup
          </Button>
          <Button type="submit" color="primary" variant="flat" onClick={handleSubmit}>
            Tambah
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
