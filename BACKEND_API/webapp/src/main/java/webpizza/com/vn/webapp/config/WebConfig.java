package webpizza.com.vn.webapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/* Hiểu file này sinh ra thế này: khi goi api axiosAuth.js xử lý login thành công sinh ra token
, token sẽ đc gửi kèm trong các axiosClient/Admin.ts.. khác, tức là khi login thành công thì sinh 
ra token và lúc đó thì mới có quyền call các api khác, để call các api khác thì cần kèm theo token
Authorization đã sinh ra lúc login
-> thì thật ra trong file axiosAuth.ts khi nó xử lý call api login sinh ra token -> token đó đc 
gửi cho các api còn lại(fiel axiosClient/Admin.ts á) thì nó sẽ gửi request theo method là dạng 
POST --->  lúc này dạng POST từ trình duyệt thực ra nó sẽ gửi cùng lúc 2 request:options và post 
  + options: kiểu thăm dò xem server có cho phép gửi dạng method là POST không, nếu khôg
  cho là báo lỗi Respone to preflight... ngay
  ++ post: sau khi thăm dò server chấp nhận thì nó mới gửi value dạng post chuẩn đi  

  ===> điều đó đồng nghĩa là server trong spring boot vừa qua mình cho phép gửi ở các dạng request
  như: GetMapping, PostMapping, PutMapping, DeleteMapping... nhưng chưa có cho phép dạng options 
  do chưa có đoạn code nào định nghĩa điều đó nên khi call api từ các file axiosClient/Admin.ts 
  các file call api dùng cho page admin hay client á thì trình duyệt thg gửi 2 request options 
  và post cùng lúc như thế thì server không hiểu request options nên báo lỗi Respone to preflight..
  
  ===> vậy nên trong file WebConfig.java này mình sẽ cấu hình cho phép các request dạng options
   đc thông qua để tránh lỗi Respone to preflight...

  Cách cấu hình như sau:
  + implement interface WebMvcConfigurer
  + override method addCorsMappings
  + trong method addCorsMappings thì khai báo cho phép tất cả các request từ mọi nguồn gốc 
  (allowedOrigins("*")) đc gửi đến server, và cho phép tất cả các phương thức (allowedMethods("*"))
  như get, post, put, delete, options... đc gửi đến server 
*/


/*giải thich annotation securityconfig
  -> Configuration: đánh dấu một class là lớp cấu hình của Spring Boot, Spring Boot biết
   đây là lớp cấu hình, sẽ quét và xử lý các @Bean bên trong. Nếu không có annotation 
 */
@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer(){
        return new WebMvcConfigurer() {
           @Override
            public void addCorsMappings(CorsRegistry registry){
                //cho phép tất cả các request từ mọi nguồn tới server
                registry.addMapping("/**") 
                //ch phép tất cả request có local chạy từ port 3000 đc qua
                .allowedOrigins("http://localhost:3000") 
                //cho phép mọt số method đc thoải mái sử dụng
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") 
                //cho phép client gửi bất kỳ header nào - vd: gọi api từ file axiosClient/Admin... có thêm n` headers -> ok
                .allowedHeaders("*") 
                .allowCredentials(true); //cho phép gửi cookie 
            }  
        };
    }
}
