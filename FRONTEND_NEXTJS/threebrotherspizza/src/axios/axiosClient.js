/***cấu hình axios call api cho phần client page***/
import axios from "axios";

const axiosClient = axios.create({
    //lay dia chi api tu backend -> dia chi root api
    baseURL: "http://localhost:8080/api/client/",
    headers:{
         //content-type: là dữ liệu mong đợi từ server trả về là dạng json
        "Content-Type": "application/json",
        
        /*Lấy token từ localStorage để gửi kèm trong header mỗi request khi call api từ axiosClient
         axiosAdmin...theo đúng chuản jwt token là header phải có Authorization: Bearer  +<7 ký tự>
         -> lưu ý token lưu trong localStorage, nó đc sinh ra từ việc xử lý call api từ file 
         axiosAuth.ts mà mình đã xử lý đăg nhập login thành công rồi sinh ra token này, thì nó sẽ 
         thông qua đoạn code này mà gửi kèm token này vào đúng user vừa login thành công giúp cho user 
         đó thực hiện call các api khác không bị lỗi vì có đủ token cần xác mình và tránh lỗi 403 không
         có quyền vì cơ chế xác minh jwt token

         -> nói thêm nữa là token này đc sinh và gửi kèm trong header mõi request, để dễ hiểu hơn là việc
          login thành công thì nó sinh ra token, thì việc call các api còn lại mới đc phép vì có token đc gửi 
          kèm này xác mình là đúng user có role.. có token hợp lệ khi giải mã thông tin trong jwt token(
          header, payload, signature đều ok) thì lúc đó đoạn code bên dưới nó giúp lấy token và xác minh
          ok -> gửi kem token khi cho user đó khi call api cần thực thi,
         
          <=> còn nếu không có đoạn code này trong axiosClient/Admin... là dù có login thành công thì khi 
         call api khác nó cũng không có gửi kèm đc token tương ứng của user đó khi login thành công nên 
         sẽ báo lõi 403 không có quyền call api này*/
        "Authorization": `Bearer ${localStorage.getItem("token")}` , 
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
    "WithCredentials": true, 
})

export default axiosClient