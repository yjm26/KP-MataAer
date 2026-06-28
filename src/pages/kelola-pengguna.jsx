import React, { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/layouts/app-sidebar.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppTitlePage } from "@/layouts/app-titlepage";
import { AppTable } from "@/layouts/app-table";
import { getAccounts, deleteAccount } from "@/services/accountService";
import AppTambahPengguna from "@/layouts/app-tambah-pengguna";
import AppEditPengguna from "@/layouts/app-edit-pengguna";

function KelolaPengguna() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const userPerPage = 10;
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Ambil role dari localStorage (atau context sesuai implementasi login kamu)
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Jika bukan admin, redirect ke halaman lain (misal dashboard)
    if (role !== "admin") {
      navigate("/dashboard");
      return;
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const accounts = await getAccounts();
      setData(accounts);
    } catch (err) {
      alert("Gagal mengambil data user: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAccount(id);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus user: " + err.message);
    }
  };

  // Urutkan berdasarkan input paling awal
  const sortedData = [...data].sort(() => 0);
  // Filter data berdasarkan kolom yang ada
  const filteredData = sortedData.filter((row) =>
    [row.id, row.email, row.role]
      .map((v) => (v ? v.toString().toLowerCase() : ""))
      .some((v) => v.includes(search.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / userPerPage);
  const indexOfLast = currentPage * userPerPage;
  const indexOfFirst = indexOfLast - userPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const columns = [
    { key: "id", title: "ID" },
    { key: "email", title: "Email" },
    { key: "role", title: "Role" },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditData(row);
              setShowEditModal(true);
            }}
            className="px-2 py-1 bg-blue-400 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-2 py-1 bg-red-white text-white bg-red-500 rounded hover:bg-red-600 "
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
          <AppTitlePage title="Kelola User" Icon={UserPlus} />
        </section>

        {/* Table Section */}
        <section className="bg-white shadow-md rounded-b-lg p-15 w-[1368px] h-[782px] shadow-slate-200 relative">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tambah Pengguna
            </button>
            <input
              type="text"
              placeholder="Cari pengguna..."
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
        {/* Modal Tambah Pengguna */}
        <AppTambahPengguna
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchData}
        />
        <AppEditPengguna
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            fetchData();
            setShowEditModal(false);
          }}
          initialData={editData}
        />
      </main>
    </div>
  );
}

export default KelolaPengguna;