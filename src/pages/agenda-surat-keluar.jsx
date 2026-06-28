import React, { useState, useEffect } from "react";
import { MailPlus, FileDown } from "lucide-react";
import { AppSidebar } from "@/layouts/app-sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppTitlePage } from "@/layouts/app-titlepage";
import { AppTable } from "@/layouts/app-table";
import { getSuratKeluar } from "@/services/suratKeluarService"; // Pastikan ada service ini
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AgendaSuratKeluar() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const suratPerPage = 10;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const suratKeluar = await getSuratKeluar();
      setData(suratKeluar);
    } catch (err) {
      alert("Gagal mengambil data surat keluar: " + err.message);
    }
  };

  // Filter data berdasarkan search
  const filteredData = data.filter((row) =>
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

  // Filter data berdasarkan periode tanggal (gunakan tanggal_keluar)
  const filteredByDate = filteredData.filter((row) => {
    const tgl = row.tanggal_keluar ? new Date(row.tanggal_keluar) : null;
    const afterStart = startDate ? tgl >= new Date(startDate) : true;
    const beforeEnd = endDate ? tgl <= new Date(endDate) : true;
    return afterStart && beforeEnd;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredByDate.length / suratPerPage);
  const indexOfLast = currentPage * suratPerPage;
  const indexOfFirst = indexOfLast - suratPerPage;
  const currentData = filteredByDate.slice(indexOfFirst, indexOfLast);

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
  ];

  // Fungsi cetak PDF
  const handlePrintPDF = () => {
    const doc = new jsPDF();
    doc.text("Agenda Surat Keluar", 14, 10);
    autoTable(doc, {
      head: [
        [
          "Nomor Surat",
          "Tujuan",
          "Nomor Agenda",
          "Tanggal Surat",
          "Tanggal Keluar",
          "Ringkasan",
          "Kode Klasifikasi",
          "Keterangan",
        ],
      ],
      body: filteredByDate.map((row) => [
        row.nomor_surat,
        row.tujuan,
        row.nomor_agenda,
        row.tanggal_surat
          ? new Date(row.tanggal_surat).toLocaleDateString("id-ID")
          : "-",
        row.tanggal_keluar
          ? new Date(row.tanggal_keluar).toLocaleDateString("id-ID")
          : "-",
        row.ringkasan,
        row.kode_klasifikasi,
        row.keterangan,
      ]),
      styles: { fontSize: 8 },
      startY: 20,
    });
    doc.save("agenda-surat-keluar.pdf");
  };

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
          <AppTitlePage title="Agenda Surat Keluar" Icon={MailPlus} />
        </section>

        {/* Table Section */}
        <section className="bg-white shadow-md rounded-b-lg p-15 w-[1368px] h-[782px] shadow-slate-200 relative">
          <div className="flex justify-between items-center mb-3">
            
            <div className="flex gap-2 items-center">
               <button
                onClick={handlePrintPDF}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Cetak PDF
              </button>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded"
              />
              <span>-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded"
              />
             
            </div>
            {/* Kanan: Cari surat keluar */}
            <input
              type="text"
              placeholder="Cari surat keluar..."
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

export default AgendaSuratKeluar;