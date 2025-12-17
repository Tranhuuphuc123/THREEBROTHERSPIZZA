package webpizza.com.vn.webapp.config;

import webpizza.com.vn.webapp.JWT.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;



/*****JWT I - lớp cấu hình bảo mật, quyết định request nào cần JWT, request nào không******
 cau hinh lop bao mat security trong spring boot cho muc ma hoa code jwt token
 * => muc dich: khi call api thi phai co token nay moi thuc thi call api chu khong phai
 * ai cung dc tu do call api - phai co token xac minh la ban co role va permissions gi moi
 * cho qua va dung api ma toi viet
 *
 * ==> moi lan user gui request len server thi lop nay kiem tra dua tren ma hoa jwt token
 * lam sao trong header phai co jwt token, dem di giai ma dung thong tin header payload, va chu
 * ky signature cuar cau truc jwt token moi cho qua va xu ly

 => SecurityConfig – Ông vua điều phối bảo mật
 -----------------------------------------------
 Việc	                            Ý nghĩa
 -----------------------------------------------
 Tắt CSRF	                     API REST không cần
 Những URL nào không cần JWT	     Swagger, login, đăng ký
 Những URL nào phải có JWT	    Tất cả API còn lại
 Nhét JwtFilter vào luồng	    Bắt buộc phải kiểm tra token trước khi xử lý***/



/*giải thich annotation securityconfig
  -> Configuration: đánh dấu một class là lớp cấu hình của Spring Boot, Spring Boot biết
   đây là lớp cấu hình, sẽ quét và xử lý các @Bean bên trong. Nếu không có annotation 
   @Configuration thì Bean không đc tạo (spring boot sẽ bỏ qua class này không xử lý nữa))
  -> EnableMethodSecurity: cho phép các method của spring security hoạt động ở lớp này)
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    /*tao method xu ly loc xy ly: bat ke request nao di qua cung phai qua filter nay moi dc
    * => tuc no loc kiem tra phai co jwt token moi dc di qua va xu ly tiep khong thi out
      => việc loại trừ trong SecurityConfig là bắt buộc và đầy đủ
      => Khi bạn dùng .permitAll() cho một đường dẫn, Spring Security sẽ quyết định rằng
     request đó không cần phải xác thực bởi bất kỳ Filter nào để được phép truy cập. Mặc
     dù JwtFilter của bạn đã được thêm vào chuỗi, nhưng khi Spring Security nhận thấy
     đường dẫn đã được .permitAll(), nó sẽ không chặn request đó ngay cả khi không có
     token.*/
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception{

        /* giải thích số dòng code:
         + cors(Customizer.withDefaults()): 
          ++ cors: bật CORS(cho phép browser từ domain khác gọi api)
          ++ Customizer.withDefaults(): sử dụng cấu hình CORS mặc định của spring
          --> cho phép hai local port 3000 và 8080 chạy trên browser gọi đc api với nhau
          mặc dù bên spring boot ta đã thêm cors này rồi nhưng vãn cần cấu hình ở securityconffig
          để cho phép request từ local 3000 vẫn gọi api đc khi call api từ nextjs từ các file axios..

         + csrf(AbstractHttpConfigurer::disable --> tắt CSRF protection , vô hiệu hóa CSRF 
         spring security mặc định yêu cầu token csrf cho mỗi method header(put/post/delete/options...)
         để tránh lỗi 403 khong có quyền nhưng API rest không cần CSRF vì jwt token an toàn hơn

         + authorizeHttpRequests: cấu hình quyền truy cập cho từng request, quyết định request nào cần
         xác thực, request nào không cần

         + auth -> auth.requestMatchers: auth dối tượng cấu hình quyền, requestMatchers chỉ định các URL
         pattern(danh sách đg dẫn) ---> liệt kê các url không cần kiểm tra jwt token bỏ qua luôn
        */
        return http.cors(Customizer.withDefaults()).csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(
                        auth -> auth.requestMatchers(
                                "/swagger-ui/**",  //cho phep api swagger dc phep qua cong an ninh security
                                "/v3/api-docs/**",  //cho phep api docs cua swagger dc phep qua cong an ninh
                                "/api/auth/**", // cho phép api của phần login auth             
                                "/api/client/users/**",
                                "/api/client/users/create/**",
                                "/api/client/users/update/{id}/**"
                        )
                        .permitAll()  //cho phep truy cap ma khong can kiem tra
                        .anyRequest()
                        .authenticated() //yeu cau security kiem tra cac th con lai

                )
                /*Mặc định Spring Security tạo session trên server (lưu user info), STATELESS = không lưu session trên server
                Tại sao? Vì bạn dùng JWT token (mang thông tin user) → không cần session */
                .sessionManagement(sess->sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                /*Spring Security có một filter mặc định: UsernamePasswordAuthenticationFilter (kiểm tra username/password form)
                Bạn muốn jwtFilter chạy trước filter mặc định này
                -> Thứ tự: JwtFilter → UsernamePasswordAuthenticationFilter → các filter khác
                -> Tại sao? Vì:
                    + JwtFilter sẽ kiểm tra token JWT trước
                    + Nếu token hợp lệ → xác thực xong, không cần kiểm tra username/password
            Nếu token không hợp lệ → từ chối request ngay */
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();
    }

    /*cau hinh AuthenticationManager nhu mot bean khac phuc loi AuthenticationManager khong the tu tiem phu
    * thuoc autowired truc tiep bang annotation @Autowired nhuw cac bean khac*/
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws  Exception{
        return config.getAuthenticationManager();
    }

    /**
     * Xử lý mã hóa mật khẩu bằng thuật toán BCrypt để tăng cường bảo mật.
     * Việc này giúp tránh lỗi "You have entered a password with no PasswordEncoder".
     * Khi xác thực, các giá trị quan trọng như mật khẩu sẽ được mã hóa thay vì lưu trữ hoặc
     * xử lý ở dạng thô.
     */
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
