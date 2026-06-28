const API_URL = `${import.meta.env.VITE_API_URL}/api/surat-masuk`;

// GET semua surat masuk
export async function getSuratMasuk() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Gagal mengambil data surat masuk");
  return await res.json();
}

// GET surat masuk by nomor_surat
export async function getSuratMasukById(nomor_surat) {
  const res = await fetch(`${API_URL}/${nomor_surat}`);
  if (!res.ok) throw new Error("Surat tidak ditemukan");
  return await res.json();
}

// CREATE surat masuk baru
export async function addSuratMasuk(data) {
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
    throw new Error(responseBody.error || "Gagal menambah surat masuk");
  }
  return responseBody;
}

// UPDATE surat masuk
export async function updateSuratMasuk(nomorSurat, formData) {
  const res = await fetch(`${API_URL}/${nomorSurat}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// DELETE surat masuk
export async function deleteSuratMasuk(nomor_surat) {
  const response = await fetch(`${API_URL}/${nomor_surat}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Gagal menghapus surat masuk');
  return response.json();
}
