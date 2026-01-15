import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import {
  Image,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "react-bootstrap";

// Import useRouter chuyển hướng trang 
import { useRouter } from 'next/navigation';

// Import các hằng số và hàm tiện ích vể url dãn ảnh upload và axioAuth láy avatar và role
import { UPLOAD_URL } from "@/constants/urls";
import { getPayloadInfoFromToken } from "@/axios/axiosAuth";


export default function Nav({ onToggleSidebar, }: {
  onToggleSidebar: () => void;
}) {

  // Khởi tạo router để chuyển hướng trang
  const router = useRouter();

  // State lưu thông tin hiển thị
  const [avatar, setAvatar] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  /* Hàm xử lý đăng xuất (Nên có)*/
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_avatar"); // <--- Thêm dòng này
    localStorage.removeItem("permissions");
    // Chuyển hướng về trang đăng nhập
    router.push("/");
  };

  /* Kiểm tra trạng thái token khi load component*/
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      const savedAvatar = localStorage.getItem("user_avatar");

      // 1. Kiểm tra bảo mật: Nếu không có token, đẩy về trang chủ ngay
      if (!token) {
        router.push("/");
        return;
      }

      // 2. Lấy Role từ token để hiển thị (nếu cần)
      const userRole = getPayloadInfoFromToken();
      setRole(userRole);

      // 3. Lấy Avatar từ localStorage
      setAvatar(savedAvatar);
    }
  }, [router]);

  return (
    <>
      {/* Dùng d-flex và justify-content-between để đẩy account sang phải */}
      <div className="d-flex justify-content-between  w-100 px-3 py-2">

        {/* 1. Bên Trái: Nút Toggle Sidebar */}
        <button
          className="btn border-1"
          type="button"
          onClick={onToggleSidebar}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        {/* 2. Bên Phải: Phần Account (Dropdown) */}
        <Dropdown align="end">
          {/* Bỏ 'as="div"' để giữ lại icon mũi tên mặc định của Bootstrap */}
          <DropdownToggle
            variant="none"
            className="d-flex align-items-center text-black border-1 p-1"
            id="dropdown-basic"
          >
            <Image
              alt="avatar"

              // Logic hiển thị ảnh giống hệt bên Header
              src={avatar ? `${UPLOAD_URL}/${avatar}` : "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png"}
              roundedCircle
              width="35px"
              height="35px"
              className="me-1" // Khoảng cách giữa ảnh và mũi tên
              style={{ objectFit: 'cover', border: '2px solid #05422C' }}
            />
            {/* Mũi tên sẽ tự xuất hiện khi dùng DropdownToggle chuẩn */}
          </DropdownToggle>

          <DropdownMenu>
            {/* <DropdownItem href="#">Profile</DropdownItem> */}
            <DropdownItem onClick={handleLogout} className="text-danger">
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}
