const API_URL = `${import.meta.env.VITE_API_URL}/api/refrensi`;

// GET semua klasifikasi
export async function getKlasifikasi() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Gagal mengambil data klasifikasi");
  return await res.json();
}

// POST tambah klasifikasi baru
export async function addKlasifikasi(klasifikasi) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ klasifikasi }),
  });

  let responseBody;
  try {
    responseBody = await res.json();
  } catch {
    responseBody = {};
  }

  if (!res.ok) {
    throw new Error(responseBody.error || "Gagal menambah klasifikasi");
  }
  return responseBody;
}

// PUT update total_surat
export async function updateTotalSurat(id, total_surat) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ total_surat }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// DELETE klasifikasi
export async function deleteKlasifikasi(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal menghapus klasifikasi");
  return await res.json();
}
