package webpizza.com.vn.webapp.JWT;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import webpizza.com.vn.webapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/*>>>JWT IV - Lớp này lấy user từ database khi cần xác thực(Lấy Vai trò, permission từ DB)).<<<
  * => muc tieu cua lop nay: chuyển đổi thông tin người dùng từ cơ sở dữ liệu thành đối
  tượng mà Spring Security có thể sử dụng để xác thực và ủy quyền (phân quyền).
   => quy định các thông tin về Roles/Permissions lấy từ db và sau đó Spring Security sẽ sử dụng để ủy
    quyền sau khi Token được xác thực.
  *  + ý nghĩa:
   *   ++ UserDetailsServiceImpl – Lấy User từ database
   *     > Spring Security không tự biết bạn lưu user ở đâu nên lớp này:
            +++ Lấy user từ DB theo username
            +++ Trả về object UserDetails cho Spring Security
         > Token chỉ chứa username
            +++--> Còn password & roles thì phải lấy từ DB.


→ Còn password & roles thì phải lấy từ DB.
       ++ Lớp này rất quan trọng trong ứng dụng Spring Security, dùng để xác thực người dùng.
       ++ Nó triển khai interface UserDetailsService và override phương thức loadUserByUsername
        để lấy thông tin người dùng từ database (thông qua AclUserRepository).
       ++ Chuyển đổi các  vai trò (role) của user thành danh sách quyền (authorities) mà Spring
        Security sử dụng để phân quyền.
       ++ Nếu không có lớp này, Spring Security sẽ không biết cách lấy thông tin người dùng từ
        database của bạn, dẫn đến không xác thực được người dùng.
       ++ Nếu có lớp này, bạn có thể xác thực người dùng từ database, tùy biến cách lấy dữ liệu
        và phân quyền.
       ===> Kết luận: Lớp này là bắt buộc nếu bạn muốn xác thực người dùng từ database riêng
       của mình trong Spring Security. Nó giúp ứng dụng bảo mật, kiểm soát truy cập và phân
       quyền hiệu quả.
    * */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;


    /*ke thua override cua Userdetail la method loadUserByUserName:
    * tim kiem trong username tim trong database co username do khong -> co thi xu ly khong thi thui
     =>  @Transactional(readOnly = true): Mở một transaction chỉ để ĐỌC dữ liệu, không cho phép ghi.
     Phương thức này CHỈ dùng để truy vấn dữ liệu, không update / insert / delete
      #  readOnly = true có tác dụng gì cụ thể?
        ✅ 1. Tối ưu hiệu năng
          ++ Hibernate không bật dirty-checking
          ++ Không theo dõi thay đổi entity
          ++ Ít tốn RAM + CPU hơn
        ✅ 2. Bảo vệ logic
          ++ Nếu lỡ gọi user.setPassword(...)
          ++ Hibernate KHÔNG flush xuống DB
          ++ Tránh bug vô tình ghi dữ liệu khi chỉ cần đọc
        ✅ 3. Phù hợp đúng vai trò method

        <==> Nếu KHÔNG có @Transactional(readOnly = true) thì sao?
          Trường hợp	                  Hậu quả
          Quan hệ LAZY	      ❌ Lỗi LazyInitializationException
          Tải role	          ❌ Role có thể null / chưa load
          Hiệu năng	          ❌ Hibernate theo dõi entity không cần thiết
          Security	          ❌ Hành vi không ổn định 
    */

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        webpizza.com.vn.webapp.entity.User user = userRepo.findByUsernameWithRoles(username);
        if(user == null || user.getUsername() == null){
            new UsernameNotFoundException("UserName khong tim thay");
        }


        /*trả về tạm role vai tro trong listRole là admin text thử token hoạt động ra sao*/
        //return new User(user.getUsername(), user.getPassword(), List.of(new SimpleGrantedAuthority("admin")));

        /*>>>>>>TODO: LẤY VAI TRÒ-> CALL API VÀ LẤY ĐC DANH SÁCH VAI TRÒ ROLE ĐÃ ĐC GÁN CHO USER<<<<<<<<<
         ===>>>>> Ý Nghĩa Tổng Thể
         -> Toàn bộ quá trình này (từ truy vấn database đến tạo UserDetails) là cầu nối giữa dữ liệu người dùng
         tùy chỉnh (từ model AclUser của bạn) và khung bảo mật chuẩn của Spring Security.
         -> Khi bạn trả về đối tượng User (UserDetails), bạn đã cung cấp cho Spring Security mọi thứ cần thiết để:
          + Xác thực mật khẩu (so sánh user.getPassword() với mật khẩu nhập).
          + Ủy quyền (sau khi xác thực, Spring Security sẽ sử dụng authorities để kiểm tra các quy tắc phân
          quyền trong csdl của User đó như @PreAuthorize('hasRole("ADMIN")' or 'Customer', or 'Employee'...)).

          -> giải mã tí phần cần giải thích thêm
           # GrantedAuthority:
             + là một interface cốt lõi trong Spring Security, đại diện cho một quyền hạn
              (permission) hoặc một vai trò (role) đã được cấp cho một người dùng
             + Spring Security sử dụng các đối tượng GrantedAuthority này để thực hiện Ủy quyền
             (Authorization), ví dụ: kiểm tra bằng @PreAuthorize('hasRole("ADMIN")') để xem người
             dùng có quyền truy cập vào một phương thức cụ thể hay không.

           -> user.getListRoles():
              + Đây là một phương thức (có lẽ là getter) trong đối tượng webpizza.com.vn.webapp.entity.User
              của bạn, được sử dụng để truy vấn danh sách, các đối tượng Role (Vai trò) mà người dùng này đã
               được gán trong cơ sở dữ liệu.
              + Nó trả về một List<Role> (hoặc tương tự), trong đó mỗi đối tượng Role có thông tin như tên
               vai trò (getName()) và có thể là ID.

           -> stream():
              + Phương thức này chuyển đổi List<Role> thành một luồng dữ liệu (Stream).
              + Stream cung cấp một chuỗi các thao tác cho phép bạn xử lý dữ liệu theo phong cách khai báo
            (declarative) và chức năng (functional programming), giúp mã ngắn gọn và dễ đọc hơn (so với
             việc dùng vòng lặp for truyền thống).

           -> map(role -> new SimpleGrantedAuthority(role.getName())):
             + Đây là thao tác chuyển đổi (transformation) chính.
             + chức năng chính:
                ++ Nó duyệt qua từng phần tử (role) trong Stream.
                ++ Với mỗi role, nó thực hiện một hàm lambda (phần role -> ...).
                ++ Hàm này tạo ra một đối tượng SimpleGrantedAuthority mới (là một triển khai cụ thể của
                GrantedAuthority), sử dụng tên vai trò (role.getName()) làm chuỗi quyền hạn.
                ++ Ví dụ: Nếu role.getName() là "ADMIN", nó sẽ tạo ra new SimpleGrantedAuthority("ADMIN").

           -> collect(Collectors.toList()):
             + Đây là thao tác kết thúc (terminal operation) của Stream.
             + Nó thu thập tất cả các kết quả đã được chuyển đổi (tức là các đối tượng SimpleGrantedAuthority)
            và đóng gói chúng lại vào một List<GrantedAuthority>.

           -> return new User(user.getUsername(), authorities:
            + Dòng này tạo ra và trả về đối tượng User của Spring Security, đây là một triển
            khai của giao diện UserDetails.
            + new User(...): Khởi tạo một đối tượng User của Spring Security.
            + Tham số 1 (user.getUsername()): Tên người dùng.
            + Tham số 2 (user.getPassword()): Mật khẩu của người dùng (đã được hash/mã hóa) được lấy từ
            database. Spring Security sẽ dùng mật khẩu này để so sánh với mật khẩu do người dùng nhập vào.
            + Tham số 3 (authorities): Danh sách các quyền hạn (List<GrantedAuthority>) vừa được tạo ở bước trên.

            ===> Đối tượng User này (implementing UserDetails) là dữ liệu mà Spring Security cần để hoàn tất quá trình
            xác thực và lưu trữ thông tin này vào SecurityContextHolder (lưu trữ phiên làm việc của người dùng).
         * */
    
        List<GrantedAuthority> authorities =  user.getListRoles().stream().map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
        return new User(user.getUsername(), user.getPassword(),authorities);

    }
}
