"use client";

import { useState, useEffect } from "react";

export default function XemDiem() {
  const [diemSo, setDiemSo] = useState([]);
  const [monHocs, setMonHocs] = useState([]);
  const [lopHocs, setLopHocs] = useState([]);

  useEffect(() => {
    // Lấy danh sách điểm đã duyệt
    fetch("http://localhost:3001/DiemSo")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu điểm số:", data);
        // Chỉ lấy điểm đã được duyệt (approved)
        const diemDaDuyet = data.filter((d) => d.trangThai === "approved");
        setDiemSo(diemDaDuyet);
      })
      .catch((error) => console.error("Lỗi lấy danh sách điểm:", error));

    // Lấy danh sách môn học
    fetch("http://localhost:3001/MonHoc")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu môn học:", data);
        setMonHocs(data);
      })
      .catch((error) => console.error("Lỗi lấy danh sách môn học:", error));

    // Lấy danh sách lớp học
    fetch("http://localhost:3001/LopHoc")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu lớp học:", data);
        setLopHocs(data);
      })
      .catch((error) => console.error("Lỗi lấy danh sách lớp học:", error));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Bảng điểm của bạn</h2>

      {diemSo.length === 0 ? (
        <p className="text-gray-500">Chưa có điểm nào được duyệt.</p>
      ) : (
        <table className="w-full border-collapse border mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Lớp Học</th>
              <th className="border p-2">Môn Học</th>
              <th className="border p-2">Điểm</th>
            </tr>
          </thead>
          <tbody>
            {diemSo.map((diem) => {
              const lop = lopHocs.find((l) => l.id === diem.id_LopHoc);
              const mon = monHocs.find((m) => m.id === diem.id_MonHoc);
              return (
                <tr key={diem.id}>
                  <td className="border p-2">{lop?.tenLop || "N/A"}</td>
                  <td className="border p-2">{mon?.tenMon || "N/A"}</td>
                  <td className="border p-2">{diem.diem}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
