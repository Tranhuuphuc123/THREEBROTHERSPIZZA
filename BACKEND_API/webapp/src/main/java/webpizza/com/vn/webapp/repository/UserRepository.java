package webpizza.com.vn.webapp.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import webpizza.com.vn.webapp.entity.User;

import java.util.List;

@Repository
public interface UserRepository  extends JpaRepository<User, Integer> {

    // Tìm user theo username
    User findByUsername(String userName);

    /*viết function tiềm kiếm Load roles cùng lúc với user giúp tránh:
     + Chuẩn JPA
     + Dùng tốt cho JWT + Security
     + Không hack : Hacker cố gắng làm gì? nó tấn công chèn (inject) các đoạn mã 
     SQL độc hại vào các trường nhập liệu (ví dụ: username) để thay đổi hoặc bỏ
     qua lệnh SQL gốc của ứng dụng.
      -> "Hack" được ngăn chặn như thế nào?	Truy vấn của bạn sử dụng Tham số được
       Đặt tên (WHERE u.username = :username). Cơ chế này (PreparedStatement) đảm 
       bảo rằng giá trị của :username luôn được coi là dữ liệu thuần túy chứ không 
       phải là một phần của lệnh SQL.
      ===> Kết quả:	Tuyệt đối ngăn chặn các cuộc tấn công SQL Injection, giúp truy
       vấn của bạn an toàn và tuân thủ Chuẩn JPA. 
     
     + Không lỗi Lazy: lazy loading( tải trì hoản) là mối quan hệ giữa User 
     và Role được cấu hình để chỉ tải khi cần thiết. Khi bạn gọi user.getListRoles(),
    JPA cố gắng mở lại kết nối DB để tải Role, nhưng kết nối đã đóng, dẫn đến lỗi.
     -> sinh ra lỗi LazyInitializationException(Đây là lỗi xảy ra khi bạn cố gắng 
     truy cập dữ liệu liên quan (như danh sách Role) sau khi kết nối DB 
     (EntityManager/Session) đã đóng (thường là sau khi rời khỏi tầng 
     Repository/Service).
     ==> Giải pháp: LEFT JOIN FETCH Từ khóa FETCH trong truy vấn của bạn 
     (LEFT JOIN FETCH u.listRoles) buộc JPA phải tải User và Role cùng lúc trong
      DUY NHẤT một câu lệnh SQL.) giúp tránh lỗi Lazy, 
        + Vì Roles đã được tải sẵn cùng User trong bộ nhớ, không cần truy cập DB lần nữa. 
        + Tránh lỗi N+1: Giảm từ nhiều truy vấn nhỏ thành một truy vấn lớn, giúp tối ưu 
        hiệu năng.
      =====> Phương thức findByUsernameWithRoles sử dụng FETCH để chuyển đổi cơ chế tải 
      từ "Tải Trì hoãn" (Lazy) sang "Tải Ngay lập tức" (Eager) chỉ trong truy vấn này, đảm 
      bảo rằng dữ liệu quyền (Role) luôn có sẵn cho các lớp sau (Service, Controller, Spring
       Security) mà không gây ra lỗi kết nối.  
     */
    @Query("""
        SELECT u FROM User u
        LEFT JOIN FETCH u.listRoles
        WHERE u.username = :username
        """)    
    User findByUsernameWithRoles(String username);


    /***method này là câu lệnh sql truy vấn từ table user theo đk phải khớp email 
     * và activeCode có tồn tại 
     * --> phục vụ mục đích truy vấn lôi hai email và activeCode của user khi create xong
     * nhằm để email thấy và kiểm tra khớp xác minh là có thì tiến hành active account vừa 
     * tạo để kích hoạt is_active của user từ 0 thành 1 kích hoạt tài khoản*/
    Optional<User> findByEmailAndActiveCode(String email, String activeCode);

    
    /**xay dung method tu viet api spring boot tiem kiem theo ten va co phan trang
     * => phục vụ tính năng chức năng search á**/
    @Query("SELECT p FROM User p WHERE "
            + "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
            + "LOWER(p.username) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> findBySearchContains( @Param("searchTerm") String name,
                                     @Param("searchTerm") String username,
                                     Pageable pageable);


}
