/***cấu hình axios call api cho phần client page***/
import axios from "axios";

const axiosClient = axios.create({
    //lay dia chi api tu backend -> dia chi root api
    baseURL: "http://localhost:8080/api/client",
    headers:{
         //content-type: là dữ liệu mong đợi từ server trả về là dạng json
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
axiosClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                // Khởi tạo headers nếu chưa có  
                config.headers = config.headers || {};
                // Gán Authorization header
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ================== 2. XỬ LÝ KẾT QUẢ TRẢ VỀ (RESPONSE) ==================
axiosClient.interceptors.response.use(
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


export default axiosClient