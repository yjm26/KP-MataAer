import React, { useState, useEffect } from "react";
import { MailPlus, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/layouts/app-sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppTitlePage } from "@/layouts/app-titlepage";
import { AppTable } from "@/layouts/app-table";
import { getSuratKeluar, deleteSuratKeluar } from "@/services/suratKeluarService";

function SuratKeluar() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const suratPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const surat = await getSuratKeluar();
      setData(surat);
    } catch (err) {
      alert("Gagal mengambil data surat keluar: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSuratKeluar(id);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus surat keluar: " + err.message);
    }
  };

  // Urutkan berdasarkan input duluan (array order)
  const sortedData = [...data].sort(() => 0);

  // Filter data berdasarkan search
  const filteredData = sortedData.filter((row) =>
    [
      row.nomor_surat,
      row.tujuan,
      row.nomor_agenda,
      row.tanggal_surat,
      row.tanggal_keluar,
      row.ringkasan,
      row.kode_klasifikasi,
      row.keterangan,
    ]
      .map((v) => (v ? v.toString().toLowerCase() : ""))
      .some((v) => v.includes(search.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / suratPerPage);
  const indexOfLast = currentPage * suratPerPage;
  const indexOfFirst = indexOfLast - suratPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const columns = [
    { key: "nomor_surat", title: "Nomor Surat" },
    { key: "tujuan", title: "Tujuan" },
    { key: "nomor_agenda", title: "Nomor Agenda" },
    {
      key: "tanggal_surat",
      title: "Tanggal Surat",
      render: (row) =>
        row.tanggal_surat
          ? new Date(row.tanggal_surat).toLocaleDateString("id-ID")
          : "-",
    },
    {
      key: "tanggal_keluar",
      title: "Tanggal Keluar",
      render: (row) =>
        row.tanggal_keluar
          ? new Date(row.tanggal_keluar).toLocaleDateString("id-ID")
          : "-",
    },
    { key: "ringkasan", title: "Ringkasan" },
    { key: "kode_klasifikasi", title: "Kode Klasifikasi" },
    { key: "keterangan", title: "Keterangan" },
    {
      key: "lampiran",
      title: "Lampiran",
      render: (row) => {
        if (typeof row.lampiran === "string" && row.lampiran !== "") {
          return (
            <a
              href={`${import.meta.env.VITE_API_URL}/uploads/${row.lampiran}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              <FileDown /> 
            </a>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/dashboard/surat-keluar/edit/${row.nomor_surat}`)}
            className="px-2 py-1 bg-blue-400 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.nomor_surat)}
            className="px-2 py-1 bg-red-white text-white bg-red-500 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
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
          <AppTitlePage title="Surat Keluar" Icon={MailPlus} />
        </section>

        {/* Table Section */}
        <section className="bg-white shadow-md rounded-b-lg p-15 w-[1368px] h-[782px] shadow-slate-200 relative">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => navigate("/dashboard/surat-keluar/tambah-surat-keluar")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tambah Surat
            </button>
            <input
              type="text"
              placeholder="Cari surat..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 w-64"
            />
          </div>
          <AppTable columns={columns} data={currentData} />
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

export default SuratKeluar;