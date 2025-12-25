/***cấu hình axios call api cho phần auth phân quyền login***/
/***đây là file lib tạo hàm tiện ích login và lấy ds các quyền của user***/

/***Mục đích***
 * File này sinh ra để:
    + Hỗ trợ đăng nhập người dùng (login).
    + Lưu trữ token xác thực và danh sách quyền của người dùng vào localStorage.
    => Cung cấp các hàm tiện ích để các phần khác của ứng dụng có thể dễ dàng sử
     dụng chức năng đăng nhập và lấy quyền của user.
 */

/* lib jwtDecode giải mã token */
import { jwtDecode } from "jwt-decode";    

/***I - tạo hàm tiện ích để login: phần này là hàm CALL api authentication
 * xác thực login sinh jwt token***/
export async function login(username:string, password:string) {
  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    //content-type: là dữ liệu mong đợi từ server trả về là dạng json
    headers: {
      "Content-type": "application/json",
    },
    
     body: JSON.stringify({
      userName: username,
      passWord: password,
    }),
  });

  if (!response.ok) {
    throw new Error("wrong username or password");
  }

  //đã đăng nhập thành công
  const data = await response.json();



/* giải thích dòng typeof window !== "undefined" trong đk if
 >>Tại sao phải kiểm tra typeof window?<<
  > Ở Trình duyệt: Đối tượng window luôn tồn tại. Nó chứa các 
  tính năng như localStorage, sessionStorage, document, alert, v.v.
  > Ở Server (Node.js): Đối tượng window không tồn tại. Node.js 
  không có khái niệm cửa sổ trình duyệt.
  > typeof window: Là cách an toàn để kiểm tra một biến có tồn 
  tại hay không mà không gây ra lỗi.
  > !== "undefined": Nghĩa là "đã xác định được đối tượng window". 
  Điều này khẳng định code đang chạy trên trình duyệt của người dùng.
    # chi tiết về !== (gọi là so sánh nghiêm ngặt)
      + !==: So sánh "Khác" một cách tuyệt đối (Kiểm tra cả nội dung 
      và loại dữ liệu).
      + !==	So sánh khác nghiêm ngặt	Ngược lại của ===.
      + Luôn dùng !==: Để tránh những lỗi logic ngớ ngẩn do JavaScript
       tự động ép kiểu.
      + Việc dùng !== giúp code chạy nhanh hơn và cực kỳ chính xác vì 
      JavaScript không cần mất công "đoán" hay ép kiểu dữ liệu (Type Coercion).

  ==> Nếu bạn viết localStorage.setItem(...) mà không kiểm tra, 
  khi Next.js cố gắng render trang đó trên Server, nó sẽ gặp lỗi: 
  "ReferenceError: window is not defined" hoặc "localStorage is not
   defined". Ứng dụng của bạn sẽ bị văng (crash) ngay lập tức.

  ==> Khi bạn viết typeof window !== "undefined", bạn đang so sánh:
  + Giá trị: Kết quả của typeof window có khác chữ "undefined" không?
  + Kiểu dữ liệu: Kiểu dữ liệu (string) có khớp không?  
  ---> Việc dùng !== giúp code chạy nhanh hơn và cực kỳ chính xác vì 
  JavaScript không cần mất công "đoán" hay ép kiểu dữ liệu (Type Coercion). 
*/
  if (typeof window !== "undefined") {
     //1. lưu tên đăng nhập vào localstorage
    localStorage.setItem("token", data.token);
    // 2. Lưu avatar (để hiển thị Header - CỰC KỲ QUAN TRỌNG)
    localStorage.setItem("user_avatar", data.avatar || "");
    // 3. LƯU ID NGƯỜI DÙNG (Dòng mới thêm vào)
    // data.id phải khớp với tên trường bạn đặt trong AuthResponseDTO ở Backend
    localStorage.setItem("user_id", data.id || "");

    /*PHÁT TÍN HIỆU: Tự kích hoạt sự kiện storage để các component khác cập nhật
    giúp việc sau khi login thành công sinh ra token thì storage update để mọi người 
    biết là co token ròi tránh tự refresh trang thủ công*/
    window.dispatchEvent(new Event("storage"));
  }
 
  //2. gọi api lấy các quyền và lưu trong localstorage
  await getPermission(data.token, username);

  // Trả về cả object data để lấy token ở page
  return data.token;
}






/***II - tạo hàm tiện ích để login: phần này là hàm CALL api authorization
 * tiến hành xet role permission của username mà phân quyền***/
export async function getPermission(token:string, username:string) {
  const response = await fetch(
    `http://localhost:8080/api/authorization/getListPermissionsByUsername?username=${username}`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },

      // chỉ trả về biến sring không cần chuỗi body json
      // body: {
      //   username: username,
      // },
    }
  );

  if (!response.ok) {
    // Sẽ thấy 403 ở đây nếu Security chặn
     console.error("Lỗi lấy quyền, Status:", response.status); 
    throw new Error("Không lấy được các quyền của người dùng");
  }

  //đã đăng nhập thành công
  const data = await response.json();
  
  if (data && data.data) {
    // Lưu ý: data.data là List các UserPermissionsResponseDTO
    // Mỗi item có field là 'name' (theo logic map trong Service của bạn)
    const strPermissions = data.data.map((item: any) => item.name).join(", ");
    
    if (typeof window !== "undefined") {
      localStorage.setItem("permissions", strPermissions);
    }
  }


  //server trả về token
  return data.token;
}



/**III - function giải mã token lây thong tin của User để xác thực user, role
 * và avatar trong phần payload của token dc sinh ra khi login thành công 
 * + giúp cho việc login ẩn/hiển link sang Admin page dựa vào role
 * + giup lấy avatar gắn vào avatar trên form account hiên ra khi login ok
 * + giúp lấy tên username trong phần payload để xác minh với username trong database
 * giúp cho viết phân quyền về sau
 * */
export function getPayloadInfoFromToken() {
  if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) return null;
      try {
        const decoded: any = jwtDecode(token);
        // Giả sử Backend bạn lưu key là 'roles' hoặc 'role' trong payload
        return decoded.roles || decoded.role || null;
      } catch (error) {
        return null;
      }
    }
      return null;
  }
