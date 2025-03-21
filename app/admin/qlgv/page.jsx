"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState(null);
  const [teacherRoleId, setTeacherRoleId] = useState(null);
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
      if (!parsedUser.loaiTK || parsedUser.loaiTK !== "admin") {
        router.push("/login");
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      localStorage.removeItem("user");
      router.push("/login");
    }

    fetch("http://localhost:3001/LoaiTk")
      .then((res) => res.json())
      .then((data) => {
        const teacherRole = data.find((role) => role.code === "giangvien");
        if (teacherRole) {
          setTeacherRoleId(teacherRole.id);
        }
      });

    fetch("http://localhost:3001/GiangVien")
      .then((res) => res.json())
      .then((data) => setTeachers(data));

    fetch("http://localhost:3001/User")
      .then((res) => res.json())
      .then((data) => {
        console.log("User Data:", data);
        setUsers(data);
      });

    fetch("http://localhost:3001/MonHoc")
      .then((res) => res.json())
      .then((data) => {
        console.log("Subjects Data:", data);
        setSubjects(data);
      });

    fetch("http://localhost:3001/LopHoc")
      .then((res) => res.json())
      .then((data) => {
        console.log("Classes Data:", data); // Kiểm tra dữ liệu
        setClasses(data);
      });
  }, [router]);

  const availableUsers = users.filter(
    (user) =>
      user.LoaiTk_Id === teacherRoleId &&
      !teachers.some((teacher) => teacher.user_id === user.id)
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/GiangVien/${id}`, { method: "DELETE" }).then(
      () => setTeachers((prev) => prev.filter((t) => t.id !== id))
    );
  };

  const handleSave = () => {
    const teacherData = editingTeacher || newTeacher;
    const method = editingTeacher ? "PUT" : "POST";
    const url = editingTeacher
      ? `http://localhost:3001/GiangVien/${editingTeacher.id}`
      : "http://localhost:3001/GiangVien";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacherData),
    })
      .then((res) => res.json())
      .then((data) => {
        setTeachers((prev) =>
          editingTeacher
            ? prev.map((t) => (t.id === data.id ? data : t))
            : [...prev, data]
        );
        setEditingTeacher(null);
        setNewTeacher(null);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-white text-slate-800">
      <div className="flex flex-1">
        <Sidebar user={user} className="h-auto min-h-full" />
        <main className="flex-1 p-10 flex flex-col">
          <Header user={user} onLogout={handleLogout} />
          <section className="mt-10 flex flex-col relative">
            <h1 className="text-3xl font-extrabold text-orange-500 text-left mb-6">
              Quản Lý Giảng Viên
            </h1>
            <button
              className="bg-pink-600 text-white px-5 py-3 rounded mb-6 w-fit"
              onClick={() =>
                setNewTeacher({
                  maGiangVien: "",
                  ngaySinh: "",
                  user_id: "",
                  id_MonHoc: "",
                  id_LopHoc: "",
                })
              }
            >
              + Thêm Giảng Viên
            </button>
            <table className="w-full bg-amber-50 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-stone-400">
                <tr>
                  <th className="p-4 text-left">Mã Giảng Viên</th>
                  <th className="p-4 text-left">Ngày Sinh</th>
                  <th className="p-4 text-left">Tài Khoản</th>
                  <th className="p-4 text-left">Môn Học</th>
                  <th className="p-4 text-left">Lớp Học</th>
                  <th className="p-4 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => {
                    // Kiểm tra nếu dữ liệu chưa có thì không hiển thị lỗi
                    if (!users.length || !subjects.length || !classes.length) {
                      return null;
                    }

                    // Tìm tài khoản theo ID
                    const user = users.find((u) => u.id == teacher.user_id);
                    const userName = user ? user.hoTen : "Chưa có";

                    // Tìm môn học theo ID
                    //const subject = subjects.find((s) => s.id === teacher.idMonHoc);
                    const subject = subjects.find(
                      (s) => s.id == Number(teacher.id_MonHoc)
                    );
                    const subjectName = subject ? subject.tenMonHoc : "Chưa có";

                    // Tìm lớp học theo ID
                    //const classItem = classes.find((c) => c.id === teacher.idLopHoc);
                    const classItem = classes.find(
                      (c) => c.id == Number(teacher.id_LopHoc)
                    );
                    const className = classItem ? classItem.tenLop : "Chưa có";

                    return (
                      <tr key={teacher.id} className="border-t">
                        <td className="p-4">{teacher.maGiangVien}</td>
                        <td className="p-4">{teacher.ngaySinh || "Chưa có"}</td>
                        <td className="p-4">{userName}</td>
                        <td className="p-4">{subjectName}</td>
                        <td className="p-4">{className}</td>
                        <td className="p-4 flex gap-2">
                          <button
                            className="bg-cyan-400 text-white px-3 py-1 rounded"
                            onClick={() => handleEdit(teacher)}
                          >
                            Sửa
                          </button>
                          <button
                            className="bg-orange-500 text-white px-3 py-1 rounded"
                            onClick={() => handleDelete(teacher.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      Không có dữ liệu giảng viên
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {(editingTeacher || newTeacher) && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white p-10 rounded-lg shadow-xl w-[40rem] border border-gray-300">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                  {editingTeacher
                    ? "Chỉnh sửa Giảng Viên"
                    : "Thêm mới Giảng Viên"}
                </h2>
                <button
                  className="text-red-600 text-4xl font-bold hover:text-red-800 absolute top-2 right-4"
                  onClick={() => {
                    setEditingTeacher(null);
                    setNewTeacher(null);
                  }}
                >
                  ×
                </button>

                {/* Form */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Mã Giảng Viên */}
                  <div>
                    <label className="block font-semibold mb-2">
                      Mã Giảng Viên
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={
                        editingTeacher?.maGiangVien ||
                        newTeacher?.maGiangVien ||
                        ""
                      }
                      onChange={(e) =>
                        editingTeacher
                          ? setEditingTeacher({
                              ...editingTeacher,
                              maGiangVien: e.target.value,
                            })
                          : setNewTeacher({
                              ...newTeacher,
                              maGiangVien: e.target.value,
                            })
                      }
                    />
                  </div>

                  {/* Ngày Sinh */}
                  <div>
                    <label className="block font-semibold mb-2">
                      Ngày Sinh
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={
                        editingTeacher?.ngaySinh || newTeacher?.ngaySinh || ""
                      }
                      onChange={(e) =>
                        editingTeacher
                          ? setEditingTeacher({
                              ...editingTeacher,
                              ngaySinh: e.target.value,
                            })
                          : setNewTeacher({
                              ...newTeacher,
                              ngaySinh: e.target.value,
                            })
                      }
                    />
                  </div>

                  {/* Tài Khoản */}
                  <div>
                    <label className="block font-semibold mb-2">
                      Tài Khoản
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={
                        editingTeacher?.user_id || newTeacher?.user_id || ""
                      }
                      onChange={(e) =>
                        editingTeacher
                          ? setEditingTeacher({
                              ...editingTeacher,
                              user_id: e.target.value,
                            })
                          : setNewTeacher({
                              ...newTeacher,
                              user_id: e.target.value,
                            })
                      }
                    >
                      <option value="">Chọn tài khoản</option>
                      {availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.hoTen} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Môn Học */}
                  <div>
                    <label className="block font-semibold mb-2">Môn Học</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={
                        editingTeacher?.id_MonHoc || newTeacher?.id_MonHoc || ""
                      }
                      onChange={(e) =>
                        editingTeacher
                          ? setEditingTeacher({
                              ...editingTeacher,
                              id_MonHoc: e.target.value,
                            })
                          : setNewTeacher({
                              ...newTeacher,
                              id_MonHoc: e.target.value,
                            })
                      }
                    >
                      <option value="">Chọn môn học</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.tenMonHoc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lớp Học */}
                  <div className="col-span-2">
                    <label className="block font-semibold mb-2">Lớp Học</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={
                        editingTeacher?.idLopHoc || newTeacher?.idLopHoc || ""
                      }
                      onChange={(e) =>
                        editingTeacher
                          ? setEditingTeacher({
                              ...editingTeacher,
                              id_LopHoc: e.target.value,
                            })
                          : setNewTeacher({
                              ...newTeacher,
                              id_LopHoc: e.target.value,
                            })
                      }
                    >
                      <option value="">Chọn lớp học</option>
                      {classes.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.tenLop}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nút Lưu */}
                <button
                  className="bg-rose-500 text-white px-6 py-3 w-full rounded-lg font-semibold shadow-md hover:bg-rose-600 transition mt-6"
                  onClick={handleSave}
                >
                  Lưu
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
