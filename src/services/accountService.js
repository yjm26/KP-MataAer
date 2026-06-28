const API_URL = `${import.meta.env.VITE_API_URL}/api/accounts`;

export async function getAccounts() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Gagal mengambil data akun');
  return response.json();
}

export async function createAccount({ id, email, password, role}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, email, password, role }),
  });
  if (!response.ok) throw new Error('Gagal membuat akun');
  return response.json();
}

export async function deleteAccount(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Gagal menghapus akun');
  return response.json();
}

export async function updateAccount(id, { email, password, role }) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  if (!response.ok) throw new Error('Gagal mengupdate akun');
  return response.json();
}
