const API_URL = `${import.meta.env.VITE_API_URL}/api/surat-keluar`;

// GET semua surat keluar
export async function getSuratKeluar() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Gagal mengambil data surat keluar");
  return await res.json();
}

// GET surat keluar by nomor_surat
export async function getSuratKeluarById(nomor_surat) {
  const res = await fetch(`${API_URL}/${nomor_surat}`);
  if (!res.ok) throw new Error("Surat tidak ditemukan");
  return await res.json();
}

// CREATE surat keluar baru
export async function addSuratKeluar(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers: data instanceof FormData ? undefined : { "Content-Type": "application/json" },
  });

  let responseBody;
  try {
    responseBody = await res.json();
  } catch {
    responseBody = {};
  }

  if (!res.ok) {
    // Jika backend mengirim error detail, lempar error dengan pesan itu
    throw new Error(responseBody.error || "Gagal menambah surat keluar");
  }
  return responseBody;
}

// UPDATE surat keluar
export async function updateSuratKeluar(nomorSurat, formData) {
  const res = await fetch(`${API_URL}/${nomorSurat}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// DELETE surat keluar
export async function deleteSuratKeluar(nomor_surat) {
  const response = await fetch(`${API_URL}/${nomor_surat}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Gagal menghapus surat keluar');
  return response.json();
}
