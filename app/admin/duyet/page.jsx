"use client";

import { useState, useEffect } from "react";

export default function DuyetDiem() {
  const [diemSo, setDiemSo] = useState([]);
  const [lopHocs, setLopHocs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/DiemSo")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu điểm số:", data); // 🔍 Kiểm tra dữ liệu nhận từ API
        const pendingDiem = data.filter((d) => d.trangThai === "pending");
        setDiemSo(pendingDiem);
      })
      .catch((error) => console.error("Lỗi lấy danh sách điểm:", error));

    fetch("http://localhost:3001/LopHoc")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu lớp học:", data); // 🔍 Kiểm tra dữ liệu lớp học
        setLopHocs(data);
      })
      .catch((error) => console.error("Lỗi lấy danh sách lớp học:", error));
  }, []);

  // Lấy danh sách lớp học có điểm chờ duyệt
  const lopCoDiem = lopHocs.filter((lop) =>
    diemSo.some((diem) => diem.id_LopHoc === lop.id)
  );

  // Hàm duyệt toàn bộ điểm của một lớp
  const handleDuyetLop = async (id_LopHoc) => {
    const diemTrongLop = diemSo.filter((d) => d.id_LopHoc === id_LopHoc);
    await Promise.all(
      diemTrongLop.map((diem) =>
        fetch(`http://localhost:3001/DiemSo/${diem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trangThai: "approved" }),
        })
      )
    );

    // Cập nhật danh sách sau khi duyệt
    setDiemSo(diemSo.filter((d) => d.id_LopHoc !== id_LopHoc));
  };

  // Hàm từ chối toàn bộ điểm của một lớp
  const handleTuChoiLop = async (id_LopHoc) => {
    const diemTrongLop = diemSo.filter((d) => d.id_LopHoc === id_LopHoc);
    await Promise.all(
      diemTrongLop.map((diem) =>
        fetch(`http://localhost:3001/DiemSo/${diem.id}`, {
          method: "DELETE",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trangThai: "rejected" }),
        })
      )
    );

    // Cập nhật danh sách sau khi từ chối
    setDiemSo(diemSo.filter((d) => d.id_LopHoc !== id_LopHoc));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Duyệt điểm sinh viên</h2>

      {lopCoDiem.length === 0 ? (
        <p className="text-gray-500">Không có lớp nào cần duyệt điểm</p>
      ) : (
        <div>
          {lopCoDiem.map((lop) => (
            <div key={lop.id} className="mb-6 p-4 border rounded-md">
              <h3 className="text-xl font-semibold">{lop.tenLop}</h3>
              <table className="w-full border-collapse border mt-2">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">ID Sinh Viên</th>
                    <th className="border p-2">ID Môn Học</th>
                    <th className="border p-2">Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {diemSo
                    .filter((diem) => diem.id_LopHoc === lop.id)
                    .map((diem) => (
                      <tr key={diem.id}>
                        <td className="border p-2">{diem.id_SinhVien}</td>
                        <td className="border p-2">{diem.id_MonHoc}</td>
                        <td className="border p-2">{diem.diem}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-green-500 text-white p-2 rounded-md"
                  onClick={() => handleDuyetLop(lop.id)}
                >
                  Duyệt tất cả điểm
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded-md"
                  onClick={() => handleTuChoiLop(lop.id)}
                >
                  Từ chối tất cả điểm
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
