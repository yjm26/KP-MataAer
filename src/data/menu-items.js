import { LayoutDashboard, Mails, Notebook, LibraryBig, LogOut } from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transaksi Surat",
    icon: Mails,
    children: [
      { title: "Surat Masuk", url: "/dashboard/surat-masuk" },
      { title: "Surat Keluar", url: "/dashboard/surat-keluar" },
    ],
  },
  {
    title: "Buku Agenda",
    url: "#",
    icon: Notebook,
    children: [
      { title: "Surat Masuk", url: "/dashboard/agenda-surat-masuk" },
      { title: "Surat Keluar", url: "/dashboard/agenda-surat-keluar" },
    ],
  },
  {
    title: "Refrensi",
    url: "/dashboard/refrensi",
    icon: LibraryBig,
  },
  {
    title: "Kelola Pengguna",
    url: "/dashboard/kelola-pengguna",
    icon: LibraryBig,
    adminOnly: true, 
  },
];

export function getFooterItem() {
  return {
    img: "/img/profile.png",
    user: localStorage.getItem("email") || "User",
    url: "#logout",
    icon: LogOut,
  };
}

