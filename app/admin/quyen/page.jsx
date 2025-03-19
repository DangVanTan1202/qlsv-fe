"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function RoleList() {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [chucNangs, setChucNangs] = useState([]);
  const router = useRouter();
  
  // Kiểm tra quyền truy cập
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
  }, [router]);

  // Gọi API để lấy danh sách quyền và chức năng
  useEffect(() => {
    const fetchData = async () => {
      await fetchRoles();
      await fetchChucNangs();
    };
    fetchData();
  }, []);

  // Gọi API lấy danh sách Role
  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:3001/Role");
      if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu roles");
      const data = await res.json();
      setRoles(data);
      console.log("Danh sách Roles:", data);
    } catch (error) {
      console.error(error);
    }
  };

  // Gọi API lấy danh sách Chức năng
  const fetchChucNangs = async () => {
    try {
      const res = await fetch("http://localhost:3001/ChucNang");
      if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu chức năng");
      const data = await res.json();
      setChucNangs(data);
      console.log("Danh sách Chức năng:", data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };
  // Cập nhật quyền Role
  const updateRolePermission = async (roleId, field, value) => {
    try {
      const updatedRoles = roles.map((role) =>
        role.id === roleId ? { ...role, [field]: value } : role
      );
      setRoles(updatedRoles);

      const roleToUpdate = updatedRoles.find((role) => role.id === roleId);
      if (!roleToUpdate) return;

      await fetch(`http://localhost:3001/Role/${roleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roleToUpdate),
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar user={user} />
      <div className="flex-1 p-6">
        <Header user={user} onLogout={handleLogout} />
        <h2 className="text-2xl font-semibold mb-4">Quản lý quyền</h2>

        {/* Kiểm tra nếu dữ liệu roles rỗng */}
        {roles.length === 0 ? (
          <p className="text-center text-gray-500">Không có dữ liệu quyền.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-300 text-gray-800">
                <th className="border p-2">Tên vai trò</th>
                <th className="border p-2">Chức năng</th>
                {["Thêm", "Sửa", "Xóa", "Duyệt", "Xem", "Từ chối", "Nộp"].map(
                  (perm, index) => (
                    <th key={index} className="border p-2">
                      {perm}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {roles
                .filter((role) => role.tenRole !== "Admin") // Ẩn role admin
                .map((role) => {
                  const chucNang =
                    chucNangs.find((cn) => cn.id === role.idChucNang) || {};
                  return (
                    <tr key={role.id} className="hover:bg-gray-100">
                      <td className="border p-2">{role.tenRole}</td>
                      <td className="border p-2">
                        {chucNang.name || "Không xác định"}
                      </td>
                      {Object.keys(role)
                        .filter((key) =>
                          [
                            "them",
                            "sua",
                            "xoa",
                            "duyet",
                            "xem",
                            "tu_choi",
                            "nop",
                          ].includes(key)
                        )
                        .map((perm) => (
                          <td key={perm} className="border p-2 text-center">
                            <input
                              type="checkbox"
                              checked={role[perm]}
                              onChange={(e) =>
                                updateRolePermission(
                                  role.id,
                                  perm,
                                  e.target.checked
                                )
                              }
                              className="w-5 h-5 cursor-pointer"
                            />
                          </td>
                        ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
