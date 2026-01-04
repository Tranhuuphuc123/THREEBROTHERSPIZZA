package webpizza.com.vn.webapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import webpizza.com.vn.webapp.entity.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {

        /* #####tạo hàm trả về danh sách các quyền thật có của username cụ thể #####
        -> :username: :username được gọi là Named Parameter (Tham số được đặt tên)
        Thay vì bạn viết "chết" (hardcode) một cái tên cụ thể vào câu lệnh SQL, bạn
         dùng dấu : kèm theo một cái tên để tạo ra một vị trí chờ sẵn (placeholder)
          ## Cơ chế hoạt động:
             # Khi ứng dụng của bạn chạy, Spring Data JPA sẽ thực hiện hai bước:
                + Bước 1: Quét câu lệnh SQL và tìm ký tự :username.
                + Bước 2: Lấy giá trị của biến username truyền vào trong hàm 
                findPermissionsRawByUsername(String username) và "đổ" nó vào đúng 
                vị trí đó trước khi gửi câu lệnh tới Database.
                
        -> nativeQuery = true: là chấp nhận sử dụng câu lệnh thuần sql
        -> @Param("username") thêm tham số này để lk biến username trong
        method lên biến :username trong câu lệnh sql
        -> Object là lớp cha của tất cả các kiểu dữ liệu. Khi bạn viết một câu 
        lệnh SQL SELECT nhiều cột (ví dụ: username, name, display_name), kết quả
        trả về của một dòng không thể khớp hoàn toàn với một kiểu dữ liệu đơn lẻ
        nào (không hẳn là String, cũng không hẳn là Integer).
         + Object[] (Mảng Object): Đại diện cho một dòng (row) duy nhất trong kết
          quả truy vấn.
         + Mỗi phần tử trong mảng tương ứng với một cột bạn đã SELECT:
                ++ obj[0]: Giá trị của cột u.username
                ++ obj[1]: Giá trị của cột p.name
                ++ obj[2]: Giá trị của cột p.display_name

         -> List<Object[]> được hiểu như thế nào?
          + Vì một người dùng có thể có nhiều quyền, câu lệnh SQL sẽ trả về nhiều dòng.
          + List<>: Là một cái "giỏ" chứa nhiều phần tử.
          + List<Object[]>: Là một cái giỏ chứa nhiều dòng dữ liệu, trong đó mỗi dòng 
          là một mảng Object[].       
        */   
        @Query(value = """
                SELECT DISTINCT 
                        u.username, p.name, p.display_name 
                FROM users_roles us 
                JOIN users u on us.user_id = u.id 
                JOIN roles_permissions rp on rp.role_id = us.role_id 
                JOIN permissions p on rp.permission_id = p.id
                WHERE u.username = :username        
          """, nativeQuery = true)            
        List<Object[]> findPermissionsRawByUsername(@Param("username") String username);
}
