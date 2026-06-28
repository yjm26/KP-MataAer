import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AppLoginForm from "@/layouts/app-login-form";
import { login } from "@/services/authService"; 

function Login() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const user = await login({
        email: data.username,
        password: data.password,
      });
      console.log("user dari backend:", user);
      // Simpan role, user, dan email ke localStorage
      if (user && user.role && user.role !== "undefined") {
        localStorage.setItem("role", user.role.trim().toLowerCase());
      }
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("email", user.email); // <-- Tambahkan baris ini
      alert("Login berhasil!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex-1 relative flex flex-col justify-center items-center bg-gradient-to-bl from-[#0575E6] via-[#02298A] to-[#021B79] text-white p-8 overflow-hidden">
        <div className="absolute w-[585px] h-[634px] rounded-full border-2 border-blue-300 opacity-30 bottom-[-650px] left-7 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-[673px] h-[661px] rounded-full border-2 border-blue-300 opacity-30 bottom-[-750px] left-30 transform -translate-x-1/2 -translate-y-1/2"></div>
        <h1 className="text-5xl font-bold mb-2">Mata Aer Makmurindo</h1>
        <p className="text-lg">Trusted parking professional</p>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8">
        <AppLoginForm form={form} onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export default Login;