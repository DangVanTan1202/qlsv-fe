"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  // State lưu trữ thông tin tài khoản
  const [form, setForm] = useState({ tenTaiKhoan: "", matKhau: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Hàm lấy ảnh avatar động theo trạng thái nhập liệu
  const getAvatarSrc = () => {
    const length = form.tenTaiKhoan.length;
    if (showPassword) return "/showpassword.png";
    if (focusedField === "matKhau" || (form.matKhau.length > 0 && focusedField !== "tenTaiKhoan")) 
      return "/textbox_password.png"; 
    if (focusedField === "tenTaiKhoan" && form.tenTaiKhoan.length === 0) return "/textbox_user_Clicked.JPG";
    if (length === 0) return "/debut.jpg"; 
    return `/textbox_user_${Math.min(length, 24)}.jpg`;
  };

  // Debug: Kiểm tra field nào đang focus
  useEffect(() => {
    console.log("focusedField:", focusedField);
    console.log("Tên tài khoản length:", form.tenTaiKhoan.length);
  }, [focusedField, form.tenTaiKhoan]);

  // Hàm xử lý khi submit form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      //  Gọi API lấy danh sách user
      const res = await fetch("http://localhost:3001/User");
      if (!res.ok) throw new Error("Không thể kết nối đến máy chủ!");
      const users = await res.json();
  
      //  Kiểm tra user đăng nhập
      const user = users.find(
        (u) => u.tenTaiKhoan === form.tenTaiKhoan && u.matKhau === form.matKhau
      );
      if (!user) throw new Error("Sai tài khoản hoặc mật khẩu!");
  
      // Gọi API lấy thông tin quyền từ LoaiTk
      const roleRes = await fetch(`http://localhost:3001/LoaiTk?id=${user.LoaiTk_Id}`);
      if (!roleRes.ok) throw new Error("Không tìm thấy quyền hoặc API bị lỗi!");
  
      const roleData = await roleRes.json();
      if (roleData.length === 0) throw new Error("Quyền không tồn tại!");
  
      const LoaiTK = roleData[0]; // JSON Server trả về một mảng, cần lấy phần tử đầu tiên
  
      //  Lưu thông tin user & quyền vào localStorage
      localStorage.setItem("user", JSON.stringify({ id: user.id, loaiTK: LoaiTK.code }));
      router.push(`/home`);
    } catch (err) {
      setError(err.message);
    }
  };
  
return (
    <div className="relative w-full h-screen flex flex-col bg-gradient-to-b from-yellow-300 to-orange-500">
      <div className="absolute inset-0 bg-cover bg-center " style={{ backgroundImage: "url('/daihoc.webp')" }}></div>
      <header className="w-full bg-red-700 text-white shadow-md py-4 px-8 flex justify-between items-center fixed top-0 z-10">
        <h1 className="text-2xl font-bold">Hệ Thống Quản Lý Sinh Viên</h1>
        <nav className="space-x-6">
          <Button variant="ghost" className="text-white" onClick={() => router.push("/contact")}>Liên Hệ hỗ trợ</Button>
        </nav>
      </header>
      <div className="flex flex-grow mt-20 relative z-10 px-4">
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md bg-blue-100/30 p-8 shadow-2xl rounded-2xl border border-orange-600 backdrop-blur-md">
            <div className="flex justify-center mb-6">
              <Image src={getAvatarSrc()} alt="Avatar" width={120} height={120} className="rounded-full border-4 border-orange-600 shadow-lg transition-all duration-300" />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input placeholder="Tên đăng nhập" value={form.tenTaiKhoan} onChange={(e) => setForm({ ...form, tenTaiKhoan: e.target.value })} onFocus={() => setFocusedField("tenTaiKhoan")} onBlur={() => setFocusedField("")} className="w-full bg-white border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500" />
              <div className="relative">
                <Input placeholder="Mật khẩu" type={showPassword ? "text" : "password"} value={form.matKhau} onChange={(e) => setForm({ ...form, matKhau: e.target.value })} onFocus={() => setFocusedField("matKhau")} onBlur={() => setFocusedField("")} className="w-full bg-white border rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-orange-500" />
                <button type="button" className="absolute right-3 top-3 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold shadow-md">Đăng Nhập</Button>
              </motion.div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-black-600">Chưa có tài khoản !</p>
              <Button variant="outline" className="mt-2 w-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white" onClick={() => router.push("/register")}>Đăng Ký Ngay</Button>
            </div>
          </motion.div>
        </div>
        <div className="hidden md:flex w-1/2 relative items-center justify-center p-6">
          <div className="relative w-4/5 max-w-[400px]">
            <img src="/qlsv-removebg-preview.png" alt="nón sinh viên" className="w-full h-full object-cover" />
            <br />
            <br />
            <br />
            <div className="absolute bottom-5 w-full text-center">
              <h2 className="text-2xl font-extrabold text-red-600 drop-shadow-3xl tracking-wide [text-shadow:_2px_2px_0px_black,_-2px_-2px_0px_black]">
                Quản Lý Sinh Viên
              </h2>
              <span className="text-lg font-medium text-blue-950 italic animate-pulse [text-shadow:_1px_1px_0px_black,_-1px_-1px_0px_black]">
                Thân thiện - Hiệu quả
              </span>
            </div>
          </div>
        </div>
      </div>
     <footer className="w-full bg-gray-900 text-white text-center py-4 absolute bottom-0">&copy; 2025 Hệ Thống Quản Lý Sinh Viên - All Rights Reserved</footer>
    </div>
  );
}