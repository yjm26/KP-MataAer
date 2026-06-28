import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SuratMasuk from "./pages/surat-masuk";
import SuratKeluar from "./pages/surat-keluar";
import Login from "./pages/login";
import Refrensi from "./pages/refrensi";
import TambahSuratMasuk from "./pages/tambah-surat-masuk";
import TambahSuratKeluar from "./pages/tambah-surat-keluar";
import EditSuratMasuk from "./pages/edit-surat-masuk";
import Dashboard from "./pages/dashboard";
import AgendaSuratMasuk from "./pages/agenda-surat-masuk"
import AgendaSuratKeluar from "./pages/agenda-surat-keluar"
import EditSuratKeluar from "./pages/edit-surat-keluar";
import KelolaPengguna from "./pages/kelola-pengguna";



function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Sub Route Dashboard */}
        <Route path="/dashboard/surat-masuk" element={<SuratMasuk />} />
        <Route path="/dashboard/surat-keluar" element={<SuratKeluar />} />
        <Route path="/dashboard/agenda-surat-masuk" element={<AgendaSuratMasuk />} />
        <Route path="/dashboard/agenda-surat-keluar" element={<AgendaSuratKeluar />} />
        <Route path="/dashboard/refrensi" element={<Refrensi />} />
        <Route path="/dashboard/kelola-pengguna" element={<KelolaPengguna/>}/>

        {/* Sub Route Tambah*/}
        <Route path="/dashboard/surat-masuk/tambah-surat-masuk" element={<TambahSuratMasuk />} />
        <Route path="/dashboard/surat-keluar/tambah-surat-keluar" element={<TambahSuratKeluar />} />
        <Route path="/dashboard/surat-masuk/edit/:nomorSurat" element={<EditSuratMasuk />} />
        <Route path="/dashboard/surat-keluar/edit/:nomorSurat" element={<EditSuratKeluar />} />
        
      </Routes>
    </Router>
  );
}

export default AppRoutes;