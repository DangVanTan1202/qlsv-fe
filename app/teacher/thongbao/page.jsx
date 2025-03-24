"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThongBao() {
  const [bảngĐiểm, setBảngĐiểm] = useState([]);
  const [giangVienId, setGiangVienId] = useState(null);
  const [monHocs, setMonHocs] = useState([]);
  const [lopHocs, setLopHocs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      fetch(`http://localhost:3001/GiangVien`)
        .then((res) => res.json())
        .then((data) => {
          const giangVien = data.find((gv) => gv.user_id === storedUser.id);
          if (giangVien) setGiangVienId(giangVien.id);
        });
    }
  }, []);

  useEffect(() => {
    if (giangVienId) {
      fetch("http://localhost:3001/DiemSo")
        .then((res) => res.json())
        .then((data) => {
          const filteredData = data.filter((d) => d.id_GiangVien === giangVienId);
          const uniqueBảngĐiểm = [];
          const addedKeys = new Set();

          filteredData.forEach((d) => {
            const key = `${d.id_LopHoc}-${d.id_MonHoc}`;
            if (!addedKeys.has(key)) {
              uniqueBảngĐiểm.push(d);
              addedKeys.add(key);
            }
          });

          setBảngĐiểm(uniqueBảngĐiểm);
        });

      fetch("http://localhost:3001/MonHoc")
        .then((res) => res.json())
        .then((data) => setMonHocs(data));

      fetch("http://localhost:3001/LopHoc")
        .then((res) => res.json())
        .then((data) => setLopHocs(data));
    }
  }, [giangVienId]);

  const getMonHocName = (id) => {
    const mon = monHocs.find((m) => m.id === id);
    return mon ? mon.tenMonHoc : "Không xác định";
  };

  const getLopHocName = (id) => {
    const lop = lopHocs.find((l) => l.id === id);
    return lop ? lop.tenLop : "Không xác định";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Thông báo bảng điểm</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-600">✅ Bảng điểm đã duyệt</h3>
        {bảngĐiểm.filter((d) => d.trangThai === "approved").length > 0 ? (
          <ul className="mt-2 space-y-2">
            {bảngĐiểm
              .filter((d) => d.trangThai === "approved")
              .map((d) => (
                <li key={`${d.id_LopHoc}-${d.id_MonHoc}`} className="p-3 border rounded bg-green-100">
                  📌 {getMonHocName(d.id_MonHoc)} - {getLopHocName(d.id_LopHoc)}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">Chưa có bảng điểm nào được duyệt.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-600">❌ Bảng điểm bị từ chối</h3>
        {bảngĐiểm.filter((d) => d.trangThai === "rejected").length > 0 ? (
          <ul className="mt-2 space-y-2">
            {bảngĐiểm
              .filter((d) => d.trangThai === "rejected")
              .map((d) => (
                <li
                  key={`${d.id_LopHoc}-${d.id_MonHoc}`}
                  className="p-3 border rounded bg-red-100 flex justify-between items-center"
                >
                  📌 {getMonHocName(d.id_MonHoc)} - {getLopHocName(d.id_LopHoc)}
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() =>
                      router.push(
                        `/teacher/diem?lopHoc=${d.id_LopHoc}&monHoc=${d.id_MonHoc}`
                      )
                    }
                  >
                    Nhập lại điểm
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">Không có bảng điểm nào bị từ chối.</p>
        )}
      </div>
    </div>
  );
}
