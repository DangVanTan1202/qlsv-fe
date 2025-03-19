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
         <div className="flex min-h-screen bg-gray-100 text-gray-800">
               <Sidebar user={user} />
               <div className="flex-1 p-6">
                 <Header user={user} onLogout={handleLogout}/>
        <div className="p-6">
          <button
            className="bg-green-500 text-white px-4 py-2 mb-4"
            onClick={() =>
              setNewStudent({
                maSinhVien: "",
                ngaySinh: "",
                idLopHoc: "",
                user_id: availableUsers.length > 0 ? availableUsers[0].id : "", // Set giá trị mặc định
              })
            }
          >
            + Thêm Sinh Viên
          </button>

          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="border px-4 py-2">Mã Sinh Viên</th>
                <th className="border px-4 py-2">Ngày Sinh</th>
                <th className="border px-4 py-2">Lớp Học</th>
                <th className="border px-4 py-2">Tài Khoản</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border">
                  <td className="border px-4 py-2">{student.maSinhVien}</td>
                  <td className="border px-4 py-2">{student.ngaySinh}</td>
                  <td className="border px-4 py-2">
                    {classes.find((c) => c.id === student.idLopHoc)?.tenLop ||
                      "Chưa có"}
                  </td>
                  <td className="border px-4 py-2">
                    {users.find((u) => u.id === student.user_id)?.hoTen ||
                      "Chưa có"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 mr-2"
                      onClick={() => handleEdit(student)}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1"
                      onClick={() => handleDelete(student.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {(editingStudent || newStudent) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-lg font-bold">
              {editingStudent ? "Chỉnh sửa" : "Thêm mới"}
            </h2>
            <label>Mã Sinh Viên:</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={editingStudent?.maSinhVien || newStudent?.maSinhVien}
              onChange={(e) => {
                const value = e.target.value;
                editingStudent
                  ? setEditingStudent({ ...editingStudent, maSinhVien: value })
                  : setNewStudent({ ...newStudent, maSinhVien: value });
              }}
            />
            <label>Ngày Sinh:</label>
            <input
              type="date"
              className="border p-2 w-full"
              value={editingStudent?.ngaySinh || newStudent?.ngaySinh}
              onChange={(e) => {
                const value = e.target.value;
                editingStudent
                  ? setEditingStudent({ ...editingStudent, ngaySinh: value })
                  : setNewStudent({ ...newStudent, ngaySinh: value });
              }}
            />
            <label>Lớp Học:</label>
            <select
              className="border p-2 w-full"
              value={editingStudent?.idLopHoc || newStudent?.idLopHoc}
              onChange={(e) => {
                const value = Number(e.target.value);
                editingStudent
                  ? setEditingStudent({ ...editingStudent, idLopHoc: value })
                  : setNewStudent({ ...newStudent, idLopHoc: value });
              }}
            >
              <option value="">-- Chọn lớp --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.tenLop}
                </option>
              ))}
            </select>
            <label>Tài Khoản:</label>
            <select
              className="border p-2 w-full"
              value={editingStudent?.user_id ?? newStudent?.user_id ?? ""}
              onChange={(e) => {
                const value = e.target.value ? e.target.value : "";
                if (editingStudent) {
                  setEditingStudent({ ...editingStudent, user_id: value });
                } else {
                  setNewStudent({ ...newStudent, user_id: value });
                }
              }}
            >
              <option value="">-- Chọn tài khoản --</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.hoTen}
                </option>
              ))}
            </select>

            <button
              className="bg-green-500 text-white px-4 py-2 mt-4"
              onClick={handleSave}
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
