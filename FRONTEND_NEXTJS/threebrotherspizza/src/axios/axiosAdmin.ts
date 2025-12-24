/***cấu hình axios call api cho phần trang admin page***/
import axios from "axios";

const axiosAdmin = axios.create({
    //lay dia chi api tu backend -> dia chi root api
    baseURL: "http://localhost:8080/api/admin",
    headers:{
        "Content-Type": "application/json",
    },

     /* cho phép gửi cookie cùng request nếu server yêu cầu -> phần này quan trọng vì nếu khong
    bật WithCredentials true thì nó khong gửi đc Authorization token sau khi sinh ra từ login 
    thành công 
     -> nó hay báo lỗi là "Respoine to preflight request doesn't pass access control check: No..."
     -> phân tích cái lỗi trên:
      + Preflight request: browser gửi request options trc để kiểm tra xem server
      có cho phép cross origin không(cho phép hai local 3000 và 8080 cùng chạy trên trình duyệt á) 
      + doesn't pas access control: server từ chối preflight request 
      + No...: server không gửi header CORS cần thiết(CORS: cross origin resource sharing là quy tắc 
      bảo mật của browser cho phép hoặc chặn các request từ một trang web này sang một trang web khác
      (khác domain/port, vd hai local port 3000 và 8080 cùng chạy trên browser)) 
    */
    withCredentials: true, 
})




/** THÊM ĐOẠN NÀY: Cấu hình Request Interceptor**/
/* Để giải quyết vấn đề Token không được gửi kèm khi gọi API, bạn cần 
sử dụng Axios Interceptors. Thay vì phải thêm Header thủ công vào mỗi 
lần gọi axiosAdmin.get, axiosClient..., Interceptor sẽ tự động "đánh chặn" 
yêu cầu trước khi nó gửi đi, kiểm tra localStorage và đính kèm Token vào 
Header.
==> Tại sao cách này tối ưu?
 + Tự động hóa: Bạn chỉ cần cấu hình 1 lần duy nhất trong file axiosAdmin. 
 Toàn bộ các hàm gọi API như fetchAccounts trong trang AccountsManage của 
 bạn sẽ tự động có Token mà không cần sửa code giao diện.

 + Bảo mật: Giúp bạn quản lý tập trung việc thêm Token.

 + Tránh lỗi Server: Backend của bạn (Spring Boot) sẽ nhận được Header 
 Authorization: Bearer <chuỗi_token>, từ đó Filter bảo mật mới có thể xác 
 thực thành công và trả về dữ liệu User.*/
// ================== 1. XỬ LÝ GỬI TOKEN ĐI (REQUEST) ==================
axiosAdmin.interceptors.request.use(
    (config) => {
        
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
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ================== 2. XỬ LÝ KẾT QUẢ TRẢ VỀ (RESPONSE) ==================
// Bạn nên thêm phần này vào để đồng bộ với axiosAdmin
axiosAdmin.interceptors.response.use(
    (response) => {
        // Nếu API trả về thành công, cứ để nó đi tiếp
        return response;
    },
    (error) => {
        // ĐÂY LÀ NƠI XỬ LÝ LỖI TẬP TRUNG
        if (error.response && error.response.status === 401) {
            // Nếu server trả về 401 (Unauthorized - Token hết hạn hoặc sai)
            console.error("Token hết hạn hoặc không hợp lệ, đang đăng xuất...");
            
            if (typeof window !== "undefined") {
                localStorage.removeItem("token"); // Xóa token rác
                window.location.href = "/login"; // Đẩy về trang login
            }
        }
        return Promise.reject(error);
    }
);

export default axiosAdmin;