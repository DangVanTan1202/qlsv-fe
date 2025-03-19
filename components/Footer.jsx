import { Mail, Phone, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="container mx-auto">
        {/* Phần trên cùng với tiêu đề và nút hỗ trợ */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-6 border-b border-gray-600">
          <h2 className="text-4xl font-bold leading-tight text-center md:text-left">
            Hệ thống quản lý sinh viên <br />
            <span className="underline">hiệu quả!</span>
          </h2>
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold mt-4 md:mt-0">
            Hỗ trợ
          </button>
        </div>

        {/* Phần dưới chứa logo, danh mục, liên hệ, mạng xã hội */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              {/* Logo và mô tả */}
           <div className="flex flex-col items-start gap-2">
            {/* Logo hình ảnh */}
            <img src="/nonsv-removebg-preview.png" alt="Student Manager Logo" className="w-32 h-auto" />

            {/* Mô tả hệ thống */}
           <p className="text-gray-400 text-sm">Hệ thống quản lý sinh viên thân thiện, hiệu quả.</p>
            </div>
          {/* Danh mục */}
          <div>
            <h3 className="text-lg font-bold mb-2">Danh mục</h3>
            <ul className="text-gray-400 space-y-1">
              <li>Quản lý sinh viên</li>
              <li>Quản lý môn học</li>
              <li>Quản lý điểm số</li>
              <li>Hỗ trợ kỹ thuật</li>
            </ul>
          </div>
          {/* Liên hệ */}
          <div>
            <h3 className="text-lg font-bold mb-2">Liên hệ</h3>
            <ul className="text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <Mail size={16} /> support@qlsv.edu.vn
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> <a href="tel:+0123456789" className="hover:underline">+0123 456 789</a>
              </li>
            </ul>
          </div>

          {/* Mạng xã hội */}
          <div>
            <h3 className="text-lg font-bold mb-2">Mạng xã hội</h3>
            <ul className="text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <Facebook size={16} /> Facebook
              </li>
              <li className="flex items-center gap-2">
                <Youtube size={16} /> YouTube
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
