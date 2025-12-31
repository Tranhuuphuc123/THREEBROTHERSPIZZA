import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

//import fontAwesomeIcon lấy icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faBox } from "@fortawesome/free-solid-svg-icons";

/* import constants permissionsName.tsx lấy list tên các quyền cần text
cho username coi quyền lây đc ở username trong localstorage có khớp với 
quyền có trong file permissionName.tsx không */
import {USER_VIEW, USERS_ROLES, ROLES_PERMISSIONS, PRODUCT_VIEW} from '@/constants/permissionsName'

export default function Sidebar() {
  
  /* Lấy danh sách quyền từ localStorage
   >> giải thích code<<<
    # typeof window !== 'undefined' (Kiểm tra môi trường): 
     + Next.js chạy ở hai nơi: Server (Node.js) và Client (Trình duyệt).
     + Vấn đề: Đối tượng window và localStorage chỉ tồn tại ở trình duyệt. 
     Nếu bạn gọi localStorage trực tiếp ở Server, Next.js sẽ báo lỗi ngay 
     lập tức vì Server không hiểu "localStorage" là gì.
     + Ý nghĩa: Dòng này kiểm tra xem code có đang chạy ở trình duyệt hay
      không. Nếu window khác undefined, nghĩa là chúng ta đang ở phía Client.
      
    # Toán tử 3 ngôi ? : (Quyết định hành động)
      + Nếu đúng (?): Nếu đang ở Client, hãy thực hiện localStorage.getItem('permissions') || "".
      + nếu sai server trả về chuỗi rỗng  
      
    # localStorage.getItem('permissions'): lấy quyền ở key permission lưu trong localstorage  
  */
  const strPermission = typeof window !== 'undefined' ? localStorage.getItem('permissions') || "" : "";
  // Kiểm tra quyền cụ thể VIEW -  hành động của các mục
  const canViewAccount = strPermission.includes(USER_VIEW);
  const canViewUsers_Roles = strPermission.includes(USERS_ROLES);
  const canViewRoles_Pers = strPermission.includes(ROLES_PERMISSIONS);
  const canViewProducts = strPermission.includes(PRODUCT_VIEW);

  /*state trạng thái đảm bảo rằng việc kiểm tra quyền (canCreate) chỉ được thực hiện
   sau khi Client đã tải xong để tránh lệch pha với Server.
   -> tại sao lại có state này
    # giải quyết lỗi Hydration Mismatch(khi lv với value ở localstorage..)
    lưu ý là kiểm tra mục account này là ktra bên sidebar của admin page
    # Next.js hoạt động theo cơ chế Pre-rendering:
      + Ở Server: Chạy code lần 1 để tạo ra file HTML. Lúc này 
      localStorage không tồn tại -> canCreate luôn là false -> Menu
       "Accounts" không có trong HTML.
      + Ở Client (Trình duyệt): React chạy code lần 2 (Hydration). 
      Lúc này localStorage có dữ liệu -> canCreate là true -> React muốn 
      hiển thị menu "Accounts". 
      ==> Lỗi xảy ra: React thấy HTML từ Server gửi xuống (không có menu) 
      khác với HTML nó định vẽ ra (có menu). Nó sẽ "mắng" bạn bằng lỗi 
      Hydration Mismatch.
      ==> quy trình giải lỗi có 3 bước sau
  */
  /* Bước 1: Khởi tạo state với giá trị false */
  const [isClient, setIsClient] = useState(false)

  /* Bước 2: Dùng useEffect để thay đổi trạng thái */
  useEffect(() => {
    setIsClient(true)
  }, [])

  /* Bước 3: Chặn đứng việc render sai lệch */
  if (!isClient) return null 


  

  return (
    <>  
      <div className="h-100">
        <div className="sidebar-logo">
          <Link href="#">
            <Image
              src="/IZJP.gif"
              width={50}
              height={50}
              style={{ borderRadius: "50%" }}
              alt="Logo"
            />{" "}
            THREE BROTHERS PIZZA
          </Link>
        </div>

        {/* <!-- Sidebar Navigation --> */}
        <ul className="sidebar-nav">
          <li className="sidebar-header">Tools & Components</li>
          <li className="sidebar-item">
            <Link href="#" className="sidebar-link">
              <FontAwesomeIcon icon={faHouse} className="fa-fw" />
              Dashboard
            </Link>
          </li>

          {/* KIỂM TRA XEM MỤC ACCOUNT CÓ QUYỀN KHONG NẾU KHÔNG THÌ ẨN NÓ ĐI */}
          {canViewAccount && (
             <li className="sidebar-item">
              <Link href="/admin/accounts" className="sidebar-link">
                <FontAwesomeIcon icon={faUser} className="fa-fw" />
                Accounts
              </Link>
            </li>
          )}

          {/* KIỂM TRA XEM MỤC USERS_ROLES CÓ QUYỀN XEM KHÔNG THÌ ẨN NÓ */}
          {canViewUsers_Roles && (
              <li className="sidebar-item">
                <Link href="/admin/User_has_Roles" className="sidebar-link">
                  <FontAwesomeIcon icon={faUser} className="fa-fw" />
                  Users_Roles
                </Link>
              </li>
          )}
         
          {/* KIỂM TRA XEM MỤC AUTHORIZATIONS CÓ QUYỀN XEM KHÔNG THÌ ẨN NÓ */}
          {canViewRoles_Pers && (
              <li className="sidebar-item">
                <Link href="/admin/Authorization" className="sidebar-link">
                  <FontAwesomeIcon icon={faUser} className="fa-fw" />
                Authorizations
                </Link>
              </li>
          )}
          
          {/* KIỂM TRA XEM MỤC AUTHORIZATIONS CÓ QUYỀN XEM KHÔNG THÌ ẨN NÓ */}
          {canViewProducts && (
             <li className="sidebar-item">
              <Link href="/admin/products" className="sidebar-link">
                <FontAwesomeIcon icon={faBox} className="fa-fw" />
                Products
              </Link>
            </li>
          )}
         
          
        </ul>
      </div>
    </>
  );
}
