const API_URL = `${import.meta.env.VITE_API_URL}/api/login`;

export async function login({ email, password }) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login gagal");
  const user = await res.json();
  return user;
}
