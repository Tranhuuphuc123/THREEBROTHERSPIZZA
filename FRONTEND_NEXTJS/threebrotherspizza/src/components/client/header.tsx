"use client";

import Link from "next/link";
import {
  Image,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavLink,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";

//import lib modal va cac lib lien quan xu ly modal context cho form login
import Modal from "react-bootstrap/Modal";
import { useModal } from "@/contexts/ModalContext";
//import pathName: hook cua next/navigation giup lay duong dan url hien tai
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

//import page giao dien cuar MOdal.body cua form login
import Login from "@/app/client/login/page";

//import ToastContext de hien thi toast
import { useToast } from '@/contexts/ToastContext';

// Import hàm getRoleFromToken từ lib call api auth axiosAuth để lấy role từ user đăng nhập
import { getPayloadInfoFromToken } from "@/axios/axiosAuth"; 

// Import URL server ảnh của bạn
import { UPLOAD_URL } from "@/constants/urls"; 

//import page edit profile
import EditProfile from "@/app/client/profile/page";



export default function Header() {

  //khoi tao cac compoent cuar modal context da khai bao o class modalcontext
  const { openModal, closeModal, show, modalType } = useModal();
  // Khai báo state để lưu trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
   // Thêm state lưu role của user khi login thàng công(role, username chưa trong payload của token)
  const [userRole, setUserRole] = useState<string | null>(null);
  // State lưu avatar ảnh của user account
  const [avatar, setAvatar] = useState<string | null>(null); 
  // Thêm State lưu id của user từ localstorage
  const [userId, setUserId] = useState<string | null>(null);

  //pathname: Lấy đường dẫn hiện tại để biết "người dùng có chuyển trang không?", nếu có → đóng modal.
   const pathName = usePathname(); 

   // Khai báo showToast từ ToastContext
  const {showToast} = useToast()


  /**** Hàm xử lý đăng xuất (Nên có) *****/
  const handleLogout = () => {
    /*Ý nghĩa của " typeof window !== 'undefined' "
      #1/ window: Là đối tượng đại diện cho cửa sổ trình duyệt,để hiểu rõ bản 
      chất của vấn đề: Server vs Client
        + (Server (Node.js): Khi Next.js đang chuẩn bị trang web ở phía máy 
        chủ (Server-side rendering), nó chạy code JavaScript nhưng trong môi 
        trường Node.js. Ở đây không có trình duyệt, vì vậy không tồn tại đối
        tượng window hay localStorage.
        
        + Client (Browser): Khi trang web đã tải xong xuống máy người dùng, 
        lúc này mới có đối tượng window và localStorage.

        --> Nếu bạn gọi trực tiếp localStorage.getItem("token") mà không kiểm
        tra, Next.js sẽ báo lỗi ngay lập tức: "localStorage is not defined" hoặc
        "window is not defined" vì nó cố gắng tìm những thứ này trên Server (nơi
         chúng không tồn tại).)

      #2/ undefined: Nghĩa là "không xác định" hoặc "không tồn tại".
    
      ===> tóm lại Cả cụm code: Có nghĩa là "Nếu đối tượng window đã tồn tại 
      (tức là code đang chạy trên trình duyệt của người dùng), thì hãy thực thi 
      đoạn code bên dưới". */
    if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user_avatar"); // <--- Thêm dòng này
        localStorage.removeItem("permissions");
        localStorage.removeItem("user_id"); // <--- THÊM DÒNG NÀY: Xóa ID khi logout

        showToast("Đã đăng xuất", 'info');
        // Ép trình duyệt load lại trang chủ từ Server để xóa sạch State cũ
        window.location.href = "/";
        setIsLoggedIn(false);
    }
  };



  /*****Tạo một hàm kiểm tra riêng để tái sử dụng: giúp load lại page khi login thành công
  có token giao diện update ngay là có token tránh tự phải refresh lại trang thủ công****/
  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      const savedAvatar = localStorage.getItem("user_avatar"); // Lấy cái đã lưu ở bước trên
      const savedId = localStorage.getItem("user_id"); // Lấy ID từ storage

      /* BƯỚC 3: Cập nhật trạng thái đăng nhập
        # !!token là cách viết tắt: 
         - Cách viết !!token là một kỹ thuật rất phổ biến trong JavaScript
          (được gọi là Double Bang). Mục đích của nó là: Chuyển đổi một giá 
          trị bất kỳ về đúng kiểu dữ liệu Boolean
         - Nếu token true -> !token là false -> !!token là true
        (chính xác là token = true => !!token vẫn là true và ngc lại))
        -> vậy làm chi cho mắc công
         + hiểu thế này vd string dùng token thì nó trả vễ là chuỗi string
         + còn nếu là null thì token trả về null 
         --> vây vấn đề là chỗ này muốn kiểm tra là có token hay không true or
         false không phải cần qua nhiều bc là xác định kiểu gì rồi xem có giá trị
         không mới xét true false việc dùng !! sẽ trả về đúng mục đích, nó giúp 
         dọn dẹp value thô thành value có giá trị boolean chính xác mục đích thui
         --> tức ở đây kiểm tra token có hay không không cần quan tâm nó trả về
         cái gì*/
      setIsLoggedIn(!!token);

     // Lấy thông tin tổng hợp từ token
      const roles = getPayloadInfoFromToken();
      if (roles) {
        setUserRole(roles);
        setAvatar(savedAvatar);// Gán avatar từ localStorage vào state
        setUserId(savedId); // Lưu ID vào state để dùng nếu cần
      } else {
        setUserRole(null);
        setAvatar(null);
        setUserId(null);
      }
    }
  }

  /* useEffect lắng nghe thay đổi token */
  useEffect(() => {
    checkAuth(); // Kiểm tra khi mới vào trang
    // Lắng nghe sự kiện để cập nhật giao diện tức thì khi login/logout thành công
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  /***Hàm kiểm tra role là admin/Employee:cashier**/
  const canAccessAdmin = userRole?.includes("admin") || userRole?.includes("cashier");

  /* useEffect để đóng modal khi chuyển trang */
  useEffect(() => {
    // Chỉ đóng modal khi người dùng thực sự chuyển sang trang khác
    if (show) {
      closeModal();
    }
    // KHÔNG bỏ 'show' vào đây, chỉ bỏ 'pathName'
  }, [pathName]);

  return (
    <>
      {/* Navbar React bootstrap */}
      <Navbar
        sticky="top"
        expand="lg"
        variant="dark"
        style={{ backgroundColor: "#05422C" }}
      >
        <Container>
          <NavbarBrand as={Link} href="/" className="fw-bold text-warning">
            👑 THREEBROTHER'S PIZZA
          </NavbarBrand>
          <NavbarToggle aria-controls="navbarNav" />

          <NavbarCollapse id="navbarNav">
            <Nav
              className="ms-auto"
              style={{ fontSize: "1.1rem", cursor: "pointer" }}
            >
              <NavLink as={Link} href="/">
                Homepage
              </NavLink>
              <NavLink as={Link} href="/client/about">
                About
              </NavLink>
              <NavLink as={Link} href="/client/contact">
                Contact
              </NavLink>
              <NavLink as={Link} href="/client/products">
                Product
              </NavLink>

              {/* xu ly handle event click button dangnhap -> modal context form login 
               => dùng toán tử 3 ngôi kiểm tra state {!isLoggedIn ? (<button đăng nhập>): (<form giao diện accounts>)
               <=> nghĩa là kiểm tra token chưa cho là false thì !false = true thỏa đk thì hiện nút đăng nhập
               còn có token thì !true = false thì thỏa đk toán tử 3 ngôi hiện form giao diện accounts
               */}
              {!isLoggedIn ? (
                <NavLink as={Link} href="#">
                    <span onClick={() => openModal("loginForm")}>Sign In</span>
                </NavLink>
              ) : (  
                    <Dropdown
                      align="end"
                      className="border rounded text-white p-1"
                      style={{ cursor: "pointer" }}
                    >
                      <DropdownToggle as="div">
                        <Image
                          alt="avatar"

                          // Ghép URL server với tên file ảnh lấy từ state
                          src={avatar ? `${UPLOAD_URL}/${avatar}` : "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png"}
                          roundedCircle
                          width="30px"
                          height="30px"
                          style={{ objectFit: 'cover', border: '1px solid #ffc107' }} // Thêm style cho đẹp
                        />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem  href="/client/profile">Profile</DropdownItem>

                        {/* Nên gọi hàm handleLogout khi người dùng bấm Logout */}
                        <DropdownItem onClick={handleLogout}>Logout</DropdownItem>

                       {/* ĐIỀU KIỆN QUAN TRỌNG: Chỉ hiện Admin Panel nếu không phải là cashier hay admin */}
                        {canAccessAdmin && (
                          <DropdownItem href="/admin">Admin Panel</DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                )}              
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>

      {/* //  modals form login cua  react bootstrap */}
      <Modal show={show && modalType == "loginForm"} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>Login Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login />
        </Modal.Body>
      </Modal>
    </>
  );
}
