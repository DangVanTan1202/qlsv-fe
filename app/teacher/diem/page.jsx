"use client";

import { useState, useEffect } from "react";

export default function NhapDiem() {
  const [monHocs, setMonHocs] = useState([]);
  const [lopHocs, setLopHocs] = useState([]);
  const [sinhViens, setSinhViens] = useState([]);
  const [users, setUsers] = useState([]);
  const [diemSo, setDiemSo] = useState({});
  const [selectedMonHoc, setSelectedMonHoc] = useState("");
  const [selectedLopHoc, setSelectedLopHoc] = useState("");
  const [userGiangVien, setUserGiangVien] = useState(null);
  const [giangVienId, setGiangVienId] = useState(null); // Lưu id giảng viên thật

  // Lấy user đang đăng nhập từ localStorage hoặc API
  useEffect(() => {
    console.log("User đăng nhập từ localStorage:", localStorage.getItem("user"));
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
        console.log("User ID sau khi lấy từ localStorage:", storedUser.id);
      setUserGiangVien(storedUser.id);
    }

   fetch("http://localhost:3001/User")//lấy user bằng API
     .then((res) => res.json())
           .then((data) => setUserGiangVien(data.id))
      .catch((error) => console.error("Lỗi lấy user đăng nhập:", error));
   }, []);

  // Khi có user_id, tìm giảng viên
  useEffect(() => {
    if (userGiangVien) {
      fetch("http://localhost:3001/GiangVien")
        .then((res) => res.json())
        .then((data) => {
          const giangVien = data.find((gv) => gv.user_id.toString() === userGiangVien.toString());
          if (giangVien) {
            setGiangVienId(giangVien.id);
          } else {
            console.warn("Không tìm thấy giảng viên với user_id:", userGiangVien);
          }
        })
        .catch((error) => console.error("Lỗi fetch GiangVien:", error));
    }
  }, [userGiangVien]);

  // Khi có id giảng viên, lọc môn học mà giảng viên đó dạy
  useEffect(() => {
    if (giangVienId) {
      fetch("http://localhost:3001/MonHoc")
        .then((res) => res.json())
        .then((data) => {
          console.log("Dữ liệu MonHoc từ API:", data);
          console.log("GiangVienId hiện tại:", giangVienId);
          const monGiangDay = data.filter((mon) => mon.id_GiangVien.toString() === giangVienId.toString());
          console.log("Môn học giảng viên đang dạy:", monGiangDay);
          setMonHocs(monGiangDay);
        })
        .catch((error) => console.error("Lỗi fetch MonHoc:", error));
    }
  }, [giangVienId]);
  
  useEffect(() => {
    fetch("http://localhost:3001/LopHoc")
      .then((res) => res.json())
      .then((data) => setLopHocs(data));

    fetch("http://localhost:3001/User")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    if (selectedLopHoc) {
      fetch("http://localhost:3001/SinhVien")
        .then((res) => res.json())
        .then((data) => {
          const sinhVienLop = data.filter((sv) => sv.id_LopHoc === parseInt(selectedLopHoc));
          setSinhViens(sinhVienLop);
        });
    }
  }, [selectedLopHoc]);

  const handleDiemChange = (sinhVienId, value) => {
    setDiemSo({ ...diemSo, [sinhVienId]: value });
  };

  const handleSubmit = async () => {
    const diemData = sinhViens.map((sv) => ({
      id_SinhVien: sv.id,
      id_MonHoc: parseInt(selectedMonHoc),
      diem: parseFloat(diemSo[sv.id]) || 0,
      id_GiangVien: giangVienId,
    }));

    await Promise.all(
      diemData.map((diem) =>
        fetch("http://localhost:3001/DiemSo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(diem),
        })
      )
    );

    alert("Nộp điểm thành công!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Nhập điểm</h2>

      <label className="block mb-2">Chọn Môn Học:</label>
      <select
        className="w-full p-2 border rounded-md mb-4"
        onChange={(e) => setSelectedMonHoc(e.target.value)}
        value={selectedMonHoc}
      >
        <option value="">-- Chọn môn học --</option>
        {monHocs.length > 0 ? (
          monHocs.map((mon) => (
            <option key={mon.id} value={mon.id}>
              {mon.tenMonHoc}
            </option>
          ))
        ) : (
          <option disabled>Không có môn học</option>
        )}
      </select>

      <label className="block mb-2">Chọn Lớp Học:</label>
      <select
        className="w-full p-2 border rounded-md mb-4"
        onChange={(e) => setSelectedLopHoc(e.target.value)}
        value={selectedLopHoc}
      >
        <option value="">-- Chọn lớp học --</option>
        {lopHocs.map((lop) => (
          <option key={lop.id} value={lop.id}>
            {lop.tenLop}
          </option>
        ))}
      </select>

      {sinhViens.length > 0 && (
        <>
          <table className="w-full border-collapse border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Mã SV</th>
                <th className="border p-2">Họ Tên</th>
                <th className="border p-2">Điểm</th>
              </tr>
            </thead>
            <tbody>
              {sinhViens.map((sv) => {
                const user = users.find((u) => u.id === sv.user_id);
                return (
                  <tr key={sv.id}>
                    <td className="border p-2">{sv.maSinhVien}</td>
                    <td className="border p-2">{user ? user.hoTen : "N/A"}</td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full p-2 border rounded-md"
                        min="0"
                        max="10"
                        step="0.1"
                        value={diemSo[sv.id] || ""}
                        onChange={(e) => handleDiemChange(sv.id, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button
            className="w-full bg-blue-500 text-white p-3 mt-4 rounded-md hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Nộp Điểm
          </button>
        </>
      )}
    </div>
  );
}
