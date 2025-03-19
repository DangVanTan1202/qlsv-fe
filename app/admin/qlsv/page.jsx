"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState(null);
  const [studentRoleId, setStudentRoleId] = useState(null);
  const router = useRouter();

  useEffect(() => {
     
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.log("Không tìm thấy user, chuyển về login");
      router.push("/login");
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log("Dữ liệu user từ localStorage:", parsedUser);

      if (!parsedUser.loaiTK || parsedUser.loaiTK !== "admin") {
        console.log("Không phải admin, chuyển về login");
        router.push("/login");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Lỗi đọc dữ liệu user:", error);
      localStorage.removeItem("user");
      router.push("/login");
    }

    fetch("http://localhost:3001/LoaiTk")
      .then((res) => res.json())
      .then((data) => {
        const studentRole = data.find((role) => role.code === "sinhvien");
        if (studentRole) {
          setStudentRoleId(studentRole.id);
        }
      });
    fetch("http://localhost:3001/SinhVien")
      .then((res) => res.json())
      .then((data) => setStudents(data));

    fetch("http://localhost:3001/LopHoc")
      .then((res) => res.json())
      .then((data) => setClasses(data));

    fetch("http://localhost:3001/User")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [router]);

  const availableUsers = users.filter(
    (user) =>
      user.LoaiTk_Id === studentRoleId &&
      !students.some((student) => student.user_id === user.id)
  );
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };
  useEffect(() => {
    console.log("editingStudent:", editingStudent);
    console.log("newStudent:", newStudent);
    console.log("availableUsers:", availableUsers);
  }, [editingStudent, newStudent, availableUsers]);

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/SinhVien/${id}`, { method: "DELETE" }).then(
      () => setStudents((prev) => prev.filter((s) => s.id !== id))
    );
  };

  const handleSave = () => {
    const studentData = editingStudent || newStudent;
    const method = editingStudent ? "PUT" : "POST";
    const url = editingStudent
      ? `http://localhost:3001/SinhVien/${editingStudent.id}`
      : "http://localhost:3001/SinhVien";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    })
      .then((res) => res.json())
      .then((data) => {
        setStudents((prev) =>
          editingStudent
            ? prev.map((s) => (s.id === data.id ? data : s))
            : [...prev, data]
        );
        setEditingStudent(null);
        setNewStudent(null);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-white text-slate-800">
    <div className="flex flex-1">
      <Sidebar user={user} className="h-auto min-h-full" />
      <main className="flex-1 p-10 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <section className="mt-10 flex flex-col relative">
          <h1 className="text-3xl font-extrabold text-orange-500 text-left mb-6">Quản Lý Sinh Viên</h1>
          <button
            className="bg-pink-600 text-white px-5 py-3 rounded mb-6 w-fit"
            onClick={() => setNewStudent({ maSinhVien: "", ngaySinh: "", idLopHoc: "", user_id: availableUsers.length > 0 ? availableUsers[0].id : "" })}
          >
            + Thêm Sinh Viên
          </button>
          <table className="w-full bg-amber-50 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-stone-400">
              <tr>
                <th className="p-4 text-left">Mã Sinh Viên</th>
                <th className="p-4 text-left">Ngày Sinh</th>
                <th className="p-4 text-left">Lớp Học</th>
                <th className="p-4 text-left">Tài Khoản</th>
                <th className="p-4 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="p-4">{student.maSinhVien}</td>
                  <td className="p-4">{student.ngaySinh}</td>
                  <td className="p-4">{classes.find((c) => c.id === student.idLopHoc)?.tenLop || "Chưa có"}</td>
                  <td className="p-4">{users.find((u) => u.id === student.user_id)?.hoTen || "Chưa có"}</td>
                  <td className="p-4 flex gap-2">
                    <button className="bg-cyan-400 text-white px-3 py-1 rounded" onClick={() => handleEdit(student)}>Sửa</button>
                    <button className="bg-orange-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(student.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(editingStudent || newStudent) && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white p-10 rounded-lg shadow-xl w-96 border border-gray-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-700">{editingStudent ? "Chỉnh sửa Sinh Viên" : "Thêm mới Sinh Viên"}</h2>
                <button className="text-red-600 text-4xl font-bold hover:text-red-800" onClick={() => { setEditingStudent(null); setNewStudent(null); }}>×</button>
              </div>
              <label className="block text-gray-600 font-semibold">Mã Sinh Viên:</label>
              <input type="text" className="border p-2 w-full mb-3 rounded shadow-sm" value={editingStudent?.maSinhVien || newStudent?.maSinhVien} onChange={(e) => { const value = e.target.value; editingStudent ? setEditingStudent({ ...editingStudent, maSinhVien: value }) : setNewStudent({ ...newStudent, maSinhVien: value }); }} />
              <label className="block text-gray-600 font-semibold">Ngày Sinh:</label>
              <input type="date" className="border p-2 w-full mb-3 rounded shadow-sm" value={editingStudent?.ngaySinh || newStudent?.ngaySinh} onChange={(e) => { const value = e.target.value; editingStudent ? setEditingStudent({ ...editingStudent, ngaySinh: value }) : setNewStudent({ ...newStudent, ngaySinh: value }); }} />
              <label className="block text-gray-600 font-semibold">Lớp Học:</label>
              <select className="border p-2 w-full mb-3 rounded shadow-sm" value={editingStudent?.idLopHoc || newStudent?.idLopHoc} onChange={(e) => { const value = Number(e.target.value); editingStudent ? setEditingStudent({ ...editingStudent, idLopHoc: value }) : setNewStudent({ ...newStudent, idLopHoc: value }); }}>
                <option value="">-- Chọn lớp --</option>
                {classes.map((cls) => (<option key={cls.id} value={cls.id}>{cls.tenLop}</option>))}
              </select>
              <label className="block text-gray-600 font-semibold">Tài Khoản:</label>
              <select className="border p-2 w-full mb-6 rounded shadow-sm" value={editingStudent?.user_id ?? newStudent?.user_id ?? ""} onChange={(e) => { const value = e.target.value ? e.target.value : ""; editingStudent ? setEditingStudent({ ...editingStudent, user_id: value }) : setNewStudent({ ...newStudent, user_id: value }); }}>
                <option value="">-- Chọn tài khoản --</option>
                {availableUsers.map((user) => (<option key={user.id} value={user.id}>{user.hoTen}</option>))}
              </select>
              <button className="bg-rose-500 text-white px-6 py-3 w-full rounded-lg font-semibold shadow-md hover:bg-rose-600 transition"  onClick={handleSave}  >Lưu</button>
            </div>
          )}
        </section>
      </main>
    </div>
  </div>
  );
}
