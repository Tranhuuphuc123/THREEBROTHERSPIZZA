package webpizza.com.vn.webapp.controller.Auth;

import webpizza.com.vn.webapp.DTO.AuthDTO.AuthRequestDTO;
import webpizza.com.vn.webapp.DTO.AuthDTO.AuthResponseDTO;
import webpizza.com.vn.webapp.JWT.JwtTokenProvider;
import webpizza.com.vn.webapp.entity.User;
import webpizza.com.vn.webapp.repository.UserRepository;

import org.springframework.security.core.Authentication; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*controller cuủa xác thực Authentication làm chức năng login ->  jwt token */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    /*Trong Spring Security, AuthenticationManager là một giao diện cốt lõi (core interface)
     chịu trách nhiệm về việc xác thực (Authentication) người dùng:

    +  Ý nghĩa: Nó là bộ phận trung tâm tiếp nhận yêu cầu đăng nhập (ví dụ: tên người dùng
     và mật khẩu) và quyết định xem người dùng đó có hợp lệ hay không.
    + Cách hoạt động: Khi bạn gọi phương thức authenticate(), AuthenticationManager sẽ ủy
     quyền (delegate) quá trình xử lý cho một danh sách các AuthenticationProvider đã được
     cấu hình (ví dụ: một Provider biết cách kiểm tra tên người dùng và mật khẩu trong cơ
     sở dữ liệu).
     + cấu hình sử dụng: sở dĩ có thể dễ dàng tiêm phụ thuôc @Autowired cho nó là nờ
     cấu hình bean AuthenticationManager đc khai báo trong lop SecurityConfig nhờ nó
     mà bên AuthController có thể dễ dàng tiêm phụ thuộc mà không báo lỗi
      ==>Tóm lại: Nó được sử dụng để kiểm tra tên người dùng (userName) và mật khẩu (passWord) mà
       người dùng cung cấp có khớp với dữ liệu đã lưu trữ (thường là trong cơ sở dữ liệu) hay không.
     */
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtUtil;

    @Autowired
    private UserRepository userRepo; // Tiêm Repo vào để lấy ảnh


    //metod xu ly login -> xác thực AUTHENTICATION -> generaToken khi login thanh cong
    /* giải thích code:
    * + @RequestBody...: Spring sẽ tự động ánh xạ dữ liệu JSON gửi trong thân (body) của yêu cầu
    *  POST thành đối tượng Java AuthRequestDTO (chứa userName và passWord).
    *
    * + UsernamePasswordAuthenticationToken: UsernamePasswordAuthenticationToken là một
    *  lớp rất quan trọng trong Spring Security để đại diện cho thông tin xác thực (Authentication)
    *  của người dùng, là một triển khai của interface Authentication trong Spring Security
    *  --> Đối tượng này được truyền vào authenticationManager.authenticate(...) để yêu cầu Spring
    * Security kiểm tra xem tên người dùng và mật khẩu này có hợp lệ không.
    *
    *  + jwtUtil.generateToken(request.userName): Nếu xác thực thành công (không có ngoại lệ),
    * code sẽ chạy tiếp. Lớp JwtTokenProvider (được tiêm vào là jwtUtil) được gọi để tạo ra một
    *  JWT mới, sử dụng userName làm định danh (Subject) trong token.
    *
    * + ResponseEntity.ok(new AuthResponseDTO(token)): Trả về một đối tượng ResponseEntity
    *  với HTTP Status Code 200 OK, và gửi JWT vừa tạo trong đối tượng AuthResponseDTO về
    * cho client (trình duyệt/ứng dụng di động). */

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> Login(@RequestBody AuthRequestDTO request){
        //1. yêu cầu xác thực của spring security -> nho nó xác minh tài khoản -> tra cho user mot token
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUserName(), request.getPassWord())
        );

       // 2. Lấy UserDetails từ đối tượng auth(username, password ,role)
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        // 3. Sinh token (truyền cả username và danh sách quyền)
        // Lưu ý: Phải sửa hàm generateToken ở lớp Provider để nhận thêm authorities
        String token = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities());

        // 4. LẤY AVATAR và ID TỪ DATABASE
        User userEntity = userRepo.findByUsername(userDetails.getUsername());
        String avatar = userEntity.getAvatar();
        Integer userId = userEntity.getId(); // LẤY ID TẠI ĐÂY

        // 5. Trả về: Token (có payload chuẩn) + Avatar (nằm ngoài token)
        return ResponseEntity.ok(new AuthResponseDTO(token, avatar, userDetails.getUsername(), userId));

    }
}
