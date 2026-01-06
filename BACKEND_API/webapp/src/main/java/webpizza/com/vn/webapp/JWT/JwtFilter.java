package webpizza.com.vn.webapp.JWT;

/*JWT II - jwt filter này có tác dụng Xác thực và Ủy quyền
  => lop tien ich xu ly trong Config/SecurityConfig.java: kiểm tra JWT trong từng request
   (lọc request mỗi lần).
  => Bộ lọc này lấy JWT từ Header, giải mã Payload để lấy username, và sau đó dùng username 
  đó để tải lại thông
  tin UserDetails (bao gồm cả Roles) từ DB, và thiết lập phiên làm việc trong Spring Security.
  => JwtFilter – Nó làm nhiệm vụ Gác cổng kiểm tra JWT mỗi request
   cụ thể là:
    ++ Chặn mọi request không có JWT
    ++ Tách token
    ++ Giải mã token
    ++ Kiểm tra valid
    ++ Lấy user từ DB
    ++ Xác thực user vào SecurityContext

 =>  kiểm tra token (dùng ở tất cả request sau login)
 + Login không chạy JwtFilter vì không có JWT,
   Nhưng toàn bộ API sau đó bắt buộc phải có JwtFilter để bảo vệ.

📌 Nếu token sai → nó không cho request đi tiếp.
* => lop loc filter nay giup tao mot cong an ninh loc va loai bien nhung
* request tu nguoi dung nao gui len ma khong jwt token, sau khi dat yeu
* cau la co cac jwt token _> viec tiep theo co sang loc xu ly gi
* thi lop SecurityConfig.java cu the la method SecurityConfig se xu ly
* lop tien ich JwtFilter nay chi co nhiem vu la lop cua loc nhung ai khong
* co jwt token thi khong cho qua thui
* => chỉ thực hiện: lấy JWT → validate(xác thực) → set Authentication(cấp quyền)
* => luu y no chi kiem tra mot lan duy nhat: vi neu khong co jwt token
* thi da loai bien ngay tu dau roi lam gi nua mac cong
* */

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//OncePerRequestFilter: giup kiem tra mot lan y/c request tu client len
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtProvider;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    //method xu ly nghiep vu class nay
    @Override
    protected  void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {

        //2 xử lý cho phép các lớp sao đc phép thực thi mà không cần kiểm tra token gì cả, không có
        //  Authrization trng header
        /*Ý nghĩa của việc lặp lại loại trừ:
            + Tối ưu hóa hiệu suất: Mặc dù SecurityConfig cho phép các request này đi qua (vì .permitAll()),
            nhưng nếu bạn không có đoạn loại trừ này trong JwtFilter, mỗi request đến các đường dẫn công khai
             (như /auth hay /swagger) vẫn phải chạy qua toàn bộ logic trong doFilterInternal của JwtFilter
             (bao gồm: lấy header Authorization, kiểm tra null, kiểm tra Bearer , và cố gắng giải mã token -
             ngay cả khi không có token).

            + Việc thêm đoạn if này vào đầu JwtFilter đảm bảo rằng, ngay khi nhận thấy đó là một đường dẫn
             công khai từ securityconfig thi Filter hiểu và sẽ ngay lập tức chuyển request cho Filter tiếp 
             theo (filterChain.doFilter(...)) mà không cần thực hiện logic giải mã JWT phức tạp, từ đó giảm 
             thiểu chi phí xử lý không cần thiết.

           ==> Việc loại trừ trong SecurityConfig là để đảm bảo quyền truy cập cuối cùng (Authorization). 
           Việc loại trừ trong JwtFilter là để tối ưu hóa sớm (Optimization), tránh chạy logic xác thực 
           JWT không cần thiết cho các request đã được biết là công khai.  */
        String path = request.getRequestURI();
        if(path.startsWith("/api/auth/login") 
            || path.startsWith("/swagger-ui/")
            || path.startsWith("/v3/api-docs")
            || path.startsWith("/uploads/")
            || path.startsWith("/api/admin/products")
            || path.startsWith("/api/admin/products/{id}")
            || path.startsWith("/api/client/users/create")
            || path.startsWith("/api/client/users/active-account")
        ){
            filterChain.doFilter(request, response);
            return;
        }

        //tất cả request còn lại -> trong header phải có Authroziation thì mới xử lý
        final String authHeader = request.getHeader("Authorization");   //Lấy Header Authorization bằng request.getHeaser...
        String userName = null;
        String jwt = null;

        /*chuan authorzation: Bearer XXXYYYZZZZ, phai bat dau chuoi bang Bearer thi moi xu ly
        con khong co chua Bearer ơ dau thi khong xu ly -> nd của jwt token chuan phải co chu
        Bearer ơ đầu: */
        if(authHeader != null &&  authHeader.startsWith("Bearer ")){
            /*7: la cat bo 7 ky tu chu 'Bearer '.. vi ma jwt token la theo cau truc la nam
             * sau bearer va khoang tran(7 ky tu) -> ta lay la lay jwt token thui con chu
             * bearer chi de nhan dang*/
            jwt = authHeader.substring(7);  //Lấy token trong header
            userName = jwtProvider.extractUsername(jwt); //Giải mã token → lấy username
        }

        //kiem tra userName storage luu tru va userName trong token con trung khop khong neu ok thi xu ly
        if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

            //ktra token valid khong
            if(jwtProvider.isTokenValid(jwt, userDetails)){
                //tạo authentication đặt vào securitycontext
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                        null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }


        /*là một câu lệnh cốt lõi thường thấy trong các Filter hoặc Interceptor của Java Web (Servlet)
         và đặc biệt là trong kiến trúc bảo mật của Spring Security.
          -> quy trình hoạt  động như sau:
           + Trong kiến trúc Servlet của Java, các yêu cầu HTTP (request) được xử lý thông
            qua một chuỗi các bộ lọc (Filter Chain) trước khi đến được bộ điều khiển
            (Controller/Servlet) cuối cùng.
            + FilterChain là một đối tượng đại diện cho phần còn lại của chuỗi các bộ
             lọc (Filters) và Tài nguyên đích (Target Resource) mà request đang cố gắng truy cập.
             --> Chuyển yêu cầu (request) và phản hồi (response) hiện tại sang thành phần tiếp
             theo trong chuỗi xử lý (Filter Chain).
             --> Nếu còn Filter: Request sẽ được chuyển đến Filter tiếp theo trong chuỗi.
             --> Nếu hết Filter: Request sẽ được chuyển đến Tài nguyên đích cuối cùng
             (ví dụ: Controller/Endpoint của bạn).
             ==> Hành động này cho phép request tiếp tục đi qua các bộ lọc Spring Security
             khác và cuối cùng đến được Controller của bạn.

            >>nếu không có dòng doFilter..<<<
                # Nếu bạn không gọi filterChain.doFilter(request, response);, chuỗi xử lý
                 sẽ bị ngắt ngay tại Filter hiện tại.
                # Kết quả: Yêu cầu sẽ không bao giờ đến được Controller đích, dẫn đến người
                dùng không thể truy cập tài nguyên.
                <=> trừ phi muốn chặn yêu cầu (ví dụ: request bị từ chối do không có JWT
                hoặc JWT không hợp lệ)

         ====> filterChain.doFilter(request, response); là cơ chế giúp yêu cầu di chuyển
          suôn sẻ từ bộ lọc này sang bộ lọc khác cho đến khi nó đạt được điểm đến cuối cùng.
         */
        filterChain.doFilter(request, response);

    }
}
