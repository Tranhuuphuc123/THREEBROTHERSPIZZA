package webpizza.com.vn.webapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "roles_permissions")
public class RoleHasPermissions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "role_id")
    @JsonIgnore /* Thêm Annotation này parse json: tránh tránh lỗi Infinite Recursion 
    (vòng lặp vô tận) ở bản trung gian nó sẽ Ngắt: Khi từ role xem rolepermissions, 
    dừng việc lặp đi ngc lại rolepermissions sang role cứ mãi lặp đi lặp lại  */
    private  Role role;

    @ManyToOne
    @JoinColumn(name = "permission_id")
    @JsonIgnore
    private Permission permission;

}
