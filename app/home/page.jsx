"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
 
  useEffect(() => {
    if (typeof window !== "undefined") {
        // Chỉ truy cập localStorage khi đang chạy trên client
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/login"); // Nếu chưa đăng nhập, điều hướng về login
          return;
        }
  
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Lỗi đọc dữ liệu user:", error);
          localStorage.removeItem("user");
          router.push("/login");
        }
      }
    }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const sections = [
    {
      name: "Đào tạo nghiên cứu",
      link: "/dao-tao-nghien-cuu",
      descriptions: [
        "Lễ trao giải sinh viên xuất sắc...",
        "Hội thảo khoa học quốc tế...",
        "Chương trình nghiên cứu mới...",
      ],
      image: "/research.jpg",
    },
    {
      name: "Tuyển sinh",
      link: "/tuyen-sinh",
      descriptions: [
        "Thông tin xét tuyển năm 2025...",
        "Học bổng hỗ trợ sinh viên...",
        "Chương trình du học trao đổi...",
      ],
      image: "/admissions.jpg",
    },
    {
      name: "Liên kết đối tác",
      link: "/lien-ket-doi-tac",
      descriptions: [
        "Hợp tác chiến lược với doanh nghiệp...",
        "Chương trình thực tập sinh tài năng...",
        "Hội nghị ký kết hợp tác...",
      ],
      image: "/lienket.jpg",
    },
    {
      name: "Thông báo mới",
      link: "/thong-bao",
      descriptions: [
        "Cập nhật quan trọng từ nhà trường...",
        "Lịch nghỉ Tết và lịch thi...",
        "Cảnh báo lừa đảo học bổng giả mạo...",
      ],
      image: "/thongbao.jpg",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-white text-orange-800">
      <div className="flex flex-1">
        <Sidebar user={user} className="h-auto min-h-full" />
        <main className="flex-1 p-10 flex flex-col">
          <Header user={user} onLogout={handleLogout} />
          <section className="mt-10 flex flex-col">
          <h1 className="text-5xl font-extrabold text-orange-500 text-left mb-20 tracking-wider relative">
  <span className="bg-gradient-to-r from-orange-500 to-yellow-400 text-transparent bg-clip-text drop-shadow-lg">
    KHÁM PHÁ HỆ THỐNG
  </span>
   </h1>

  <div className="flex flex-col gap-8">
    {sections.map((section, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className={`relative flex flex-col md:flex-row items-center 
          rounded-lg shadow-md bg-gray-900 border border-gray-800 
          hover:border-sky-500 transition-all ${
            index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
          }`}
      >
        {/* Hình ảnh */}
        <div className="w-full md:w-1/3 h-60 overflow-hidden rounded-t-lg md:rounded-t-none md:rounded-l-lg">
          <img
            src={section.image}
            alt={section.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Nội dung */}
        <div className="w-full md:w-2/3 p-6 text-white">
          <h2 className="text-2xl font-semibold text-sky-400 mb-3">
            {section.name}
          </h2>

          {/* Mỗi mục xuống hàng */}
          <ul className="text-gray-300 space-y-2 list-disc pl-5">
            {section.descriptions.map((desc, i) => (
              <li key={i}>{desc}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    ))}
  </div>
</section>
    </main>
      </div>
      <Footer />
    </div>
  );
}
