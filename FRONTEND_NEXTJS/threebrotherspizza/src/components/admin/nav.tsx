import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect} from "react";
import {
  Image,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "react-bootstrap";

// Import useRouter chuyển hướng trang 
import { useRouter } from 'next/navigation'; 


export default function Nav({onToggleSidebar,}: {
  onToggleSidebar: () => void;
}) {

  // Khai báo state để lưu trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Khởi tạo router để chuyển hướng trang
  const router = useRouter(); 

    /* Hàm xử lý đăng xuất (Nên có)*/
  const handleLogout = () => {
    localStorage.removeItem("token");
      // Chuyển hướng về trang đăng nhập
      router.push("/adminLogin");
  };

  /* Kiểm tra trạng thái token khi load component*/
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Nếu không có token, có thể tự động đẩy về login nếu đây là trang bảo mật
    if (!token) router.push("/adminLogin"); 
  }, []);

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
              src="https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1"
              roundedCircle
              width="35px"
              height="35px"
              className="me-2" // Khoảng cách giữa ảnh và mũi tên
            />
            {/* Mũi tên sẽ tự xuất hiện khi dùng DropdownToggle chuẩn */}
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem href="#">Profile</DropdownItem>
            <DropdownItem onClick={handleLogout} className="text-danger">
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}
