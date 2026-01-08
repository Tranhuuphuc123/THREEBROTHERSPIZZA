package webpizza.com.vn.webapp.config;

import webpizza.com.vn.webapp.JWT.JwtFilter;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;



/***** JWT I: SECURITY CONFIG - Lớp điều phối bảo mật toàn hệ thống ******
 * Nhiệm vụ: Quyết định request nào cần xác thực JWT, request nào không.
 * * 1. MỤC ĐÍCH:
 * - Kiểm soát quyền truy cập API: Chỉ những request có Token hợp lệ, có
 * Role và Permission đúng mới được phép thực thi logic trong Controller.
 * - Bảo mật thông tin: Mã hóa và giải mã cấu trúc JWT (Header.Payload.Signature) 
 * để xác minh danh tính người dùng trong mỗi request gửi lên.
 * 
 * * 2. CƠ CHẾ HOẠT ĐỘNG:
 * - Khi User gửi request, nó sẽ đi qua hệ thống Filter (bộ lọc) ở "cửa ngõ".
 * - Hệ thống sẽ kiểm tra Header xem có Authorization Token không, giải mã và kiểm tra tính toàn vẹn.

  => SecurityConfig – Ông vua điều phối bảo mật
    -----------------------------------------------
    Việc	                            Ý nghĩa
    -----------------------------------------------
    Tắt CSRF	                     API REST không cần
    Những URL nào không cần JWT	     Swagger, login, đăng ký
    Những URL nào phải có JWT	     Tất cả API còn lại
    Nhét JwtFilter vào luồng	     Bắt buộc phải kiểm tra token trước khi xử lý***/



/*giải thich annotation securityconfig
  -> Configuration: đánh dấu một class là lớp cấu hình của Spring Boot, Spring Boot biết
   đây là lớp cấu hình, sẽ quét và xử lý các @Bean bên trong. Nếu không có annotation 
   @Configuration thì Bean không đc tạo (spring boot sẽ bỏ qua class này không xử lý nữa))
  -> EnableMethodSecurity: cho phép các method của spring security hoạt động ở lớp này)
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

     /*  
      + ${client.url}: thì trong application.properties mình đã cấu hình là 
     client.url = "http://localhost:3000" nên ở đây chỉ cần lôi key là đc quản lý 
     cấu hình tập trung
     */
    @Value("${client.url}")
    private String clientUrl;

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
        return http
                // Dùng CORS theo cấu hình CorsConfigurationSource bên dưới
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",  //cho phep api swagger dc phep qua cong an ninh security
                                "/v3/api-docs/**",  //cho phep api docs cua swagger dc phep qua cong an ninh
                                "/api/auth/**", // cho phép api của phần login auth             
                                "/uploads/**", //cho phép ảnh đc public không cần kiểm tra api này
                                "/api/admin/products/**", //cho phép quyền xem api sản phẩm không cần kiểm tra api này
                                "/api/admin/products/{id}/**", //cho phép quyền tìm kiếm sản phẩm theo id không càn kiểm tra api này
                                "/api/admin/products/client-list/**", //cho phép quyền hiện thì product theo product type và trạng thái
                                "/api/client/users/create/**", //cho phép create tài khoản khong cần kiểm tra api này
                                "/api/client/users/active-account/**" //cho phép xác thực tài khoản qua gmail không cần ktra api này
                        )
                        .permitAll()  //cho phep truy cap ma khong can kiem tra
                        // Quan trọng: Phải cho phép OPTIONS request (Preflight) đi qua không cần token
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
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



    /* Hiểu đoạn sau ntn thế này: khi goi api axiosAuth.js xử lý login thành công sinh ra token
    , token sẽ đc gửi kèm trong các axiosClient/Admin.ts.. khác, tức là khi login thành công thì sinh 
    ra token và lúc đó thì mới có quyền call các api khác, để call các api khác thì cần kèm theo token
    Authorization đã sinh ra lúc login
    -> thì thật ra trong file axiosAuth.ts khi nó xử lý call api login sinh ra token -> token đó đc 
    gửi cho các api còn lại(file axiosClient/Admin.ts á) thì nó sẽ gửi request theo method là dạng 
    POST/GET... -->  lúc này dạng POST/GET.. từ trình duyệt thực ra nó sẽ gửi cùng lúc 2 request:
    options và post 
        + options: kiểu thăm dò xem server có cho phép gửi dạng method là POST không, nếu khôg
        cho là báo lỗi Respone to preflight... ngay
        ++ post: sau khi thăm dò server chấp nhận thì nó mới gửi value dạng post chuẩn đi  

        ===> điều đó đồng nghĩa là server trong spring boot vừa qua mình cho phép gửi ở các dạng 
        request như: GetMapping, PostMapping, PutMapping, DeleteMapping... nhưng chưa có cho phép
        dạng options do chưa có đoạn code nào định nghĩa điều đó nên khi call api từ các file 
        axiosClient/Admin.ts các file call api dùng cho page admin hay client á thì trình duyệt
        thg gửi 2 request options và post cùng lúc như thế thì server không hiểu request options 
        nên báo lỗi Respone to preflight..
        
        ===> vậy nên trong file SecurityConfig.java này mình sẽ cấu hình cho phép các request 
        dạng options đc thông qua để tránh lỗi Respone to preflight...

    * * #### TẠI SAO PHẢI CẤU HÌNH CORS TẠI ĐÂY? (Thay vì file WebConfig)####
    * - Spring Security là lớp bảo vệ nằm ngoài cùng (vòng gửi xe). 
    * - Trình duyệt luôn gửi request "thăm dò" OPTIONS (Preflight) trước khi gửi request thật (POST/PUT).
    * - Nếu cấu hình CORS ở WebConfig (tầng MVC bên trong), Spring Security sẽ chặn request OPTIONS 
    * ngay tại cửa vì không có Token -> Dẫn đến lỗi "CORS Preflight error".
    * - => Gộp CORS vào đây để Security nhận diện và cho phép request OPTIONS đi qua trước.
    *  
    ** *>>> giải thích Cấu hình CORS Chi Tiết:<<<<
     * Giải quyết lỗi Preflight khi gọi API từ trình duyệt (như Next.js chạy port 3000).
     * Khi gọi API kèm theo Token trong Header, trình duyệt sẽ gửi cả request OPTIONS để thăm dò
     * xem coi request gửi các yêu cầu api của các method header(get/put/delete... ) phải kèm
     * options để thăm dò xác định có đùng method headeer đó đc gửi đúng không ok thì mới cho
     * call, tránh lỗi prelight do server không xác nhận chính xác đc api gọi lên có đúng là 
     * method header cần gọi khong dù đã có token.
     ---> * Bean này đảm bảo Security chấp nhận yêu cầu thăm dò đó.
     *
   */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Cho phép nguồn (Origin) từ phía Frontend của bạn chạy port 3000: http://localhost:3000
        configuration.setAllowedOrigins(Arrays.asList(clientUrl));
        // Cho phép các phương thức HTTP cần thiết bao gồm cả OPTIONS đi kèm
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Cho phép các Header quan trọng, đặc biệt là 'Authorization' chứa Token JWT
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        // Cho phép gửi kèm thông tin xác thực (như Cookies hoặc Auth Header)
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Áp dụng cấu hình trên cho toàn bộ các API (/**)
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
