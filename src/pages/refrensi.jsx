import React, { useState, useEffect } from "react";
import { MailPlus } from "lucide-react";

import { AppSidebar } from "@/layouts/app-sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppTitlePage } from "@/layouts/app-titlepage";
import { AppTable } from "@/layouts/app-table";
import {
  getKlasifikasi,
  addKlasifikasi,
  deleteKlasifikasi,
} from "@/services/refrensiService";

function Refrensi() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputKlasifikasi, setInputKlasifikasi] = useState("");
  const [loading, setLoading] = useState(false);
  const klasifikasiPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const klasifikasi = await getKlasifikasi();
      setData(klasifikasi);
    } catch (err) {
      alert("Gagal mengambil data klasifikasi: " + err.message);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!inputKlasifikasi.trim()) return;
    setLoading(true);
    try {
      await addKlasifikasi(inputKlasifikasi.trim());
      setInputKlasifikasi("");
      fetchData();
    } catch (err) {
      alert("Gagal menambah klasifikasi: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus klasifikasi ini?")) return;
    setLoading(true);
    try {
      await deleteKlasifikasi(id);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus klasifikasi: " + err.message);
    }
    setLoading(false);
  };

  // Filter data berdasarkan search
  const filteredData = data.filter((row) =>
    row.klasifikasi?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / klasifikasiPerPage);
  const indexOfLast = currentPage * klasifikasiPerPage;
  const indexOfFirst = indexOfLast - klasifikasiPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const columns = [
    { key: "klasifikasi", title: "Klasifikasi" },
    { key: "total_surat", title: "Jumlah Total" },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 flex flex-col items-center justify-center">
        <section>
          <AppTitlePage title="Referensi Klasifikasi" Icon={MailPlus} />
        </section>

        {/* Table Section */}
        <section className="bg-white shadow-md rounded-b-lg p-15 w-[1368px] h-[782px] shadow-slate-200 relative">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah klasifikasi baru..."
                value={inputKlasifikasi}
                onChange={(e) => setInputKlasifikasi(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                Tambah
              </button>
            </div>
            <input
              type="text"
              placeholder="Cari klasifikasi..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 w-64"
            />
          </div>
          <AppTable columns={columns} data={currentData} loading={loading} />
          {/* Pagination */}
          <div className="flex justify-end mt-4 absolute right-8 bottom-8">
            <nav>
              <ul className="inline-flex -space-x-px">
                <li>
                  <button
                    className="px-3 py-1 rounded-l border border-gray-300 bg-white hover:bg-gray-100"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i}>
                    <button
                      className={`px-3 py-1 border border-gray-300 ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="px-3 py-1 rounded-r border border-gray-300 bg-white hover:bg-gray-100"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Refrensi;