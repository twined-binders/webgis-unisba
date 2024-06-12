import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, useDisclosure, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useState, useMemo, useCallback } from "react";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import UpdateModalComponent from "../modal/updateModal";
import React from "react";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
import { COLUMNS } from "./Columns";

const INITIAL_VISIBLE_COLUMNS = ["no", "nama", "nim", "prodi", "aksi"];

export default function TableComponent({ data, handleDelete, currentPage, setCurrentPage, itemsPerPage }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [startIndex, setStartIndex] = useState();

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setStartIndex(startIndex);
    return data.slice(startIndex, endIndex);
  }, [currentPage, data, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));

  const headerColumns = useMemo(() => {
    return COLUMNS.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const handleSelectionChange = useCallback((keys) => {
    setVisibleColumns(new Set(keys));
  }, []);
  console.log(currentPage);

  return (
    <>
      <div className="py-6">
        <Table
          color="primary"
          selectionMode="single"
          defaultSelectedKeys={["0"]}
          radius="sm"
          bottomContent={
            <div className="flex w-full justify-between">
              <div className="basis-1/2 flex justify-end">
                <Pagination showControls isCompact showShadow color="primary" page={currentPage} total={totalPages} onChange={setCurrentPage} />
              </div>
              <div className="basis-1/2 flex justify-end">
                <Dropdown>
                  <DropdownTrigger>
                    <Button endContent={<ChevronDownIcon />} variant="flat">
                      Columns
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Table Columns" disallowEmptySelection closeOnSelect={false} selectionMode="multiple" selectedKeys={visibleColumns} onSelectionChange={handleSelectionChange}>
                    {COLUMNS.map((column) => (
                      <DropdownItem key={column.uid} className="col-span-1">
                        {column.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          }
        >
          <TableHeader columns={headerColumns}>{(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}</TableHeader>
          <TableBody emptyContent={"Tidak ada data !"}>
            {paginatedData.map((mahasiswa, index) => (
              <TableRow key={mahasiswa.id}>
                {headerColumns.map((column) => {
                  switch (column.uid) {
                    case "no":
                      return <TableCell key="no">{startIndex + index + 1}</TableCell>;
                    case "nama":
                      return <TableCell key="nama">{mahasiswa.nama}</TableCell>;
                    case "nim":
                      return <TableCell key="nim">{mahasiswa.nim}</TableCell>;
                    case "fakultas":
                      return <TableCell key="fakultas">{mahasiswa.fakultas}</TableCell>;
                    case "prodi":
                      return <TableCell key="prodi">{mahasiswa.prodi}</TableCell>;
                    case "kelas":
                      return <TableCell key="kelas">{mahasiswa.kelas}</TableCell>;
                    case "email":
                      return <TableCell key="email">{mahasiswa.email}</TableCell>;
                    case "alamat":
                      return <TableCell key="alamat">{mahasiswa.alamat}</TableCell>;
                    case "rt_rw":
                      return (
                        <TableCell key="rt_rw">
                          {mahasiswa.rt}/{mahasiswa.rw}
                        </TableCell>
                      );
                    case "dusun":
                      return <TableCell key="dusun">{mahasiswa.dusun}</TableCell>;
                    case "kodepos":
                      return <TableCell key="kodepos">{mahasiswa.kodePos}</TableCell>;
                    case "desa":
                      return <TableCell key="desa">{mahasiswa.desa}</TableCell>;
                    case "kecamatan":
                      return <TableCell key="kecamatan">{mahasiswa.kecamatan}</TableCell>;
                    case "kota":
                      return <TableCell key="kota">{mahasiswa.kota}</TableCell>;
                    case "provinsi":
                      return <TableCell key="provinsi">{mahasiswa.provinsi}</TableCell>;
                    case "aksi":
                      return (
                        <TableCell key="aksi">
                          <div className="flex gap-2">
                            <Tooltip content="Edit">
                              <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => {
                                  onOpen();
                                  setSelectedMahasiswa(mahasiswa);
                                }}
                              >
                                <EditIcon />
                              </span>
                            </Tooltip>
                            <Tooltip color="danger" content="Hapus">
                              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(mahasiswa.id)}>
                                <DeleteIcon />
                              </span>
                            </Tooltip>
                          </div>
                        </TableCell>
                      );
                    default:
                      return null;
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <UpdateModalComponent isOpen={isOpen} onClose={onClose} mahasiswa={selectedMahasiswa} />
    </>
  );
}
