/***cấu hình axios call api cho phần auth phân quyền login***/
/***đây là file lib tạo hàm tiện ích login và lấy ds các quyền của user***/

/***Mục đích***
 * File này sinh ra để:
    + Hỗ trợ đăng nhập người dùng (login).
    + Lưu trữ token xác thực và danh sách quyền của người dùng vào localStorage.
    => Cung cấp các hàm tiện ích để các phần khác của ứng dụng có thể dễ dàng sử
     dụng chức năng đăng nhập và lấy quyền của user.
 */

/***tạo hàm tiện ích để login***/
export async function login(username, password) {
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
  //lưu tên đăng nhập vào localstorage
  localStorage.setItem("token", data.token);

  /*PHÁT TÍN HIỆU: Tự kích hoạt sự kiện storage để các component khác cập nhật
  giúp việc sau khi login thành công sinh ra token thì storage update để mọi người 
  biết là co token ròi tránh tự refresh trang thủ công*/
  window.dispatchEvent(new Event("storage"));
  
  //gọi api lấy các quyền và lưu trong localstorage
  //getPermission(data.token, username);

  // Trả về cả object data để lấy token ở page
  return data.token;
}

/***tạo hàm tiện ích để lấy vai trò của user***/
// export async function getPermission(token, username) {
//   const response = await fetch(
//     "http://localhost:8080/api/client/permission/by-username?username" +
//       username,
//     {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//       body: {
//         username: username,
//       },
//     }
//   );
//   if (!response.ok) {
//     throw new Error("Không lấy được các quyền của người dùng");
//   }

//   //đã đăng nhập thành công
//   const data = await response.json();
//   //rút gọn bớt dữ liệu chỉ muốn lấy danh sách các quyền ghép lại theo dấu
//   var strPermissions = data.data.map((item) => item.name).join(", ");
//   //lấy danh sách các queyenf lưu vào localstorage
//   localStorage.setItem("permissions", strPermissions);

//   //server trả về token
//   return data.token;
// }
