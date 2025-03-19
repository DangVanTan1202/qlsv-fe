"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Atom, Baby, Blend } from "lucide-react";

export default function Header({ user, onLogout }) {
  const router = useRouter();
  const hasUser = user && Object.keys(user).length > 0;

  return (
    <header className="flex justify-between items-center bg-red-800 p-4 shadow-md rounded-lg text-white">
      {hasUser ? (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20">
            <img
              src="/nonsv-removebg-preview.png"
              alt="User Avatar"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="font-bold text-lg">{user.hoTen}</p>
            <p className="text-sm text-gray-900">{user.role}</p>
          </div>
        </div>
      ) : (
        <p className="text-white text-lg font-semibold">
          Chào mừng đến hệ thống quản lý sinh viên
        </p>
      )}
      <div className="flex gap-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-white"
          onClick={() => router.push("/dao-tao-nghien-cuu")}
        >
          <Atom />
          <span>Đào tạo nghiên cứu</span>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-white"
          onClick={() => router.push("/tuyen-sinh")}
        >
          <Baby />
          <span>Tuyển sinh</span>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-white"
          onClick={() => router.push("/lien-ket-doi-tac")}
        >
          <Blend />
          <span>Liên kết đối tác</span>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-white"
          onClick={() => router.push("/thong-bao")}
        >
          <Bell />
          <span>Thông báo</span>
        </Button>
        {hasUser && (
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-white"
            onClick={onLogout}
          >
            <LogOut />
            <span>Đăng xuất</span>
          </Button>
        )}
      </div>
    </header>
  );
}
